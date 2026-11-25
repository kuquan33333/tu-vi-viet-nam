'use client';
import {useEffect,useState,useRef} from 'react';
import Link from 'next/link';
import BirthForm,{type BirthFormState} from '@/components/BirthForm';
import dynamic from 'next/dynamic';
import Icon from '@/components/Icon';
import ChartGrid from '@/components/ui/ChartGrid';
import {starLabel} from '@/components/ui/star-labels';
import './chart-ui.css';
const ShareCard=dynamic(()=>import('@/components/ShareCardCanvas'));
const ChartBoard=dynamic(()=>import('@/components/ChartBoard'),{loading:()=> <p role="status">Đang tải bàn lá số…</p>});
import type {TimeView} from '@/components/TimeNav';
const TimeNav=dynamic(()=>import('@/components/TimeNav'));

import {uncertainBirthOptions} from '@/lib/ziwei/share';
import {STAR_DESCRIPTIONS,BRANCHES} from '@/lib/ziwei/constants';
import {chartLabel,getPalaceFact,getStudyReading,READING_NOTICE} from '@/lib/ziwei/client-reading';
import {saveProfiles,takeQueuedProfile} from '@/lib/ziwei/profile-storage';
import type {BirthInfo,ZiweiChart,Palace,Star} from '@/lib/ziwei/types';

