import assert from 'node:assert/strict';
import {test} from 'node:test';
import {candidateMonths,candidateSolarToLunar,candidateLunarToSolar,fromCivilDay} from '../../lib/ziwei/vn-calendar-candidate';
test('E6: fixed UTC+7 candidate matches documented Tet and leap boundaries',()=>{
 for(const [y,m,d] of [[1968,1,29],[1985,1,21],[2007,2,17],[2030,2,2]]){
  assert.deepEqual(candidateSolarToLunar(y,m,d),{lunarYear:y,lunarMonth:1,lunarDay:1,isLeapMonth:false});
  assert.deepEqual(candidateLunarToSolar(y,1,1),{year:y,month:m,day:d});
 }
 assert.deepEqual(candidateSolarToLunar(1985,3,21),{lunarYear:1985,lunarMonth:2,lunarDay:1,isLeapMonth:true});
 assert.deepEqual(candidateSolarToLunar(2025,7,25),{lunarYear:2025,lunarMonth:6,lunarDay:1,isLeapMonth:true});
 assert.deepEqual(candidateSolarToLunar(2033,12,22),{lunarYear:2033,lunarMonth:11,lunarDay:1,isLeapMonth:true});
 assert.deepEqual(candidateSolarToLunar(2026,11,24),{lunarYear:2026,lunarMonth:10,lunarDay:16,isLeapMonth:false});
});
test('E6: candidate every civil date 1900–2050 round trips; no gaps or invalid dates',()=>{
 let checked=0;
 for(let t=Date.UTC(1900,0,1);t<Date.UTC(2051,0,1);t+=86400000){
  const d=new Date(t),y=d.getUTCFullYear(),m=d.getUTCMonth()+1,day=d.getUTCDate();
  const lunar=candidateSolarToLunar(y,m,day);assert.ok(lunar,d.toISOString());
  assert.deepEqual(candidateLunarToSolar(lunar.lunarYear,lunar.lunarMonth,lunar.lunarDay,lunar.isLeapMonth),{year:y,month:m,day});
  checked++;
 }
 assert.equal(checked,55152);
 for(let i=1;i<candidateMonths.length;i++)assert.equal(candidateMonths[i].start,candidateMonths[i-1].start+candidateMonths[i-1].length);
 assert.equal(candidateSolarToLunar(2026,2,30),null);assert.equal(candidateSolarToLunar(1899,1,1),null);
 assert.equal(candidateLunarToSolar(2026,1,1,true),null);
 for(const r of candidateMonths){
  const s=fromCivilDay(r.start);
  if(s.year>=1900&&s.year<=2050)assert.deepEqual(candidateSolarToLunar(s.year,s.month,s.day),{lunarYear:r.year,lunarMonth:r.month,lunarDay:1,isLeapMonth:r.leap});
 }
});
