import assert from 'node:assert/strict';
import {readdirSync,readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,relative,resolve} from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const pw=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const mode=process.argv[2],engine=process.argv[3]||'chromium',shard=Number(process.argv[4]||0),shards=Number(process.argv[5]||1);
assert.ok(['all','screens','compat'].includes(mode));assert.ok(['chromium','firefox','webkit'].includes(engine));
const root=resolve('out'),base='http://127.0.0.1:4173',dir='qa-artifacts/ui6-'+mode+'-'+engine+'-'+shard;
mkdirSync(dir,{recursive:true});const results=[],failures=[];
const main=['/','/chart','/lich-van-nien','/thien-ky','/dia-ky','/nhan-ky','/library','/hop-ban','/ho-so','/privacy','/terms'];
function walk(d){return readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(d,e.name)):[join(d,e.name)]);}
const routes=[...new Set(walk(root).filter(f=>f.endsWith('.html')).map(f=>relative(root,f).split('\\').join('/')).filter(f=>!f.startsWith('_next/')&&!f.startsWith('_not-found/')&&!/(^|\/)(500|_not-found)\.html$/.test(f)).map(f=>'/'+f.replace(/(?:^|\/)index\.html$/,'').replace(/\.html$/,'')).map(s=>s.replace(/\/$/,'')||'/'))].sort();
if(mode==='all'){for(const r of main)assert.ok(routes.includes(r),'missing export '+r);assert.ok(routes.includes('/404'),'missing 404');}
const jobs=mode==='all'?routes.filter((_,i)=>i%shards===shard).map(route=>({route,width:360})):mode==='screens'?[... [360,768,1280].flatMap(width=>main.map(route=>({route,width}))),... [320,390,430,820,1024,1180,1440,1920].map(width=>({route:'/',width})),... [390,820,1024].flatMap(width=>['/chart','/lich-van-nien'].map(route=>({route,width})))]:[360,390,820,1024,1280].flatMap(width=>['/','/chart','/lich-van-nien'].map(route=>({route,width})));
// Regression: the exact book/chapter reported by the owner, plus a second book.
const chapterRoute='/library/quanji/tong-luan';
if(mode==='screens')jobs.push(...[320,360,390,430,768,820,1024,1180,1280].map(width=>({route:chapterRoute,width})),{route:'/library/gusuifu/tong-luan-thien',width:390});
if(mode==='compat')jobs.push(...[390,820,1024,1180].map(width=>({route:chapterRoute,width})));
assert.ok(jobs.length>0);
writeFileSync(dir+'/scope.json',JSON.stringify({mode,engine,shard,shards,totalExportRoutes:routes.length,jobs},null,2));
const browser=await pw[engine].launch({headless:true});
const name=(route,width)=>(route==='/'?'home':route.slice(1).replaceAll('/','--'))+'-'+width;
async function tabTo(page,selector){
 for(let i=0;i<150;i++){if(await page.evaluate(s=>document.activeElement?.matches(s),selector))return;await page.keyboard.press('Tab');}
 throw Error('Keyboard cannot reach '+selector);
}
async function keyboard(page,route,width){
 if(route==='/'){
  if(width<1100){await tabTo(page,'.mobile-menu-button');await page.keyboard.press('Enter');assert.equal(await page.locator('.mobile-menu-button').getAttribute('aria-expanded'),'true');await page.keyboard.press('Tab');await page.keyboard.press('Escape');assert.equal(await page.locator('.mobile-menu-button').getAttribute('aria-expanded'),'false');assert.ok(await page.evaluate(()=>document.activeElement?.matches('.mobile-menu-button')));}
  await tabTo(page,'.home2-actions a[href="/chart"]');await page.keyboard.press('Enter');await page.waitForURL('**/chart');await page.getByRole('heading',{name:'Lập lá số Tử Vi'}).waitFor();
 }else if(route==='/chart'){
  await tabTo(page,'.birth-form button[type=submit]');await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-invalid')==='true');
  assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.trim()),'Nam');
  await page.keyboard.press('Space');assert.equal(await page.getByRole('button',{name:'Nam',exact:true}).getAttribute('aria-pressed'),'true');
  await tabTo(page,'.birth-form input[aria-label="Không rõ giờ sinh cụ thể"]');await page.keyboard.press('Space');assert.equal(await page.getByLabel('Giờ và phút sinh').isDisabled(),true);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'chart form overflow after keyboard validation');
  await page.getByLabel('Tỉnh hoặc thành phố nơi sinh').selectOption('Tỉnh Gia Lai');await page.getByLabel('Quận huyện hoặc khu vực nơi sinh').selectOption('TP. Pleiku');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'chart form overflow after location selection');
 }else if(route==='/lich-van-nien'){
  await tabTo(page,'.calendar4-grid button[tabindex="0"]');const old=await page.evaluate(()=>document.activeElement?.getAttribute('data-date'));
  await page.keyboard.press('ArrowRight');const next=await page.evaluate(()=>document.activeElement?.getAttribute('data-date'));assert.notEqual(next,old);
  await page.keyboard.press('PageDown');await page.keyboard.press('PageUp');await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-pressed')),'true');
 }
}
try{
 for(const {route,width} of jobs){
  const key=name(route,width),errors=[],external=[],ctx=await browser.newContext({viewport:{width,height:({320:568,360:780,390:844,430:932,768:1024,820:1180,1024:768,1180:820}[width]??(width>=1440?1000:900))},reducedMotion:'reduce'});
  const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/*',r=>{const req=r.request(),url=req.url();if(url.startsWith(base+'/')||url.startsWith('data:')||url.startsWith('blob:'))return r.continue();external.push({url,type:req.resourceType()});return r.abort();});
  try{
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:20000});assert.equal(response?.status(),200,'export HTTP status '+route);
   await page.waitForFunction(()=>document.documentElement.dataset.themeReady==='true',null,{timeout:15000});await page.evaluate(()=>document.fonts.ready);
   const metrics=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,header:document.querySelectorAll('header.global-header').length,footer:document.querySelectorAll('footer').length,h1:document.querySelectorAll('h1').length,theme:document.documentElement.dataset.theme}));
   if(metrics.scroll>metrics.width+1){const offenders=await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).flatMap(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&(r.right>document.documentElement.clientWidth+1||r.left< -1)&&s.position!=='fixed'?[{tag:e.tagName,id:e.id,cls:String(e.className).slice(0,100),label:e.getAttribute('aria-label'),left:r.left,right:r.right,width:r.width,scroll:e.scrollWidth,client:e.clientWidth}]:[];}).slice(0,60));writeFileSync(dir+'/overflow-'+key+'.json',JSON.stringify(offenders,null,2));}
   if(metrics.scroll>metrics.width+1&&route==='/chart'){
    // Diagnostic only, after the original metrics were recorded. Restore every
    // inline style immediately; do not change the pass/fail measurement.
    const probes=await page.evaluate(()=>{
     const root=document.documentElement,initial=root.scrollWidth,out=[];
     const candidates=Array.from(document.querySelectorAll('.chart3-form-grid,.chart3-birth-form,.chart3-birth-form>div,.chart3-preview,.chart3-birth-form select,.chart3-birth-form input,.chart3-birth-form details,.term-help-popup'));
     for(const el of candidates){const before=el.getAttribute('style'),r=el.getBoundingClientRect(),s=getComputedStyle(el),entry={tag:el.tagName,cls:String(el.className),label:el.getAttribute('aria-label'),text:el.tagName==='SELECT'?el.options[el.selectedIndex]?.text:undefined,width:r.width,right:r.right,client:el.clientWidth,scroll:el.scrollWidth,display:s.display,appearance:s.appearance};el.style.setProperty('display','none','important');entry.without=root.scrollWidth;if(before===null)el.removeAttribute('style');else el.setAttribute('style',before);out.push(entry);}
     return {initial,restored:root.scrollWidth,probes:out};
    });
    writeFileSync(dir+'/overflow-probes-'+key+'.json',JSON.stringify(probes,null,2));
   }
   assert.ok(metrics.scroll<=metrics.width+1,'horizontal overflow '+JSON.stringify(metrics));assert.equal(metrics.header,1);assert.equal(metrics.footer,1);assert.equal(metrics.h1,1);assert.equal(metrics.theme,'light');
   if(mode!=='all'){
    const brand=page.locator('.global-header .brand-wordmark');
    assert.match(await brand.innerText(),/Tử Vi Việt Nam/);
    await brand.locator('img').evaluate(async img=>{await img.decode();if(!img.naturalWidth)throw Error('missing brand emblem')});
    assert.ok(await page.locator('link[rel="icon"][href="/brand/favicon.svg"]').count(),'new favicon');
    assert.match(await page.title(),/Tử Vi Việt Nam/);
    if(route==='/'){
     assert.equal(await page.locator('.home-primary-card').count(),4);
     assert.equal(await page.locator('.home-chart .ui-chart-cell').count(),12);
     assert.equal(await page.locator('.home-chart .home-palace-name,.home-chart .ui-chart-cell strong').count(),12);
     assert.match(await page.locator('.brand-date').getAttribute('data-date'),/^\d{4}-\d{2}-\d{2}$/);
     await page.locator('.hero-art img').evaluate(async img=>{await img.decode();if(!img.naturalWidth)throw Error('missing study artwork')});
     if(width>=1100){const toggle=page.locator('.brand-tools-toggle');await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');assert.equal(await page.locator('#desktop-tools-menu a').count(),6);await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur()});}
    }
   }
   if(mode!=='all'&&width<1100&&route==='/'){
    const mobile=await page.evaluate(async()=>{
     const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
     const logo=document.querySelector('.global-header .brand-emblem'),art=document.querySelector('.hero-art img');await Promise.all([logo.decode(),art.decode()]);
     const card=document.querySelector('.home-primary-card'),button=document.querySelector('.mobile-menu-button');
     return {logo:logo.currentSrc,book:art.currentSrc,native:art.naturalWidth,rendered:art.getBoundingClientRect().width,header:rect(document.querySelector('.brand-wordmark')),menu:rect(button),cards:[...document.querySelectorAll('.home-primary-card')].map(rect),frame:getComputedStyle(card,'::before').backgroundImage,icon:getComputedStyle(card.querySelector('.icon-pc')).display,buttons:[...document.querySelectorAll('.home2-actions a')].map(rect),panel:rect(document.querySelector('.home-chart .ui-chart-grid')),paper:getComputedStyle(document.body).backgroundImage,bottom:getComputedStyle(document.querySelector('.ui-bottom-nav')).display};
    });
    writeFileSync(dir+'/responsive-layout-'+width+'.json',JSON.stringify(mobile,null,2));
    assert.match(mobile.logo,/emblem-pc\.svg$/);assert.match(mobile.book,/study-pc\.webp$/);assert.ok(mobile.rendered>0&&mobile.rendered<=mobile.native+1,'art must be visible at native size or smaller');
    assert.ok(mobile.header.right<=mobile.menu.left+1&&mobile.menu.height>=44,'header collision/touch size');
    assert.ok(mobile.buttons.every(b=>b.height>=44&&b.left>=0&&b.right<=width+1),'hero touch targets');
    for(const corner of ['tl','tr','br','bl'])assert.ok(mobile.frame.includes('corner-gold-'+corner+'.svg'),'missing responsive corner '+corner);
    assert.equal(mobile.icon,'inline');assert.ok(mobile.paper.includes('paper-pc.svg'));
    assert.equal(mobile.cards.length,4);assert.ok(mobile.cards.every(c=>c.left>=0&&c.right<=width+1&&c.height>=44));
    if(width<640){assert.ok(mobile.cards.every((c,i)=>!i||c.top>=mobile.cards[i-1].bottom-1),'mobile card stack');assert.notEqual(mobile.bottom,'none');}
    else{assert.ok(Math.abs(mobile.cards[0].top-mobile.cards[1].top)<2&&Math.abs(mobile.cards[2].top-mobile.cards[3].top)<2,'tablet 2x2 cards');}
    assert.ok(mobile.panel.left>=0&&mobile.panel.right<=width+1,'sample chart visible');
   }
   if(width>=1100&&route==='/'){
    const pc=await page.evaluate(async()=>{
     const rect=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
     const brand=document.querySelector('.global-header .brand-emblem'),art=document.querySelector('.hero-art img');await Promise.all([brand.decode(),art.decode()]);
     return {brand:rect('.brand-wordmark'),nav:rect('.desktop-links'),cta:rect('.header-cta'),links:[...document.querySelectorAll('.desktop-links>a,.brand-tools-toggle')].map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width}}),hero:rect('.home2-hero'),title:rect('#home2-title'),titleSize:parseFloat(getComputedStyle(document.querySelector('#home2-title')).fontSize),cards:[...document.querySelectorAll('.home-primary-card')].map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}}),asset:{logo:brand.currentSrc,logoNatural:brand.naturalWidth,book:art.currentSrc,bookNatural:art.naturalWidth,bookRendered:art.getBoundingClientRect().width},frame:getComputedStyle(document.querySelector('.home-primary-card'),'::before').backgroundImage};
    });
    writeFileSync(dir+'/pc-layout-'+width+'.json',JSON.stringify(pc,null,2));
    assert.ok(pc.brand.width>160&&pc.brand.right<=pc.nav.left+1,'desktop logo/nav collision');
    assert.ok(pc.nav.right<=pc.cta.left+1&&pc.cta.right<=width+1,'desktop nav/CTA collision');
    assert.ok(pc.links.every((l,i)=>l.width>30&&l.left>=pc.nav.left-1&&l.right<=pc.nav.right+1&&(!i||l.left>=pc.links[i-1].right-1)),'desktop links overlap or leave nav');
    assert.ok(pc.titleSize>=29,'desktop hero type too small');
    assert.equal(pc.cards.length,4);assert.ok(pc.cards.every(c=>Math.abs(c.top-pc.cards[0].top)<2),'desktop feature card row');
    assert.match(pc.asset.logo,/emblem-pc\.svg$/);assert.match(pc.asset.book,/study-pc\.webp$/);assert.ok(pc.asset.bookNatural>=pc.asset.bookRendered-1,'book artwork scaled beyond source');
    for(const corner of ['tl','tr','br','bl'])assert.ok(pc.frame.includes('corner-gold-'+corner+'.svg'),'missing fixed vector corner '+corner);
    assert.equal(await page.locator('.home-primary-card svg .icon-pc').first().evaluate(e=>getComputedStyle(e).display),'inline');
    const art=await page.evaluate(async()=>{const paths=['paper-pc.svg','cloud-detail-pc.svg','hills-card-pc.svg','corner-gold-tl.svg','corner-gold-tr.svg','corner-gold-br.svg','corner-gold-bl.svg'];return Promise.all(paths.map(async p=>{const img=new Image();img.src='/brand/'+p;await img.decode();return {p,w:img.naturalWidth,h:img.naturalHeight}}));});assert.ok(art.every(x=>x.w>0&&x.h>0));
   }
   if(mode!=='all'&&route.startsWith('/library/')&&route.split('/').length===4){
    const toc=page.locator('.ui5-chapters'),article=page.locator('.ui5-reader');
    const summary=toc.locator('summary'),details=toc.locator('details');
    assert.equal(await toc.locator('a[aria-current=page]').count(),1);
    assert.equal(await details.getAttribute('open'),'');
    await summary.click();assert.equal(await details.getAttribute('open'),null);
    await summary.click();assert.equal(await details.getAttribute('open'),'');
    await page.evaluate(()=>window.scrollTo(0,0));
    const before=await page.evaluate(()=>{const t=document.querySelector('.ui5-chapters'),a=document.querySelector('.ui5-reader'),h=document.querySelector('.global-header');return {position:getComputedStyle(t).position,tocBottom:t.getBoundingClientRect().bottom,articleTop:a.getBoundingClientRect().top,articleLeft:a.getBoundingClientRect().left,tocRight:t.getBoundingClientRect().right,headerBottom:h.getBoundingClientRect().bottom}});
    if(width<1100){
     assert.equal(before.position,'static','chapter TOC cannot be sticky in single column');
     assert.ok(before.tocBottom<=before.articleTop+1,'TOC overlaps article at rest');
     await page.evaluate(()=>{const a=document.querySelector('.ui5-reader'),h=document.querySelector('.global-header');window.scrollTo(0,a.getBoundingClientRect().top+window.scrollY-h.getBoundingClientRect().height+180)});
     const after=await page.evaluate(()=>{const t=document.querySelector('.ui5-chapters'),h=document.querySelector('.global-header'),p=document.querySelector('.ui5-reader .ui5-reading-body');const top=h.getBoundingClientRect().bottom,rect=p.getBoundingClientRect(),y=Math.max(top+12,rect.top+12),x=rect.left+rect.width/2,hit=document.elementFromPoint(x,y);return {tocBottom:t.getBoundingClientRect().bottom,headerBottom:top,scrollY,articleVisible:!!hit?.closest('.ui5-reader')}});
     assert.ok(after.scrollY>0&&after.tocBottom<=after.headerBottom+1,'TOC did not scroll out of reading area');
     assert.ok(after.articleVisible,'article is obscured after scroll');
     writeFileSync(dir+'/chapter-scroll-'+key+'.json',JSON.stringify({before,after},null,2));
     await page.screenshot({path:dir+'/chapter-scrolled-'+key+'.png',fullPage:false,animations:'disabled'});
    }else{
     assert.equal(before.position,'sticky','desktop sidebar must remain sticky');
     assert.ok(before.tocRight<=before.articleLeft+1,'desktop sidebar overlaps article');
     writeFileSync(dir+'/chapter-scroll-'+key+'.json',JSON.stringify({before},null,2));
    }
    await page.evaluate(()=>window.scrollTo(0,0));
   }
   // Text underlines are removed globally, but active navigation markers and focus remain.
   const underlines=await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).filter(e=>e instanceof HTMLElement&&e.getClientRects().length>0&&getComputedStyle(e).visibility==='visible'&&getComputedStyle(e).textDecorationLine.includes('underline')).map(e=>({tag:e.tagName,cls:String(e.className),text:e.textContent?.trim().slice(0,70)})));
   assert.deepEqual(underlines,[],'unexpected visible text underline '+route);
   if(route==='/'&&mode!=='all'){
    if(width>=1100){
     const active=page.locator('.desktop-links a[aria-current=page]');
     assert.equal(await active.count(),1);
     assert.ok(await active.evaluate(e=>parseFloat(getComputedStyle(e).borderBottomWidth)>=2&&getComputedStyle(e).borderBottomStyle==='solid'&&getComputedStyle(e).borderBottomColor!=='rgba(0, 0, 0, 0)'),'desktop active indicator retained');
     await active.focus();assert.ok(await active.evaluate(e=>getComputedStyle(e).outlineStyle!=='none'&&!getComputedStyle(e).textDecorationLine.includes('underline')),'focus without underline');
    }else if(width<640){
     const active=page.locator('.ui-bottom-nav a[aria-current=page]');
     assert.equal(await active.count(),1);
     assert.ok(await active.evaluate(e=>{const s=getComputedStyle(e,'::before');return s.content!=='none'&&parseFloat(s.height)>=2}),'mobile active bar retained');
    }
   }
   await page.mouse.move(0,0);
   if(mode==='screens')await page.screenshot({path:dir+'/'+key+'.png',fullPage:true,animations:'disabled'});
   await page.addScriptTag({path:process.env.AXE_SCRIPT});
   const axe=await page.evaluate(async()=>window.axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
   writeFileSync(dir+'/axe-'+key+'.json',JSON.stringify(axe.violations,null,2));
   const high=axe.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));assert.deepEqual(high,[]);
   if(mode!=='all'&&['/','/chart','/lich-van-nien'].includes(route))await keyboard(page,route,width);
   assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
   results.push({route,width,engine,status:'pass',metrics,violations:axe.violations.map(v=>({id:v.id,impact:v.impact}))});
  }catch(e){const problem={route,width,engine,status:'fail',message:e instanceof Error?e.message:String(e),errors,external};failures.push(problem);results.push(problem);console.error(JSON.stringify(problem));await page.screenshot({path:dir+'/failure-'+key+'.png',fullPage:false,timeout:5000}).catch(()=>{});}
  finally{await ctx.close();}
 }
}finally{await browser.close();writeFileSync(dir+'/results.json',JSON.stringify(results,null,2));writeFileSync(dir+'/failures.json',JSON.stringify(failures,null,2));}
assert.equal(results.length,jobs.length);assert.deepEqual(failures,[],'UI-6 failures');
console.log('UI6 '+mode+' '+engine+' '+results.length+' route/viewport checks passed');
