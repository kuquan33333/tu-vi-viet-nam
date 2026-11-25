import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const phase=process.argv[2];assert.ok(['before','after'].includes(phase));
const dir='qa-artifacts/ui-4-'+phase;mkdirSync(dir,{recursive:true});
const base='http://127.0.0.1:4173',browser=await chromium.launch({headless:true}),results=[];
try{
 for(const width of [360,768,1280]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[],outbound=[];
  page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/*',r=>{if(r.request().url().startsWith(base+'/'))return r.continue();outbound.push(r.request().url());return r.abort()});
  await page.goto(base+'/lich-van-nien');await page.waitForFunction(()=>document.documentElement.dataset.themeReady==='true');await page.evaluate(()=>document.fonts.ready);
  const year=page.getByLabel('Năm tra cứu'),month=page.getByLabel('Tháng tra cứu');
  const selectMonth=async(y,m)=>{await year.selectOption(String(y));await month.selectOption(String(m));};
  const cell=key=>page.locator('button[data-date="'+key+'"]');
  const keyOfFocus=()=>page.evaluate(()=>document.activeElement?.getAttribute('data-date'));
  const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow '+width);
  await selectMonth(2026,11);
  if(phase==='before')await page.getByRole('button',{name:'24/11/2026',exact:true}).click();else await cell('2026-11-24').click();
  await noOverflow();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:dir+'/calendar-'+width+'.png',fullPage:true,animations:'disabled'});
  if(phase==='after'){
   const grid=page.getByRole('group',{name:'Lịch tháng'}),panel=page.locator('.calendar4-panel');
   const heading=panel.getByRole('heading');
   assert.deepEqual(await grid.locator('.calendar4-week').allTextContents(),['CN','T2','T3','T4','T5','T6','T7']);
   assert.equal(await grid.locator('button').count(),35);
   assert.equal(await grid.locator('button[tabindex="0"]').count(),1);
   assert.match(await cell('2026-11-24').getAttribute('aria-label'),/Thứ Ba, 24 tháng 11 năm 2026, âm lịch 16 tháng 10/);
   assert.match(await heading.innerText(),/Thứ Ba, 24 tháng 11 năm 2026/);
   assert.match(await panel.locator('.calendar4-subtitle').innerText(),/16\/10\/2026/);
   assert.deepEqual((await panel.locator('.calendar4-facts dd').allTextContents()).slice(0,3),['Nhâm Dần','Kỷ Hợi','Bính Ngọ']);
   assert.match(await cell('2026-11-09').innerText(),/1\/10/);
   assert.match(await cell('2026-11-23').innerText(),/15 · Rằm/);
   assert.match(await panel.locator('.calendar4-facts dd').nth(3).innerText(),/Tiểu tuyết · \d\d:\d\d/);
   const sizes=await grid.locator('button').evaluateAll(bs=>bs.map(b=>({w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height})));
   assert.ok(sizes.every(b=>b.w>=44&&b.h>=(width<640?56:92)));
   assert.equal(await cell('2026-11-24').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(158, 47, 38)');
   // Keyboard focus moves without changing selection until native Enter.
   await cell('2026-11-24').focus();await page.keyboard.press('ArrowRight');assert.equal(await keyOfFocus(),'2026-11-25');assert.equal(await cell('2026-11-24').getAttribute('aria-pressed'),'true');
   await page.keyboard.press('ArrowUp');assert.equal(await keyOfFocus(),'2026-11-18');
   await page.keyboard.press('ArrowDown');assert.equal(await keyOfFocus(),'2026-11-25');
   await page.keyboard.press('PageDown');assert.equal(await keyOfFocus(),'2026-12-25');
   await page.keyboard.press('PageUp');assert.equal(await keyOfFocus(),'2026-11-25');
   await page.keyboard.press('Home');assert.equal(await keyOfFocus(),'2026-11-22');
   await page.keyboard.press('End');assert.equal(await keyOfFocus(),'2026-11-28');
   await page.keyboard.press('Enter');assert.equal(await cell('2026-11-28').getAttribute('aria-pressed'),'true');
   await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');assert.equal(await keyOfFocus(),'2026-12-01');await page.keyboard.press('Enter');assert.equal(await month.inputValue(),'12');
   assert.equal(await grid.locator('button[tabindex="0"]').count(),1);
   // Reproduce rapid key presses immediately after selection, including crossing the year boundary.
   await selectMonth(2026,12);await cell('2026-12-30').click();
   await page.keyboard.press('Enter');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');
   assert.equal(await keyOfFocus(),'2027-01-01');await page.keyboard.press('Space');
   assert.equal(await cell('2027-01-01').getAttribute('aria-pressed'),'true');
   assert.equal(await year.inputValue(),'2027');
   await selectMonth(2026,12);
   await page.getByRole('button',{name:'Tháng trước'}).click();assert.equal(await month.inputValue(),'11');
   await page.getByRole('button',{name:'Tháng sau'}).click();assert.equal(await month.inputValue(),'12');
   await selectMonth(1900,1);assert.equal(await page.getByRole('button',{name:'Tháng trước'}).isDisabled(),true);
   await cell('1900-01-01').focus();await page.keyboard.press('ArrowLeft');assert.equal(await keyOfFocus(),'1900-01-01');
   await selectMonth(2050,12);assert.equal(await page.getByRole('button',{name:'Tháng sau'}).isDisabled(),true);
   await selectMonth(2025,7);await cell('2025-07-25').click();assert.match(await panel.locator('.calendar4-subtitle').innerText(),/nhuận/i);assert.match(await cell('2025-07-25').innerText(),/Nhuận/);
   await selectMonth(2026,9);assert.match(await cell('2026-09-02').innerText(),/Quốc khánh/);
   await selectMonth(2004,2);await cell('2004-02-04').click();assert.match(await panel.locator('.calendar4-facts dd').last().innerText(),/Lập xuân · 18:5/);
   await page.getByRole('button',{name:'Hôm nay',exact:true}).click();assert.equal(await grid.locator('button[aria-current=date]').getAttribute('aria-pressed'),'true');
   await selectMonth(2026,11);await cell('2026-11-24').click();await noOverflow();
   await page.addScriptTag({path:process.env.AXE_SCRIPT});
   const axe=await page.evaluate(async()=>window.axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
   writeFileSync(dir+'/axe-'+width+'.json',JSON.stringify(axe.violations,null,2));
   assert.deepEqual(axe.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
   await page.emulateMedia({media:'print'});assert.equal(await panel.isVisible(),true);assert.equal(await page.getByRole('button',{name:'In lịch tháng A4'}).isVisible(),false);
   const pdf=await page.pdf({path:dir+'/print-'+width+'.pdf',preferCSSPageSize:true,printBackground:true});
   assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,1,'calendar A4 fixture must fit one page');
   // A six-row month is another print stress case.
   await page.emulateMedia({media:'screen'});await selectMonth(2026,8);assert.equal(await grid.locator('button').count(),42);
   await page.emulateMedia({media:'print'});const dense=await page.pdf({path:dir+'/print-six-weeks-'+width+'.pdf',preferCSSPageSize:true,printBackground:true});assert.equal((dense.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,1,'six-week calendar A4 fixture');
   await page.emulateMedia({media:'screen'});
   assert.deepEqual(errors,[]);assert.deepEqual(outbound,[]);
  }
  results.push({width,phase,errors,outbound});await ctx.close();
 }
}finally{writeFileSync(dir+'/results.json',JSON.stringify(results,null,2));await browser.close();}
assert.equal(results.length,3);console.log('UI4 '+phase+' calendar captures completed');
