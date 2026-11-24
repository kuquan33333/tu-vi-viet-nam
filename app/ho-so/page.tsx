'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {profileStatus,readProfiles,queueProfile,deleteProfile,deleteAllProfiles,lockProfiles,unlockProfiles,relockProfiles,disableProfileLock,exportProfiles,importProfiles,PROFILE_LIMIT,type SavedProfile} from '@/lib/ziwei/profile-storage';
export default function HoSoPage(){
 const [profiles,setProfiles]=useState<SavedProfile[]>([]),[state,setState]=useState<ReturnType<typeof profileStatus>>('unavailable'),[ready,setReady]=useState(false),[pin,setPin]=useState(''),[confirmPin,setConfirmPin]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 const router=useRouter();
 function refresh(){setState(profileStatus());setProfiles(readProfiles());setReady(true);}
 useEffect(()=>{refresh();window.addEventListener('storage',refresh);return()=>window.removeEventListener('storage',refresh);},[]);
 async function run(fn:()=>Promise<void>|void){setBusy(true);setMessage('');try{await fn();refresh();}catch(e){setMessage(e instanceof Error?e.message:'Không thể thực hiện.');}finally{setBusy(false);setPin('');setConfirmPin('');}}
 function open(id:string){queueProfile(id);router.push('/chart');}
 function download(){if(!window.confirm('Tệp JSON xuất ra KHÔNG được mã hóa. Chỉ lưu ở nơi an toàn. Tiếp tục?'))return;
  const url=URL.createObjectURL(new Blob([exportProfiles()],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='ho-so-tu-vi.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 const accessible=ready&&(state==='plain'||state==='unlocked');
 return <main className="site-wrap page-content" style={{minHeight:'70dvh'}}>
  <div className="tool-hero"><div className="eyebrow">CHỈ LƯU TRÊN THIẾT BỊ</div><h1 className="display-small">Hồ sơ lá số</h1><p className="lead">Quản lý, sao lưu và bảo vệ thông tin sinh của bạn.</p></div>
  {message&&<p role="status" className="study-notice">{message}</p>}
  {ready&&state==='unavailable'&&<p role="alert" className="study-notice">Không đọc được kho hồ sơ. Không ghi đè dữ liệu hiện có.</p>}
  {ready&&state==='locked'&&<section className="surface-card reading-panel"><h2>Kho hồ sơ đang khóa</h2><form onSubmit={e=>{e.preventDefault();void run(()=>unlockProfiles(pin));}}><label>Mã PIN<input className="study-input" type="password" inputMode="numeric" autoComplete="off" value={pin} onChange={e=>setPin(e.target.value)} required/></label><button className="action-primary" disabled={busy}>Mở khóa</button></form><p>PIN chỉ được giữ trong phiên xử lý; tải lại trang sẽ khóa kho. Không thể khôi phục nếu quên PIN.</p></section>}
  {accessible&&<>
   <div className="workspace-head"><p>{profiles.length}/{PROFILE_LIMIT} hồ sơ</p><div className="site-actions" style={{display:'flex',gap:8,flexWrap:'wrap'}}>
    <Link href="/chart" className="action-primary">Lập lá số mới</Link>
    <button className="action-outline" disabled={busy} onClick={()=>void run(download)}>Xuất JSON</button>
    <label className="action-outline">Nhập JSON<input type="file" accept=".json,application/json" aria-label="Nhập JSON" disabled={busy} onChange={e=>{const f=e.target.files?.[0];e.target.value='';if(f)void run(async()=>{if(f.size>1000000)throw Error('Tệp quá lớn.');const count=await importProfiles(await f.text());setMessage('Đã nhập '+count+' hồ sơ mới. Bỏ qua mã trùng.');});}} style={{maxWidth:190}}/></label>
    {profiles.length>0&&<button className="action-outline" disabled={busy} onClick={()=>{if(window.confirm('Xóa tất cả hồ sơ? Không thể khôi phục.'))void run(deleteAllProfiles);}}>Xóa tất cả</button>}
   </div></div>
   {profiles.length>=25&&<p role="status" className="study-notice">Đã dùng {profiles.length}/30 hồ sơ. Khi đầy, cần xóa hoặc xuất bản sao trước khi lưu thêm.</p>}
   <section className="surface-card reading-panel" style={{marginBottom:16}}><h2>Bảo vệ hồ sơ bằng PIN</h2>
    {state==='plain'?<form onSubmit={e=>{e.preventDefault();if(pin!==confirmPin){setMessage('Hai mã PIN không trùng nhau.');return;}void run(()=>lockProfiles(pin));}}>
      <p>Khóa mã hóa dữ liệu trên trình duyệt. PIN 6–12 chữ số; chọn PIN dài, không dễ đoán. PIN ngắn có thể bị dò ngoại tuyến. Không thể khôi phục PIN.</p>
      <div className="profile-split"><label>Mã PIN<input className="study-input" type="password" inputMode="numeric" autoComplete="new-password" minLength={6} maxLength={12} value={pin} onChange={e=>setPin(e.target.value)} required/></label><label>Nhập lại PIN<input className="study-input" type="password" inputMode="numeric" autoComplete="new-password" value={confirmPin} onChange={e=>setConfirmPin(e.target.value)} required/></label></div>
      <button className="action-outline" disabled={busy}>Mã hóa và khóa</button>
    </form>:<><p>Đang mở khóa trong phiên này. Mọi thay đổi vẫn được mã hóa. Tải lại trang để khóa.</p><button className="action-outline" disabled={busy} onClick={()=>void run(relockProfiles)}>Khóa ngay</button> <button className="action-outline" disabled={busy} onClick={()=>{if(window.confirm('Tắt mã hóa sẽ lưu hồ sơ dạng bản rõ. Tiếp tục?'))void run(disableProfileLock);}}>Tắt mã hóa</button></>}
   </section>
   {profiles.length===0?<div className="surface-card reading-panel"><h2>Chưa có hồ sơ nào</h2><p>Lập lá số rồi lưu để xem lại tại đây.</p></div>:<div className="saved-list">{profiles.map(p=><article key={p.id} className="surface-card saved-card"><div><h3>{p.title}</h3><p>{p.birth.day}/{p.birth.month}/{p.birth.year} · {p.birth.gender==='male'?'Nam':'Nữ'}</p></div><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button type="button" className="action-outline" onClick={()=>open(p.id)}>Xem lá số / In A4</button><button className="action-outline" disabled={busy} aria-label={'Xóa hồ sơ '+p.title} onClick={()=>{if(window.confirm('Xóa hồ sơ này?'))void run(()=>deleteProfile(p.id));}}>Xóa</button></div></article>)}</div>}
  </>}
  <p className="home-note">Hồ sơ không tự đồng bộ. Mã hóa không bảo vệ khỏi thiết bị đã bị xâm nhập hoặc trang đang mở khóa. Xóa dữ liệu trình duyệt sẽ mất hồ sơ; hãy sao lưu an toàn.</p>
 </main>;
}
