import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const phase=process.argv[2];assert.ok(['before','after'].includes(phase));
const dir='qa-artifacts/ui-5-'+phase;mkdirSync(dir,{recursive:true});
const base='http://127.0.0.1:4173',browser=await chromium.launch({headless:true}),results=[],failures=[];
const routes=['/cong-cu','/thien-ky','/dia-ky','/nhan-ky','/library','/library/gusuifu','/library/gusuifu/tong-luan-thien','/library/search','/hop-ban','/ho-so','/privacy','/terms','/thien-ky/que/1','/404'];
try{
 for(const width of [360,768,1280]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[],outbound=[];
  page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/*',r=>{if(r.request().url().startsWith(base+'/'))return r.continue();outbound.push(r.request().url());return r.abort()});
  const open=async route=>{await page.goto(base+route);await page.waitForFunction(()=>document.documentElement.dataset.themeReady==='true');await page.evaluate(()=>document.fonts.ready);};
  const overflow=async route=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow '+route+' '+width);
  for(const route of routes){
   if(phase==='before'&&route==='/404')continue;
   const slug=route.slice(1).replaceAll('/','-');
   try{
   await open(route);
   if(phase==='after')await overflow(route);
   await page.screenshot({path:dir+'/'+slug+'-'+width+'.png',fullPage:true,animations:'disabled'});
   if(phase==='before'){results.push({width,route,phase,status:'captured'});continue;}
   assert.equal(await page.locator('h1').count(),1,'single h1 '+route);
   assert.ok(await page.locator('nav[aria-label="Đường dẫn trang"]').count()>=1,'breadcrumb '+route);
   if(['/thien-ky','/dia-ky','/nhan-ky'].includes(route)){
    const tabs=page.getByRole('tablist').first(),all=tabs.getByRole('tab');
    assert.equal(await tabs.locator('button[tabindex="0"]').count(),1);
    await all.first().focus();await page.keyboard.press('ArrowRight');assert.equal(await all.nth(1).getAttribute('aria-selected'),'true');
    const panelId=await all.nth(1).getAttribute('aria-controls');assert.equal(await page.locator('#'+panelId).isVisible(),true);
    await overflow(route+' second tab');await page.screenshot({path:dir+'/'+slug+'-tab2-'+width+'.png',fullPage:true,animations:'disabled'});await page.keyboard.press('End');assert.equal(await all.last().getAttribute('aria-selected'),'true');await overflow(route+' last tab');
    await page.keyboard.press('Home');assert.equal(await all.first().getAttribute('aria-selected'),'true');
   }
   if(route==='/cong-cu')assert.equal(await page.locator('.ui5-tool').count(),9);
   if(route==='/thien-ky'){
    assert.equal(await page.locator('.ui5-dictionary-search .study-point-list button').count(),64);
    await page.locator('select').first().selectOption('9');await page.getByRole('button',{name:'Lập từ 6 hào nhập tay'}).click();
    assert.equal(await page.getByRole('heading',{name:'Quẻ chủ',exact:true}).count(),1);assert.equal(await page.getByRole('heading',{name:'Quẻ biến',exact:true}).count(),1);
    assert.equal(await page.locator('svg.ui5-hexagram').first().locator('[data-line]').count(),6);assert.match(await page.locator('svg.ui5-hexagram').first().getAttribute('aria-label'),/hào động 1/);
    const readingLink=page.locator('a[href*="#hao-"]').first();assert.match(await readingLink.evaluate(e=>getComputedStyle(e).textDecorationLine),/underline/);
    await page.locator('#dich-search').fill('29');assert.equal(await page.locator('.ui5-dictionary-search .study-point-list button').count(),1);
   }
   if(route==='/dia-ky'){await page.locator('#degree-number').fill('90');assert.match(await page.locator('.ui5-direction-pair').innerText(),/90\.0°[\s\S]*270\.0°/);}
   if(route==='/library/gusuifu/tong-luan-thien'){
    assert.ok(await page.locator('.ui5-passage').count()>0);assert.ok(await page.locator('.ui5-reader').evaluate(e=>e.getBoundingClientRect().width<=680));assert.match(await page.locator('.ui5-passage').first().innerText(),/Hán-Việt[\s\S]*Dịch nghĩa/);
    assert.equal(await page.locator('.ui5-chapters a[aria-current=page]').count(),1);
   }
   if(route==='/hop-ban'){assert.equal(await page.locator('.compare-forms select[aria-label^="Chọn hồ sơ người"]').count(),2);}
   if(route==='/ho-so'){await page.getByRole('heading',{name:'Chưa có hồ sơ nào'}).waitFor();assert.equal(await page.locator('.ui5-profiles a[href="/chart"]').count()>=2,true);}
   if(route==='/privacy'||route==='/terms')assert.equal(await page.locator('.ui5-legal-toc a').count(),5);
   if(route==='/404'){assert.equal(await page.locator('.ui5-error a[href="/"]').count(),1);assert.equal(await page.locator('.ui5-error a[href="/lich-van-nien"]').count(),1);}
   if(['/cong-cu','/thien-ky','/dia-ky','/nhan-ky','/library','/library/gusuifu/tong-luan-thien','/privacy','/terms','/hop-ban','/ho-so'].includes(route)){
    await page.addScriptTag({path:process.env.AXE_SCRIPT});
    const axe=await page.evaluate(async()=>window.axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
    writeFileSync(dir+'/axe-'+slug+'-'+width+'.json',JSON.stringify(axe.violations,null,2));
    assert.deepEqual(axe.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],'axe '+route);
   }
   results.push({width,route,phase,status:'pass'});
   }catch(e){const failure={width,route,message:e instanceof Error?e.message:String(e)};failures.push(failure);results.push({...failure,phase,status:'fail'});console.error(JSON.stringify(failure));await page.screenshot({path:dir+'/'+slug+'-failure-'+width+'.png',fullPage:true,animations:'disabled',timeout:5000}).catch(()=>{});}
  }
  if(errors.length||outbound.length)failures.push({width,errors,outbound});await ctx.close();
 }
}finally{writeFileSync(dir+'/results.json',JSON.stringify(results,null,2));writeFileSync(dir+'/failures.json',JSON.stringify(failures,null,2));await browser.close();}
assert.deepEqual(failures,[],'UI-5 route failures');assert.equal(results.length,phase==='after'?42:39);console.log('UI5 '+phase+' route captures completed');
