'use client';
import {useEffect,useState} from 'react';
import type {HousePeriodChart} from '@/lib/triad/xuan-khong';
const now=new Date(Date.now()+7*3600000);
const currentDate=[now.getUTCFullYear(),String(now.getUTCMonth()+1).padStart(2,'0'),String(now.getUTCDate()).padStart(2,'0')].join('-');
export default function XuanKongGIS(){
 const [day,setDay]=useState(currentDate),[bearing,setBearing]=useState('180');
 const [report,setReport]=useState<HousePeriodChart|null>(null),[error,setError]=useState('');
 const [lat,setLat]=useState(''),[lon,setLon]=useState(''),[mapConsent,setMapConsent]=useState(false);
 const [plan,setPlan]=useState<string|null>(null);
 useEffect(()=>()=>{if(plan)URL.revokeObjectURL(plan)},[plan]);
 async function calculate(){
  setError('');try{
   const [y,m,d]=day.split('-').map(Number);
   const {calculateHouseChart}=await import('@/lib/triad/xuan-khong');
   setReport(calculateHouseChart(y,m,d,Number(bearing)));
  }catch(e){setReport(null);setError(e instanceof Error?e.message:'Không thể tính Huyền Không');}
 }
 const latitude=Number(lat),longitude=Number(lon);
 const valid=lat.trim()!==''&&lon.trim()!==''&&Number.isFinite(latitude)&&Number.isFinite(longitude)&&Math.abs(latitude)<=90&&Math.abs(longitude)<=180;
 const area=.004;
 const osm=valid?('https://www.openstreetmap.org/export/embed.html?bbox='+encodeURIComponent([longitude-area,latitude-area,longitude+area,latitude+area].join(','))+'&layer=mapnik&marker='+encodeURIComponent(latitude+','+longitude)):'';
 const positions=['Tốn · Đông Nam','Ly · Nam','Khôn · Tây Nam','Chấn · Đông','Trung tâm','Đoài · Tây','Cấn · Đông Bắc','Khảm · Bắc','Càn · Tây Bắc'];
 return <section aria-label="Huyền Không Phi Tinh và bản đồ tham khảo">
  <div className="study-card">
   <h2>Huyền Không Phi Tinh · Vận/Sơn/Hướng bàn</h2>
   <p className="study-muted">Tính cửu cung, 24 sơn, 3 lớp sao theo Hạ quái (không xét kiêm hướng/thế quái). Năm đổi vận theo Lập Xuân UTC+7, không mặc định Tết Âm lịch.</p>
   <div className="study-picks" style={{margin:'15px 0'}}>
    <label className="study-label">Ngày xây hoặc nhập trạch (1901–2049)<input className="study-input" type="date" min="1901-01-01" max="2049-12-31" value={day} onChange={e=>setDay(e.target.value)}/></label>
    <label className="study-label">Độ hướng mặt nhận khí (0–359,9°)<input className="study-input" type="number" step=".1" min="0" max="359.9" value={bearing} onChange={e=>setBearing(e.target.value)}/></label>
    <button className="study-btn" type="button" onClick={()=>void calculate()}>Lập Huyền Không bàn</button>
   </div>
   {error&&<p role="alert" className="study-notice">{error}</p>}
   {report&&<>
    <div className="study-picks" style={{marginBottom:16}}>
     <div><strong>Vận {report.period}</strong><p>Thời điểm Lập Xuân {report.liChun} (UTC+7)</p></div>
     <div><strong>Tọa {report.input.sitting} · Hướng {report.input.facing}</strong><p>Góc {report.input.bearing}°</p></div>
     <div><strong>Cấu trúc truyền thống</strong><p>{report.isWangShanWangXiang?'Vượng sơn vượng hướng':report.isShangShanXiaShui?'Thượng sơn hạ thủy':'Không khớp hai mô thức trên'}</p></div>
    </div>
    {report.boundaryWarning&&<p role="alert" className="study-notice">Góc đang gần ranh 24 sơn (dưới 1,5°). Cần đo lại bằng thiết bị phù hợp; không tự quy kiêm hướng.</p>}
    <div className="study-palace-grid" role="group" aria-label="Cửu cung Vận Sơn Hướng">
     {report.palaces.map(p=><div key={p.code} className="study-palace" style={{minWidth:0}}>
      <strong className="top">{p.name}</strong><div><strong>Vận {p.periodStar}</strong></div>
      <div>Sơn {p.mountainStar} · Hướng {p.waterStar}</div>
     </div>)}
    </div>
   </>}
   <p className="study-notice" style={{marginTop:12}}>Đây là công thức **Hạ quái một trường phái**, không tự động xử lý kiêm hướng/thế quái hoặc luận đoán tài lộc, bệnh tật. Tên gọi “vượng” là thuật ngữ truyền thống, không phải bằng chứng về tác động thực tế. Nguồn: <a href="https://github.com/xudaniel/mingli-fengshui" target="_blank" rel="noopener noreferrer">mingli-fengshui MIT</a>.</p>
  </div>
  <div className="study-grid">
   <section className="study-card">
    <h2>Bản đồ tọa độ tham khảo · OpenStreetMap</h2>
    <p className="study-muted">Chỉ để nhận diện vị trí địa lý, không có dữ liệu địa chính, ranh thửa hay đánh giá đất xây dựng. Không đọc vị trí GPS của bạn.</p>
    <div className="study-picks">
     <label className="study-label">Vĩ độ<input type="number" className="study-input" min="-90" max="90" step=".000001" value={lat} onChange={e=>{setLat(e.target.value);setMapConsent(false)}} placeholder="VD 16.0678"/></label>
     <label className="study-label">Kinh độ<input type="number" className="study-input" min="-180" max="180" step=".000001" value={lon} onChange={e=>{setLon(e.target.value);setMapConsent(false)}} placeholder="VD 108.2208"/></label>
    </div>
    {valid&&<div className="study-actions" style={{marginTop:12}}>
     <button type="button" className="study-btn" onClick={()=>setMapConsent(true)}>Đồng ý tải bản đồ ngoài</button>
     <a className="study-btn secondary" href={'https://www.openstreetmap.org/?mlat='+latitude+'&mlon='+longitude+'#map=16/'+latitude+'/'+longitude} target="_blank" rel="noopener noreferrer">Mở OpenStreetMap</a>
    </div>}
    {mapConsent&&valid&&<iframe title="Bản đồ OpenStreetMap theo tọa độ đã nhập" src={osm} loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin" style={{width:'100%',height:390,border:'1px solid var(--ac-bdr)',borderRadius:12,marginTop:12}}/>}
    <p className="study-muted" style={{marginTop:10}}>© <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap contributors</a> · ODbL. Bản đồ chỉ tải sau khi bạn bấm đồng ý; nhà cung cấp có thể nhận IP và thông tin kết nối.</p>
   </section>
   <section className="study-card">
    <h2>Sơ đồ nhà và lớp lưới 9 cung</h2>
    <p className="study-muted">Tải ảnh mặt bằng từ thiết bị; ảnh chỉ hiển thị cục bộ, không gửi lên máy chủ. **Mặc định cạnh trên ảnh phải chỉ về Bắc**; không coi lưới minh họa là dữ liệu đo GIS.</p>
    <label className="study-label">Ảnh mặt bằng<input className="study-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{
     const f=e.target.files?.[0];if(f&&f.size<=5000000&&['image/png','image/jpeg','image/webp'].includes(f.type))setPlan(URL.createObjectURL(f));else if(f)setError('Ảnh phải là PNG/JPEG/WebP nhỏ hơn 5MB');
    }}/></label>
    {plan&&<div style={{position:'relative',marginTop:12,overflow:'hidden',borderRadius:10}}>
     <img alt="Sơ đồ mặt bằng do bạn chọn, không gửi lên mạng" src={plan} style={{display:'block',width:'100%',height:'auto',maxHeight:440,objectFit:'contain'}}/>
     <div role="img" aria-label="Lưới cửu cung Bắc ở trên ảnh" style={{position:'absolute',inset:0,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gridTemplateRows:'repeat(3,1fr)',pointerEvents:'none'}}>
      {positions.map((pos,i)=><div key={pos} style={{border:'1px solid var(--white)',background:'var(--overlay)',display:'grid',placeItems:'center',color:'var(--white)',fontSize:11,textShadow: 'none',textAlign:'center',padding:3}}>{pos}{report?' · '+report.palaces[i].periodStar:''}</div>)}
     </div>
    </div>}
    {plan&&<button type="button" className="study-btn secondary" style={{marginTop:10}} onClick={()=>setPlan(null)}>Bỏ ảnh mặt bằng</button>}
   </section>
  </div>
 </section>;
}
