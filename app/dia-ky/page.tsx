'use client';

import {useEffect,useMemo,useState} from 'react';
import TriadNav from '@/components/TriadNav';
import XuanKongGIS from '@/components/XuanKongGIS';
import {
 DIRECTIONS, normalizeDegree, mountainAt, directionAt, kuaFromYear,
 directionName, directionCategory, type Gender
} from '@/lib/triad/fengshui';

type Tab='compass'|'battrach'|'xuan'|'land';
const LAND_FORMS=[
 {title:'Minh đường',meaning:'Khoảng trống phía trước trong cách đọc hình thế truyền thống.',check:'Khoảng không gian trước vị trí khảo sát thông thoáng, không bị chắn sát mặt tiền.'},
 {title:'Hậu chẩm',meaning:'Thế tựa phía sau được miêu tả trong nhiều trường phái hình thế.',check:'Có điểm tựa hợp lý, không chắn lối thoát hiểm hay thông gió.'},
 {title:'Tả Thanh Long – Hữu Bạch Hổ',meaning:'Hai phía bên trái và phải khi nhìn theo hướng mặt tiền; cách luận khác nhau tùy tài liệu.',check:'Hai phía có bố cục cân bằng, không gây nguy hiểm hoặc mất ánh sáng.'},
 {title:'Thủy khẩu',meaning:'Hướng nước vào, ra hoặc thế thoát nước trong ngôn ngữ phong thủy cổ.',check:'Nền thoát nước tốt, không úng ngập và không bị rủi ro lũ.'},
 {title:'Long mạch – Sơn thế',meaning:'Phương pháp mô tả địa hình, dòng núi và địa thế trong thuật phong thủy.',check:'Đánh giá địa chất, nguy cơ sạt lở bằng dữ liệu kỹ thuật độc lập.'},
 {title:'Hướng và tọa',meaning:'Hướng là mặt nhìn ra, tọa là phía đối diện lệch 180°.',check:'Đo hướng nhà tại vị trí phù hợp và đối chiếu phương pháp đo.'},
];
function Compass({degree}:{degree:number}) {
 const center=155,rad=128;
 const ticks=Array.from({length:24},(_,i)=>{
  const angle=i*15*Math.PI/180;
  return {x1:center+Math.sin(angle)*112,y1:center-Math.cos(angle)*112,x2:center+Math.sin(angle)*(i%3===0?126:121),y2:center-Math.cos(angle)*(i%3===0?126:121)};
 });
 return <svg className="study-compass" role="img" aria-label={'La bàn '+degree+' độ'} viewBox="0 0 310 310">
  <circle cx={center} cy={center} r={145} fill="var(--bg-0)" stroke="var(--ac-bdr)" strokeWidth="2"/>
  <circle cx={center} cy={center} r={105} fill="none" stroke="var(--ac-bdr)" strokeWidth="1"/>
  <circle cx={center} cy={center} r={81} fill="none" stroke="var(--ac-bdr)" strokeWidth="1"/>
  {ticks.map((t,i)=><line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--ac)" strokeWidth={i%3===0?2.2:1}/>)}
  {DIRECTIONS.map(d=>{
   const a=d.degree*Math.PI/180;
   return <text key={d.key} x={center+Math.sin(a)*92} y={center-Math.cos(a)*92+5} fill="var(--tx-2)" fontSize="14" fontWeight="700" textAnchor="middle">{d.key==='N'?'B':d.key==='NE'?'ĐB':d.key==='E'?'Đ':d.key==='SE'?'ĐN':d.key==='S'?'N':d.key==='SW'?'TN':d.key==='W'?'T':'TB'}</text>;
  })}
  <g transform={'rotate('+degree+' '+center+' '+center+')'}>
   <path d="M155 38 L142 164 L155 149 L168 164 Z" fill="#bd6c32" opacity=".95"/>
   <path d="M155 38 L155 149 L168 164 Z" fill="var(--ac)"/>
  </g>
  <circle cx={center} cy={center} r={10} fill="var(--ac)" stroke="var(--bg-page)" strokeWidth="3"/>
  <text x={center} y="198" fontSize="12" fontWeight="700" fill="var(--ac-dim)" textAnchor="middle">{Math.round(degree*10)/10}°</text>
 </svg>;
}
function CompassPanel(){
 const [degree,setDegree]=useState(180);
 const [active,setActive]=useState(false);
 const [status,setStatus]=useState('Nhập số độ thủ công hoặc xin quyền cảm biến la bàn.');
 const mountain=mountainAt(degree),dir=directionAt(degree);
 const sittingDegree=normalizeDegree(degree+180),sittingMountain=mountainAt(sittingDegree),sittingDir=directionAt(sittingDegree);
 useEffect(()=>{
  if(!active)return;
  function onAngle(ev:DeviceOrientationEvent){
   const specific=(ev as DeviceOrientationEvent & {webkitCompassHeading?:number}).webkitCompassHeading;
   if(typeof specific==='number'&&Number.isFinite(specific)){
    setDegree(Math.round(normalizeDegree(specific)*10)/10);
    setStatus('Đang đọc hướng từ cảm biến iPhone. Nên hiệu chuẩn bằng la bàn vật lý.');
   }else if(ev.absolute&&typeof ev.alpha==='number'){
    setDegree(Math.round(normalizeDegree(360-ev.alpha)*10)/10);
    setStatus('Góc từ cảm biến tuyệt đối; độ chính xác tùy thiết bị và hệ tọa độ.');
   }else setStatus('Thiết bị không cung cấp góc la bàn tuyệt đối. Hãy nhập số độ thủ công.');
  }
  window.addEventListener('deviceorientation',onAngle);
  return ()=>window.removeEventListener('deviceorientation',onAngle);
 },[active]);
 async function enableSensor(){
  try{
   const de=window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {requestPermission?:()=>Promise<string>};
   if(!de){setStatus('Trình duyệt này không hỗ trợ cảm biến hướng.');return;}
   if(typeof de.requestPermission==='function'){
    const result=await de.requestPermission();
    if(result!=='granted'){setStatus('Quyền cảm biến đã bị từ chối. Bạn vẫn có thể nhập độ thủ công.');return;}
   }
   setActive(true);
   setStatus('Đã bật cảm biến. Di chuyển điện thoại theo hướng mặt tiền để xem độ.');
  }catch{setStatus('Không thể kích hoạt la bàn. Sử dụng nhập độ thủ công.');}
 }
 return <div className="study-grid">
  <section className="study-card">
   <h2>La Kinh 24 sơn hướng</h2>
   <Compass degree={degree}/>
   <div className="study-picks" style={{marginBottom:14}}>
    <div><div className="study-muted">Hướng (mặt nhìn ra)</div><strong>{dir.name} · {mountain.name}</strong> · {degree.toFixed(1)}°</div>
    <div><div className="study-muted">Tọa (phía đối diện)</div><strong style={{color:'var(--ac-dim)'}}>{sittingDir.name} · {sittingMountain.name}</strong> · {sittingDegree.toFixed(1)}°</div>
   </div>
   <label className="study-label" htmlFor="degree-number">Hướng đo (0–359,9°)</label>
   <input id="degree-number" className="study-input" type="number" min={0} max={359.9} step={0.1} value={degree}
     onChange={e=>setDegree(normalizeDegree(Number(e.target.value)||0))}/>
   <input className="study-slider" aria-label="Thay đổi góc hướng" type="range" min="0" max="359.5" step=".5" value={degree} onChange={e=>setDegree(Number(e.target.value))}/>
   <div className="study-actions" style={{marginTop:10}}>
    <button type="button" className="study-btn" onClick={enableSensor} disabled={active}>{active?'Cảm biến đã bật':'⌖ Bật la bàn điện thoại'}</button>
    {active&&<button type="button" className="study-btn secondary" onClick={()=>setActive(false)}>Dừng cảm biến</button>}
   </div>
   <div className="study-notice">{status} Góc 0° = Bắc, 90° = Đông, 180° = Nam. Ngưỡng ranh sơn 7,5°; kết quả tại ranh giới có thể đổi vì sai số cảm biến.</div>
  </section>
  <section className="study-card">
   <h2>Tra cứu 24 sơn</h2>
   <p>Chọn một sơn để xoay la bàn đến trục giữa của cung 15 độ.</p>
   <div className="study-point-list" style={{maxHeight:430}}>
    {Array.from({length:24},(_,i)=>mountainAt(i*15)).map((m)=><button key={m.index} type="button"
      className={mountain.index===m.index?'active':''} onClick={()=>setDegree(m.center)}>
      <strong>{m.name}</strong> <small>{m.center}° · {directionAt(m.center).name}</small>
     </button>)}
   </div>
   <div className="study-notice">
    Sơ đồ sơn hướng là hệ tọa độ truyền thống, không phải công cụ đo đạc địa chính. Hãy dùng la bàn chuẩn, số đo thực địa và tư vấn kỹ thuật trước khi xây dựng.
   </div>
  </section>
 </div>;
}
function BattrachPanel(){
 const [year,setYear]=useState(1990);
 const [gender,setGender]=useState<Gender>('nam');
 const [angle,setAngle]=useState(180);
 const kua=useMemo(()=>{try{return kuaFromYear(year,gender);}catch{return null;}},[year,gender]);
 const direction=directionAt(angle);
 const good=kua?Object.values(kua.good).includes(direction.key):false;
 return <div className="study-grid">
  <section className="study-card">
   <h2>Cung phi Bát Trạch</h2>
   <p>Nhập năm quy đổi theo Bát Trạch (năm sau tiết Lập Xuân) và giới tính theo công thức truyền thống.</p>
   <div className="study-picks">
    <label className="study-label">Năm Bát Trạch
     <input className="study-input" type="number" min={1900} max={2099} value={year} onChange={e=>setYear(Number(e.target.value))}/>
    </label>
    <label className="study-label">Quy ước giới tính truyền thống
     <select className="study-input" value={gender} onChange={e=>setGender(e.target.value as Gender)}>
      <option value="nam">Nam</option><option value="nu">Nữ</option>
     </select>
    </label>
   </div>
   {!kua?<p className="study-notice">Vui lòng nhập năm trong khoảng 1900–2099.</p>:<>
    <div className="study-stat" style={{marginTop:18}}>Cung {kua.name} · {kua.number}</div>
    <p><strong>{kua.group} mệnh</strong> — Phục vị tại {directionName(kua.home)}.</p>
    <h3 style={{marginTop:20}}>Bốn hướng cát theo Bát Trạch</h3>
    <div className="study-picks">
     {Object.entries(kua.good).map(([category,dir])=><div className="study-direction good" key={category}>
      <span>{category}</span><strong>{directionName(dir)}</strong>
     </div>)}
    </div>
    <div className="study-notice">Ngày sinh gần Lập Xuân cần kiểm tra thời điểm giao tiết thực tế để chọn đúng năm phong thủy. Không áp dụng một công thức niên mệnh chung cho mọi trường phái.</div>
   </>}
  </section>
  <section className="study-card">
   <h2>Đối chiếu với hướng nhà</h2>
   <label className="study-label">Số độ mặt tiền: {angle}° · {direction.name}</label>
   <input className="study-slider" type="range" min="0" max="359" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/>
   <input className="study-input" type="number" min={0} max={359} value={angle}
     onChange={e=>setAngle(Math.round(normalizeDegree(Number(e.target.value)||0)))}/>
   {kua&&<div className="study-card" style={{padding:15,marginTop:17,background:'var(--ac-bg)'}}>
    <div className="study-muted">Kết quả so sánh</div>
    <h2 style={{fontSize:23,margin:'7px 0'}}>{direction.name} – {mountainAt(angle).name}</h2>
    <p style={{margin:0}}>{good?'Nhóm cát: ':'Không nằm trong bốn hướng cát: '}<strong>{directionCategory(kua,direction.key)}</strong>.</p>
   </div>}
   <h3 style={{marginTop:24}}>Sơ đồ 8 hướng</h3>
   <div className="study-palace-grid">
    {(['NW','N','NE','W','C','E','SW','S','SE'] as const).map(d=>
     <div key={d} className="study-palace" style={{minHeight:72,background:d==='C'?'var(--ac-bg)':'var(--bg-0)',padding:7}}>
      {d==='C'?<><strong>{kua?.name||'—'}</strong><span className="study-muted">Trung tâm</span></>:
       <><strong>{directionName(d)}</strong><span className="study-muted">{kua?directionCategory(kua,d):''}</span></>}
     </div>)}
   </div>
   <p className="study-muted">Sơ đồ quay theo phương Bắc ở phía trên, chỉ phân loại theo bảng Bát Trạch; không thay cho khảo sát nhà ở hay quy chuẩn xây dựng.</p>
  </section>
 </div>;
}
function LandPanel(){
 const [checked,setChecked]=useState<boolean[]>(()=>LAND_FORMS.map(()=>false));
 const n=checked.filter(Boolean).length;
 return <>
  <div className="study-grid three">
   {LAND_FORMS.map((it,i)=><section className="study-card" key={it.title}>
    <div className="study-pill">Khái niệm {i+1}/6</div>
    <h2 style={{marginTop:12}}>{it.title}</h2>
    <p>{it.meaning}</p>
    <label style={{display:'flex',alignItems:'start',gap:10,marginTop:15,fontSize:12,lineHeight:1.7,color:'var(--tx-2)',cursor:'pointer'}}>
     <input type="checkbox" checked={checked[i]} onChange={e=>setChecked(old=>old.map((n,j)=>j===i?e.target.checked:n))} style={{marginTop:4,accentColor:'var(--ac)'}}/>
     <span>{it.check}</span>
    </label>
   </section>)}
  </div>
  <div className="study-card">
   <h2>Phiếu khảo sát thực địa</h2>
   <p>Đã đánh dấu {n}/{LAND_FORMS.length} nội dung. Các ô chỉ giúp ghi nhớ việc cần quan sát, không tạo điểm phong thủy tự động hay kết luận về đất.</p>
   <div className="study-actions">
    <button className="study-btn secondary" type="button" onClick={()=>setChecked(LAND_FORMS.map(()=>false))}>Làm lại phiếu</button>
    <button className="study-btn" type="button" onClick={()=>window.print()}>In / lưu PDF khảo sát</button>
   </div>
   <div className="study-notice">Các khái niệm phong thủy chỉ được mô tả theo truyền thống. Với địa hình thật, bắt buộc đánh giá địa chất, độ dốc, ngập lụt, cấp thoát nước, pháp lý và tiêu chuẩn xây dựng bằng chuyên môn kỹ thuật.</div>
  </div>
 </>;
}
export default function DiaKyPage(){
 const [tab,setTab]=useState<Tab>('compass');
 return <div className="study-shell">
  <TriadNav active="dia-ky"/>
  <main className="study-container">
   <div className="study-hero">
    <div className="study-kicker">Hệ thống tri thức · Địa Kỷ</div>
    <h1 className="study-title">Địa Kỷ · Phương hướng và hình thế</h1>
    <p className="study-lead">La Kinh 24 sơn, Bát Trạch, Huyền Không Phi Tinh và bản đồ tọa độ tùy chọn, cùng phiếu khảo sát địa hình theo các thuật ngữ phong thủy truyền thống.</p>
    <div className="study-tabs" role="tablist" aria-label="Phân hệ Địa Kỷ">
     <button className={'study-tab'+(tab==='compass'?' active':'')} aria-selected={tab==='compass'} role="tab" onClick={()=>setTab('compass')}>⌖ La Kinh 24 sơn</button>
     <button className={'study-tab'+(tab==='battrach'?' active':'')} aria-selected={tab==='battrach'} role="tab" onClick={()=>setTab('battrach')}>◈ Bát Trạch</button>
     <button className={'study-tab'+(tab==='xuan'?' active':'')} aria-selected={tab==='xuan'} role="tab" onClick={()=>setTab('xuan')}>Huyền Không · GIS</button>
     <button className={'study-tab'+(tab==='land'?' active':'')} aria-selected={tab==='land'} role="tab" onClick={()=>setTab('land')}>△ Sơn xuyên hình thế</button>
    </div>
   </div>
   {tab==='compass'?<CompassPanel/>:tab==='battrach'?<BattrachPanel/>:tab==='xuan'?<XuanKongGIS/>:<LandPanel/>}
   <div className="study-card" style={{marginTop:16}}>
    <h2>Nguồn tham khảo và phương pháp</h2>
    <p>Bộ tính Bát Trạch và phân nhóm hướng được đối chiếu với <a href="https://github.com/aec-platform/phong-thuy-corpus" target="_blank" rel="noopener noreferrer">phong-thuy-corpus</a> (code MIT, dữ liệu CC BY 4.0) và bảng hướng Bát Trạch truyền thống. 24 sơn được tính bằng 24 cung liên tiếp, mỗi cung rộng 15°.</p>
    <p>Một cung hướng cát theo phong thủy không đồng nghĩa nhà ở đạt yêu cầu an toàn hay hợp pháp. Công cụ không tự đánh giá “long mạch”, không thay thế bản đồ đo đạc.</p>
   </div>
   <footer className="study-footer">Địa Kỷ · Công cụ tham khảo văn hóa, kiến trúc và địa lý. Không dùng làm căn cứ pháp lý, địa chính hoặc xây dựng.</footer>
  </main>
 </div>;
}
