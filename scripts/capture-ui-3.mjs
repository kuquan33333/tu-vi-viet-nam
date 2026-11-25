import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const phase=process.argv[2];assert.ok(['before','after'].includes(phase));
const dir='qa-artifacts/ui-3-'+phase;mkdirSync(dir,{recursive:true});
const base='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});const results=[];
try{
 for(const width of [360,768,1280]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',acceptDownloads:true});
  const page=await ctx.newPage(),errors=[],outbound=[];
  page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/*',r=>{if(r.request().url().startsWith(base+'/'))return r.continue();outbound.push(r.request().url());return r.abort()});
  const open=async()=>{await page.goto(base+'/chart');await page.waitForFunction(()=>document.documentElement.dataset.themeReady==='true');await page.evaluate(()=>document.fonts.ready);};
  const overflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page overflow '+width);
  const submit=()=>page.getByRole('button',{name:/LẬP LÁ SỐ TỬ VI/});
  const date=async()=>{await page.getByLabel('Ngày sinh dương lịch',{exact:true}).selectOption('6');await page.getByLabel('Tháng sinh dương lịch',{exact:true}).selectOption('5');await page.getByLabel('Năm sinh',{exact:true}).fill('1990');};
  const fill=async()=>{await page.getByLabel('Họ và tên (tùy chọn)').fill('UI3 QA');if(phase==='after')await page.getByRole('button',{name:'Nam',exact:true}).click();await date();await page.getByLabel('Giờ và phút sinh').fill('08:00');await page.getByLabel('Tỉnh hoặc thành phố nơi sinh').selectOption('Tỉnh Gia Lai');await page.getByLabel('Quận huyện hoặc khu vực nơi sinh').selectOption('TP. Pleiku');};
  await open();await overflow();await page.screenshot({path:dir+'/form-'+width+'.png',fullPage:true,animations:'disabled'});
  if(phase==='after'){
   const genders=page.getByRole('group',{name:'Giới tính (bắt buộc)'});
   assert.deepEqual(await genders.getByRole('button').evaluateAll(bs=>bs.map(b=>b.getAttribute('aria-pressed'))),['false','false']);
   await submit().click();await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-invalid')==='true');
   assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.trim()),'Nam');
   const invalids=page.locator('.birth-form [aria-invalid=true]');
   assert.ok(await invalids.count()>=6);
   assert.ok(await invalids.evaluateAll(els=>els.every(e=>{const id=e.getAttribute('aria-describedby');return id&&document.getElementById(id)?.textContent?.trim()})));
   await page.screenshot({path:dir+'/errors-'+width+'.png',fullPage:true,animations:'disabled'});
   await page.getByRole('button',{name:/Sinh ở nước ngoài/}).click();
   assert.equal(await page.getByLabel('Tỉnh hoặc thành phố nơi sinh').count(),0);
   assert.equal(await page.getByLabel('Quận huyện hoặc khu vực nơi sinh').count(),0);
   assert.equal(await page.getByLabel('Kinh độ',{exact:true}).inputValue(),'');
   assert.equal(await page.getByLabel('Múi giờ UTC tại thời điểm sinh',{exact:true}).inputValue(),'');
   await page.getByLabel('Thành phố và quốc gia').fill('Paris, Pháp');await page.getByLabel('Kinh độ',{exact:true}).fill('2.35');await page.getByLabel('Múi giờ UTC tại thời điểm sinh',{exact:true}).fill('2');
   await page.getByRole('button',{name:'Nữ',exact:true}).click();await date();await page.getByLabel('Giờ và phút sinh').fill('08:00');await submit().click();await page.getByLabel('Bàn lá số 12 cung').waitFor();
   await open();await page.getByRole('button',{name:'Nam',exact:true}).click();await date();
   await page.getByLabel('Tỉnh hoặc thành phố nơi sinh').selectOption('Tỉnh Gia Lai');await page.getByLabel('Quận huyện hoặc khu vực nơi sinh').selectOption('TP. Pleiku');
   await page.getByLabel('Không rõ giờ sinh cụ thể').check();assert.equal(await page.getByLabel('Giờ và phút sinh').isDisabled(),true);
   await page.getByRole('button',{name:/XEM 12 PHƯƠNG ÁN/}).click();await page.getByRole('heading',{name:'12 phương án chưa xác định'}).waitFor();
   assert.equal(await page.getByRole('button',{name:'Lưu lá số'}).count(),0);
   assert.equal(await page.locator('.chart3-hypothesis').count(),12);
   assert.equal(await page.locator('.chart3-hypothesis[open]').count(),0);
   await open();
  }
  await fill();await submit().click();await page.getByLabel('Bàn lá số 12 cung').waitFor();await overflow();
  await page.evaluate(()=>document.fonts.ready);
  if(width>=640)await page.locator('.chart-scroll [role=group]').first().waitFor();
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForFunction(()=>window.scrollY===0);
  await page.screenshot({path:dir+'/result-'+width+'.png',fullPage:true,animations:'disabled'});
  if(phase==='after'){
   if(width===360){
    assert.equal(await page.locator('.mobile-palace').count(),12);
    await page.locator('.mobile-star-list button').first().click();
    await page.locator('.chart3-detail.is-open').waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('.chart3-detail').isVisible(),false);
    await page.getByRole('button',{name:'Xem dạng bàn'}).click();await page.locator('.chart-scroll').waitFor();await overflow();
   }
   await page.locator('.chart3-grid').waitFor();
   assert.equal(await page.locator('.chart3-palace').count(),12);
   const major=page.locator('.chart3-palace [role=button]').first();await major.click();
   await page.locator('.chart3-detail.is-open').waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('.chart3-detail.is-open').count(),0);
   await page.getByRole('button',{name:'Chia sẻ ảnh'}).click();await page.locator('#share-card').waitFor();
   const download=page.waitForEvent('download');await page.getByRole('button',{name:'Tải ảnh PNG'}).click();
   const png=await download;assert.match(png.suggestedFilename(),/\.png$/);const bytes=readFileSync(await png.path());assert.ok(bytes.length>1000);assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
   await page.getByRole('dialog').getByRole('button',{name:'Đóng',exact:true}).click();
   await page.emulateMedia({media:'print'});assert.equal(await page.locator('.chart-scroll').isVisible(),true);const pdf=await page.pdf({path:dir+'/print-'+width+'.pdf',preferCSSPageSize:true,printBackground:true});const pageCount=(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length;assert.equal(pageCount,1,'A4 chart must occupy exactly one page at '+width);await page.emulateMedia({media:'screen'});
   assert.deepEqual(errors,[]);assert.deepEqual(outbound,[]);
   await open();await page.addScriptTag({path:process.env.AXE_SCRIPT});const axe=await page.evaluate(async()=>window.axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
   writeFileSync(dir+'/axe-'+width+'.json',JSON.stringify(axe.violations,null,2));
   assert.deepEqual(axe.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  }
  results.push({width,phase,errors,outbound});await ctx.close();
 }
}finally{writeFileSync(dir+'/results.json',JSON.stringify(results,null,2));await browser.close();}
assert.equal(results.length,3);
console.log('UI3 '+phase+' 3 viewport captures complete');
