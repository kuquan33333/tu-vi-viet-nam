import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { Solar } from 'lunar-javascript';
import { generateChart } from '../../lib/ziwei/algorithm';
import { solarToLunarVN, lunarToSolarVN } from '../../lib/ziwei/lunar-solar';
import type { BirthInfo } from '../../lib/ziwei/types';

// Nguồn tham chiếu: iztro khóa trong package-lock.json, chạy trong process Node riêng,
// không import algorithm.ts, không dùng bản đồ dịch của sản phẩm và không gửi mạng.
// Cùng quy ước đổi năm âm lịch (normal), ngày dương lịch đã chuẩn hóa và giờ chi 0–11.
// Đây là đối chiếu hồi quy với thư viện gốc, không chứng minh tử vi có giá trị tiên đoán.
const referenceCode = [
  "const {astro} = require('iztro');",
  "const b = JSON.parse(process.argv[1]);",
  "astro.config({yearDivide:'normal'});",
  "const a=astro.bySolar([b.year,b.month,b.day].join('-'),b.hour,b.gender==='male'?'男':'女',true,'zh-CN');",
  "const branches=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];",
  "const names={'紫微':'Tử Vi','天机':'Thiên Cơ','太阳':'Thái Dương','武曲':'Vũ Khúc','天同':'Thiên Đồng','廉贞':'Liêm Trinh','天府':'Thiên Phủ','太阴':'Thái Âm','贪狼':'Tham Lang','巨门':'Cự Môn','天相':'Thiên Tướng','天梁':'Thiên Lương','七杀':'Thất Sát','破军':'Phá Quân'};",
  "const cuc={'水二局':2,'木三局':3,'金四局':4,'土五局':5,'火六局':6};",
  "const stars=a.palaces.flatMap(p=>p.majorStars.map(s=>{if(!names[s.name])throw Error('Unknown major '+s.name);return [names[s.name],branches.indexOf(p.earthlyBranch)];})).sort((x,y)=>x[0].localeCompare(y[0],'vi'));",
  "const value={menh:branches.indexOf(a.earthlyBranchOfSoulPalace),than:branches.indexOf(a.earthlyBranchOfBodyPalace),cuc:cuc[a.fiveElementsClass],stars};",
  "if(value.menh<0||value.than<0||!value.cuc||stars.some(s=>s[1]<0))throw Error('Invalid independent reference');",
  "process.stdout.write(JSON.stringify(value));",
].join('\n');

type Snapshot = { menh: number; than: number; cuc: number; stars: [string, number][] };
const reference = (birth: BirthInfo): Snapshot => JSON.parse(execFileSync(process.execPath, ['-e', referenceCode, JSON.stringify(birth)], { encoding: 'utf8' }));
const snapshot = (b: BirthInfo): Snapshot => {
  const c = generateChart(b);
  const stars: [string, number][] = c.palaces.flatMap(p => p.stars.filter(s => s.type === 'major')
    .map(s => [s.name, p.branch] as [string, number])).sort((x, y) => x[0].localeCompare(y[0], 'vi'));
  return { menh: c.mingGongBranch, than: c.shenGongBranch, cuc: c.wuxingJu, stars };
};

// Dữ liệu danh nhân lấy đúng từ famous.ts. Giờ sinh là giả định của dataset,
// không xác nhận lịch sử; chỉ dùng để kiểm thử. Không import module server-only.
const famousSource = readFileSync(new URL('../../lib/ziwei/famous.ts', import.meta.url), 'utf8');
function famous(id: string): BirthInfo {
  const block = famousSource.split("id: '" + id + "'")[1]?.split(/\n\s*},/)[0];
  assert.ok(block, 'Không tìm thấy fixture ' + id);
  const n = (key: string) => {
    const value = block.match(new RegExp('\\b' + key + ':\\s*(\\d+)'))?.[1];
    assert.ok(value, id + ': thiếu ' + key);
    return Number(value);
  };
  const gender = block.match(/gender:\s*'(male|female)'/)?.[1];
  assert.ok(gender === 'male' || gender === 'female');
  return { year: n('year'), month: n('month'), day: n('day'), hour: n('hour'), gender };
}

const cases: [string, BirthInfo][] = [
  ['Mẫu A', {year: 1990, month: 5, day: 6, hour: 4, gender: 'male'}],
  ['Mẫu B', {year: 1992, month: 9, day: 16, hour: 7, gender: 'female'}],
  ['Mẫu C', {year: 2000, month: 1, day: 31, hour: 0, gender: 'female'}],
  ['Quang Trung (fixture famous.ts)', famous('quang-trung')],
  ['Phan Bội Châu (fixture famous.ts)', famous('phan-boi-chau')],
];

for (const [id, b] of cases) {
  test('Golden comparator: ' + id, () => {
    const expected = reference(b);
    console.log('REFERENCE ' + id + ' ' + JSON.stringify(expected));
    assert.equal(expected.stars.length, 14);
    assert.equal(new Set(expected.stars.map(x => x[0])).size, 14);
    assert.deepEqual(snapshot(b), expected);
  });
}

test('Lịch 24/11/2026: 16/10 Bính Ngọ, tháng Kỷ Hợi, ngày Nhâm Dần', () => {
  assert.deepEqual(solarToLunarVN(2026, 11, 24), { lunarYear: 2026, lunarMonth: 10, lunarDay: 16, isLeapMonth: false });
  assert.deepEqual(lunarToSolarVN(2026, 10, 16), {year: 2026, month: 11, day: 24});
  const l = Solar.fromYmd(2026, 11, 24).getLunar();
  assert.equal(l.getYearGan() + l.getYearZhi(), '丙午');
  assert.equal(l.getMonthGan() + l.getMonthZhi(), '己亥');
  assert.equal(l.getDayGan() + l.getDayZhi(), '壬寅');
});
