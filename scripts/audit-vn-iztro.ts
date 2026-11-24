/**
 * Create an isolated QA copy of the pinned MIT iztro package, with only its
 * lunar-lite import replaced. Never edit node_modules/iztro or lunar-lite.
 * Run via npm ci && npx tsx scripts/audit-vn-iztro.ts.
 */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {cpSync,existsSync,mkdirSync,mkdtempSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {dirname,join,relative,resolve,sep} from 'node:path';
import ts from 'typescript';
import {candidateSolarToLunar} from '../lib/ziwei/vn-calendar-candidate';
const rq=createRequire(import.meta.url);
const originalRoot=dirname(rq.resolve('iztro/package.json'));
const metadata=JSON.parse(readFileSync(join(originalRoot,'package.json'),'utf8'));
assert.equal(metadata.version,'2.6.1','Re-audit dependency before upgrading');
const liteRoot=dirname(rq.resolve('lunar-lite/package.json'));
assert.equal(JSON.parse(readFileSync(join(liteRoot,'package.json'),'utf8')).version,'0.2.8');
const qaDir=mkdtempSync(resolve('node_modules/.vn-iztro-audit-'));
const outDir=resolve('qa-baseline/calendar');
mkdirSync(outDir,{recursive:true});
try{
 cpSync(join(originalRoot,'lib'),join(qaDir,'lib'),{recursive:true});
 for(const n of ['LICENSE','LICENSE.md','README.md'])if(existsSync(join(originalRoot,n)))cpSync(join(originalRoot,n),join(qaDir,n));
 const code=readFileSync('lib/ziwei/vn-calendar-candidate.ts','utf8');
 const output=ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
 writeFileSync(join(qaDir,'vn-calendar.cjs'),output);
 cpSync('scripts/reference/vn-iztro-calendar-adapter.cjs',join(qaDir,'vn-adapter.cjs'));
 let replaced=0;const touched:string[]=[];
 function walk(dir:string){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
   const path=join(dir,entry.name);if(entry.isDirectory()){walk(path);continue;}if(!path.endsWith('.js'))continue;
   const old=readFileSync(path,'utf8');
   let rel=relative(dirname(path),join(qaDir,'vn-adapter.cjs')).split(sep).join('/');if(!rel.startsWith('.'))rel='./'+rel;
   const changed=old.replace(/require\((["'])lunar-lite\1\)/g,()=>{replaced++;return 'require('+JSON.stringify(rel)+')';});
   if(changed!==old){touched.push(relative(qaDir,path));writeFileSync(path,changed);}
  }
 }
 walk(join(qaDir,'lib'));assert.ok(replaced>=5,'No or incomplete calendar imports intercepted');
 const original=rq('iztro').astro, vn=rq(join(qaDir,metadata.main||'lib/index.js')).astro;
 assert.notEqual(original,vn);
 original.config({yearDivide:'normal'});vn.config({yearDivide:'normal'});
 const provider=rq(join(qaDir,'vn-adapter.cjs'));
 const branches=[...'子丑寅卯辰巳午未申酉戌亥'],stems=[...'甲乙丙丁戊己庚辛壬癸'];
 const mod=(a:number,b:number)=>((a%b)+b)%b;
 const normalize=(a:any)=>({
  ming:a.earthlyBranchOfSoulPalace,than:a.earthlyBranchOfBodyPalace,cuc:a.fiveElementsClass,
  palaces:a.palaces.map((p:any)=>({branch:p.earthlyBranch,stem:p.heavenlyStem,name:p.name,body:p.isBodyPalace,major:p.majorStars.map((s:any)=>[s.name,s.mutagen,s.brightness]),minor:p.minorStars.map((s:any)=>[s.name,s.mutagen,s.brightness]),adjective:p.adjectiveStars.map((s:any)=>[s.name,s.mutagen,s.brightness]),decadal:p.decadal,ages:p.ages,changsheng:p.changsheng12,boshi:p.boshi12,jiangqian:p.jiangqian12,suiqian:p.suiqian12}))
 });
 const major=(a:any)=>a.palaces.flatMap((p:any)=>p.majorStars.map((s:any)=>[s.name,p.earthlyBranch])).sort((a:any,b:any)=>a[0].localeCompare(b[0]));
 const focused=['1968-01-29','1985-01-21','2007-02-17','2030-02-02','1985-03-21','2025-07-25','2025-08-15','2033-12-22','1938-09-24','1944-06-20'];
 const reports:any[]=[];
 let count=0,same=0,legacyMismatch=0;
 for(const date of focused){
  const [y,m,d]=date.split('-').map(Number);const l=candidateSolarToLunar(y,m,d);assert.ok(l);
  for(const hour of [0,1,6,11])for(const gender of ['男','女']){
   const a=vn.bySolar(date,hour,gender,true,'zh-CN'),old=original.bySolar(date,hour,gender,true,'zh-CN');
   assert.equal(a.solarDate,date,'Never substitute another birthday');
   const raw=a.rawDates.lunarDate;
   assert.deepEqual([raw.lunarYear,raw.lunarMonth,raw.lunarDay,raw.isLeap],[l.lunarYear,l.lunarMonth,l.lunarDay,l.isLeapMonth],date);
   assert.deepEqual(a.rawDates.chineseDate.yearly,[stems[mod(l.lunarYear-4,10)],branches[mod(l.lunarYear-4,12)]],date);
   const effectiveMonth:number=l.lunarMonth+(l.isLeapMonth&&l.lunarDay>15?1:0);
   assert.equal(a.earthlyBranchOfSoulPalace,branches[mod(effectiveMonth+1-hour,12)],date+' Mệnh');
   assert.equal(a.earthlyBranchOfBodyPalace,branches[mod(effectiveMonth+1+hour,12)],date+' Thân');
   assert.equal(a.palaces.length,12);assert.equal(major(a).length,14);assert.equal(new Set(major(a).map((v:any)=>v[0])).size,14);
   const back:{solarYear:number;solarMonth:number;solarDay:number}=provider.lunar2solar([l.lunarYear,l.lunarMonth,l.lunarDay].join('-'),l.isLeapMonth);
   assert.deepEqual([back.solarYear,back.solarMonth,back.solarDay],[y,m,d]);
   const fromLunar:any=vn.byLunar([l.lunarYear,l.lunarMonth,l.lunarDay].join('-'),hour,gender,l.isLeapMonth,true,'zh-CN');
   assert.deepEqual(normalize(fromLunar),normalize(a),'same calendar must give same chart');
   // Confirm against independent unmodified iztro byLunar only where it can
   // represent this lunar tuple exactly. Never use its substituted solar date in production.
   let reference='unrepresentable';
   try{
    const ref:any=original.byLunar([l.lunarYear,l.lunarMonth,l.lunarDay].join('-'),hour,gender,l.isLeapMonth,true,'zh-CN');
    const rr=ref.rawDates.lunarDate;
    if(JSON.stringify([rr.lunarYear,rr.lunarMonth,rr.lunarDay,rr.isLeap])===JSON.stringify([l.lunarYear,l.lunarMonth,l.lunarDay,l.isLeapMonth])){
     assert.deepEqual([a.earthlyBranchOfSoulPalace,a.earthlyBranchOfBodyPalace,a.fiveElementsClass,major(a)],[ref.earthlyBranchOfSoulPalace,ref.earthlyBranchOfBodyPalace,ref.fiveElementsClass,major(ref)],date+' independent principal stars');
     reference='matched';
    }
   }catch(e){if(e instanceof assert.AssertionError)throw e;reference='unrepresentable';}
   if(JSON.stringify(normalize(a))!==JSON.stringify(normalize(old)))legacyMismatch++;
   reports.push({date,hour,gender,lunar:l,originalMing:old.earthlyBranchOfSoulPalace,vnMing:a.earthlyBranchOfSoulPalace,cuc:a.fiveElementsClass,reference});
   count++;
  }
 }
 // Check real outputs with every month and two hours over a stable modern year.
 for(let m=1;m<=12;m++){
  const date='1990-'+m+'-15',l=candidateSolarToLunar(1990,m,15);assert.ok(l);
  const raw=original.bySolar(date,0,'男',true,'zh-CN').rawDates.lunarDate;
  if(JSON.stringify([raw.lunarYear,raw.lunarMonth,raw.lunarDay,raw.isLeap])!==JSON.stringify([l.lunarYear,l.lunarMonth,l.lunarDay,l.isLeapMonth]))continue;
  for(const h of [0,6]){assert.deepEqual(normalize(vn.bySolar(date,h,'男',true,'zh-CN')),normalize(original.bySolar(date,h,'男',true,'zh-CN')),date+' unchanged');same++;}
 }
 assert.ok(same>=12,'insufficient unchanged cases');assert.ok(legacyMismatch>0);
 // The old engine is not mutated by loading or running the new engine.
 assert.equal(original.bySolar('1985-01-21',6,'男',true,'zh-CN').rawDates.lunarDate.lunarYear,1984);
 assert.equal(vn.bySolar('1985-01-21',6,'男',true,'zh-CN').rawDates.lunarDate.lunarYear,1985);
 const report={provider:'isolated QA only',iztro:metadata.version,interceptedImports:replaced,files:touched,focusedCases:count,unchangedCases:same,changedFromLegacy:legacyMismatch,independentMajorMatches:reports.filter(r=>r.reference==='matched').length,details:reports};
 writeFileSync(join(outDir,'iztro-utc7-adapter.json'),JSON.stringify(report,null,2));
 console.log('VN_IZTRO_QA '+JSON.stringify({...report,details:undefined}));
}finally{rmSync(qaDir,{recursive:true,force:true});}
