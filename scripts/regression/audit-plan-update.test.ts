import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import * as nodeModule from 'node:module';
import { generateChart } from '../../lib/ziwei/algorithm';
import { schoolStarBrightness } from '../../lib/ziwei/school-data';
import { PROVINCES } from '../../lib/ziwei/cities';
import { ALL_BOOKS, searchClassics } from '../../lib/classics';
import type { ZiweiChart, Star } from '../../lib/ziwei/types';

// Chỉ test; không thay đổi thuật toán hay cung cấp dữ liệu sinh qua mạng.
// Các test nguồn (L3–L6) không thay thế kiểm thử trình duyệt/ảnh PNG/API.
const source = (p: string) => readFileSync(new URL('../../' + p, import.meta.url), 'utf8');
const strict = process.argv.includes('--strict-audit');
const known = (reason: string) => ({ todo: strict ? false : reason });
const sample = () => generateChart({ year: 1990, month: 5, day: 6, hour: 4, gender: 'male' });

// Cùng cơ chế với patterns-sihua-bonus.test.ts hiện có: chỉ vô hiệu hóa
// marker server-only trong process test. Không thay đổi module sản phẩm.
type HookResult = { url?: string; format?: string; source?: string; shortCircuit?: boolean };
const { registerHooks } = nodeModule as unknown as {
  registerHooks(hooks: {
    resolve(specifier: string, context: unknown, next: (s: string, c: unknown) => HookResult): HookResult;
    load(url: string, context: unknown, next: (u: string, c: unknown) => HookResult): HookResult;
  }): void;
};
const stub = 'data:text/javascript,';
registerHooks({
  resolve(specifier, context, next) {
    return specifier === 'server-only' ? { url: stub, shortCircuit: true } : next(specifier, context);
  },
  load(url, context, next) {
    return url === stub ? { format: 'commonjs', source: '', shortCircuit: true } : next(url, context);
  },
});

test('L1: chính tinh có độ sáng theo bảng QS đã được chuẩn hóa', () => {
  const chart = sample();
  let checked = 0;
  for (const p of chart.palaces) {
    for (const s of p.stars.filter(x => x.type === 'major')) {
      const expected = schoolStarBrightness(s.name, p.branch, 'QS');
      if (!expected) continue;
      checked++;
      assert.equal(s.brightnessRaw, expected, s.name);
      const group = ['Miếu', 'Vượng'].includes(expected) ? 'bright'
        : ['Hãm', 'Bất', 'Nhàn'].includes(expected) ? 'dim' : 'normal';
      assert.equal(s.brightness, group, s.name);
    }
  }
  assert.ok(checked > 0, 'Phải có ít nhất một chính tinh có độ sáng trong bảng');
});

test('L2: Tứ Hóa song ngữ và nhận diện Hóa Lộc ở Tài Bạch, Hóa Quyền ở Quan Lộc', async () => {
  const { isSiHua, detectPatterns } = await import('../../lib/ziwei/patterns');
  for (const [cn, vi] of [['禄','Lộc'],['权','Quyền'],['科','Khoa'],['忌','Kỵ']] as const) {
    assert.equal(isSiHua(vi, cn), true);
    assert.equal(isSiHua(cn, vi), true);
    assert.equal(isSiHua(undefined, vi), false);
  }
  const chart = sample();
  const tai = chart.palaces.find(p => p.name === 'Tài Bạch')!;
  const quan = chart.palaces.find(p => p.name === 'Quan Lộc')!;
  assert.ok(tai && quan);
  tai.stars = [{ name: 'Vũ Khúc', type: 'major', siHua: 'Lộc' }];
  quan.stars = [{ name: 'Tử Vi', type: 'major', siHua: 'Quyền' }];
  const names = detectPatterns(chart).map(p => p.name);
  assert.ok(names.includes('Hóa Lộc Nhập Tài'), names.join(', '));
  assert.ok(names.includes('Hóa Quyền Nhập Quan'), names.join(', '));
});

