import assert from 'node:assert/strict';
import {test} from 'node:test';
import {generateChart} from '../../lib/ziwei/algorithm';
import type {BirthInfo} from '../../lib/ziwei/types';

// Independent Swiss Ephemeris 2.10.03 Moshier geocentric solar longitude:
// 315 degrees: 2004-02-04 11:56:12.268 UT = 18:56:12 UTC+7.
// 75 degrees: 1990-06-05 22:46:16.830 UT = 1990-06-06 05:46:16.830 UTC+7.
// Test times deliberately > 1 minute from the astronomical boundary.
function chartAt(year:number,month:number,day:number,clockHour:number,clockMinute:number,offset:number,hour:number){
 const b:BirthInfo={year,month,day,hour,gender:'male',origInput:{year,month,day,clockHour,clockMinute,clockSecond:0},timeConvention:{trueSolar:false,lateZishi:'current-day',utcOffsetMinutes:offset}};
 return generateChart(b).lunarInfo.fourPillars?.slice(0,2);
}
test('E6: same chi hour but different actual birth minutes on Lập Xuân boundary',()=>{
 assert.deepEqual(chartAt(2004,2,4,18,54,420,9),['Quý Mùi','Ất Sửu']);
 assert.deepEqual(chartAt(2004,2,4,18,58,420,9),['Giáp Thân','Bính Dần']);
});
test('E6: month pillar changes at actual Mang Chủng instant, not chi-hour midpoint',()=>{
 assert.deepEqual(chartAt(1990,6,6,5,44,420,3),['Canh Ngọ','Tân Tỵ']);
 assert.deepEqual(chartAt(1990,6,6,5,48,420,3),['Canh Ngọ','Nhâm Ngọ']);
});
test('E6: identical astronomical instant in two time zones has the same term pillars',()=>{
 assert.deepEqual(chartAt(2004,2,4,18,58,420,9),chartAt(2004,2,4,19,58,480,10));
});
