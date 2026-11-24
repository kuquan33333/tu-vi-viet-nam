'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import BirthForm,{type BirthFormState} from './BirthForm';
import {readProfiles,profileStatus,type SavedProfile} from '@/lib/ziwei/profile-storage';
import type {BirthInfo} from '@/lib/ziwei/types';
export default function ProfilePicker({label,onFormSave,onProfile}:{label:string;onFormSave:(f:BirthFormState)=>void;onProfile:(b:BirthInfo|null)=>void}){
 const [profiles,setProfiles]=useState<SavedProfile[]>([]),[id,setId]=useState(''),[status,setStatus]=useState('plain');
 const selectionCallback=useRef(onProfile);selectionCallback.current=onProfile;
 useEffect(()=>{function refresh(){const list=readProfiles(),state=profileStatus();setProfiles(list);setStatus(state);if(state==='locked'||state==='unavailable'){setId('');selectionCallback.current(null);}}refresh();window.addEventListener('storage',refresh);return()=>window.removeEventListener('storage',refresh);},[]);
 return <><label>{label}<select className="study-input" aria-label={label} value={id} onChange={e=>{setId(e.target.value);const p=profiles.find(p=>p.id===e.target.value);onProfile(p?{...p.birth,calendarVersion:p.birth.calendarVersion??'legacy-cn'}:null);}}><option value="">Nhập thông tin mới</option>{profiles.map(p=><option key={p.id} value={p.id}>{p.title} · {p.birth.day}/{p.birth.month}/{p.birth.year}</option>)}</select></label>
 {status==='locked'&&<p className="study-notice">Hồ sơ đang khóa. <Link href="/ho-so">Mở khóa tại Hồ sơ</Link>.</p>}
 {id?<p className="workspace-note">Dùng dữ liệu đã lưu và giữ nguyên phiên bản lịch.</p>:<BirthForm hideSubmit onSubmit={()=>{}} onFormSave={onFormSave}/>}</>;
}
