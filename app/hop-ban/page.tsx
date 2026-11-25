'use client';
import Icon from '@/components/Icon';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import type {BirthFormState} from '@/components/BirthForm';
import ProfilePicker from '@/components/ProfilePicker';
import {BRANCHES} from '@/lib/ziwei/constants';
import {generateChart} from '@/lib/ziwei/algorithm';
import {formToBirthInfo,birthFormProblem} from '@/lib/ziwei/share';
import {compareCharts,getSynastryFacts,chartLabel,READING_NOTICE} from '@/lib/ziwei/client-reading';
import {saveProfiles} from '@/lib/ziwei/profile-storage';
import type {ZiweiChart,BirthInfo} from '@/lib/ziwei/types';

const TOPICS:Record<string,string>={
 'Mệnh':'Cấu trúc cung Mệnh','Phu Thê':'Quan niệm quan hệ theo cổ học',
 'Phúc Đức':'Bối cảnh gia đình và tinh thần','Tài Bạch':'Nhóm sao thuộc cung Tài Bạch',
 'Quan Lộc':'Nhóm sao thuộc cung Quan Lộc','Thiên Di':'Cung Thiên Di và môi trường bên ngoài',
 'Điền Trạch':'Cung Điền Trạch','Tử Tức':'Cung Tử Tức',
 'Phụ Mẫu':'Cung Phụ Mẫu','Huynh Đệ':'Cung Huynh Đệ','Tật Ách':'Cung Tật Ách',
 'Nô Bộc':'Giao hữu trong hệ thống cổ học'
};
function complete(f:BirthFormState|null){
 if(!f)return false;
 return !f.unknownTime&&!birthFormProblem(f);
}
export default function HemingPage(){
 const [savedA,setSavedA]=useState<BirthInfo|null>(null),[savedB,setSavedB]=useState<BirthInfo|null>(null);
 const [formA,setA]=useState<BirthFormState|null>(null);
 const [formB,setB]=useState<BirthFormState|null>(null);
 const [chartA,setChartA]=useState<ZiweiChart|null>(null);
 const [chartB,setChartB]=useState<ZiweiChart|null>(null);
 const [selected,setSelected]=useState<'A'|'B'>('A');
 const [error,setError]=useState('');
 const [message,setMessage]=useState('');
 const facts=useMemo(()=>chartA&&chartB?getSynastryFacts(chartA,chartB):null,[chartA,chartB]);
 const rows=useMemo(()=>chartA&&chartB?compareCharts(chartA,chartB):[],[chartA,chartB]);
 function run(){
  setError('');setMessage('');
  if((!savedA&&!complete(formA))||(!savedB&&!complete(formB))){setError('Hãy nhập ngày sinh hợp lệ, nơi sinh và giờ sinh xác định của cả hai người. Không tự giả định giờ sinh.');return;}
  try{
   const a=generateChart(savedA??formToBirthInfo(formA!));
   const b=generateChart(savedB??formToBirthInfo(formB!));
   setChartA(a);setChartB(b);
   window.scrollTo({top:0,behavior:'smooth'});
  }catch{setError('Không thể tạo hai lá số từ thông tin đã nhập. Hãy kiểm tra ngày, giờ và địa phương.');}
 }
 async function saveBoth(){
  if(!chartA||!chartB)return;
  try {await saveProfiles([chartA.birthInfo,chartB.birthInfo]);setMessage('Đã lưu cả hai lá số trên thiết bị này.');}
  catch(e) {setMessage(e instanceof Error?e.message:'Không thể lưu hồ sơ.');}
 }
 return <main className="site-wrap page-content" style={{minHeight:'70dvh'}}>
  <div className="tool-hero">
   <div className="eyebrow">TỬ VI ĐẨU SỐ · ĐỐI CHIẾU CẤU TRÚC</div>
   <h1 className="display-small">Hợp Bàn · Hai lá số</h1>
   <p className="lead" style={{maxWidth:800}}>So sánh hai mệnh bàn bằng các cung, sao và dữ liệu được tính trực tiếp trên máy. Báo cáo trình bày sự giống và khác theo 12 lĩnh vực truyền thống, không chấm điểm “hợp nhau” tùy ý.</p>
  </div>
  {!facts?<div>
   <div className="study-tabs" style={{justifyContent:'center'}}>
    <button type="button" className={'study-tab'+(selected==='A'?' active':'')} onClick={()=>setSelected('A')}>Người thứ nhất · A</button>
    <button type="button" className={'study-tab'+(selected==='B'?' active':'')} onClick={()=>setSelected('B')}>Người thứ hai · B</button>
   </div>
   <div className="profile-split compare-forms" data-mobile-selected={selected}>
    <section className="surface-card profile-box compare-a"><div className="eyebrow">HỒ SƠ A</div><h2>Người thứ nhất</h2>
     <ProfilePicker label="Chọn hồ sơ người A" onFormSave={setA} onProfile={b=>{setSavedA(b);setA(null);}}/></section>
    <section className="surface-card profile-box compare-b"><div className="eyebrow">HỒ SƠ B</div><h2>Người thứ hai</h2>
     <ProfilePicker label="Chọn hồ sơ người B" onFormSave={setB} onProfile={b=>{setSavedB(b);setB(null);}}/></section>
   </div>
   {error&&<p role="alert" className="study-notice">{error}</p>}
   <div className="surface-card" style={{padding:25,marginTop:17,textAlign:'center'}}>
    <button type="button" className="action-primary" onClick={run}>Đối chiếu hai lá số</button>
    <p className="workspace-note" style={{marginTop:12}}>Tính trực tiếp trên thiết bị, không gửi thông tin sinh ra ngoài.</p>
   </div>
  </div>:<>
   <div className="workspace-head"><div><h2 className="display-small" style={{fontSize:24}}>Báo cáo đối chiếu 12 cung</h2>
    <p className="workspace-note">Xem điểm chung và khác biệt trong các trường sao thực tế.</p></div>
    <div className="site-actions" style={{display:'flex',gap:8,flexWrap:'wrap'}}>
     <button type="button" className="action-outline" onClick={()=>window.print()}>↧ In / PDF</button>
     <button type="button" className="action-outline" onClick={saveBoth}>＋ Lưu 2 hồ sơ</button>
     <button type="button" className="action-primary" onClick={()=>{setChartA(null);setChartB(null);setSavedA(null);setSavedB(null);setA(null);setB(null);setSelected('A');}}>↶ Đổi dữ liệu</button>
    </div>
   </div>
   {message&&<p role="status" className="study-notice">{message}</p>}
   <div className="profile-split" style={{marginBottom:19}}>
    {[[chartA,'A'],[chartB,'B']].map(([chart,label])=>{
      const c=chart as ZiweiChart;return <div key={label as string} className="surface-card profile-box">
       <div className="eyebrow">LÁ SỐ {label as string}</div><h2>{chartLabel(c.birthInfo)}</h2>
       <p className="workspace-note">Mệnh tại cung {c.palaces.find(p=>p.branch===c.mingGongBranch)?.name} · {c.wuxingJuName}</p>
       <p className="workspace-note">Cung Mệnh tại chi {BRANCHES[c.mingGongBranch]}</p><p className="workspace-note">Lịch {c.birthInfo.calendarVersion==='legacy-cn'?'cũ':'Việt Nam UTC+7'} · {c.birthInfo.calendarUncertain||''}</p>{c.birthInfo.longitudeReferenceId&&<p className="workspace-note">Kinh độ tham khảo của huyện; lưu ý sai số gần ranh giờ.</p>}
       <div className="reading-pills">{c.palaces.find(p=>p.branch===c.mingGongBranch)?.stars.filter(s=>s.type==='major').map(s=><span key={s.name}>{s.name}</span>)}</div>
      </div>;
    })}
   </div>
   <div className="surface-card reading-panel" style={{marginBottom:19}}>
    <div className="eyebrow">TỔNG QUAN CÓ THỂ KIỂM TRA</div>
    <h2 style={{fontFamily:'var(--font-serif)',fontSize:22,fontWeight:700,margin:'10px 0'}}>Các yếu tố cấu trúc</h2>
    <div className="profile-split">
     <div><p><strong>Ngũ hành cục:</strong> {facts.sameJu?'Cùng một cục ('+chartA!.wuxingJuName+')':'Khác cục ('+chartA!.wuxingJuName+' / '+chartB!.wuxingJuName+')'}.</p>
     <p><strong>Cung Mệnh:</strong> {facts.sameMingBranch?'Cùng một địa chi.':'Khác địa chi.'}</p></div>
     <div><p><strong>Hồ sơ A:</strong> {facts.aMing?.major.join(', ')||'Vô chính diệu'}.</p><p><strong>Hồ sơ B:</strong> {facts.bMing?.major.join(', ')||'Vô chính diệu'}.</p></div>
    </div>
    <p className="workspace-note">Những điểm trùng nhau chỉ mô tả ký hiệu trên hai lá số, không xác nhận chất lượng mối quan hệ, tính cách hay mức độ tương hợp trong đời sống.</p>
   </div>
   <div className="profile-split">
    {rows.map(row=><section className="surface-card reading-panel" key={row.name}>
     <div className="eyebrow">CUNG {row.name.toLocaleUpperCase('vi')}</div>
     <h2 style={{fontFamily:'var(--font-serif)',fontSize:20,fontWeight:700,margin:'9px 0'}}>{TOPICS[row.name]||row.name}</h2>
     <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
      <div><strong style={{fontSize:12}}>Người A</strong><p>{row.a.join(', ')||'Vô chính diệu'}</p></div>
      <div><strong style={{fontSize:12}}>Người B</strong><p>{row.b.join(', ')||'Vô chính diệu'}</p></div>
     </div>
     <p><strong>Trùng chính tinh:</strong> {row.shared.join(', ')||'Không có trong cung tương ứng'}.</p><p><strong>Chỉ A:</strong> {row.uniqueA.join(', ')||'Không có'} · <strong>Chỉ B:</strong> {row.uniqueB.join(', ')||'Không có'}</p><p><strong>Địa chi:</strong> {row.branchA} / {row.branchB}</p><p><strong>Tứ Hóa A:</strong> {row.huaA.join(', ')||'Không có'} · <strong>B:</strong> {row.huaB.join(', ')||'Không có'}</p>
     <p className="workspace-note">Chỉ đối chiếu sao chính trong hai cung cùng tên; kết luận chiêm nghiệm cần xem toàn bộ mệnh bàn và từng trường phái.</p>
    </section>)}
   </div>
   <div className="home-note">{READING_NOTICE} Công cụ không cung cấp tỷ lệ phần trăm hay lời khuyên bắt buộc về hôn nhân, công việc hoặc lựa chọn cá nhân.</div>
  </>}
  <div style={{padding:'20px 0'}}><Link href="/chart" className="section-link">Lập lá số riêng <Icon name="arrow" size={16}/></Link></div>
 </main>;
}
