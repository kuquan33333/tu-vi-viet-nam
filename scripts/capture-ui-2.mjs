import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const phase=process.argv[2];
assert.ok(['before','after'].includes(phase));
const dir='qa-artifacts/ui-2-'+phase;
mkdirSync(dir,{recursive:true});
const base='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const results=[];
try{
 for(const width of [360,390,768,1280]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/*',r=>{const q=r.request();if(!q.url().startsWith(base+'/')){external.push({url:q.url(),type:q.resourceType()});return r.abort()}return r.continue()});
  const response=await page.goto(base+'/',{waitUntil:'domcontentloaded'});
  assert.equal(response?.status(),200);
  await page.waitForFunction(()=>document.documentElement.dataset.themeReady==='true');
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:dir+'/home-'+width+'.png',fullPage:true,animations:'disabled'});
  const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,heading:document.querySelector('h1')?.innerText,canonical:document.querySelector('link[rel=canonical]')?.getAttribute('href'),header:document.querySelectorAll('header.global-header').length,footer:document.querySelectorAll('footer').length,bottom:getComputedStyle(document.querySelector('.bottom-nav')).display}));
  results.push({phase,...metrics,errors,external});
  if(phase==='after'){
   assert.ok(metrics.scroll<=width+1,'horizontal overflow '+width);
   assert.equal(metrics.header,1);assert.equal(metrics.footer,1);
   assert.equal(metrics.bottom,width<640?'grid':'none');
   assert.match(metrics.heading,/Lá số rõ ràng,\s*phương pháp minh bạch\./);
   assert.ok(metrics.canonical,'Missing canonical');
   assert.equal(new URL(metrics.canonical).href,'https://lichvannien-9sv.pages.dev/');
   const main=page.locator('main.home2');
   assert.equal(await main.locator('.home2-actions a').count(),2);
   assert.equal(await main.locator('.home2-actions a.ui-button-primary').count(),1);
   assert.equal(await main.locator('.home2-module-grid a').count(),4);
   assert.deepEqual(await main.locator('.home2-tool-grid a').evaluateAll(els=>els.map(e=>e.getAttribute('href'))),['/lich-van-nien','/hop-ban','/thien-ky','/dia-ky','/nhan-ky','/library']);
   assert.equal(await main.locator('.home2-all').getAttribute('href'),'/cong-cu');
   assert.equal(await main.locator('.home2-source').getAttribute('href'),'/terms#nguon-va-giay-phep');
   assert.equal(await main.locator('.home2-sample').isVisible(),width>=640);
   assert.equal(await main.locator('.ui-chart-cell').count(),12);
   assert.equal(await main.locator('.ui-chart-cell[data-ming=true]').count(),1);
   assert.deepEqual(await main.locator('.ui-chart-cell').evaluateAll(els=>els.map(e=>[Number(e.dataset.branch),Number(e.style.gridRow),Number(e.style.gridColumn)])),[[5,1,1],[6,1,2],[7,1,3],[8,1,4],[4,2,1],[9,2,4],[3,3,1],[10,3,4],[2,4,1],[1,4,2],[0,4,3],[11,4,4]]);
   assert.match(await main.locator('.ui-chart-center').textContent(),/Phan Bội Châu/);
   const cols=async s=>(await main.locator(s).evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length));
   assert.equal(await cols('.home2-module-grid'),width<640?1:width<1024?2:4);
   assert.equal(await cols('.home2-tool-grid'),width<1024?2:3);
   assert.ok(await main.locator('a').evaluateAll(els=>els.every(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44})),'touch target');
   assert.doesNotMatch(await main.innerText(),/Giao diện Việt hóa|Một hệ thống, bốn cánh cửa|\[Họ tên\]/);
   assert.match(await main.locator('.home2-method').innerText(),/không cung cấp chẩn đoán/);
   await page.keyboard.press('Tab');
   assert.ok(await page.evaluate(()=>!!document.activeElement&&document.activeElement!==document.body),'keyboard focus');
   await page.addScriptTag({path:process.env.AXE_SCRIPT});
   const axe=await page.evaluate(async()=>window.axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
   writeFileSync(dir+'/axe-'+width+'.json',JSON.stringify(axe.violations,null,2));
   assert.deepEqual(axe.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
   assert.deepEqual(external.filter(x=>['script','font'].includes(x.type)),[]);
   assert.deepEqual(errors,[]);
  }
  await ctx.close();
 }
}finally{writeFileSync(dir+'/results.json',JSON.stringify(results,null,2));await browser.close();}
assert.equal(results.length,4);
console.log('UI2 '+phase+' four viewport captures completed');
