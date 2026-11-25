import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const phase=process.argv[2];
assert.ok(['before','after'].includes(phase));
const output='qa-artifacts/ui-1-'+phase;
mkdirSync(output,{recursive:true});
const ref=phase==='before'?'565bda16c47f260c2b31f0005b02545ca1a5b3a9':'HEAD';
const git=(args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
const source=git(['ls-tree','-r','--name-only',ref]).trim().split('\n').filter(p=>/^(app|components)\/.*\.(tsx|css)$|^(tailwind|postcss)\.config\.(ts|js)$/.test(p));
const inv=['# UI-1 inventory — '+phase,'','Commit: '+git(['rev-parse',ref]).trim(),''];
const residual=[];
for(const file of source){
 const src=git(['show',ref+':'+file]), lines=src.split('\n');
 inv.push('## '+file+' ('+lines.length+' lines)');
 const matches=lines.flatMap((line,i)=>{const findings=[];
  const icons=[...new Set(line.match(/[☷☯⊕✺⌖✳☰☾✦◇⌂▤◷∞↗◈♡◆◎✓✔★☆⬇⚠\u{1F300}-\u{1FAFF}]/gu)||[])];
  const color=[...new Set(line.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g)||[])];
  if(icons.length)findings.push('glyph '+icons.join(' '));
  if(color.length)findings.push('color '+color.join(', '));
  if(/(?:linear|radial)-gradient\(/.test(line))findings.push('gradient');
  const utility=[...new Set(line.match(/\b(?:text|bg|border|ring)-(?:red|green|blue|yellow|amber|gray|slate|purple|orange|pink|rose|indigo|emerald|sky|zinc|neutral|stone)-\d{2,3}(?:\/\d+)?/g)||[])];
  if(utility.length)findings.push('legacy color utility '+utility.join(', '));
  return findings.length?[{line:i+1,findings}]:[];
 });
 for(const m of matches){inv.push('- '+m.line+': '+m.findings.join('; '));if(file!=='app/tokens.css')residual.push({file,...m});}
 if(!matches.length)inv.push('- No matching literal color, gradient or specified icon.');
 inv.push('');
}
writeFileSync(output+'/inventory.md',inv.join('\n'));
writeFileSync(output+'/residual.json',JSON.stringify(residual,null,2));
const base='http://127.0.0.1:4173',routes=['/','/chart','/lich-van-nien','/thien-ky','/dia-ky','/nhan-ky','/library','/hop-ban','/ho-so','/privacy','/terms'];
const browser=await chromium.launch({headless:true}),results=[],errors=[];
try{
 for(const width of [360,768,1280]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  let outbound=[],pageErrors=[],fonts=[];
  await ctx.route('**/*',r=>{const req=r.request();if(!req.url().startsWith(base+'/')){outbound.push({type:req.resourceType(),url:req.url()});return r.abort();}if(req.resourceType()==='font')fonts.push(req.url());return r.continue()});
  const page=await ctx.newPage();page.on('pageerror',e=>pageErrors.push(e.message));
  for(const route of routes){
   try{
    outbound=[];pageErrors=[];fonts=[];
    const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});
    assert.equal(response?.status(),200,route);
    await page.waitForFunction(()=>document.documentElement.dataset.themeReady==='true',null,{timeout:15000});
    await page.evaluate(()=>document.fonts.ready);
    const status=await page.evaluate(()=>({
      width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
      header:document.querySelectorAll('header.global-header').length,footer:document.querySelectorAll('footer').length,
      headerHeight:document.querySelector('header.global-header')?.getBoundingClientRect().height,
      heading:document.querySelector('h1')?.textContent,crumbs:document.querySelectorAll('nav.breadcrumb').length,
      theme:document.documentElement.dataset.theme,
      paper:getComputedStyle(document.documentElement).getPropertyValue('--paper').trim().toUpperCase(),
      accent:getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().toUpperCase(),
      loadedFonts:[...document.fonts].filter(f=>f.status==='loaded').length,
      fontBody:getComputedStyle(document.body).fontFamily,
      fontHeading:document.querySelector('h1')?getComputedStyle(document.querySelector('h1')).fontFamily:'',
      fontFamilies:[...new Set([...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family))],
      bottom:document.querySelector('.bottom-nav')?getComputedStyle(document.querySelector('.bottom-nav')).display:null
    }));
    const name=(route==='/'?'home':route.slice(1))+'-'+width+'.png';
    await page.screenshot({path:output+'/'+name,fullPage:true,animations:'disabled'});
    assert.ok(status.heading,'Missing heading');
    if(phase==='after'){
      assert.ok(status.scroll<=status.width+1,'Horizontal overflow '+JSON.stringify(status));
      assert.equal(status.header,1);assert.equal(status.footer,1);
      assert.equal(status.crumbs,route==='/'?0:1);
      assert.equal(status.theme,'light');
      assert.equal(status.paper,'#F6F2E9');assert.equal(status.accent,'#9E2F26');
      assert.ok(status.loadedFonts>0,'No loaded self-hosted fonts');
      assert.ok(/be[_ ]?vietnam[_ ]?pro/i.test(status.fontBody),'Body must use Be Vietnam Pro');
      assert.ok(/noto[_ ]?serif/i.test(status.fontHeading),'Heading must use Noto Serif');
      assert.ok(status.fontFamilies.some(f=>/be[_ ]?vietnam[_ ]?pro/i.test(f)),'Be Vietnam Pro must actually load');
      assert.ok(status.fontFamilies.some(f=>/noto[_ ]?serif/i.test(f)),'Noto Serif must actually load');
      assert.ok(Math.abs(status.headerHeight-(width<640?56:72))<=1,'Header height');
      assert.equal(status.bottom,width<640?'grid':'none','Bottom tab breakpoint');
      assert.equal(outbound.filter(x=>x.type==='font'||x.type==='script').length,0,'Unexpected remote font/script');
      assert.deepEqual(pageErrors,[]);
      if(route==='/'){
        const cdp=await ctx.newCDPSession(page);
        await cdp.send('DOM.enable');await cdp.send('CSS.enable');
        try{
          await page.evaluate(()=>{
            const sample='ĂÂĐÊÔƠƯăâđêôơưẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰỲỶỸỴ';
            for(const [id,family,weight] of [['ui1-sans-probe',getComputedStyle(document.body).fontFamily,'400'],['ui1-serif-probe',getComputedStyle(document.querySelector('h1')).fontFamily,'700']]){
              const span=document.createElement('span');span.id=id;span.textContent=sample;span.style.cssText='position:fixed;left:0;top:0;opacity:0;pointer-events:none;font-size:16px;white-space:nowrap';span.style.fontFamily=family;span.style.fontWeight=weight;document.body.append(span);
            }
          });
          await page.evaluate(()=>document.fonts.ready);
          const {root}=await cdp.send('DOM.getDocument');
          for(const selector of ['#ui1-sans-probe','#ui1-serif-probe']){
            const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});
            const {fonts:used}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
            assert.ok(used.length>0&&used.every(f=>f.isCustomFont),'Vietnamese fallback '+selector+' '+JSON.stringify(used));
          }
        }finally{await page.evaluate(()=>{document.querySelector('#ui1-sans-probe')?.remove();document.querySelector('#ui1-serif-probe')?.remove()});await cdp.detach();}
      }
      if(route==='/'&&width<1024){
        const menu=page.getByRole('button',{name:'Mở menu'});
        await menu.click();await page.getByRole('navigation',{name:'Menu toàn website'}).waitFor();
        await page.keyboard.press('Escape');
        await page.getByRole('navigation',{name:'Menu toàn website'}).waitFor({state:'hidden'});
        assert.equal(await menu.evaluate(el=>el===document.activeElement),true);
      }
    }
    results.push({phase,width,route,...status,fontRequests:fonts.length,outbound,pageErrors});
   }catch(e){errors.push({width,route,error:String(e)});console.error('UI1_ROUTE_ERROR '+width+' '+route+' '+String(e));}
  }
  await ctx.close();
 }
}finally{
 writeFileSync(output+'/results.json',JSON.stringify({phase,results,errors},null,2));
 await browser.close();
}
if(phase==='after'){
 const remaining=residual.filter(r=>r.findings.some(v=>v.startsWith('glyph ')||v.startsWith('color ')||v.startsWith('legacy color utility ')||v==='gradient'));
 assert.deepEqual(remaining,[],'Specified UI literal colors, gradients or Unicode glyphs still present (see inventory)');
}
assert.deepEqual(errors,[],'Responsive screenshot QA');
assert.equal(results.length,33);
console.log('UI1 '+phase+' 33 route/viewport captures completed');
