/**
 * Independent astronomy check. Install astronomy-engine@2.1.19 in a temp directory,
 * then set ASTRONOMY_ENGINE_PATH to its CommonJS astronomy.js. Not a runtime dependency.
 */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {candidateMonths,candidateSolarToLunar,fromCivilDay} from '../lib/ziwei/vn-calendar-candidate';
const requireFromHere=createRequire(import.meta.url);
const path=process.env.ASTRONOMY_ENGINE_PATH;
assert.ok(path,'ASTRONOMY_ENGINE_PATH required');
const A=requireFromHere(path) as {
 SearchMoonPhase:(target:number,start:Date,days:number)=>{date:Date}|null;
 SearchSunLongitude:(target:number,start:Date,days:number)=>{date:Date}|null;
 SunPosition:(t:Date)=>{elon:number};
};
const DAY=86400000,TZ=7*3600000;
const civil=(dt:Date)=>Math.floor((dt.getTime()+TZ)/DAY);
const sector=(n:number)=>Math.floor(((A.SunPosition(new Date(n*DAY-TZ)).elon%360+360)%360)/30);
const moons:{start:number;utc:string}[]=[];
let t=new Date(Date.UTC(1898,9,1));
while(t.getUTCFullYear()<2052){
 const r=A.SearchMoonPhase(0,t,35);assert.ok(r,'missing moon');
 moons.push({start:civil(r.date),utc:r.date.toISOString()});t=new Date(r.date.getTime()+DAY);
}
const anchors:{year:number;index:number}[]=[];
for(let y=1898;y<=2051;y++){
 const r=A.SearchSunLongitude(270,new Date(Date.UTC(y,11,18)),8);assert.ok(r,'missing solstice '+y);
 const n=civil(r.date);let i=moons.length-1;while(i>=0&&moons[i].start>n)i--;
 assert.ok(i>=0);anchors.push({year:y,index:i});
}
const independent:{year:number;month:number;leap:boolean;start:number;length:number;utc:string}[]=[];
for(let j=0;j<anchors.length-1;j++){
 const {year,index:a}=anchors[j],b=anchors[j+1].index,count=b-a;
 assert.ok(count===12||count===13,'lunation count '+year+' '+count);
 let leap=-1;
 if(count===13){
  for(let i=a+1;i<b;i++){if(sector(moons[i].start)===sector(moons[i+1].start)){leap=i;break;}}
  assert.ok(leap>=0,'missing leap '+year);
 }
 let y=year,m=11;
 for(let i=a;i<b;i++){
  if(i>a&&i!==leap){m=m%12+1;if(m===1)y++;}
  independent.push({year:y,month:m,leap:i===leap,start:moons[i].start,length:moons[i+1].start-moons[i].start,utc:moons[i].utc});
 }
}
const key=(r:{year:number;month:number;leap:boolean})=>[r.year,r.month,Number(r.leap)].join('/');
const rows=new Map(independent.map(r=>[key(r),r]));
const diff=[] as unknown[];
let checked=0;
for(const r of candidateMonths){
 const s=fromCivilDay(r.start);
 if(s.year<1900||s.year>2050)continue;
 checked++;
 const other=rows.get(key(r));
 if(!other||other.start!==r.start||other.length!==r.length)diff.push({key:key(r),moshier:r,astronomyEngine:other??null});
}
const dailyDiff=[] as string[];
let i=0;
for(let t=Date.UTC(1900,0,1);t<Date.UTC(2051,0,1);t+=DAY){
 const n=t/DAY;
 while(i<independent.length-1&&independent[i].start+independent[i].length<=n)i++;
 const r=independent[i],d=new Date(t);
 const a=candidateSolarToLunar(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate());
 const b={lunarYear:r.year,lunarMonth:r.month,lunarDay:n-r.start+1,isLeapMonth:r.leap};
 if(JSON.stringify(a)!==JSON.stringify(b))dailyDiff.push(d.toISOString().slice(0,10)+','+JSON.stringify(a)+','+JSON.stringify(b));
}
const summary={independent:'Astronomy Engine 2.1.19 (MIT)',checkedMonthStarts:checked,monthDisagreements:diff.length,dayDisagreements:dailyDiff.length,details:diff};
mkdirSync('qa-baseline/calendar',{recursive:true});
writeFileSync('qa-baseline/calendar/independent-astronomy.json',JSON.stringify(summary,null,2));
writeFileSync('qa-baseline/calendar/independent-astronomy-daily.txt',dailyDiff.join('\n'));
console.log('ASTRONOMY_COMPARE '+JSON.stringify(summary));
// Report disagreements explicitly. A separate release gate, not this audit, decides migration.
assert.ok(checked>1800);
