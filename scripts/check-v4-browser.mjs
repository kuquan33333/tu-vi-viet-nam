import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const base='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});const results=[],contrast=[],mobileSmokes=[];
mkdirSync('qa-artifacts/v4',{recursive:true});
try{
 for(const width of [360,1280]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const page=await ctx.newPage();
  await ctx.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  // Diagnose hydration failures without treating a server-rendered 200 page as interactive.
  const browserErrors=[],failedRequests=[];
  page.on('pageerror',err=>browserErrors.push(err.message));
  page.on('requestfailed',request=>failedRequests.push({url:request.url(),reason:request.failure()?.errorText}));
  const open=async path=>{
   const response=await page.goto(base+path,{waitUntil:'domcontentloaded'});
   await page.waitForLoadState('networkidle');
   try{
    await page.waitForFunction(()=>document.documentElement.dataset.themeReady==='true',null,{timeout:12000});
   }catch(err){
    const details=await page.evaluate(()=>({
     title:document.title,
     theme:document.documentElement.getAttribute('data-theme'),
     themeReady:document.documentElement.dataset.themeReady||null,
     navigation:location.pathname,
     heading:[...document.querySelectorAll('h1')].map(x=>x.textContent?.slice(0,100)),
     buttons:[...document.querySelectorAll('.theme-switch')].map(x=>({name:x.getAttribute('aria-label'),disabled:x.disabled})),
     scripts:document.scripts.length,
     loadedScripts:[...document.scripts].filter(x=>x.src).length,
     bodyText:document.body?.innerText?.slice(0,400)
    })).catch(e=>({readError:String(e)}));
    console.error('V4_HYDRATION_DIAGNOSTIC '+JSON.stringify({path,width,status:response?.status(),details,browserErrors,failedRequests:failedRequests.slice(-20)}));
    await page.screenshot({path:'qa-artifacts/v4/hydration-failure-'+width+'.png',fullPage:false}).catch(()=>{});
    throw err;
   }
   assert.equal(response?.status(),200,'Unexpected status '+path);
  };
  const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal page overflow '+page.url());
  for(const path of ['/','/chart','/lich-van-nien','/hop-ban','/ho-so','/thien-ky/que/1','/nhan-ky']){
   await open(path);await noOverflow();console.log('V4_THEME '+width+' '+path);
   const checkContrast=async theme=>{if(!['/','/chart','/lich-van-nien'].includes(path)||!process.env.AXE_SCRIPT)return;await page.addScriptTag({path:process.env.AXE_SCRIPT});const result=await page.evaluate(async()=>await window.axe.run({runOnly:{type:'rule',values:['color-contrast']}}));contrast.push({path,width,theme,violations:result.violations.flatMap(v=>v.nodes.map(n=>({target:n.target,summary:n.failureSummary})))});};
   async function chooseTheme(theme){const root=page.locator('html');const old=await root.getAttribute('data-theme');if(old!==theme)await page.getByRole('button',{name:theme==='dark'?'Chuyển sang chế độ tối':'Chuyển sang chế độ sáng'}).click();await page.waitForFunction(t=>document.documentElement.dataset.theme===t,theme);await page.getByRole('button',{name:theme==='dark'?'Chuyển sang chế độ sáng':'Chuyển sang chế độ tối'}).waitFor();await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));}
   if(await page.locator('.theme-switch').count()){
    await chooseTheme('light');await checkContrast('light');
    await chooseTheme('dark');await noOverflow();await checkContrast('dark');
    await chooseTheme('light');
   }else{
    // UI-BRIEF explicitly defers dark mode. Verify old saved preferences do not
    // override the new light-only presentation, and preserve contrast testing.
    await page.evaluate(()=>localStorage.setItem('ziwei-theme','dark'));
    await open(path);await noOverflow();
    assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
    assert.equal(await page.evaluate(()=>localStorage.getItem('ziwei-theme')),'dark');
    assert.equal(await page.locator('.theme-switch').count(),0);
    await checkContrast('light');
    // All shared info buttons must have no external ring while retaining the SVG circle and touch target.
    const helpButtons=await page.locator('button.term-help-button:visible').evaluateAll(buttons=>buttons.map(b=>{const s=getComputedStyle(b),r=b.getBoundingClientRect(),svg=b.querySelector('svg');return {border:[s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth],background:s.backgroundColor,shadow:s.boxShadow,width:r.width,height:r.height,circle:!!svg?.querySelector('circle'),color:s.color};}));
    for(const b of helpButtons){assert.deepEqual(b.border,['0px','0px','0px','0px']);assert.equal(b.background,'rgba(0, 0, 0, 0)');assert.equal(b.shadow,'none');assert.ok(b.width>=44&&b.height>=44);assert.ok(b.circle);assert.equal(b.color,'rgb(158, 47, 38)');}
    if(path==='/chart'){
      const solar=page.getByRole('button',{name:'Dương lịch (Mặt trời)',exact:true});
      const lunar=page.getByRole('button',{name:'Âm lịch (Mặt trăng)',exact:true});
      for(const toggle of [solar,lunar]){
        await toggle.click();
        assert.equal(await toggle.getAttribute('aria-pressed'),'true');
        const other=toggle===solar?lunar:solar;
        assert.equal(await other.getAttribute('aria-pressed'),'false');
        for(const button of [solar,lunar])assert.ok((await button.boundingBox()).height>=44,'Calendar toggle touch target');
        await noOverflow();
        await checkContrast('light');
      }
    }
   }
  }
  await open('/chart');await page.getByRole('button',{name:'Nam',exact:true}).click();await page.getByLabel('Họ và tên (tùy chọn)').fill('V4 QA');
  await page.getByLabel('Ngày sinh dương lịch').selectOption('6');await page.getByLabel('Tháng sinh dương lịch').selectOption('5');await page.getByLabel('Năm sinh',{exact:true}).fill('1990');
  await page.getByLabel('Tỉnh hoặc thành phố nơi sinh').selectOption('Tỉnh Gia Lai');await page.getByLabel('Quận huyện hoặc khu vực nơi sinh').selectOption('TP. Pleiku');await page.getByLabel('Giờ và phút sinh').fill('08:00');
  await page.getByRole('button',{name:/LẬP LÁ SỐ TỬ VI/}).click();await page.getByLabel('Bàn lá số 12 cung').waitFor();await noOverflow();
  if(width===360){assert.equal(await page.locator('.mobile-palace').count(),12);assert.equal(await page.locator('.chart-scroll').isVisible(),false);}
  await page.getByRole('button',{name:'Lưu lá số'}).click();await page.getByText(/Đã lưu hồ sơ/).waitFor();
  await page.screenshot({path:'qa-artifacts/v4/chart-'+width+'.png',fullPage:true});
  await page.emulateMedia({media:'print'});await page.locator('.chart-scroll').waitFor({state:'visible'});await page.pdf({path:'qa-artifacts/v4/chart-'+width+'.pdf',preferCSSPageSize:true,printBackground:true});await page.emulateMedia({media:'screen'});
  // The separate profile print action must reopen the real chart and call print only after rendering.
  await open('/ho-so');
  await page.evaluate(()=>{window.print=()=>{document.documentElement.dataset.printInvoked='true';};});
  await page.getByRole('button',{name:'In A4',exact:true}).click();
  await page.waitForURL('**/chart?print=1');await page.getByLabel('Bàn lá số 12 cung').waitFor();
  await page.waitForFunction(()=>document.documentElement.dataset.printInvoked==='true');
  await page.emulateMedia({media:'print'});await page.locator('.chart-scroll').waitFor({state:'visible'});const profilePdf=await page.pdf({path:'qa-artifacts/v4/profile-print-'+width+'.pdf',preferCSSPageSize:true,printBackground:true});assert.equal((profilePdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,1);await page.emulateMedia({media:'screen'});
  // JSON backup must download the real saved profile; importing it again is idempotent.
  await open('/ho-so');
  page.once('dialog',dialog=>dialog.accept());
  const [backup]=await Promise.all([
   page.waitForEvent('download'),
   page.getByRole('button',{name:'Xuất JSON'}).click()
  ]);
  assert.equal(backup.suggestedFilename(),'ho-so-tu-vi.json');
  const exported=JSON.parse(readFileSync(await backup.path(),'utf8'));
  assert.equal(exported.format,'tuvivn-profiles');
  assert.ok(exported.profiles.some(p=>p.birth?.name==='V4 QA'));
  await page.getByLabel('Nhập JSON').setInputFiles({
   name:'test-import.json',mimeType:'application/json',
   buffer:Buffer.from(JSON.stringify(exported))
  });
  await page.getByText(/Đã nhập 0 hồ sơ mới/).waitFor();
  await page.getByRole('heading',{name:'V4 QA'}).waitFor();
  await open('/ho-so');await page.getByLabel('Mã PIN',{exact:true}).fill('73918426');await page.getByLabel('Nhập lại PIN').fill('73918426');await page.getByRole('button',{name:'Mã hóa và khóa'}).click();
  await page.getByRole('heading',{name:'Kho hồ sơ đang khóa'}).waitFor();
  assert.ok(!(await page.evaluate(()=>localStorage.getItem('tuvivn.profiles.v2'))).includes('V4 QA'));
  await page.getByLabel('Mã PIN',{exact:true}).fill('00000000');await page.getByRole('button',{name:'Mở khóa'}).click();await page.getByText(/PIN không đúng/).waitFor();
  await page.getByLabel('Mã PIN',{exact:true}).fill('73918426');await page.getByRole('button',{name:'Mở khóa'}).click();await page.getByRole('heading',{name:'V4 QA'}).waitFor();
  // Do not reload the page: the encrypted vault deliberately relocks on a hard navigation.
  // Exercise the real new shell via client-side navigation from the unlocked profile page.
  await page.locator('.global-header .brand-wordmark').click();
  await page.locator('.home-primary-grid a[href="/hop-ban"]').click();
  await page.waitForURL('**/hop-ban');await page.getByLabel('Chọn hồ sơ người A').selectOption({label:await page.getByLabel('Chọn hồ sơ người A').locator('option').nth(1).textContent()});
  if(width===360)await page.getByRole('button',{name:/Người thứ hai/}).click();
  await page.getByLabel('Chọn hồ sơ người B').selectOption({label:await page.getByLabel('Chọn hồ sơ người B').locator('option').nth(1).textContent()});
  await page.getByRole('button',{name:'Đối chiếu hai lá số'}).click();await page.getByRole('heading',{name:'Báo cáo đối chiếu 12 cung'}).waitFor();await noOverflow();
  await page.screenshot({path:'qa-artifacts/v4/hop-ban-'+width+'.png',fullPage:true});
  await open('/lich-van-nien');await page.getByLabel('Năm tra cứu').selectOption('2004');await page.getByLabel('Tháng tra cứu').selectOption('2');await page.locator('button[data-date="2004-02-04"]').click();await page.locator('.calendar4-facts dd').last().getByText(/Lập xuân · 18:5/).waitFor();await noOverflow();
  await page.emulateMedia({media:'print'});assert.equal(await page.getByRole('button',{name:'In lịch tháng A4'}).isVisible(),false);await page.pdf({path:'qa-artifacts/v4/calendar-'+width+'.pdf',preferCSSPageSize:true,printBackground:true});await page.emulateMedia({media:'screen'});
  await open('/thien-ky/que/1');await page.getByRole('heading',{name:'Quái từ',exact:true}).waitFor();await page.getByRole('link',{name:'Quẻ sau',exact:true}).click();await page.getByRole('heading',{name:'Thuần Khôn',exact:true}).waitFor();
  await page.screenshot({path:'qa-artifacts/v4/hex-'+width+'.png',fullPage:true});
  results.push({width,profileEncryption:true,profileComparison:true,calendar:true,hexagram:true,overflow:false});await ctx.close();
 }

 // Additional real mobile widths requested at the audit stage.
 // Preserve the deep interaction/contrast suite at 360/1280 above.
 for(const width of [320,390,430]){
  const ctx=await browser.newContext({viewport:{width,height:840},reducedMotion:'reduce',acceptDownloads:true});
  const page=await ctx.newPage(),pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  await ctx.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  const paths=['/','/chart','/hop-ban','/lich-van-nien','/thien-ky/que/1','/dia-ky','/nhan-ky','/ho-so','/library','/cong-cu'];
  for(const route of paths){
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});
   assert.equal(response?.status(),200,'Mobile '+width+' unexpected HTTP '+route);
   await page.waitForFunction(()=>document.documentElement.dataset.themeReady==='true');
   const sizes=await page.evaluate(()=>({
    scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth,
    heading:document.querySelector('h1')?.textContent?.trim()||'',
    bottom:document.querySelector('.bottom-nav')?getComputedStyle(document.querySelector('.bottom-nav')).display:null
   }));
   assert.ok(sizes.heading,'Mobile '+width+' missing heading '+route);
   assert.ok(sizes.scroll<=sizes.viewport+1,'Mobile '+width+' overflow '+route+' '+JSON.stringify(sizes));
   assert.equal(sizes.bottom,'grid','Mobile '+width+' navigation invisible '+route);
   mobileSmokes.push({width,route,status:response.status(),scroll:sizes.scroll,viewport:sizes.viewport});
   if(['/','/chart','/lich-van-nien'].includes(route)){
    await page.screenshot({path:'qa-artifacts/v4/mobile-'+width+'-'+(route==='/'?'home':route.slice(1))+'.png',fullPage:false});
   }
   if(route==='/'){
    await page.getByRole('button',{name:'Mở menu'}).click();
    await page.getByRole('navigation',{name:'Menu toàn website'}).waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('navigation',{name:'Menu toàn website'}).waitFor({state:'hidden'});
   }
  }
  assert.deepEqual(pageErrors,[],'Mobile '+width+' runtime errors');
  console.log('MOBILE_SMOKE '+JSON.stringify({width,routes:paths.length,errors:pageErrors.length}));
  await ctx.close();
 }
}finally{writeFileSync('qa-artifacts/v4/results.json',JSON.stringify(results,null,2));writeFileSync('qa-artifacts/v4/contrast.json',JSON.stringify(contrast,null,2));writeFileSync('qa-artifacts/v4/mobile-smokes.json',JSON.stringify(mobileSmokes,null,2));await browser.close();}
assert.ok(contrast.every(x=>x.violations.length===0),'WCAG AA contrast violations: '+JSON.stringify(contrast.filter(x=>x.violations.length)));
