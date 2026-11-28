import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {test} from 'node:test';
const read=(p:string)=>readFileSync(p,'utf8');
test('E3: layout không áp canonical trang chủ cho mọi trang',()=>assert.doesNotMatch(read('app/layout.tsx'),/canonical:\s*['"]\/['"]/));
test('A2–A5: metadata có OG và Twitter theo trang',()=>{
 const src=read('lib/seo/metadata.ts');
 for(const key of ['canonical','openGraph','images','twitter'])assert.ok(src.includes(key),key);
});
test('A6: route Hợp bàn và redirect 301',()=>{
 assert.ok(existsSync('app/hop-ban/page.tsx'));
 assert.match(read('public/_redirects'),/^\/heming\s+\/hop-ban\s+301$/m);
 assert.doesNotMatch(read('components/AppChrome.tsx'),/\/heming/);
});
test('A7: chương sách có slug, không dùng index làm URL',()=>{
 assert.doesNotMatch(read('app/library/[book]/[chapter]/page.tsx'),/chapter:\s*String\(i\)/);
 const redirects=read('public/_redirects').split('\n').filter(s=>/^\/library\/[^/]+\/\d+\s/.test(s));
 assert.equal(redirects.length,21);
 assert.equal(new Set(redirects.map(s=>s.split(/\s+/)[1])).size,21);
 assert.ok(redirects.every(s=>s.endsWith(' 301')));
});
test('D1: không có header điều hướng thứ hai',()=>{
 for(const p of ['components/TriadNav.tsx','app/privacy/page.tsx','app/terms/page.tsx'])assert.doesNotMatch(read(p),/<header\b/,p);
});
test('D2: tên tác giả giữ nguyên',()=>assert.doesNotMatch(read('app/library/page.tsx'),/author\.split/));
test('D3/D4: menu đầy đủ, header theo UI-BRIEF và không đánh dấu link nội bộ như link ngoài',()=>{
 const header=read('components/ui/Header.tsx'),bottom=read('components/ui/BottomTabBar.tsx'),chrome=read('components/RouteChrome.tsx'),appChrome=read('components/AppChrome.tsx');
 for(const path of ['/cong-cu','/hop-ban','/ho-so','/lich-van-nien','/thien-ky','/dia-ky','/nhan-ky','/library'])assert.ok(header.includes(path),path);
 assert.doesNotMatch(header+bottom+chrome,/↗/);
 assert.ok(header.includes('desktopLinks.map')&&header.includes('allLinks.map'));
 const expected=['/','/chart','/lich-van-nien','/hop-ban','/library'];
 const list=header.match(/export const desktopLinks=\[([^\n]+)\];/)?.[1]||'';
 assert.deepEqual([...list.matchAll(/href:'([^']+)'/g)].map(m=>m[1]),expected);
 assert.ok(header.includes('toolLinks.map')&&header.includes('desktop-tools-menu'));assert.match(bottom,/href:'\/lich-van-nien',label:'Lịch'/);
 assert.match(chrome,/<Header\s+path=\{path\}\s*\/>/);assert.ok(appChrome.includes('<Footer/>'));assert.match(appChrome,/<RouteChrome\s+footer=\{<Footer\/>\}>/);
 assert.match(header,/Escape/);assert.match(header,/menu\.current\?\.focus/);
});
test('A: robots, sitemap loại URL cũ/hồ sơ',()=>{
 assert.match(read('app/robots.ts'),/['"]\/ho-so['"]/);
 assert.doesNotMatch(read('app/sitemap.ts'),/['"]\/heming['"]|['"]\/ho-so['"]/);
});

test('D7: bốn thuật ngữ có chú thích trong form',()=>{
 const src=read('components/BirthForm.tsx');
 for(const term of ['Sinh thần','Dương lịch (Mặt trời)','Âm lịch (Mặt trăng)','Chân Thái Dương Thời'])assert.ok(src.includes('term="'+term+'"'),term);
});
test('D1: breadcrumb dùng chung cho thư viện, chương sách và trang pháp lý',()=>{
 for(const p of ['app/library/page.tsx','app/library/[book]/page.tsx','app/library/[book]/[chapter]/page.tsx','app/library/search/page.tsx','app/privacy/page.tsx','app/terms/page.tsx'])assert.match(read(p),/<Breadcrumb items=/,p);
 assert.match(read('components/Breadcrumb.tsx'),/BreadcrumbList/);
});

test('D4, D9: không còn ký hiệu mở ngoài trong link nội bộ hay nhãn an lá số',()=>{
 for(const p of ['app/page.tsx','app/chart/page.tsx','app/hop-ban/page.tsx','app/lich-van-nien/page.tsx','app/ho-so/page.tsx','app/knowledge/page.tsx','app/preview/page.tsx','app/thien-ky/page.tsx','app/nhan-ky/page.tsx','app/dia-ky/page.tsx','components/AppChrome.tsx','components/ShareCardCanvas.tsx']){
  const src=read(p);
  assert.doesNotMatch(src,/<Link\b[^>]*>[^<]*↗/i,p);
  assert.doesNotMatch(src,/[Aa]n [Ll]á [Ss]ố/,p);
 }
});
