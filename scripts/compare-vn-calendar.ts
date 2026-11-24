import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {solarToLunarVN,lunarToSolarVN} from '../lib/ziwei/lunar-solar';

async function main(){
 // External reference is used only in QA, not redistributed or shipped.
 const referencePath=process.env.VN_CALENDAR_REFERENCE;
 assert.ok(referencePath,'Set VN_CALENDAR_REFERENCE to the pinned, hash-verified reference file.');
 const {LichTa}=await import(pathToFileURL(resolve(referencePath)).href);
 const start=Date.UTC(1900,0,1), end=Date.UTC(2051,0,1),day=86400000;
 const diff:string[]=['solar,current_y,current_m,current_d,current_leap,reference_y,reference_m,reference_d,reference_leap'];
 const reverse:string[]=['solar,current_or_reference,back_solar'];
 const leapBoundaries:unknown[]=[];
 const focus:unknown[]=[];
 const tets:Record<number,{day:number;month:number}>={1968:{day:29,month:1},1985:{day:21,month:1},2007:{day:17,month:2},2030:{day:2,month:2}};
 let total=0,errors=0;
 for(let ts=start;ts<end;ts+=day){
  const dt=new Date(ts),y=dt.getUTCFullYear(),m=dt.getUTCMonth()+1,d=dt.getUTCDate(),key=dt.toISOString().slice(0,10);
  const current=solarToLunarVN(y,m,d),r=LichTa.toLunar(d,m,y,7);
  assert.ok(current,key+' current returned null');assert.ok(r&&r.day>0&&r.month>0,key+' reference invalid');
  const ref={lunarYear:r.year,lunarMonth:r.month,lunarDay:r.day,isLeapMonth:r.isLeap};
  const a=[current.lunarYear,current.lunarMonth,current.lunarDay,Number(current.isLeapMonth)],b=[ref.lunarYear,ref.lunarMonth,ref.lunarDay,Number(ref.isLeapMonth)];
  total++;
  if(a.join(',')!==b.join(','))diff.push([key,...a,...b].join(','));
  if(current.lunarYear>=1900&&current.lunarYear<=2050){
   const back=lunarToSolarVN(current.lunarYear,current.lunarMonth,current.lunarDay,current.isLeapMonth);
   if(!back||back.year!==y||back.month!==m||back.day!==d)reverse.push([key,'current',back?JSON.stringify(back):'null'].join(','));
  }
  const refBack=LichTa.toSolar(r.day,r.month,r.year,r.isLeap,7);
  if(!refBack||refBack.year!==y||refBack.month!==m||refBack.day!==d)reverse.push([key,'reference',refBack?JSON.stringify(refBack):'null'].join(','));
  if((current.isLeapMonth||ref.isLeapMonth)&&(a[2]===1||b[2]===1||a[2]>=29||b[2]>=29))leapBoundaries.push({solar:key,current,ref});
  const tet=tets[y];if(tet&&m===tet.month&&Math.abs(d-tet.day)<=1)focus.push({solar:key,current,ref,expectedTet:tet.day===d});
 }
 for(const [y,t] of Object.entries(tets)){const r=LichTa.toLunar(t.day,t.month,Number(y),7);const matches=r.year===Number(y)&&r.month===1&&r.day===1&&!r.isLeap;if(!matches)errors++;}
 mkdirSync('qa-baseline/calendar',{recursive:true});
 writeFileSync('qa-baseline/calendar/differences.csv',diff.join('\n')+'\n');
 writeFileSync('qa-baseline/calendar/roundtrip-differences.csv',reverse.join('\n')+'\n');
 writeFileSync('qa-baseline/calendar/leap-boundaries.json',JSON.stringify(leapBoundaries,null,2));
 const result={range:'1900-01-01..2050-12-31',reference:'LichTa 2.2.1 UTC+7 (pinned 6f65638)',total,differences:diff.length-1,roundtripDifferences:reverse.length-1,tetReferenceMismatches:errors,focus};
 writeFileSync('qa-baseline/calendar/summary.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
 // Audit must expose differences, not silently assert the approximate reference is authoritative.
 // This step gates execution and valid output; migration requires separately reviewed fixtures.
 assert.equal(total,Math.round((end-start)/day));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
