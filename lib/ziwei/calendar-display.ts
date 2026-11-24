import {candidateSolarToLunar} from './vn-calendar-candidate';
export const TERM_NAMES_VI=['Tiểu hàn','Đại hàn','Lập xuân','Vũ thủy','Kinh trập','Xuân phân','Thanh minh','Cốc vũ','Lập hạ','Tiểu mãn','Mang chủng','Hạ chí','Tiểu thử','Đại thử','Lập thu','Xử thử','Bạch lộ','Thu phân','Hàn lộ','Sương giáng','Lập đông','Tiểu tuyết','Đại tuyết','Đông chí'];
export type SolarTerm={name:string;index:number;year:number;month:number;day:number;clock:string;utcMs:number};
export type CalendarYearRow={terms:number[];monthChanges:[number,string][];dayAnchor:number};
export type CalendarData=Record<number,CalendarYearRow>;
const DAY=86400000,STEMS='甲乙丙丁戊己庚辛壬癸',BRANCHES='子丑寅卯辰巳午未申酉戌亥';
export function termFromInstant(year:number,index:number,utcMs:number):SolarTerm{
 const d=new Date(utcMs+7*3600000),r=new Date(Math.round((utcMs+7*3600000)/60000)*60000);
 const clock=r.getUTCDate()===d.getUTCDate()?[r.getUTCHours(),r.getUTCMinutes()].map(x=>String(x).padStart(2,'0')).join(':'):'23:59';
 return {name:TERM_NAMES_VI[index],index,year,month:d.getUTCMonth()+1,day:d.getUTCDate(),clock,utcMs};
}
export function displayTerms(data:CalendarData,year:number):SolarTerm[]{return (data[year]?.terms??[]).map((seconds,index)=>termFromInstant(year,index,Date.UTC(year,0,1)+seconds*1000));}
export function displayGanZhi(data:CalendarData,y:number,m:number,d:number){
 const row=data[y],lunar=candidateSolarToLunar(y,m,d);if(!row)return null;
 const n=Math.round((Date.UTC(y,m-1,d)-Date.UTC(y,0,1))/DAY);
 const month=[...row.monthChanges].reverse().find(([day])=>day<=n)?.[1]??'—';
 const day=(row.dayAnchor+n)%60;
 return {year:lunar?STEMS[((lunar.lunarYear-4)%10+10)%10]+BRANCHES[((lunar.lunarYear-4)%12+12)%12]:'—',month,day:STEMS[day%10]+BRANCHES[day%12]};
}
export type DayMark={label:string;kind:'holiday'|'tradition'|'lunar'|'term'};
export function dayMarks(y:number,m:number,d:number,terms:readonly SolarTerm[]):DayMark[]{
 const out:DayMark[]=[];
 const fixed:Record<string,string>={'1-1':'Tết Dương lịch','4-30':'Ngày Chiến thắng','5-1':'Quốc tế Lao động','9-2':'Quốc khánh'};
 if(fixed[m+'-'+d])out.push({label:fixed[m+'-'+d],kind:'holiday'});
 const l=candidateSolarToLunar(y,m,d);
 if(l){
  if(!l.isLeapMonth){
   if(l.lunarMonth===1&&l.lunarDay<=3)out.push({label:'Tết · mùng '+l.lunarDay,kind:'holiday'});
   if(l.lunarMonth===3&&l.lunarDay===10)out.push({label:'Giỗ Tổ Hùng Vương',kind:'holiday'});
   if(l.lunarMonth===8&&l.lunarDay===15)out.push({label:'Trung Thu',kind:'tradition'});
   if(l.lunarMonth===5&&l.lunarDay===5)out.push({label:'Tết Đoan Ngọ',kind:'tradition'});
  }
  if(l.lunarDay===1)out.push({label:'Mùng 1'+(l.isLeapMonth?' (nhuận)':''),kind:'lunar'});
  if(l.lunarDay===15)out.push({label:'Rằm'+(l.isLeapMonth?' (nhuận)':''),kind:'lunar'});
 }
 for(const t of terms)if(t.year===y&&t.month===m&&t.day===d)out.push({label:t.name,kind:'term'});
 return out;
}

export function vietnamToday(now=new Date()){const d=new Date(now.getTime()+7*3600000);return {year:d.getUTCFullYear(),month:d.getUTCMonth()+1,day:d.getUTCDate()};}

export function calendarUncertainty(year:number,month:number,day:number):string|undefined{
 const k=year*10000+month*100+day;
 if(k>=19380825&&k<=19381022)return 'Thu phân 1938 sát nửa đêm; JPL DE440s ủng hộ ngày đã chọn theo UTC+7 cố định.';
 if(k>=19440620&&k<=19440719)return 'Sóc tháng 6/1944 sát nửa đêm; JPL DE440s ủng hộ ngày 20/6 theo UTC+7 cố định.';
 if(k>=19670707&&k<=19670806)return 'Sóc tháng 7/1967 chỉ khoảng 4 giây sau nửa đêm theo JPL DE440s; lưu ý quy ước thời gian lịch sử.';
 return undefined;
}

