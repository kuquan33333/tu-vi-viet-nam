import type {KeyboardEvent,ReactNode} from 'react';
import type {DayMark} from '@/lib/ziwei/calendar-display';
import type {CandidateLunar} from '@/lib/ziwei/vn-calendar-candidate';

export const WEEKDAYS=['CN','T2','T3','T4','T5','T6','T7'] as const;
const FULL_WEEKDAYS=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
export function civilKey(d:Date){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
export function fullDate(d:Date){return FULL_WEEKDAYS[d.getDay()]+', '+d.getDate()+' tháng '+(d.getMonth()+1)+' năm '+d.getFullYear();}
export type CalendarCell={d:Date;within:boolean;lunar:CandidateLunar|null;marks:DayMark[]};

export default function CalendarGrid({days,selected,focused,today,onSelect,onFocusDay,onMove,description}:{days:CalendarCell[];selected:string;focused:string;today:string;onSelect:(d:Date)=>void;onFocusDay:(d:Date)=>void;onMove:(d:Date,key:string)=>void;description:string}){
 function handleKey(e:KeyboardEvent<HTMLButtonElement>,d:Date){
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','PageUp','PageDown','Home','End'].includes(e.key)){e.preventDefault();onMove(d,e.key);}
  // Native buttons provide Enter/Space selection.
 }
 return <div className="calendar4-grid" role="group" aria-label="Lịch tháng" aria-describedby={description}>
  {WEEKDAYS.map(day=><div className="calendar4-week" key={day}>{day}</div>)}
  {days.map(({d,within,lunar:l,marks})=>{
   const key=civilKey(d),chosen=key===selected,isToday=key===today,disabled=d.getFullYear()<1900||d.getFullYear()>2050;
   const first=l?.lunarDay===1,full=l?.lunarDay===15;
   const events=marks.filter(m=>m.kind!=='lunar');
   const label=fullDate(d)+(l?', âm lịch '+l.lunarDay+' tháng '+l.lunarMonth+(l.isLeapMonth?' nhuận':'')+' năm '+l.lunarYear:', ngoài phạm vi lịch âm')+(marks.length?', '+marks.map(m=>m.label).join(', '):'')+(isToday?', hôm nay':'');
   return <button key={key} type="button" data-date={key} aria-label={label} aria-pressed={chosen} aria-current={isToday?'date':undefined} disabled={disabled} tabIndex={!disabled&&key===focused?0:-1}
    className={'calendar4-day'+(!within?' outside':'')+(chosen?' selected':'')+(isToday?' today':'')+(first?' first-lunar':'')+(full?' full-lunar':'')}
    onFocus={()=>onFocusDay(d)} onClick={()=>onSelect(d)} onKeyDown={e=>handleKey(e,d)}>
    <span className="calendar4-solar">{d.getDate()}</span>
    <span className="calendar4-lunar">{l?(first?l.lunarDay+'/'+l.lunarMonth:full?'15 · Rằm':l.lunarDay):'—'}</span>
    {l?.isLeapMonth&&<span className="calendar4-leap">Nhuận</span>}
    {events.map(m=><span key={m.kind+'-'+m.label} className={'calendar4-event event-'+m.kind}>{m.label}</span>)}
    {isToday&&<span className="calendar4-today-label">Hôm nay</span>}
   </button>;
  })}
 </div>;
}
