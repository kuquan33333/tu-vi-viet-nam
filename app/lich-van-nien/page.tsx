'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {Solar} from 'lunar-javascript';
import {solarToLunarVN} from '@/lib/ziwei/lunar-solar';
const DAYS=['T2','T3','T4','T5','T6','T7','CN'];
const HOLIDAYS:Record<string,string>={'1-1':'Tết Dương lịch','4-30':'Ngày Giải phóng miền Nam','5-1':'Quốc tế Lao động','9-2':'Quốc khánh'};
const date=(y:number,m:number,d:number)=>new Date(y,m-1,d);
export default function CalendarPage(){
 const today=new Date();
 const [year,setYear]=useState(today.getFullYear());
 const [month,setMonth]=useState(today.getMonth()+1);
 const [selected,setSelected]=useState(date(today.getFullYear(),today.getMonth()+1,today.getDate()));
 const days=useMemo(()=>{
  const offset=(date(year,month,1).getDay()+6)%7;
  const count=Math.ceil((offset+new Date(year,month,0).getDate())/7)*7;
  return Array.from({length:count},(_,i)=>{
   const d=date(year,month,i-offset+1);
   return {d,within:d.getMonth()===month-1,lunar:solarToLunarVN(d.getFullYear(),d.getMonth()+1,d.getDate())};
  });
 },[year,month]);
 const lunar=useMemo(()=>solarToLunarVN(selected.getFullYear(),selected.getMonth()+1,selected.getDate()),[selected]);
 const ganZhi=useMemo(()=>{
  try {
   const l=Solar.fromYmd(selected.getFullYear(),selected.getMonth()+1,selected.getDate()).getLunar();
   // lunar-javascript exposes Gan/Zhi methods under version-specific names.
   // Resolve conservatively; never fabricate values if the current build lacks them.
   const object=l as unknown as Record<string,unknown>;
   const call=(name:string):string => {
    const fn=object[name];if(typeof fn!=='function')return '';
    try{const value=(fn as (this:typeof l)=>unknown).call(l);return typeof value==='string'?value:'';}
    catch{return '';}
   };
   const pair=(composite:string,gan:string,zhi:string)=>call(composite)||(call(gan)+call(zhi))||'—';
   return {
    year:pair('getYearInGanZhi','getYearGan','getYearZhi'),
    month:pair('getMonthInGanZhi','getMonthGan','getMonthZhi'),
    day:pair('getDayInGanZhi','getDayGan','getDayZhi'),
    term:call('getJieQi')||call('getJie')||call('getQi')
   };
  } catch{return null;}
 },[selected]);
 function shift(n:number){
  const d=date(year,month+n,1);if(d.getFullYear()<1900||d.getFullYear()>2050)return;
  setYear(d.getFullYear());setMonth(d.getMonth()+1);setSelected(d);
 }
 return <main className="site-wrap page-content">
  <div className="tool-hero"><div className="eyebrow">LỊCH PHÁP VIỆT NAM</div><h1 className="display-small">Lịch Vạn Niên</h1>
   <p className="lead" style={{maxWidth:750}}>Tra cứu ngày Dương lịch, Âm lịch, Can Chi và tiết khí trong phạm vi 1900–2050. Không đưa ra kết luận ngày tốt/xấu không có căn cứ thuật toán.</p>
  </div>
  <div className="workspace-layout">
   <section className="surface-card" style={{padding:18}}>
    <div className="calendar-toolbar">
     <h2 className="display-small" style={{fontSize:24}}>Tháng {month} / {year}</h2>
     <div style={{display:'flex',gap:6}}>
      <button className="action-outline" type="button" onClick={()=>shift(-1)} aria-label="Tháng trước">‹</button>
      <button className="action-outline" type="button" onClick={()=>{const n=new Date();setYear(n.getFullYear());setMonth(n.getMonth()+1);setSelected(n);}}>Hôm nay</button>
      <button className="action-outline" type="button" onClick={()=>shift(1)} aria-label="Tháng sau">›</button>
     </div>
    </div>
    <div className="calendar-month-grid" role="grid" aria-label="Lịch tháng">
     {DAYS.map(d=><div className="calendar-week" key={d}>{d}</div>)}
     {days.map(({d,within,lunar:l},i)=>{
      const chosen=selected.toDateString()===d.toDateString();
      const holiday=(l&&l.lunarDay===1&&l.lunarMonth===1?'Tết':l&&l.lunarDay===15&&l.lunarMonth===8?'Trung Thu':HOLIDAYS[(d.getMonth()+1)+'-'+d.getDate()]||'');
      return <button type="button" role="gridcell" aria-selected={chosen} key={i}
       className={'calendar-day'+(!within?' outside':'')+(chosen?' selected':'')+(today.toDateString()===d.toDateString()?' today':'')}
       onClick={()=>{setSelected(d);if(!within){setMonth(d.getMonth()+1);setYear(d.getFullYear());}}}>
       <span className="solar-day">{d.getDate()}</span>
       <span className="lunar-day">{l?(l.lunarDay===1?l.lunarDay+'/'+l.lunarMonth:l.lunarDay+' âm'):'—'}</span>
       {holiday&&<span className="calendar-holiday">{holiday}</span>}
      </button>;
     })}
    </div>
   </section>
   <aside className="surface-card reading-panel">
    <div className="eyebrow">CHI TIẾT NGÀY</div>
    <h2 className="display-small" style={{fontSize:30,margin:'10px 0'}}>{selected.toLocaleDateString('vi-VN')}</h2>
    <p className="lead">Âm lịch: <strong>{lunar?(lunar.lunarDay+'/'+lunar.lunarMonth+'/'+lunar.lunarYear+(lunar.isLeapMonth?' (tháng nhuận)':'')):'—'}</strong></p>
    <div className="calendar-facts">
     <div><span>Năm Can Chi</span><strong>{ganZhi?.year||'—'}</strong></div>
     <div><span>Tháng Can Chi</span><strong>{ganZhi?.month||'—'}</strong></div>
     <div><span>Ngày Can Chi</span><strong>{ganZhi?.day||'—'}</strong></div>
     <div><span>Tiết khí tham khảo</span><strong>{ganZhi?.term||'Không phải ngày giao tiết'}</strong></div>
    </div>
    <div className="study-notice">Can Chi và tiết khí hiển thị theo bộ lịch hiện có của dự án; tại thời điểm chuyển tiết cần đối chiếu nguồn lịch pháp chuyên môn.</div>
    <div style={{marginTop:15,display:'flex',gap:8,flexWrap:'wrap'}}>
     <Link className="action-outline" href="/thien-ky">Thiên Kỷ ↗</Link>
     <Link className="action-outline" href="/chart">Lập lá số ↗</Link>
    </div>
   </aside>
  </div>
 </main>;
}
