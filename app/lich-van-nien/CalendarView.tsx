'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import {dayMarks,displayTerms,displayGanZhi,vietnamToday,calendarUncertainty,type CalendarData} from '@/lib/ziwei/calendar-display';
import {candidateSolarToLunar as solarToLunarVN} from '@/lib/ziwei/vn-calendar-candidate';
const DAYS=['T2','T3','T4','T5','T6','T7','CN'];
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
export default function CalendarView({data,initial}:{data:CalendarData;initial:{year:number;month:number;day:number}}){
 const [today,setToday]=useState(initial);
 const [year,setYear]=useState(initial.year);
 const [month,setMonth]=useState(initial.month);
 const [selected,setSelected]=useState(date(initial.year,initial.month,initial.day));
 useEffect(()=>{const now=vietnamToday();setToday(now);if(now.year!==initial.year||now.month!==initial.month||now.day!==initial.day){setYear(now.year);setMonth(now.month);setSelected(date(now.year,now.month,now.day));}},[initial.year,initial.month,initial.day]);
 const terms=useMemo(()=>displayTerms(data,year),[data,year]);
 const days=useMemo(()=>{
  const offset=(date(year,month,1).getDay()+6)%7;
  const count=42;
  return Array.from({length:count},(_,i)=>{
   const d=date(year,month,i-offset+1);
   return {d,within:d.getMonth()===month-1,lunar:solarToLunarVN(d.getFullYear(),d.getMonth()+1,d.getDate())};
  });
 },[year,month]);
 const selectedTerms=terms.filter(t=>t.year===selected.getFullYear()&&t.month===selected.getMonth()+1&&t.day===selected.getDate());
 const lunar=useMemo(()=>solarToLunarVN(selected.getFullYear(),selected.getMonth()+1,selected.getDate()),[selected]);
 const ganZhi=useMemo(()=>displayGanZhi(data,selected.getFullYear(),selected.getMonth()+1,selected.getDate()),[data,selected]);
 function shift(n:number){
  const d=date(year,month+n,1);if(d.getFullYear()<1900||d.getFullYear()>2050)return;
  setYear(d.getFullYear());setMonth(d.getMonth()+1);setSelected(d);
 }
 return <main className="site-wrap page-content">
  <div className="tool-hero"><div className="eyebrow">LỊCH PHÁP VIỆT NAM</div><h1 className="display-small">Lịch Vạn Niên</h1>
   <p className="lead" style={{maxWidth:750}}>Tra cứu ngày Dương lịch, Âm lịch, Can Chi và tiết khí trong phạm vi 1900–2050. Không đưa ra kết luận ngày tốt/xấu không có căn cứ thuật toán.</p>
  </div>
  <div className="workspace-layout">
   <section className="surface-card calendar-print" style={{padding:18}}>
    <div className="calendar-toolbar">
     <h2 className="display-small" style={{fontSize:24}}>Tháng {month} / {year}</h2>
     <div className="no-print" style={{display:'flex',gap:6,flexWrap:'wrap'}}>
      <button className="action-outline" type="button" onClick={()=>shift(-1)} aria-label="Tháng trước"><span style={{transform:'rotate(180deg)',display:'inline-flex'}}><Icon name="arrow"/></span></button>
      <button className="action-outline" type="button" onClick={()=>{const n=vietnamToday();setYear(n.year);setMonth(n.month);setSelected(date(n.year,n.month,n.day));}}>Hôm nay</button>
      <button className="action-outline" type="button" onClick={()=>shift(1)} aria-label="Tháng sau"><Icon name="arrow"/></button>
      <button className="action-outline" type="button" onClick={()=>window.print()}>In lịch tháng A4</button>
     </div>
    </div>
    <div className="no-print" style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
     <label>Tháng <select aria-label="Tháng tra cứu" value={month} onChange={e=>{const m=Number(e.target.value);setMonth(m);setSelected(date(year,m,1));}}>{Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label>
     <label>Năm <select aria-label="Năm tra cứu" value={year} onChange={e=>{const y=Number(e.target.value);setYear(y);setSelected(date(y,month,1));}}>{Array.from({length:151},(_,i)=><option key={1900+i} value={1900+i}>{1900+i}</option>)}</select></label>
    </div>
    <div className="calendar-month-grid" role="group" aria-label="Lịch tháng">
     {DAYS.map(d=><div className="calendar-week" key={d}>{d}</div>)}
     {days.map(({d,within,lunar:l},i)=>{
      const chosen=selected.toDateString()===d.toDateString();
      const marks=dayMarks(d.getFullYear(),d.getMonth()+1,d.getDate(),within?terms:displayTerms(data,d.getFullYear()));
      return <button type="button" aria-label={d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()} aria-pressed={chosen} disabled={d.getFullYear()<1900||d.getFullYear()>2050} key={i}
       className={'calendar-day'+(!within?' outside':'')+(chosen?' selected':'')+(today.year===d.getFullYear()&&today.month===d.getMonth()+1&&today.day===d.getDate()?' today':'')+(marks.some(m=>m.kind==='holiday')?' has-holiday':'')+(marks.some(m=>m.kind==='term')?' has-term':'')}
       onClick={()=>{setSelected(d);if(!within){setMonth(d.getMonth()+1);setYear(d.getFullYear());}}}>
       <span className="solar-day">{d.getDate()}</span>
       <span className="lunar-day">{l?(l.lunarDay===1?l.lunarDay+'/'+l.lunarMonth:l.lunarDay+' âm'):'—'}</span>
       {marks.filter(m=>m.kind!=='lunar').map(m=><span key={m.label} className={'calendar-holiday mark-'+m.kind}>{m.label}</span>)}
       {marks.some(m=>m.kind==='lunar')&&<span className="calendar-lunar-mark">{l?.lunarDay===1?'Mùng 1':'Rằm'}</span>}
      </button>;
     })}
    </div>
    <div className="calendar-legend"><span>Ngày lễ / ngày kỷ niệm</span><span>Tiết khí</span><span>Mùng 1 / rằm</span></div>
    <p className="workspace-note">Các mốc lễ theo lịch, không phải lịch nghỉ chính thức của từng năm. Tết và Quốc khánh có ngày nghỉ liền kề theo thông báo hằng năm.</p>
   </section>
   <aside className="surface-card reading-panel no-print">
    <div className="eyebrow">CHI TIẾT NGÀY</div>
    <h2 className="display-small" style={{fontSize:30,margin:'10px 0'}}>{selected.getDate()+'/'+(selected.getMonth()+1)+'/'+selected.getFullYear()}</h2>
    <p className="lead">Âm lịch: <strong>{lunar?(lunar.lunarDay+'/'+lunar.lunarMonth+'/'+lunar.lunarYear+(lunar.isLeapMonth?' (tháng nhuận)':'')):'—'}</strong></p>
    <p>{dayMarks(selected.getFullYear(),selected.getMonth()+1,selected.getDate(),terms).map(m=>m.label).join(' · ')}</p><div className="calendar-facts">
     <div><span>Năm Can Chi</span><strong>{ganZhiVi(ganZhi?.year)}</strong></div>
     <div><span>Tháng Can Chi (tiết khí, tham khảo)</span><strong>{ganZhiVi(ganZhi?.month)}</strong></div>
     <div><span>Ngày Can Chi</span><strong>{ganZhiVi(ganZhi?.day)}</strong></div>
     <div><span>Giờ giao tiết (UTC+7)</span><strong>{selectedTerms.length?selectedTerms.map(t=>t.name+' · '+t.clock).join(', '):'Không có mốc giao tiết'}</strong></div>
    </div>
    <p className="workspace-note">Ngày lễ: Điều 112 Bộ luật Lao động 2019; không thay thế thông báo ngày nghỉ từng năm.</p><div className="study-notice">Ngày âm và năm Can Chi sử dụng lịch Việt Nam UTC+7 (1900–2050). Giờ giao tiết lấy từ lunar-javascript 1.7.7, quy đổi UTC+7 và làm tròn đến phút. Sai số mô hình lịch sử có thể ảnh hưởng những mốc sát nửa đêm. Lịch lịch sử áp dụng quy ước UTC+7 cố định.</div>{calendarUncertainty(selected.getFullYear(),selected.getMonth()+1,selected.getDate())&&<p className="study-notice">{calendarUncertainty(selected.getFullYear(),selected.getMonth()+1,selected.getDate())}</p>}
    <div style={{marginTop:15,display:'flex',gap:8,flexWrap:'wrap'}}>
     <Link className="action-outline" href="/thien-ky">Thiên Kỷ →</Link>
     <Link className="action-outline" href="/chart">Lập lá số →</Link>
    </div>
   </aside>
  </div>
 </main>;
}
