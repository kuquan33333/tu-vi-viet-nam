import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {Solar} from 'lunar-javascript';
import {buildCalendarYear} from '../../lib/ziwei/calendar-display-server';
import {displayTerms,displayGanZhi} from '../../lib/ziwei/calendar-display';
import {solarTermsForYear} from '../../lib/ziwei/calendar-events';
test('Calendar display cache matches original terms and Gan Chi at all monthly boundaries 1900–2050',()=>{
 for(let year=1900;year<=2050;year++){
  const row=buildCalendarYear(year),data={[year]:row};
  assert.deepEqual(displayTerms(data,year),solarTermsForYear(year));
  const base=Date.UTC(year,0,1);
  const days=new Set([0,30,59,181,364,...row.monthChanges.flatMap(([n])=>[n-1,n,n+1]),...Array.from({length:12},(_,m)=>(Date.UTC(year,m,15)-base)/86400000)]);
  for(const n of days){const dt=new Date(base+n*86400000);if(dt.getUTCFullYear()!==year)continue;
   const m=dt.getUTCMonth()+1,d=dt.getUTCDate(),reference=Solar.fromYmd(year,m,d).getLunar(),cached=displayGanZhi(data,year,m,d);
   assert.equal(cached?.month,reference.getMonthGan()+reference.getMonthZhi(),year+'/'+m+'/'+d+' month');
   assert.equal(cached?.day,reference.getDayGan()+reference.getDayZhi(),year+'/'+m+'/'+d+' day');
  }
 }
});

test('Calendar UI defers the full 151-year dataset and keeps the home preview server-rendered',()=>{
 const page=readFileSync('app/lich-van-nien/page.tsx','utf8');
 const view=readFileSync('app/lich-van-nien/CalendarView.tsx','utf8');
 const home=readFileSync('components/ui/HomeCalendar.tsx','utf8');
 const homePage=readFileSync('app/page.tsx','utf8');
 const pkg=JSON.parse(readFileSync('package.json','utf8'));
 assert.ok(page.includes('buildCalendarYear')&&page.includes('initialData'));
 assert.doesNotMatch(page,/buildCalendarData/);
 assert.ok(view.includes("fetch('/calendar-data.json')"));
 assert.ok(homePage.includes('buildCalendarYear'));
 assert.doesNotMatch(homePage,/today\.year\+1/);
 assert.doesNotMatch(home,/^'use client'/m);
 assert.doesNotMatch(home,/useEffect|useState/);
 assert.ok(pkg.scripts.prebuild.includes('render-calendar-data.ts'));
});