// Mẫu tổng hợp để kiểm tra giao diện ngôn ngữ của detector, không phải lá số lịch sử.
function satPhaFixture(): ZiweiChart {
  const chart = sample();
  for (const p of chart.palaces) p.stars = [];
  const branches = [chart.mingGongBranch, (chart.mingGongBranch + 4) % 12, (chart.mingGongBranch + 8) % 12];
  const stars = ['Thất Sát', 'Phá Quân', 'Tham Lang'];
  branches.forEach((b, i) => {
    chart.palaces.find(p => p.branch === b)!.stars = [{ name: stars[i], type: 'major' } as Star];
  });
  return chart;
}

test('L2: Sát Phá Tham phải nhận đủ tên sao tiếng Việt', known('L2: sanFangAllStars chỉ thêm khóa tiếng Việt nhưng detector hỏi khóa Hán; chạy --strict-audit để thấy lỗi đỏ'), async () => {
  const { detectPatterns } = await import('../../lib/ziwei/patterns');
  const chart = satPhaFixture();
  const pattern = detectPatterns(chart).find(p => p.name === 'Sát Phá Tham');
  assert.ok(pattern, 'Ba sao tiếng Việt đã có trong tam phương nhưng không tìm thấy cách cục');
  assert.equal(pattern.palaces.length, 3);
});

test('L2: mô tả cách cục không còn chữ Hán', known('L2: translatePattern không dịch description; chưa sửa nội dung/nguồn'), async () => {
  const { detectPatterns } = await import('../../lib/ziwei/patterns');
  const chart = satPhaFixture();
  // Tách lỗi dịch mô tả khỏi lỗi khóa VI/CN: cung cấp tên gốc detector đang tra.
  const names: Record<string, string> = { 'Thất Sát': '七杀', 'Phá Quân': '破军', 'Tham Lang': '贪狼' };
  for (const p of chart.palaces) for (const s of p.stars) s.name = names[s.name] ?? s.name;
  const pattern = detectPatterns(chart).find(p => p.name === 'Sát Phá Tham');
  assert.ok(pattern, 'Fixture tên Hán phải kích hoạt detector');
  assert.doesNotMatch(pattern.description, /\p{Script=Han}/u);
});

test('L3: tỉnh và thành phố mặc định của BirthForm tồn tại cùng một mục', () => {
  const text = source('components/BirthForm.tsx');
  const province = text.match(/province:\s*initialData\?\.province\s*\?\?\s*'([^']+)'/)?.[1];
  const city = text.match(/city:\s*initialData\?\.city\s*\?\?\s*'([^']+)'/)?.[1];
  assert.ok(province && city);
  assert.ok(PROVINCES.find(p => p.name === province)?.cities.some(c => c.name === city));
});

test('L4: biểu thức quy đổi lịch sử cộng delta âm, không đảo dấu (kiểm tra nguồn)', () => {
  const text = source('components/BirthForm.tsx');
  assert.match(text, /adjustedMinutes\s*=\s*\(totalMinutes\s*\+\s*historicalTz\.deltaMinutes\s*\+\s*1440\)\s*%\s*1440/);
  assert.match(text, /Tự động quy đổi về UTC\+7 \(\{historicalTz\.deltaMinutes\} phút\)/);
  assert.equal((9 * 60 + 15 - 60 + 1440) % 1440, 8 * 60 + 15);
  assert.equal((9 * 60 + 15 - 120 + 1440) % 1440, 7 * 60 + 15);
});

test('L5: tọa độ 12 cung thẻ chia sẻ khớp bàn lá số (kiểm tra nguồn)', () => {
  const share = source('components/ShareCardCanvas.tsx').split('const ZHIWEI_LAYOUT')[1].split('];')[0];
  const board = source('components/ChartBoard.tsx').split('const BRANCH_GRID_POS')[1].split('};')[0];
  const a = [...share.matchAll(/\{\s*branch:\s*(\d+),\s*row:\s*(\d+),\s*col:\s*(\d+)\s*\}/g)]
    .map(m => [Number(m[1]), Number(m[2]), Number(m[3])]).sort((x, y) => x[0] - y[0]);
  const b = [...board.matchAll(/(\d+):\s*\[(\d+),\s*(\d+)\]/g)]
    .map(m => [Number(m[1]), Number(m[2]) - 1, Number(m[3]) - 1]).sort((x, y) => x[0] - y[0]);
  assert.equal(a.length, 12);
  assert.equal(b.length, 12);
  assert.deepEqual(a, b);
});

