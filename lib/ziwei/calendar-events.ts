import {Solar} from 'lunar-javascript';
import {dayMarks as displayDayMarks} from './calendar-display';
export const TERM_NAMES_VI=['Tiểu hàn','Đại hàn','Lập xuân','Vũ thủy','Kinh trập','Xuân phân','Thanh minh','Cốc vũ','Lập hạ','Tiểu mãn','Mang chủng','Hạ chí','Tiểu thử','Đại thử','Lập thu','Xử thử','Bạch lộ','Thu phân','Hàn lộ','Sương giáng','Lập đông','Tiểu tuyết','Đại tuyết','Đông chí'];
const KEYS=['小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'];
const TRADITIONAL:Record<string,string>={'驚蟄':'惊蛰','穀雨':'谷雨','小滿':'小满','芒種':'芒种','處暑':'处暑'};
const UPPER:Record<string,string>={XIAO_HAN:'小寒',DA_HAN:'大寒',LI_CHUN:'立春',YU_SHUI:'雨水',JING_ZHE:'惊蛰',DA_XUE:'大雪',DONG_ZHI:'冬至'};
export type SolarTerm={name:string;index:number;year:number;month:number;day:number;clock:string;utcMs:number};
const cache=new Map<number,SolarTerm[]>();
/** lunar-javascript 1.7.7 qiAccurate uses UTC+8. Convert to fixed UTC+7;
 * minute-level display, not a claim of exact seconds for all history.
 */
export function solarTermsForYear(year:number):SolarTerm[]{
 if(!Number.isInteger(year)||year<1900||year>2050)return [];
 if(cache.has(year))return cache.get(year)!;
 const table=Solar.fromYmd(year,7,1).getLunar().getJieQiTable();
 const unique=new Map<number,SolarTerm>();
 for(const [key,s] of Object.entries(table)){
  const index=KEYS.indexOf(UPPER[key]??TRADITIONAL[key]??key);
  if(index<0)continue;
  const utcMs=Date.UTC(s.getYear(),s.getMonth()-1,s.getDay(),s.getHour()-8,s.getMinute(),s.getSecond());
  const d=new Date(utcMs+7*3600000);if(d.getUTCFullYear()!==year)continue;
  const localRounded=new Date(Math.round((utcMs+7*3600000)/60000)*60000);
  const clock=[localRounded.getUTCHours(),localRounded.getUTCMinutes()].map(x=>String(x).padStart(2,'0')).join(':');
  // Keep the actual civil day and seconds internally. For a term in the last
  // 30 seconds of a day, show 23:59 rather than rolling the displayed clock.
  unique.set(index,{name:TERM_NAMES_VI[index],index,year,month:d.getUTCMonth()+1,day:d.getUTCDate(),clock:localRounded.getUTCDate()===d.getUTCDate()?clock:'23:59',utcMs});
 }
 const list=[...unique.values()].sort((a,b)=>a.utcMs-b.utcMs);cache.set(year,list);return list;
}
export type {DayMark} from './calendar-display';
export {vietnamToday} from './calendar-display';
export function dayMarks(y:number,m:number,d:number,terms=solarTermsForYear(y)){return displayDayMarks(y,m,d,terms);}
