// Run against static export with a temporary Playwright install (QA only).
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
const req=createRequire(import.meta.url);
const {chromium}=req(process.env.PLAYWRIGHT_MODULE||'playwright');
const base='http://127.0.0.1:4173';
mkdirSync('qa-artifacts/interaction',{recursive:true});
const browser=await chromium.launch({headless:true});
const outcomes=[];
try{
 for(const width of [360,1280]){
  const ctx=await browser.newContext({viewport:{width,height:width===360?800:900}});
  const page=await ctx.newPage();
  const errors=[],leaks=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{
   if(r.url().includes('QA-BIRTH-UNIQUE')||r.postData()?.includes('QA-BIRTH-UNIQUE'))leaks.push(r.url());
  });
  // Block third-party requests during the test; no synthetic birth data leaves the runner.
  await ctx.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  const goto=async path=>{await page.goto(base+path);await page.waitForLoadState('networkidle');};
  const fillDate=async (scope,y='1990',m='5',d='6')=>{
   await scope.getByLabel('Ngày sinh dương lịch',{exact:true}).selectOption(d);
   await scope.getByLabel('Tháng sinh dương lịch',{exact:true}).selectOption(m);
   await scope.getByLabel('Năm sinh',{exact:true}).fill(y);
  };
  const fillNormal=async scope=>{
   await fillDate(scope);await scope.getByLabel('Tỉnh hoặc thành phố nơi sinh').selectOption('Tỉnh Gia Lai');
   await scope.getByLabel('Quận huyện hoặc khu vực nơi sinh').selectOption('TP. Pleiku');
   await scope.getByLabel('Giờ và phút sinh').fill('08:00');
  };
  await goto('/chart');
  assert.equal(await page.getByLabel('Giờ và phút sinh').inputValue(),'');
  assert.equal(await page.getByLabel('Tỉnh hoặc thành phố nơi sinh').inputValue(),'');
  await fillDate(page);await page.getByLabel('Tìm nơi sinh theo địa danh cũ').fill('krong pa');
  await page.getByRole('button',{name:/Krông Pa.*cần nhập kinh độ/}).first().click();
  assert.equal(await page.getByLabel('Kinh độ',{exact:true}).inputValue(),'');
  await page.getByRole('button',{name:'Dùng kinh độ tham khảo của huyện'}).click();
  assert.ok(Number(await page.getByLabel('Kinh độ',{exact:true}).inputValue())>102);
  await page.getByText(/Đang dùng kinh độ tham khảo/).waitFor();
  await page.getByLabel('Kinh độ',{exact:true}).fill('108.65');
  await page.getByText(/Đang dùng kinh độ tham khảo/).waitFor({state:'hidden'});
  await page.getByLabel('Không rõ giờ sinh cụ thể').check();
  await page.getByRole('button',{name:/XEM 12 PHƯƠNG ÁN/}).click();
  await page.getByRole('heading',{name:'12 phương án chưa xác định'}).waitFor();
  assert.equal(await page.getByRole('button',{name:/Lưu lá số/}).count(),0);
  await page.screenshot({path:'qa-artifacts/interaction/unknown-'+width+'.png',fullPage:true});
  await goto('/ho-so');await page.getByRole('heading',{name:'Chưa có hồ sơ nào'}).waitFor();
  await goto('/chart');
  await fillNormal(page);
  await page.getByPlaceholder('Ví dụ: Nguyễn Văn A').fill('QA-BIRTH-UNIQUE');
  await page.getByRole('button',{name:/LẬP LÁ SỐ TỬ VI/}).click();
  await page.getByLabel('Bàn lá số 12 cung').waitFor();
  await page.screenshot({path:'qa-artifacts/interaction/chart-'+width+'.png',fullPage:true});
  await page.getByRole('button',{name:/Lưu lá số/}).click();
  await page.getByText(/Đã lưu hồ sơ trên thiết bị này/).waitFor();
  await goto('/ho-so');await page.getByRole('heading',{name:/QA-BIRTH-UNIQUE/}).waitFor();
  await page.getByRole('button',{name:/Xem lá số/}).click();
  await page.getByLabel('Bàn lá số 12 cung').waitFor();
  await goto('/lich-van-nien');
  await page.getByLabel('Năm tra cứu').selectOption('1985');
  await page.getByLabel('Tháng tra cứu').selectOption('1');
  await page.getByRole('button',{name:'21/1/1985',exact:true}).click();
  await page.getByText('1/1/1985',{exact:true}).waitFor();
  await page.getByText('Ất Sửu',{exact:true}).waitFor();
  await goto('/chart');await fillNormal(page);await fillDate(page,'1985','1','21');
  await page.getByRole('button',{name:/LẬP LÁ SỐ TỬ VI/}).click();
  await page.getByLabel('Bàn lá số 12 cung').waitFor();
  if(width===360){await page.locator('.mobile-lunar-date').waitFor();assert.match(await page.locator('.mobile-lunar-date').innerText(),/Âm lịch: 1\/1\/1985/);}else await page.locator('.chart-scroll').getByText(/Âm lịch: 1\/1\/1985/).waitFor();
  await goto('/hop-ban');
  const a=page.locator('.compare-a'),b=page.locator('.compare-b');
  await fillNormal(a);
  if(width===360)await page.getByRole('button',{name:/Người thứ hai/}).click();
  await fillNormal(b);
  await page.getByRole('button',{name:/Đối chiếu hai lá số/}).click();
  await page.getByRole('heading',{name:'Báo cáo đối chiếu 12 cung'}).waitFor();
  await page.screenshot({path:'qa-artifacts/interaction/hop-ban-'+width+'.png',fullPage:true});
  await goto('/chart');
  await fillDate(page,'1955','7','1');
  await page.getByLabel('Tỉnh hoặc thành phố nơi sinh').selectOption('Tỉnh Quảng Trị');
  await page.getByLabel('Quận huyện hoặc khu vực nơi sinh').selectOption('Địa danh khác (nhập kinh độ)');
  await page.getByLabel('Kinh độ',{exact:true}).fill('107');
  await page.getByLabel('Giờ và phút sinh').fill('00:30');
  await page.getByText(/Cần xác định phía Bắc hoặc Nam sông Bến Hải/).waitFor();
  await page.getByLabel('Khu vực lịch sử').selectOption('south');
  await page.getByText(/Giờ này xuất hiện hai lần trong lịch sử/).waitFor();
  await page.screenshot({path:'qa-artifacts/interaction/historical-'+width+'.png',fullPage:true});
  assert.deepEqual(leaks,[],'Synthetic birth name in network requests');
  assert.deepEqual(errors,[],'Browser runtime errors');
  outcomes.push({width,chart:true,unknown:true,profile:true,hopBan:true,historical:true,networkLeaks:leaks.length,pageErrors:errors.length});
  console.log('BROWSER_QA '+JSON.stringify(outcomes.at(-1)));
  await ctx.close();
 }
}finally{writeFileSync('qa-artifacts/interaction/results.json',JSON.stringify(outcomes,null,2));await browser.close();}
