'use client';
import {useState} from 'react';
import type {HourChart} from '@/lib/triad/qimen-hour';
const now=new Date(Date.now()+7*3600000);
const today=[now.getUTCFullYear(),String(now.getUTCMonth()+1).padStart(2,'0'),String(now.getUTCDate()).padStart(2,'0')].join('-');
export default function TimeQimenTool(){
 const [day,setDay]=useState(today),[clock,setClock]=useState('12:00'),[report,setReport]=useState<HourChart|null>(null);
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function run(){
  setBusy(true);setError('');
  try{
   const [y,m,d]=day.split('-').map(Number),[h,minute]=clock.split(':').map(Number);
   const {calculateHourChart}=await import('@/lib/triad/qimen-hour');
   setReport(calculateHourChart(y,m,d,h,minute));
  }catch(e){setReport(null);setError(e instanceof Error?e.message:'Không thể lập thời gia bàn');}
  finally{setBusy(false);}
 }
 return <section className="study-card" style={{marginBottom:18}} aria-label="Kỳ Môn thời gia Việt Nam">
  <h2>Thời gia Kỳ Môn – Thiên bàn · Địa bàn · Cửu tinh · Bát môn · Bát thần</h2>
  <p className="study-muted">Phép Chia bổ/Chuyển bàn: tự chọn cục theo phù đầu, tiết khí và nhập giờ dân sự UTC+7. Tính hoàn toàn trên thiết bị.</p>
  <div className="study-picks" style={{margin:'15px 0'}}>
   <label className="study-label">Ngày dương lịch<input type="date" className="study-input" value={day} min="1901-01-01" max="2049-12-31" onChange={e=>setDay(e.target.value)}/></label>
   <label className="study-label">Giờ Việt Nam UTC+7<input type="time" className="study-input" value={clock} onChange={e=>setClock(e.target.value)}/></label>
   <button className="study-btn" type="button" onClick={()=>void run()} disabled={busy}>{busy?'Đang tính…':'Lập thời gia bàn'}</button>
  </div>
  {error&&<p role="alert" className="study-notice">{error}</p>}
  {report&&<>
   <div className="study-picks" style={{marginBottom:16}}>
    <div><div className="study-muted">Tiết khí</div><strong>{report.term}</strong><p>Giao tiết: {report.termTime} (UTC+7)</p></div>
    <div><div className="study-muted">Cục – nguyên</div><strong>{report.dun} {report.ju} cục</strong><p>{report.yuan} nguyên · Ngày {report.day} · Giờ {report.hour}</p></div>
    <div><div className="study-muted">Trực Phù / Trực Sử</div><strong>{report.zhifu} ({report.dutyStarPalace}) · {report.zhishi} ({report.dutyDoorPalace})</strong><p>Không vong: {report.voidBranches}</p></div>
   </div>
   <div className="study-palace-grid" role="group" aria-label="Cửu cung chuyển bàn theo giờ">
    {report.palaces.map(p=><div key={p.index} className="study-palace" style={{minWidth:0}}>
     <strong className="top">{p.name} {p.index}</strong>
     <div>Địa {p.dia} · Thiên {p.thien||'—'}</div>
     <div className="stem">{p.sao}</div><div>{p.mon||'Trung cung'}</div><div>{p.than||'—'}</div>
     <small>Ẩn: {p.hidden||'—'} · {p.marks.join(', ')||'Không có dấu'}</small>
    </div>)}
   </div>
   <p className="study-notice">Đây là bảng <strong>thời gia theo một trường phái Chia bổ/Chuyển bàn</strong>, chưa hỗ trợ trọn bộ Trí nhuận, Phi bàn hoặc mọi dị biệt trường phái. Quy tắc giờ Tý muộn 23 giờ đổi trụ ngày. Không dùng kết quả để dự báo như bằng chứng khoa học.</p>
  </>}
  <p className="study-muted" style={{marginTop:13}}>Nguồn engine MIT được cố định commit: <a href="https://github.com/perfhelf/bigfishmarquis-qimen" rel="noopener noreferrer" target="_blank">bigfishmarquis-qimen</a>; phiên bản và giấy phép nằm trong thư mục nguồn dự án. Địa bàn chọn tay bên dưới chỉ để đối chiếu.</p>
 </section>;
}
