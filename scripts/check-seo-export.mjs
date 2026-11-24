// Run after static export: node scripts/check-seo-export.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://lichvannien-9sv.pages.dev').replace(/\/$/,'');
const root='out';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const files=walk(root).filter(p=>p.endsWith('.html')&&!/(?:404|_not-found|500)\.html$/.test(p)&&!p.includes('/_next/')&&!p.includes('/_not-found/'));
const required=['/','/chart','/hop-ban','/lich-van-nien','/library','/cong-cu','/ho-so','/privacy','/terms','/thien-ky','/dia-ky','/nhan-ky','/knowledge','/preview','/library/search'];
const visited=new Set(), titles=new Set();
const attrs=s=>Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
for(const f of files){
 const rel=path.relative(root,f).replaceAll(path.sep,'/');
 const route='/'+rel.replace(/(?:^|\/)index\.html$/,'').replace(/\.html$/,'');
 const normalized=route.replace(/\/$/,'')||'/';
 const html=fs.readFileSync(f,'utf8'), head=html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]||'';
 const tags=[...head.matchAll(/<(?:link|meta)\b[^>]*>/gi)].map(m=>attrs(m[0]));
 const canonical=tags.filter(t=>t.rel==='canonical');
 assert.equal(canonical.length,1,f+' canonical count');
 assert.equal(canonical[0].href,base+(normalized==='/'?'/':normalized),f+' canonical');
 const title=head.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
 assert.ok(title,f+' title');assert.ok(!titles.has(title),f+' duplicate title');titles.add(title);
 for(const key of ['description','og:title','og:description','og:url','og:image','twitter:card','twitter:title','twitter:description','twitter:image']){
  assert.ok(tags.some(t=>(t.name===key||t.property===key)&&t.content),f+' '+key);
 }
 assert.equal(tags.find(t=>t.property==='og:url')?.content,canonical[0].href,f+' OG URL');
 for(const a of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){
  const t=attrs(a[1]);if(t.href?.startsWith('/')&&!t.href.startsWith('//'))assert.ok(!a[2].includes('↗'),f+' internal arrow '+t.href);
  if(/^https?:\/\//.test(t.href||'')&&t.target==='_blank')assert.ok((t.rel||'').split(/\s+/).includes('noopener'),f+' external noopener');
 }
 visited.add(normalized);console.log('PASS',normalized);
}
for(const route of required)assert.ok(visited.has(route),'Missing route '+route);
const redirect=fs.readFileSync(path.join(root,'_redirects'),'utf8');
for(const line of redirect.split(/\r?\n/).filter(x=>x.trim()&&!x.startsWith('#'))){
 const [from,to,status]=line.trim().split(/\s+/);assert.equal(status,'301');assert.ok(!visited.has(from),'Old route emitted: '+from);assert.ok(visited.has(to),'Redirect destination missing '+to);
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const m of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)){const u=new URL(m[1]);assert.equal(u.origin,new URL(base).origin);assert.ok(visited.has(u.pathname.replace(/\/$/,'')||'/'),'Invalid sitemap URL '+u.pathname);assert.ok(!['/ho-so','/preview','/library/search'].includes(u.pathname));}
const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');assert.match(robots,/Disallow: \/ho-so/);assert.match(robots,/Disallow: \/api/);
const png=fs.readFileSync(path.join(root,'og-default.png'));assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
console.log('PASS static metadata, redirects, sitemap, robots, OG image:',visited.size,'routes');
