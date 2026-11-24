/**
 * Create an isolated calendar-provider build of the locked MIT iztro package.
 * npm ci executes this lifecycle hook; upstream iztro/lunar-lite stay untouched.
 * The copied package is generated, not tracked, and uses the same locked dependencies.
 */
import {createRequire} from 'node:module';
import {cpSync,existsSync,mkdirSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {dirname,join,relative,resolve,sep} from 'node:path';
import ts from 'typescript';
const req=createRequire(import.meta.url);
const original=dirname(req.resolve('iztro/package.json'));
const meta=JSON.parse(readFileSync(join(original,'package.json'),'utf8'));
if(meta.version!=='2.6.1')throw Error('Re-audit calendar provider for iztro version '+meta.version);
const lite=JSON.parse(readFileSync(req.resolve('lunar-lite/package.json'),'utf8'));
if(lite.version!=='0.2.8')throw Error('Re-audit lunar-lite version '+lite.version);
const target=resolve('node_modules/iztro-vn-local');
rmSync(target,{recursive:true,force:true});mkdirSync(target,{recursive:true});
cpSync(join(original,'lib'),join(target,'lib'),{recursive:true});
let license=false;
for(const n of ['LICENSE','LICENSE.md','README.md'])if(existsSync(join(original,n))){cpSync(join(original,n),join(target,n));if(n.startsWith('LICENSE'))license=true;}
if(!license)throw Error('Missing upstream MIT license');
writeFileSync(join(target,'package.json'),JSON.stringify({...meta,name:'iztro-vn-local',private:true,scripts:{}},null,2));
const candidate=ts.transpileModule(readFileSync('lib/ziwei/vn-calendar-candidate.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
writeFileSync(join(target,'vn-calendar.cjs'),candidate);
cpSync('scripts/reference/vn-iztro-calendar-adapter.cjs',join(target,'vn-adapter.cjs'));
writeFileSync(join(target,'vn-adapter.d.cts'),"export function withEffectiveCalendarDate<T>(date:string,lunar:{lunarYear:number;lunarMonth:number;lunarDay:number;isLeapMonth:boolean},fn:()=>T):T;\n");
let count=0;
function walk(dir){
 for(const e of readdirSync(dir,{withFileTypes:true})){
  const p=join(dir,e.name);if(e.isDirectory()){walk(p);continue;}if(!p.endsWith('.js'))continue;
  const old=readFileSync(p,'utf8');let rel=relative(dirname(p),join(target,'vn-adapter.cjs')).split(sep).join('/');if(!rel.startsWith('.'))rel='./'+rel;
  const changed=old.replace(/require\((["'])lunar-lite\1\)/g,()=>{count++;return 'require('+JSON.stringify(rel)+')';});
  if(changed!==old)writeFileSync(p,changed);
 }
}
walk(join(target,'lib'));
if(count<5)throw Error('Incomplete calendar import interception: '+count);
console.log('Generated isolated iztro UTC+7 provider: '+count+' imports; original dependencies unchanged.');