export default function ChartPage(){
 const [options,setOptions]=useState<ZiweiChart[]>([]);
 const [chart,setChart]=useState<ZiweiChart|null>(null);
 const resultHeading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{
  if(!chart)return;
  // Run after React commits the result, not while the submitted form still owns focus.
  resultHeading.current?.focus({preventScroll:true});
  window.scrollTo({top:0,left:0,behavior:'instant'});
 },[chart]);
 const [palace,setPalace]=useState<Palace|null>(null);
 const [star,setStar]=useState<Star|null>(null);
 const [view,setView]=useState<TimeView>('mingpan');
 const [year,setYear]=useState(new Date().getFullYear());
 const [feedback,setFeedback]=useState('');
 const [boardMode,setBoardMode]=useState(false);
 const [detailOpen,setDetailOpen]=useState(false);
 const detailClose=useRef<HTMLButtonElement>(null);
 const trigger=useRef<HTMLElement|null>(null);
 const shareDialog=useRef<HTMLDialogElement>(null);
 const [shareOpen,setShareOpen]=useState(false);
 const [sharing,setSharing]=useState(false);
 const [shareReady,setShareReady]=useState(false);
 const [shareError,setShareError]=useState('');
 function showDetail(p:Palace,s:Star|null=null){
  trigger.current=document.activeElement instanceof HTMLElement?document.activeElement:null;
  setPalace(p);setStar(s);setDetailOpen(true);
  requestAnimationFrame(()=>detailClose.current?.focus());
 }
 function closeDetail(){setDetailOpen(false);setStar(null);requestAnimationFrame(()=>trigger.current?.focus());}
 useEffect(()=>{
  if(!detailOpen)return;
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!shareDialog.current?.open){setDetailOpen(false);setStar(null);requestAnimationFrame(()=>trigger.current?.focus());}};
  window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 },[detailOpen]);
 useEffect(()=>{if(!shareOpen)return;
  if(!shareDialog.current?.open)shareDialog.current?.showModal();
  const root=shareDialog.current;if(!root)return;
  const sync=()=>setShareReady(Boolean(root.querySelector('#share-card')));sync();
  const observer=new MutationObserver(sync);observer.observe(root,{childList:true,subtree:true});return()=>observer.disconnect();},[shareOpen]);
 async function downloadImage(){
  setSharing(true);setShareError('');
  try{const {captureShareCard,downloadDataURL}=await import('@/components/ShareCardCanvas');await document.fonts.ready;const png=await captureShareCard();if(!png)throw new Error('image');downloadDataURL(png,'La-so-tu-vi.png');}
  catch{setShareError('Chưa tạo được ảnh. Vui lòng thử lại hoặc dùng In / PDF A4.');}
  finally{setSharing(false);}
 }
 useEffect(()=>{
  const queued=takeQueuedProfile();if(!queued)return;
  void import('@/lib/ziwei/algorithm').then(({generateChart})=>{const next=generateChart({...queued.birth,calendarVersion:queued.birth.calendarVersion??'legacy-cn'});setChart(next);setPalace(next.palaces.find(p=>p.branch===next.mingGongBranch)||null);}).catch(()=>setFeedback('Không thể mở hồ sơ đã lưu, vui lòng thử nhập lại.'));
 },[]);
 async function onUncertain(form:BirthFormState){try{const {generateChart}=await import('@/lib/ziwei/algorithm');setOptions(uncertainBirthOptions(form).map(b=>generateChart(b)));setFeedback('');}catch{setFeedback('Không thể tạo các phương án; kiểm tra ngày và nơi sinh.');}}
 async function onGenerated(birth:BirthInfo){
  setOptions([]);
  try{
   const {generateChart}=await import('@/lib/ziwei/algorithm');
   const next=generateChart(birth);
   setChart(next);setPalace(next.palaces.find(p=>p.branch===next.mingGongBranch)||null);
   setStar(null);setFeedback('');

  }catch{setFeedback('Chưa tính được lá số với dữ liệu vừa nhập. Hãy kiểm tra ngày và giờ sinh.');}
 }
 async function save(){
  if(!chart)return;
  try {await saveProfiles([chart.birthInfo]);setFeedback('Đã lưu hồ sơ trên thiết bị này. Mở mục Hồ sơ để xem lại.');}
  catch(e) {setFeedback(e instanceof Error?e.message:'Không lưu được hồ sơ.');}
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
 return <main className="site-wrap page-content chart3" style={{minHeight:'70dvh'}}>
  {!chart?<div className="chart3-form-view">
   <div className="tool-hero">
    
    <h1 className="display-small">Lập lá số Tử Vi</h1>
    <p className="lead" style={{maxWidth:680}}>Nhập ngày giờ sinh. Dữ liệu chỉ xử lý trên thiết bị của bạn; không cần tài khoản. Mục có dấu * là bắt buộc.</p>
   </div>
   <div className="chart3-form-grid">
    <BirthForm chartLayout onSubmit={onGenerated} onUnknownTime={onUncertain}/>
    <aside className="ui-card ui-card-large chart3-preview">
      <p className="ui-eyebrow">Bạn sẽ nhận được</p>
      <ol><li>12 cung và 14 chính tinh</li><li>Tứ Hóa, đại hạn, lưu niên</li><li>Giải nghĩa từng sao</li><li>Lưu hồ sơ, in khổ A4</li></ol>
      <ChartGrid empty center={null}/>
      <p className="chart3-hint">Lá số sẽ hiện ở đây sau khi bạn lập.</p>
    </aside>
   </div>
   {options.length>0&&<section className="workspace-surface" style={{marginTop:20,padding:16}}><h2>12 phương án chưa xác định</h2><p role="alert" className="study-notice">Giả định ngày an sao không đổi, lần lượt xét 12 chi giờ. Mệnh, Thân, Cục và đại hạn chỉ là khả năng; gần nửa đêm còn có thể đổi ngày. Không lưu phương án nào thành hồ sơ.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:8}}>{options.map(c=><div key={c.birthInfo.hour} className="surface-card" style={{padding:10}}><strong>Giờ {BRANCHES[c.birthInfo.hour]}</strong><p>Chưa xác định Mệnh, Thân, Cục và đại hạn.</p><details className="chart3-hypothesis"><summary>Xem giả định cho giờ này</summary><p>Chỉ là giả định nếu sinh giờ {BRANCHES[c.birthInfo.hour]}.</p><p>Mệnh: {BRANCHES[c.mingGongBranch]} · Thân: {BRANCHES[c.shenGongBranch]}</p><p>{c.wuxingJuName}</p><small>{c.palaces.find(p=>p.branch===c.mingGongBranch)?.stars.filter(s=>s.type==='major').map(s=>starLabel(s.name)).join(', ')||'Vô chính diệu'}</small></details></div>)}</div><button className="action-outline" onClick={()=>setOptions([])}>Đóng phương án</button></section>}
   {feedback&&<p role="status" className="study-notice">{feedback}</p>}
   <div className="home-note" style={{marginTop:23}}>Lưu ý: thông tin trong lá số là cách diễn giải văn hóa truyền thống, không phải khẳng định chính xác về tính cách, tương lai, sức khỏe hay tài chính. Bạn có thể lưu hồ sơ cục bộ sau khi lập xong.</div>
  </div>:
  <>
   <div className="workspace-head">
    <div><div className="eyebrow">BẢN MỆNH · 12 CUNG</div><h1 ref={resultHeading} tabIndex={-1}>{chartLabel(chart.birthInfo)}</h1>
     <p style={{color:'var(--tx-3)',fontSize:12,marginTop:5}}>{chart.birthInfo.day}/{chart.birthInfo.month}/{chart.birthInfo.year} · {chart.wuxingJuName} · {chart.birthInfo.gender==='male'?'Nam':'Nữ'}</p>
    </div>
    <div className="site-actions" style={{display:'flex',flexWrap:'wrap',gap:7}}>
     <button className="action-outline" onClick={save}><Icon name="save"/> Lưu lá số</button>
     <button className="action-outline" onClick={()=>{setShareError('');setShareReady(false);setShareOpen(true);}}><Icon name="external"/> Chia sẻ ảnh</button>
     <button className="action-outline" onClick={copy}><Icon name="copy"/> Sao chép</button>
     <button className="action-outline" onClick={()=>window.print()}><Icon name="print"/> In / PDF A4</button>
     <button className="action-primary" onClick={()=>{setChart(null);setPalace(null);setStar(null);setBoardMode(false);setDetailOpen(false);}}><Icon name="reset"/> Lập lại</button>
    </div>
   </div>
   {feedback&&<p role="status" className="study-notice" style={{marginBottom:14}}>{feedback}</p>}
   <p className="study-notice">{chart.birthInfo.calendarVersion==='legacy-cn'?'Hồ sơ dùng lịch cũ (không tự đổi kết quả đã lưu). Chọn Lập lại nếu muốn tính theo lịch Việt Nam UTC+7.':'Lịch Việt Nam UTC+7 · ngày âm thực tế hiển thị riêng với quy tắc an sao tháng nhuận.'} {chart.birthInfo.calendarUncertain||''}</p>
   {chart.birthInfo.longitudeReferenceId&&<p className="study-notice">Lá số sử dụng kinh độ tham khảo của huyện. Nếu giờ sinh gần ranh chi giờ, hãy nhập kinh độ nơi sinh chính xác để đối chiếu.</p>}
   <div className="workspace-toolbar workspace-surface" style={{padding:'11px 15px'}}>
    <TimeNav chart={chart} view={view} liunianYear={year} onViewChange={setView} onYearChange={setYear}/>
   </div>
   <div className="workspace-layout">
    <section className="workspace-surface chart-print" aria-label="Bàn lá số 12 cung">
     <div className="workspace-toolbar"><span className="eyebrow">LÁ SỐ TRỰC QUAN</span><span className="workspace-note">Chọn cung hoặc sao để xem chi tiết.</span></div>
     <button className="action-outline chart3-board-toggle" aria-pressed={boardMode} onClick={()=>setBoardMode(v=>!v)}>{boardMode?"Xem danh sách":"Xem dạng bàn"}</button>
     <div className={"chart-scroll"+(boardMode?" chart3-board-visible":"")}><ChartBoard chart={chart} view={view} liunianYear={year}
      onPalaceSelect={p=>showDetail(p)} onStarSelect={(s,p)=>showDetail(p,s)}
      onSiHuaClick={(name,hua)=>{const p=chart.palaces.find(x=>x.stars.some(s=>s.name===name));if(p){showDetail(p,p.stars.find(s=>s.name===name)||null);setFeedback('Đang xem '+starLabel(name)+' Hóa '+hua+' trong cung '+p.name+'.');}}}/></div>
     <div className={"mobile-palaces"+(boardMode?" chart3-list-hidden":"")} aria-label="Danh sách 12 cung"><p className="mobile-lunar-date">Âm lịch: {(chart.lunarInfo.rawDate??chart.lunarInfo).lunarDay}/{(chart.lunarInfo.rawDate??chart.lunarInfo).isLeapMonth?'Nhuận ':''}{(chart.lunarInfo.rawDate??chart.lunarInfo).lunarMonth}/{(chart.lunarInfo.rawDate??chart.lunarInfo).lunarYear}</p>{chart.palaces.map(p=><article key={p.branch} className="surface-card mobile-palace"><button className="action-outline" aria-pressed={shown?.branch===p.branch} onClick={()=>showDetail(p)}>{p.name} · {BRANCHES[p.branch]}</button><p>{p.isMingGong?'Mệnh · ':''}{p.isShenGong?'Thân · ':''}{p.daXianAge?p.daXianAge.join('–')+' tuổi':''}</p>{!p.stars.some(s=>s.type==='major')&&<p>Vô chính diệu</p>}<div className="mobile-star-list">{p.stars.map((s,i)=><button key={s.name+'-'+i} onClick={()=>showDetail(p,s)} className={s.type==='major'?'chart3-major':'chart3-minor'}>{starLabel(s.name)}{s.brightnessRaw?' · '+s.brightnessRaw:''}{s.siHua?' · Hóa '+s.siHua:''}</button>)}</div></article>)}</div>
    </section>
    <aside className={"workspace-surface workspace-aside reading-panel chart3-detail"+(detailOpen?" is-open":"")} aria-label="Chi tiết cung và sao">
     <button ref={detailClose} type="button" className="action-outline chart3-close" onClick={closeDetail}><Icon name="close"/> Đóng chi tiết</button>
     <div className="reading-head"><Icon name="tools" size={24}/><div><div className="eyebrow">TRA CỨU CÓ CĂN CỨ</div><h2>{star?starLabel(star.name):(shown?.name||'Tổng quan')}</h2></div></div>
     {star?<>
      <div className="reading-pills"><span>{star.type==='major'?'Chính tinh':'Phụ tinh'}</span>{star.brightnessRaw&&<span>{star.brightnessRaw}</span>}{star.siHua&&<span>Hóa {star.siHua}</span>}</div>
      <h3>Đặc tính trong tư liệu truyền thống</h3>
      {STAR_DESCRIPTIONS[star.name]?<>
       <p><strong>Từ khóa:</strong> {STAR_DESCRIPTIONS[star.name].keywords}</p>
       <p><strong>Ngũ hành:</strong> {STAR_DESCRIPTIONS[star.name].element}</p>
       <p><strong>Tính chất ghi chép:</strong> {STAR_DESCRIPTIONS[star.name].nature}</p>
      </>:<p>Chưa có nội dung đã kiểm duyệt cho sao này. Có thể xem tên sao và vị trí trên lá số.</p>}
      <button className="action-outline" onClick={()=>setStar(null)} style={{marginTop:5}}><span className="inline-flex rotate-180"><Icon name="arrow" size={16}/></span> Xem lại cung {shown?.name}</button>
     </>:study?<>
      <div className="reading-pills"><span>Chi {study.fact.branch}</span>{shown?.isMingGong&&<span>Cung Mệnh</span>}{shown?.isShenGong&&<span>Cung Thân</span>}</div>
      <h3>Các chính tinh tọa thủ</h3>
      {study.intros.length?study.intros.map(s=><div key={s.name} style={{borderBottom:'1px solid var(--bdr)',paddingBottom:12,marginBottom:12}}>
       <strong>{starLabel(s.name)}</strong>{s.brightness&&<span style={{fontSize:11,color:'var(--ac-dim)'}}> · {s.brightness}</span>}
       <p style={{marginTop:6}}>{s.description?.keywords||'Chưa có chú giải được xác minh.'}</p>
      </div>):<p>Vô chính diệu — không có chính tinh trực tiếp trong cung; xem đối cung để tham khảo cấu trúc.</p>}
      {!!study.fact.transformations.length&&<><h3>Tứ Hóa tại cung</h3><p>{study.fact.transformations.map(t=>{const [name,...rest]=t.split(' Hóa ');return [starLabel(name),...rest].join(' Hóa ');}).join(' · ')}</p></>}
      <h3>Đối cung</h3>
      <p>{study.opposite?.name} ({study.opposite?.branch}) · {study.opposite?.major.map(starLabel).join(', ')||'Không có chính tinh'}</p>
      <h3>Tam hợp</h3>
      <p>{study.trine.map(x=>x.name+': '+(x.major.map(starLabel).join(', ')||'Vô chính diệu')).join(' · ')}</p>
      <div className="study-notice" style={{marginTop:16}}>Nội dung trên được dựng từ các sao và cung thực tế của lá số, không phải kết quả AI tự tạo.</div>
     </>:null}
     <p className="workspace-note" style={{marginTop:17}}>{READING_NOTICE}</p>
     <Link href="/library" className="section-link">Tra cứu cổ thư liên quan <Icon name="arrow" size={16}/></Link>
    </aside>
   </div>
   <div className="chart3-print-note"><p>{chart.birthInfo.calendarVersion==='legacy-cn'?'Hồ sơ dùng lịch cũ; kết quả đã lưu không tự đổi.':'Lịch Việt Nam UTC+7 · ngày âm thực tế hiển thị riêng với quy tắc an sao tháng nhuận.'} {chart.birthInfo.calendarUncertain||''}</p>{chart.birthInfo.longitudeReferenceId&&<p>Kinh độ tham khảo của huyện; đối chiếu nơi sinh chính xác nếu gần ranh chi giờ.</p>}<p>{READING_NOTICE}</p><p>Quyền riêng tư: lá số được xử lý trên thiết bị; chỉ lưu vào Hồ sơ khi người dùng chọn lưu.</p></div>
   {shareOpen&&<dialog ref={shareDialog} className="chart3-share" aria-labelledby="chart3-share-title" onClose={()=>setShareOpen(false)}><h2 id="chart3-share-title">Chia sẻ ảnh lá số</h2><p>Ảnh chứa thông tin ngày giờ sinh; chỉ chia sẻ nếu bạn muốn. Ảnh được tạo trên thiết bị.</p><div className="chart3-share-scroll"><ShareCard chart={chart} birth={{year:String(chart.birthInfo.origInput?.year??chart.birthInfo.year),month:String(chart.birthInfo.origInput?.month??chart.birthInfo.month),day:String(chart.birthInfo.origInput?.day??chart.birthInfo.day),hour:chart.birthInfo.origInput?String(chart.birthInfo.origInput.clockHour):"--",minute:chart.birthInfo.origInput?String(chart.birthInfo.origInput.clockMinute):"--",gender:chart.birthInfo.gender,city:chart.birthInfo.city}}/></div>{shareError&&<p role="alert">{shareError}</p>}<div className="chart3-share-actions"><button className="action-primary" onClick={downloadImage} disabled={sharing||!shareReady}>{sharing?"Đang tạo ảnh…":"Tải ảnh PNG"}</button><button className="action-outline" onClick={()=>shareDialog.current?.close()}>Đóng</button></div></dialog>}
   <div className="home-note"><strong style={{color:'var(--tx-0)'}}>Quyền riêng tư:</strong> Lá số không được tự động tải lên máy chủ. Khi bạn chọn “Lưu lá số”, dữ liệu sinh được lưu trong bộ nhớ trình duyệt hiện tại và có thể xóa tại mục <Link href="/ho-so">Hồ sơ</Link>.</div>
  </>}
 </main>;
}
