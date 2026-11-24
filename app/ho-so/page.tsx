'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {clearProfiles,queueProfile,readProfiles,removeProfile,type SavedProfile} from '@/lib/ziwei/profile-storage';

export default function HoSoPage(){
 const [profiles,setProfiles]=useState<SavedProfile[]>([]);
 const [ready,setReady]=useState(false);
 const router=useRouter();
 useEffect(()=>{setProfiles(readProfiles());setReady(true);},[]);
 function open(id:string){queueProfile(id);router.push('/chart');}
 function del(id:string){
  if(!window.confirm('Xóa lá số đã lưu khỏi thiết bị này?'))return;
  removeProfile(id);setProfiles(readProfiles());
 }
 function removeAll(){
  if(!window.confirm('Xóa toàn bộ lá số đã lưu trên thiết bị này? Không thể khôi phục.'))return;
  clearProfiles();setProfiles([]);
 }
 return <main className="site-wrap page-content" style={{minHeight:'70dvh'}}>
  <div className="tool-hero">
   <div className="eyebrow">THƯ VIỆN CỦA BẠN · CHỈ LƯU TRÊN THIẾT BỊ</div>
   <h1 className="display-small">Hồ sơ lá số</h1>
   <p className="lead">Lưu, xem lại và xóa các lá số bạn chủ động lưu. Không cần đăng ký tài khoản, thông tin không được tự động đồng bộ.</p>
  </div>
  <div className="workspace-head">
   <p style={{color:'var(--tx-2)',fontSize:13}}>{ready?profiles.length+' hồ sơ trong trình duyệt hiện tại':'Đang đọc dữ liệu cục bộ...'}</p>
   <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
    {profiles.length>0&&<button type="button" className="action-outline" onClick={removeAll}>Xóa tất cả</button>}
    <Link href="/chart" className="action-primary">＋ Lập lá số mới</Link>
   </div>
  </div>
  {ready&&profiles.length===0?<div className="surface-card" style={{padding:'45px 25px',textAlign:'center'}}>
   <div style={{fontSize:37,color:'var(--ac-dim)',marginBottom:12}}>◇</div>
   <h2 className="display-small" style={{fontSize:26,marginBottom:14}}>Chưa có hồ sơ nào</h2>
   <p className="lead" style={{fontSize:13,maxWidth:510,margin:'auto'}}>Sau khi lập lá số, chọn “Lưu lá số” để cất giữ vào trình duyệt. Có thể mở lại tại đây.</p>
   <Link href="/chart" className="action-primary" style={{marginTop:22}}>Bắt đầu lập lá số →</Link>
  </div>:
  <div className="saved-list">{profiles.map(p=><div key={p.id} className="surface-card saved-card">
   <div><h3>{p.title}</h3><p>{p.birth.day}/{p.birth.month}/{p.birth.year} · {p.birth.gender==='male'?'Nam':'Nữ'} · Lưu ngày {new Date(p.savedAt).toLocaleDateString('vi-VN')}</p></div>
   <div style={{display:'flex',gap:7,flexShrink:0}}>
    <button type="button" onClick={()=>open(p.id)} style={{color:'var(--ac-dim)'}}>Xem lá số →</button>
    <button type="button" onClick={()=>del(p.id)} aria-label={'Xóa hồ sơ '+p.title}>Xóa</button>
   </div>
  </div>)}</div>}
  <div className="home-note"><strong>Chính sách lưu:</strong> Tối đa 30 hồ sơ trên một trình duyệt. Xóa dữ liệu trình duyệt hoặc dùng chế độ riêng tư có thể khiến hồ sơ bị mất. Thông tin sinh không được gửi đến AI trong chức năng lưu cục bộ này.</div>
 </main>;
}
