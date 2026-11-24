import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const root='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true}),reports=[];
mkdirSync('qa-artifacts/specialists',{recursive:true});
try{
 for(const width of [360,1280]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',route=>route.request().url().startsWith(root)?route.continue():route.abort());
  const open=async path=>{
   const res=await page.goto(root+path,{waitUntil:'domcontentloaded'});
   assert.equal(res?.status(),200,path+' returned non-200');
   await page.waitForFunction(()=>document.documentElement.dataset.themeReady==='true',{timeout:12000});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'Overflow at '+path+' '+width);
  };
  await open('/thien-ky');
  await page.getByRole('tab',{name:/Kỳ Môn thời gia/}).click();
  await page.getByRole('button',{name:'Lập thời gia bàn'}).click();
  await page.getByRole('group',{name:'Cửu cung chuyển bàn theo giờ'}).waitFor({timeout:15000});
  assert.equal(await page.getByRole('group',{name:'Cửu cung chuyển bàn theo giờ'}).locator('.study-palace').count(),9);
  assert.ok(await page.getByText(/Trực Phù/).count());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'Qimen overflow '+width);
  await page.screenshot({path:'qa-artifacts/specialists/qimen-'+width+'.png',fullPage:true});

  await open('/dia-ky');
  await page.getByRole('tab',{name:'Huyền Không · GIS'}).click();
  await page.getByRole('button',{name:'Lập Huyền Không bàn'}).click();
  await page.getByRole('group',{name:'Cửu cung Vận Sơn Hướng'}).waitFor({timeout:15000});
  assert.equal(await page.getByRole('group',{name:'Cửu cung Vận Sơn Hướng'}).locator('.study-palace').count(),9);
  assert.equal(await page.locator('iframe[src*="openstreetmap.org"]').count(),0,'Map should not load without consent');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'XuanKhong overflow '+width);
  await page.screenshot({path:'qa-artifacts/specialists/xuan-'+width+'.png',fullPage:true});

  await open('/nhan-ky');
  await page.getByRole('heading',{name:'Kiểm chứng danh mục và thư mục có nguồn'}).waitFor();
  await page.getByText(/361\/361 mã huyệt/).waitFor();
  await page.getByText(/0\/361/).waitFor();
  await page.screenshot({path:'qa-artifacts/specialists/medical-'+width+'.png',fullPage:false});

  await open('/thien-ky/que/1');
  await page.getByRole('heading',{name:/Bản dịch ý quái từ/}).waitFor();
  await page.getByRole('heading',{name:'Bình giải bối cảnh và thông điệp'}).waitFor();
  await page.screenshot({path:'qa-artifacts/specialists/hex1-'+width+'.png',fullPage:false});

  assert.deepEqual(errors,[],'JS errors on specialist journeys '+width);
  reports.push({width,qimenNinePalaces:true,xuanThreePlates:true,osmConsent:true,acupointsCodes:true,hexagramVietnamese:true,errors:0});
  await context.close();
 }
} finally {
 writeFileSync('qa-artifacts/specialists/results.json',JSON.stringify(reports,null,2));
 await browser.close();
}
