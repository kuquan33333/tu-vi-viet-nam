import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const base='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});const results=[],contrast=[];
mkdirSync('qa-artifacts/v4',{recursive:true});
try{
 for(const width of [360,1280]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const page=await ctx.newPage();
  await ctx.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  const open=async path=>{await page.goto(base+path);await page.waitForLoadState('networkidle');await page.waitForFunction(()=>document.documentElement.dataset.themeReady==='true');};
  const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal page overflow '+page.url());
  for(const path of ['/','/chart','/lich-van-nien','/hop-ban','/ho-so','/thien-ky/que/1','/nhan-ky']){
   await open(path);await noOverflow();console.log('V4_THEME '+width+' '+path);
   const checkContrast=async theme=>{if(!['/','/chart','/lich-van-nien'].includes(path)||!process.env.AXE_SCRIPT)return;await page.addScriptTag({path:process.env.AXE_SCRIPT});const result=await page.evaluate(async()=>await window.axe.run({runOnly:{type:'rule',values:['color-contrast']}}));contrast.push({path,width,theme,violations:result.violations.flatMap(v=>v.nodes.map(n=>({target:n.target,summary:n.failureSummary})))});};
   async function chooseTheme(theme){const root=page.locator('html');const old=await root.getAttribute('data-theme');if(old!==theme)await page.getByRole('button',{name:theme==='dark'?'Chuyển sang chế độ tối':'Chuyển sang chế độ sáng'}).click();await page.waitForFunction(t=>document.documentElement.dataset.theme===t,theme);await page.getByRole('button',{name:theme==='dark'?'Chuyển sang chế độ sáng':'Chuyển sang chế độ tối'}).waitFor();await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));}
   await chooseTheme('light');await checkContrast('light');
   await chooseTheme('dark');await noOverflow();await checkContrast('dark');
   await chooseTheme('light');
  }
  await open('/chart');await page.getByLabel('Họ và tên (tùy chọn)').fill('V4 QA');
  await page.getByLabel('Ngày sinh dương lịch').selectOption('6');await page.getByLabel('Tháng sinh dương lịch').selectOption('5');await page.getByLabel('Năm sinh',{exact:true}).fill('1990');
  await page.getByLabel('Tỉnh hoặc thành phố nơi sinh').selectOption('Tỉnh Gia Lai');await page.getByLabel('Quận huyện hoặc khu vực nơi sinh').selectOption('TP. Pleiku');await page.getByLabel('Giờ và phút sinh').fill('08:00');
  await page.getByRole('button',{name:/LẬP LÁ SỐ TỬ VI/}).click();await page.getByLabel('Bàn lá số 12 cung').waitFor();await noOverflow();
  if(width===360){assert.equal(await page.locator('.mobile-palace').count(),12);assert.equal(await page.locator('.chart-scroll').isVisible(),false);}
  await page.getByRole('button',{name:'Lưu lá số'}).click();await page.getByText(/Đã lưu hồ sơ/).waitFor();
  await page.screenshot({path:'qa-artifacts/v4/chart-'+width+'.png',fullPage:true});
  await page.emulateMedia({media:'print'});await page.locator('.chart-scroll').waitFor({state:'visible'});await page.pdf({path:'qa-artifacts/v4/chart-'+width+'.pdf',preferCSSPageSize:true,printBackground:true});await page.emulateMedia({media:'screen'});
  await open('/ho-so');await page.getByLabel('Mã PIN',{exact:true}).fill('73918426');await page.getByLabel('Nhập lại PIN').fill('73918426');await page.getByRole('button',{name:'Mã hóa và khóa'}).click();
  await page.getByRole('heading',{name:'Kho hồ sơ đang khóa'}).waitFor();
  assert.ok(!(await page.evaluate(()=>localStorage.getItem('tuvivn.profiles.v2'))).includes('V4 QA'));
  await page.getByLabel('Mã PIN',{exact:true}).fill('00000000');await page.getByRole('button',{name:'Mở khóa'}).click();await page.getByText(/PIN không đúng/).waitFor();
  await page.getByLabel('Mã PIN',{exact:true}).fill('73918426');await page.getByRole('button',{name:'Mở khóa'}).click();await page.getByRole('heading',{name:'V4 QA'}).waitFor();
  await page.getByRole('link',{name:'Hợp bàn',exact:true}).filter({visible:true}).first().click();await page.getByLabel('Chọn hồ sơ người A').selectOption({label:await page.getByLabel('Chọn hồ sơ người A').locator('option').nth(1).textContent()});
  if(width===360)await page.getByRole('button',{name:/Người thứ hai/}).click();
  await page.getByLabel('Chọn hồ sơ người B').selectOption({label:await page.getByLabel('Chọn hồ sơ người B').locator('option').nth(1).textContent()});
  await page.getByRole('button',{name:'Đối chiếu hai lá số'}).click();await page.getByRole('heading',{name:'Báo cáo đối chiếu 12 cung'}).waitFor();await noOverflow();
  await page.screenshot({path:'qa-artifacts/v4/hop-ban-'+width+'.png',fullPage:true});
  await open('/lich-van-nien');await page.getByLabel('Năm tra cứu').selectOption('2004');await page.getByLabel('Tháng tra cứu').selectOption('2');await page.getByRole('button',{name:'4/2/2004',exact:true}).click();await page.getByText(/Lập xuân · 18:5/).waitFor();await noOverflow();
  await page.emulateMedia({media:'print'});assert.equal(await page.getByRole('button',{name:'In lịch tháng A4'}).isVisible(),false);await page.pdf({path:'qa-artifacts/v4/calendar-'+width+'.pdf',preferCSSPageSize:true,printBackground:true});await page.emulateMedia({media:'screen'});
  await open('/thien-ky/que/1');await page.getByRole('heading',{name:'Quái từ',exact:true}).waitFor();await page.getByRole('link',{name:'Quẻ sau',exact:true}).click();await page.getByRole('heading',{name:'Thuần Khôn',exact:true}).waitFor();
  await page.screenshot({path:'qa-artifacts/v4/hex-'+width+'.png',fullPage:true});
  results.push({width,profileEncryption:true,profileComparison:true,calendar:true,hexagram:true,overflow:false});await ctx.close();
 }
}finally{writeFileSync('qa-artifacts/v4/results.json',JSON.stringify(results,null,2));writeFileSync('qa-artifacts/v4/contrast.json',JSON.stringify(contrast,null,2));await browser.close();}
assert.ok(contrast.every(x=>x.violations.length===0),'WCAG AA contrast violations: '+JSON.stringify(contrast.filter(x=>x.violations.length)));
