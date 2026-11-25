'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import {Button,Icon} from '@/components/ui';
import CalendarGrid,{civilKey,fullDate} from '@/components/ui/CalendarGrid';
import DetailPanel from '@/components/ui/DetailPanel';
import {dayMarks,displayTerms,displayGanZhi,vietnamToday,calendarUncertainty,type CalendarData} from '@/lib/ziwei/calendar-display';
import {candidateSolarToLunar as solarToLunarVN} from '@/lib/ziwei/vn-calendar-candidate';
import './calendar-ui.css';

const STEM_CN=[...'甲乙丙丁戊己庚辛壬癸'];
const BRANCH_CN=[...'子丑寅卯辰巳午未申酉戌亥'];
const STEM_VI=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const BRANCH_VI=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
function ganZhiVi(v:string|undefined){
 if(!v||v==='—')return '—';
 return [...v].map(ch=>{
  const si=STEM_CN.indexOf(ch);if(si>=0)return STEM_VI[si];
  const zi=BRANCH_CN.indexOf(ch);if(zi>=0)return BRANCH_VI[zi];
  return ch;
 }).join(' ');
}
const date=(y:number,m:number,d:number)=>new Date(y,m-1,d);
const inRange=(d:Date)=>d.getFullYear()>=1900&&d.getFullYear()<=2050;
const monthDate=(d:Date,delta:number)=>{
 const first=date(d.getFullYear(),d.getMonth()+1+delta,1);
 return date(first.getFullYear(),first.getMonth()+1,Math.min(d.getDate(),date(first.getFullYear(),first.getMonth()+2,0).getDate()));
};
export default function CalendarView({data,initial}:{data:CalendarData;initial:{year:number;month:number;day:number}}){
 const [today,setToday]=useState(initial);
 const [year,setYear]=useState(initial.year);
 const [month,setMonth]=useState(initial.month);
 const [selected,setSelected]=useState(date(initial.year,initial.month,initial.day));
 const [focused,setFocused]=useState(civilKey(date(initial.year,initial.month,initial.day)));
 const gridRoot=useRef<HTMLDivElement>(null);
 const pendingFocus=useRef<string|null>(null);
 function choose(d:Date,restoreFocus=false){
  if(!inRange(d))return;
  const key=civilKey(d);setYear(d.getFullYear());setMonth(d.getMonth()+1);setSelected(d);setFocused(key);
  if(restoreFocus){pendingFocus.current=key;requestAnimationFrame(()=>{gridRoot.current?.querySelector<HTMLButtonElement>('[data-date="'+key+'"]')?.focus();});}
 }
 useEffect(()=>{const now=vietnamToday();setToday(now);if(now.year!==initial.year||now.month!==initial.month||now.day!==initial.day){const d=date(now.year,now.month,now.day);if(inRange(d)){setYear(now.year);setMonth(now.month);setSelected(d);setFocused(civilKey(d));}}},[initial.year,initial.month,initial.day]);
 useEffect(()=>{if(pendingFocus.current){const target=gridRoot.current?.querySelector<HTMLButtonElement>('[data-date="'+pendingFocus.current+'"]');if(target){pendingFocus.current=null;target.focus();}}},[year,month,focused]);
 const terms=useMemo(()=>displayTerms(data,year),[data,year]);
 const days=useMemo(()=>{
  const offset=date(year,month,1).getDay();
  const count=Math.max(35,Math.ceil((offset+date(year,month+1,0).getDate())/7)*7);
  const byYear=new Map([[year,terms]]);
  return Array.from({length:count},(_,i)=>{
   const d=date(year,month,i-offset+1),y=d.getFullYear(),m=d.getMonth()+1,day=d.getDate();
   if(!byYear.has(y))byYear.set(y,displayTerms(data,y));
   return {d,within:m===month&&y===year,lunar:solarToLunarVN(y,m,day),marks:inRange(d)?dayMarks(y,m,day,byYear.get(y)!):[]};
  });
 },[data,year,month,terms]);
 const sy=selected.getFullYear(),sm=selected.getMonth()+1,sd=selected.getDate();
 const selectedYearTerms=useMemo(()=>displayTerms(data,sy),[data,sy]);
 const selectedTerms=selectedYearTerms.filter(t=>t.month===sm&&t.day===sd);
 const latestTerm=useMemo(()=>[...displayTerms(data,sy-1),...selectedYearTerms].filter(t=>t.year*10000+t.month*100+t.day<=sy*10000+sm*100+sd).at(-1),[data,sy,sm,sd,selectedYearTerms]);
 const lunar=useMemo(()=>solarToLunarVN(sy,sm,sd),[sy,sm,sd]);
 const ganZhi=useMemo(()=>displayGanZhi(data,sy,sm,sd),[data,sy,sm,sd]);
 const marks=dayMarks(sy,sm,sd,selectedYearTerms);
 const uncertainty=calendarUncertainty(sy,sm,sd);
 function shift(n:number){choose(date(year,month+n,1));}
 function move(d:Date,key:string){
  const steps:Record<string,number>={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7,Home:-d.getDay(),End:6-d.getDay()};
  const next=key==='PageUp'||key==='PageDown'?monthDate(d,key==='PageUp'?-1:1):date(d.getFullYear(),d.getMonth()+1,d.getDate()+steps[key]);
  if(!inRange(next))return;
  const nextKey=civilKey(next);
  pendingFocus.current=nextKey;setFocused(nextKey);setYear(next.getFullYear());setMonth(next.getMonth()+1);
  if(nextKey===focused)gridRoot.current?.querySelector<HTMLButtonElement>('[data-date="'+nextKey+'"]')?.focus();
 }
 return <main className="site-wrap page-content calendar4">
  <div className="calendar4-header">
   <h1>Lịch Vạn Niên</h1>
   <div className="calendar4-navigation no-print" aria-label="Điều hướng tháng" role="group">
    <Button variant="secondary" className="calendar4-arrow" onClick={()=>shift(-1)} aria-label="Tháng trước" disabled={year===1900&&month===1}><span className="calendar4-back"><Icon name="arrow"/></span></Button>
    <span className="calendar4-month" aria-live="polite">Tháng {month}/{year}</span>
    <Button variant="secondary" className="calendar4-arrow" onClick={()=>shift(1)} aria-label="Tháng sau" disabled={year===2050&&month===12}><Icon name="arrow"/></Button>
    <Button className="calendar4-today" onClick={()=>{const n=vietnamToday();setToday(n);choose(date(n.year,n.month,n.day));}}>Hôm nay</Button>
   </div>
  </div>
  <p className="calendar4-intro no-print">Tra cứu ngày Dương lịch, Âm lịch, Can Chi và tiết khí trong phạm vi 1900–2050. Không đưa ra kết luận ngày tốt/xấu không có căn cứ thuật toán.</p>
  <div className="calendar4-controls no-print">
   <label>Tháng<select className="ui-input" aria-label="Tháng tra cứu" value={month} onChange={e=>choose(date(year,Number(e.target.value),1))}>{Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label>
   <label>Năm<select className="ui-input" aria-label="Năm tra cứu" value={year} onChange={e=>choose(date(Number(e.target.value),month,1))}>{Array.from({length:151},(_,i)=><option key={1900+i} value={1900+i}>{1900+i}</option>)}</select></label>
   <Button variant="secondary" onClick={()=>window.print()}><Icon name="print"/> In lịch tháng A4</Button>
  </div>
  <div className="calendar4-layout">
   <section className="ui-card calendar4-board" aria-labelledby="calendar4-print-heading">
    <h2 className="calendar4-print-heading" id="calendar4-print-heading">Tháng {month}/{year}</h2>
    <p className="sr-only" id="calendar4-keyboard">Dùng phím mũi tên để di chuyển ngày, Page Up hoặc Page Down để đổi tháng, Home hoặc End để tới đầu hoặc cuối tuần, Enter hoặc Space để chọn ngày.</p>
    <div ref={gridRoot}><CalendarGrid days={days} selected={civilKey(selected)} focused={focused} today={civilKey(date(today.year,today.month,today.day))} onSelect={d=>choose(d,true)} onFocusDay={d=>setFocused(civilKey(d))} onMove={move} description="calendar4-keyboard"/></div>
    <div className="calendar4-notes"><p className="calendar4-legend">Mùng 1: ngày/tháng âm · 15: Rằm · Nhuận: tháng nhuận. Ngày lễ và tiết khí ghi trực tiếp trên ô.</p>
     <p>Các mốc lễ theo lịch, không phải lịch nghỉ chính thức của từng năm. Tết và Quốc khánh có ngày nghỉ liền kề theo thông báo hằng năm.</p></div>
   </section>
   <DetailPanel title={fullDate(selected)} subtitle={<>Âm lịch: <strong>{lunar?lunar.lunarDay+'/'+lunar.lunarMonth+'/'+lunar.lunarYear:'—'}</strong>{lunar?.isLeapMonth?' (tháng nhuận)':''}{' · Năm '+ganZhiVi(ganZhi?.year)}</>}>
    {marks.length>0&&<p className="calendar4-marks">{marks.map(m=>m.label).join(' · ')}</p>}
    <dl className="calendar4-facts">
     <dt>Ngày Can Chi</dt><dd>{ganZhiVi(ganZhi?.day)}</dd>
     <dt>Tháng Can Chi <small>(tiết khí, tham khảo)</small></dt><dd>{ganZhiVi(ganZhi?.month)}</dd>
     <dt>Năm Can Chi</dt><dd>{ganZhiVi(ganZhi?.year)}</dd>
     <dt>Tiết khí gần nhất <small>(UTC+7)</small></dt><dd>{latestTerm?latestTerm.name+' · '+latestTerm.clock+' · '+latestTerm.day+'/'+latestTerm.month+'/'+latestTerm.year:'Không có dữ liệu trong phạm vi hỗ trợ'}</dd>
     <dt>Giờ giao tiết trong ngày</dt><dd>{selectedTerms.length?selectedTerms.map(t=>t.name+' · '+t.clock).join(', '):'Không có mốc giao tiết'}</dd>
    </dl>
    <p className="calendar4-source">Nguồn thuật toán: lịch Việt Nam UTC+7 (1900–2050); tiết khí từ lunar-javascript 1.7.7.</p>
    <p className="calendar4-note">Ngày lễ: Điều 112 Bộ luật Lao động 2019; không thay thế thông báo ngày nghỉ từng năm.</p>
    <p className="calendar4-note">Ngày âm và năm Can Chi sử dụng lịch Việt Nam UTC+7 (1900–2050). Giờ giao tiết lấy từ lunar-javascript 1.7.7, quy đổi UTC+7 và làm tròn đến phút. Sai số mô hình lịch sử có thể ảnh hưởng những mốc sát nửa đêm. Lịch lịch sử áp dụng quy ước UTC+7 cố định. Tiết khí gần nhất tính đến cuối ngày đã chọn; giờ giao tiết ghi rõ nếu nằm trong ngày.</p>
    {uncertainty&&<p className="calendar4-note">{uncertainty}</p>}
    <div className="calendar4-links no-print"><Link className="ui-button ui-button-secondary" prefetch={false} href="/thien-ky">Thiên Kỷ <Icon name="arrow" size={16}/></Link><Link className="ui-button ui-button-secondary" prefetch={false} href="/chart">Lập lá số <Icon name="arrow" size={16}/></Link></div>
   </DetailPanel>
  </div>
 </main>;
}