test('L6: mẫu lời giải ngoại tuyến dùng tên Can Chi (kiểm tra nguồn; API không có trên bản tĩnh)', () => {
  const text = source('app/api/interpret/route.ts');
  for (const name of ['phuThe', 'quanLoc', 'taiBach', 'target']) {
    const field = name === 'target' ? 'targetPalace' : name;
    assert.ok(text.includes('BRANCHES[' + field + '.branch]'), name);
    assert.ok(text.includes('${' + name + 'BranchName}'), name);
  }
  assert.ok(text.includes('STEMS[targetPalace.stem]'));
  assert.ok(text.includes('${targetStemName}'));
  assert.doesNotMatch(text, /\$\{(?:phuThe|quanLoc|taiBach|targetPalace)\??\.(?:branch|stem)\b/);
});

test('L7: tìm kiếm không phân biệt hoa thường và tìm đoạn chỉ có trong bản dịch', () => {
  const lower = searchClassics('thất sát');
  assert.ok(lower.length > 0);
  assert.deepEqual(lower.map(x => x.paragraphId), searchClassics('THẤT SÁT').map(x => x.paragraphId));
  const query = 'tiền của';
  const only = ALL_BOOKS.flatMap(b => b.chapters.flatMap(c => c.paragraphs))
    .filter(p => p.translation?.toLowerCase().includes(query) && !p.text.toLowerCase().includes(query));
  assert.ok(only.length > 0, 'Dataset phải có đoạn chỉ khớp bản dịch');
  const result = searchClassics(query, 10000);
  assert.ok(only.some(p => result.some(h => h.paragraphId === p.id)));
});

test('L8: 34 tỉnh thành, cờ Đông Hà/Quảng Trị, không còn hai tệp DST Trung Quốc', () => {
  assert.equal(PROVINCES.length, 34);
  assert.equal(new Set(PROVINCES.map(p => p.name)).size, 34);
  for (const name of ['Gia Lai', 'Đắk Lắk', 'Tây Ninh', 'Đồng Tháp', 'Cà Mau']) {
    assert.ok(PROVINCES.some(p => p.name === 'Tỉnh ' + name), name);
  }
  const qt = PROVINCES.find(p => p.name === 'Tỉnh Quảng Trị')!;
  assert.ok(qt);
  assert.equal(qt.cities.find(c => c.name.startsWith('TP. Đông Hà'))?.isSouthOf17thParallel, true);
  assert.equal(qt.cities.find(c => c.name.startsWith('TX. Quảng Trị'))?.isSouthOf17thParallel, true);
  assert.equal(qt.cities.find(c => c.name.startsWith('Vĩnh Linh'))?.isSouthOf17thParallel, false);
  for (const path of ['lib/ziwei/dst-cn.ts','scripts/regression/dst-cn.test.ts']) {
    assert.equal(existsSync(new URL('../../' + path, import.meta.url)), false, path);
  }
});

test('L8: npm test phải bao phủ toàn bộ regression scripts', known('L8: 11 test cũ chưa được kiểm chứng và vẫn không có trong npm test; không đánh dấu chúng là đã pass'), () => {
  const pkg = JSON.parse(source('package.json')) as { scripts: { test: string } };
  const files = readdirSync(new URL('.', import.meta.url)).filter(x => x.endsWith('.test.ts'));
  const missing = files.filter(x => !pkg.scripts.test.includes('scripts/regression/' + x));
  assert.deepEqual(missing, [], 'Test chưa chạy: ' + missing.join(', '));
});
