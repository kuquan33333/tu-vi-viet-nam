import assert from 'node:assert/strict';
import {test} from 'node:test';
import {generateChart,resolveEffectiveLunarDate} from '../../lib/ziwei/algorithm';
import {solarToLunarVN,lunarToSolarVN,legacySolarToLunar,CANDIDATE_VERSION,calendarUncertainty} from '../../lib/ziwei/lunar-solar';
const mod=(n:number,k:number)=>((n%k)+k)%k;
const cases=[[1968,1,29],[1985,1,21],[2007,2,17],[2030,2,2]] as const;
for(const [year,month,day] of cases)test('E6 actual generateChart UTC+7 Tet '+year,()=>{
 const expected={lunarYear:year,lunarMonth:1,lunarDay:1,isLeapMonth:false};
 assert.notDeepEqual(legacySolarToLunar(year,month,day),expected,'legacy negative control');
 assert.deepEqual(solarToLunarVN(year,month,day),expected);
 assert.deepEqual(lunarToSolarVN(year,1,1),{year,month,day});
 for(const hour of [0,1,6,11])for(const gender of ['male','female'] as const){
  const b={year,month,day,hour,gender};
  const c=generateChart(b);
  assert.deepEqual(c.lunarInfo.rawDate,expected);
  assert.deepEqual([c.birthInfo.year,c.birthInfo.month,c.birthInfo.day],[year,month,day]);
  assert.equal(c.birthInfo.calendarVersion,CANDIDATE_VERSION);
  assert.equal(c.lunarInfo.yearStem,mod(year-4,10));assert.equal(c.lunarInfo.yearBranch,mod(year-4,12));
  assert.equal(c.mingGongBranch,mod(2-hour,12));assert.equal(c.shenGongBranch,mod(2+hour,12));
  assert.equal(c.palaces.length,12);assert.equal(c.palaces.flatMap(p=>p.stars.filter(s=>s.type==='major')).length,14);
  const old=generateChart({...b,calendarVersion:'legacy-cn'});
  assert.notEqual(old.mingGongBranch,c.mingGongBranch);
 }
});
test('E6 leap month not representable in old calendar, all policies preserve actual birthday',()=>{
 const birth={year:1985,month:3,day:21,hour:6,gender:'male' as const};
 const raw={lunarYear:1985,lunarMonth:2,lunarDay:1,isLeapMonth:true};
 for(const policy of ['split','origin-month','prev-month','next-month'] as const){
  const c=generateChart(birth,{leapMonth:policy});
  assert.deepEqual(c.lunarInfo.rawDate,raw);
  const e=resolveEffectiveLunarDate(1985,3,21,policy);
  assert.equal(e.lunarMonth,policy==='next-month'?3:2);
  assert.equal(c.mingGongBranch,mod(e.lunarMonth+1-birth.hour,12));
  assert.equal(c.shenGongBranch,mod(e.lunarMonth+1+birth.hour,12));
  assert.deepEqual([c.birthInfo.year,c.birthInfo.month,c.birthInfo.day],[1985,3,21]);
 }
 // A scoped override must not leak into the next chart.
 const rawAfter=generateChart(birth,{leapMonth:'origin-month'});
 assert.equal(rawAfter.lunarInfo.lunarMonth,2);
});
test('E6 historical disagreement is explicit; famous pre-1900 fixtures remain legacy',()=>{
 for(const [year,month,day] of [[1938,9,24],[1944,6,20],[1967,7,8]]){
  assert.ok(calendarUncertainty(year,month,day));
  assert.ok(generateChart({year,month,day,hour:6,gender:'male'}).birthInfo.calendarUncertain);
 }
 assert.equal(generateChart({year:1753,month:5,day:5,hour:6,gender:'male'}).birthInfo.calendarVersion,'legacy-cn');
});

import {getLiuRiSiHua} from '../../lib/ziwei/sihua';
import {Solar} from 'lunar-javascript';
import {STEMS_CN} from '../../lib/ziwei/algorithm';
test('E6 daily transformations follow real VN Gregorian date',()=>{
 const expected=STEMS_CN.indexOf(Solar.fromYmd(1985,3,21).getLunar().getDayGan());
 assert.ok(expected>=0);assert.equal(getLiuRiSiHua(1985,2,1,true)?.stemIndex,expected);
 assert.equal(getLiuRiSiHua(1985,2,31,true),null);
});
