/** Build-time cache of the existing lunar-javascript display values, not a new calendar algorithm. */
import {Solar} from 'lunar-javascript';
import {solarTermsForYear} from './calendar-events';
import type {CalendarData,CalendarYearRow} from './calendar-display';
const DAY=86400000,STEMS='甲乙丙丁戊己庚辛壬癸',BRANCHES='子丑寅卯辰巳午未申酉戌亥';
function lunarAt(ms:number){const d=new Date(ms);return Solar.fromYmd(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate()).getLunar();}
export function buildCalendarYear(year:number):CalendarYearRow{
 const start=Date.UTC(year,0,1),first=lunarAt(start);
 const monthAt=(ms:number)=>{const l=lunarAt(ms);return l.getMonthGan()+l.getMonthZhi();};
 const dayAnchor=Array.from({length:60},(_,i)=>i).find(i=>STEMS[i%10]===first.getDayGan()&&BRANCHES[i%12]===first.getDayZhi());
 if(dayAnchor===undefined)throw Error('Invalid Gan Zhi anchor '+year);
 const terms=solarTermsForYear(year),monthChanges:[number,string][]=[[0,monthAt(start)]];
 // The previous display uses civil dates in the reference's UTC+8 convention.
 // Read actual month values near each Jie from the same library; no invented stem formula.
 for(const term of terms.filter(t=>t.index%2===0)){
  const central=Math.floor((term.utcMs+8*3600000-start)/DAY);
  for(let offset=Math.max(0,central-2);offset<=central+2;offset++){
   if(new Date(start+offset*DAY).getUTCFullYear()!==year)continue;
   const value=monthAt(start+offset*DAY);
   if(value!==monthChanges.at(-1)![1])monthChanges.push([offset,value]);
  }
 }
 if(terms.length!==24)throw Error('Incomplete terms '+year);
 return {terms:terms.map(t=>(t.utcMs-start)/1000),monthChanges,dayAnchor};
}
export function buildCalendarData():CalendarData{return Object.fromEntries(Array.from({length:151},(_,i)=>[1900+i,buildCalendarYear(1900+i)]));}
