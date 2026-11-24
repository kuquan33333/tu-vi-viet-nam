'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import BirthForm,{type BirthFormState} from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import TimeNav,{type TimeView} from '@/components/TimeNav';
import {generateChart} from '@/lib/ziwei/algorithm';
import {uncertainBirthOptions} from '@/lib/ziwei/share';
import {STAR_DESCRIPTIONS,BRANCHES} from '@/lib/ziwei/constants';
import {chartLabel,getPalaceFact,getStudyReading,READING_NOTICE} from '@/lib/ziwei/client-reading';
import {saveProfile,takeQueuedProfile} from '@/lib/ziwei/profile-storage';
import type {BirthInfo,ZiweiChart,Palace,Star} from '@/lib/ziwei/types';

export default function ChartPage(){
 const [options,setOptions]=useState<ZiweiChart[]>([]);
 const [chart,setChart]=useState<ZiweiChart|null>(null);
 const [palace,setPalace]=useState<Palace|null>(null);
 const [star,setStar]=useState<Star|null>(null);
 const [view,setView]=useState<TimeView>('mingpan');
 const [year,setYear]=useState(new Date().getFullYear());
 const [feedback,setFeedback]=useState('');
 useEffect(()=>{
  const queued=takeQueuedProfile();if(!queued)return;
  try {
   const next=generateChart(queued.birth);
   setChart(next);setPalace(next.palaces.find(p=>p.branch===next.mingGongBranch)||null);
  } catch {setFeedback('Không thể mở hồ sơ đã lưu, vui lòng thử nhập lại.');}
 },[]);
 function onUncertain(form:BirthFormState){try{setOptions(uncertainBirthOptions(form).map(b=>generateChart(b)));setFeedback('');}catch{setFeedback('Không thể tạo các phương án; kiểm tra ngày và nơi sinh.');}}
 function onGenerated(birth:BirthInfo){
  setOptions([]);
  try{
   const next=generateChart(birth);
   setChart(next);setPalace(next.palaces.find(p=>p.branch===next.mingGongBranch)||null);
   setStar(null);setFeedback('');
   window.scrollTo({top:0,behavior:'smooth'});
  }catch{setFeedback('Chưa tính được lá số với dữ liệu vừa nhập. Hãy kiểm tra ngày và giờ sinh.');}
 }
 function save(){
  if(!chart)return;
  try {saveProfile(chart.birthInfo);setFeedback('Đã lưu hồ sơ trên thiết bị này. Mở mục Hồ sơ để xem lại.');}
  catch {setFeedback('Không lưu được. Trình duyệt có thể đang chặn bộ nhớ hoặc đã hết dung lượng.');}
 }
 async function copy(){
  if(!chart)return;
  const text=chartLabel(chart.birthInfo)+'\nNgày sinh: '+chart.birthInfo.day+'/'+chart.birthInfo.month+'/'+chart.birthInfo.year+
  '\nNgũ hành cục: '+chart.wuxingJuName+'\nMệnh tại: '+(chart.palaces.find(p=>p.branch===chart.mingGongBranch)?.name||'Mệnh');
  try {await navigator.clipboard.writeText(text);setFeedback('Đã sao chép tóm tắt vào bộ nhớ tạm.');}
  catch{setFeedback('Trình duyệt không hỗ trợ sao chép. Bạn có thể sử dụng chức năng in.');}
 }
 const shown=chart?(palace||chart.palaces.find(p=>p.branch===chart.mingGongBranch)||null):null;
 const study=chart&&shown?getStudyReading(chart,shown):null;
 return <main className="site-wrap page-content" style={{minHeight:'70dvh'}}>
  {!chart?<div style={{maxWidth:790,margin:'0 auto'}}>
   <div className="tool-hero">
    <div className="eyebrow">TỬ VI ĐẨU SỐ · BÀN MỆNH</div>
    <h1 className="display-small">Lập lá số Tử Vi</h1>
    <p className="lead" style={{maxWidth:680}}>Nhập ngày giờ sinh và nơi sinh để lập bàn 12 cung. Phần tính toán thực hiện trên thiết bị; không cần tài khoản.</p>
   </div>
   <div className="workspace-surface"><BirthForm onSubmit={onGenerated} onUnknownTime={onUncertain}/></div>
   {options.length>0&&<section className="workspace-surface" style={{marginTop:20,padding:16}}><h2>12 phương án chưa xác định</h2><p role="alert" className="study-notice">Giả định ngày an sao không đổi, lần lượt xét 12 chi giờ. Mệnh, Thân, Cục và đại hạn chỉ là khả năng; gần nửa đêm còn có thể đổi ngày. Không lưu phương án nào thành hồ sơ.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:8}}>{options.map(c=><div key={c.birthInfo.hour} className="surface-card" style={{padding:10}}><strong>Giờ {BRANCHES[c.birthInfo.hour]}</strong><p>Mệnh: {BRANCHES[c.mingGongBranch]} · Thân: {BRANCHES[c.shenGongBranch]}</p><p>{c.wuxingJuName}</p><small>{c.palaces.find(p=>p.branch===c.mingGongBranch)?.stars.filter(s=>s.type==='major').map(s=>s.name).join(', ')||'Vô chính diệu'}</small></div>)}</div><button className="action-outline" onClick={()=>setOptions([])}>Đóng phương án</button></section>}
   {feedback&&<p role="status" className="study-notice">{feedback}</p>}
   <div className="home-note" style={{marginTop:23}}>Lưu ý: thông tin trong lá số là cách diễn giải văn hóa truyền thống, không phải khẳng định chính xác về tính cách, tương lai, sức khỏe hay tài chính. Bạn có thể lưu hồ sơ cục bộ sau khi lập xong.</div>
  </div>:
  <>
   <div className="workspace-head">
    <div><div className="eyebrow">BẢN MỆNH · 12 CUNG</div><h1>{chartLabel(chart.birthInfo)}</h1>
     <p style={{color:'var(--tx-3)',fontSize:12,marginTop:5}}>{chart.birthInfo.day}/{chart.birthInfo.month}/{chart.birthInfo.year} · {chart.wuxingJuName} · {chart.birthInfo.gender==='male'?'Nam':'Nữ'}</p>
    </div>
    <div className="site-actions" style={{display:'flex',flexWrap:'wrap',gap:7}}>
     <button className="action-outline" onClick={save}>＋ Lưu lá số</button>
     <button className="action-outline" onClick={copy}>⧉ Sao chép</button>
     <button className="action-outline" onClick={()=>window.print()}>↧ In / PDF</button>
     <button className="action-primary" onClick={()=>{setChart(null);setPalace(null);setStar(null);}}>↶ Lập lại</button>
    </div>
   </div>
   {feedback&&<p role="status" className="study-notice" style={{marginBottom:14}}>{feedback}</p>}
   <div className="workspace-toolbar workspace-surface" style={{padding:'11px 15px'}}>
    <TimeNav chart={chart} view={view} liunianYear={year} onViewChange={setView} onYearChange={setYear}/>
   </div>
   <div className="workspace-layout">
    <section className="workspace-surface" aria-label="Bàn lá số 12 cung">
     <div className="workspace-toolbar"><span className="eyebrow">LÁ SỐ TRỰC QUAN</span><span className="workspace-note">Trên điện thoại, vuốt ngang để xem đủ 12 cung →</span></div>
     <div className="chart-scroll"><ChartBoard chart={chart} view={view} liunianYear={year}
      onPalaceSelect={p=>{setPalace(p);setStar(null);}} onStarSelect={(s,p)=>{setStar(s);setPalace(p);}}
      onSiHuaClick={(name,hua)=>{const p=chart.palaces.find(x=>x.stars.some(s=>s.name===name));if(p){setPalace(p);setStar(p.stars.find(s=>s.name===name)||null);setFeedback('Đang xem '+name+' Hóa '+hua+' trong cung '+p.name+'.');}}}/></div>
    </section>
    <aside className="workspace-surface workspace-aside reading-panel" aria-label="Chi tiết cung và sao">
     <div className="reading-head"><div style={{fontSize:24,color:'var(--ac-dim)'}}>✧</div><div><div className="eyebrow">TRA CỨU CÓ CĂN CỨ</div><h2>{star?star.name:(shown?.name||'Tổng quan')}</h2></div></div>
     {star?<>
      <div className="reading-pills"><span>{star.type==='major'?'Chính tinh':'Phụ tinh'}</span>{star.brightnessRaw&&<span>{star.brightnessRaw}</span>}{star.siHua&&<span>Hóa {star.siHua}</span>}</div>
      <h3>Đặc tính trong tư liệu truyền thống</h3>
      {STAR_DESCRIPTIONS[star.name]?<>
       <p><strong>Từ khóa:</strong> {STAR_DESCRIPTIONS[star.name].keywords}</p>
       <p><strong>Ngũ hành:</strong> {STAR_DESCRIPTIONS[star.name].element}</p>
       <p><strong>Tính chất ghi chép:</strong> {STAR_DESCRIPTIONS[star.name].nature}</p>
      </>:<p>Chưa có nội dung đã kiểm duyệt cho sao này. Có thể xem tên sao và vị trí trên lá số.</p>}
      <button className="action-outline" onClick={()=>setStar(null)} style={{marginTop:5}}>← Xem lại cung {shown?.name}</button>
     </>:study?<>
      <div className="reading-pills"><span>Chi {study.fact.branch}</span>{shown?.isMingGong&&<span>Cung Mệnh</span>}{shown?.isShenGong&&<span>Cung Thân</span>}</div>
      <h3>Các chính tinh tọa thủ</h3>
      {study.intros.length?study.intros.map(s=><div key={s.name} style={{borderBottom:'1px solid var(--bdr)',paddingBottom:12,marginBottom:12}}>
       <strong>{s.name}</strong>{s.brightness&&<span style={{fontSize:11,color:'var(--ac-dim)'}}> · {s.brightness}</span>}
       <p style={{marginTop:6}}>{s.description?.keywords||'Chưa có chú giải được xác minh.'}</p>
      </div>):<p>Vô chính diệu — không có chính tinh trực tiếp trong cung; xem đối cung để tham khảo cấu trúc.</p>}
      {!!study.fact.transformations.length&&<><h3>Tứ Hóa tại cung</h3><p>{study.fact.transformations.join(' · ')}</p></>}
      <h3>Đối cung</h3>
      <p>{study.opposite?.name} ({study.opposite?.branch}) · {study.opposite?.major.join(', ')||'Không có chính tinh'}</p>
      <h3>Tam hợp</h3>
      <p>{study.trine.map(x=>x.name+': '+(x.major.join(', ')||'Vô chính diệu')).join(' · ')}</p>
      <div className="study-notice" style={{marginTop:16}}>Nội dung trên được dựng từ các sao và cung thực tế của lá số, không phải kết quả AI tự tạo.</div>
     </>:null}
     <p className="workspace-note" style={{marginTop:17}}>{READING_NOTICE}</p>
     <Link href="/library" className="section-link">Tra cứu cổ thư liên quan →</Link>
    </aside>
   </div>
   <div className="home-note"><strong style={{color:'var(--tx-0)'}}>Quyền riêng tư:</strong> Lá số không được tự động tải lên máy chủ. Khi bạn chọn “Lưu lá số”, dữ liệu sinh được lưu trong bộ nhớ trình duyệt hiện tại và có thể xóa tại mục <Link href="/ho-so">Hồ sơ</Link>.</div>
  </>}
 </main>;
}
