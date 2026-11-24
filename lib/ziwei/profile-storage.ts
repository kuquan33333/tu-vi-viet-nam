import type {BirthInfo} from '@/lib/ziwei/types';
export interface SavedProfile {id:string;title:string;savedAt:string;birth:BirthInfo}
const KEY='tuvivn.profiles.v2';
const OPEN_KEY='tuvivn.open-profile.v2';
function canUseStorage(){return typeof window!=='undefined'&&typeof localStorage!=='undefined'}
export function readProfiles():SavedProfile[]{
 if(!canUseStorage())return [];
 try{
  const val=JSON.parse(localStorage.getItem(KEY)||'[]');
  if(!Array.isArray(val))return [];
  return val.filter((v:SavedProfile)=>v&&typeof v.id==='string'&&v.birth&&Number.isInteger(v.birth.year)
   &&Number.isInteger(v.birth.month)&&Number.isInteger(v.birth.day)&&typeof v.birth.hour==='number'
   &&(v.birth.gender==='male'||v.birth.gender==='female')).slice(0,30);
 }catch{return []}
}
export function saveProfile(birth:BirthInfo):SavedProfile{
 if(birth.assumedHour)throw new Error('Không lưu phương án giờ sinh chưa xác định.');
 if(!canUseStorage())throw new Error('Bộ nhớ trình duyệt không khả dụng.');
 const now=new Date();
 const item:SavedProfile={
  id:String(now.getTime())+'-'+Math.random().toString(36).slice(2,9),
  title:birth.name?.trim()||'Lá số '+birth.day+'/'+birth.month+'/'+birth.year,
  savedAt:now.toISOString(),
  birth:{...birth}
 };
 const list=[item,...readProfiles()].slice(0,30);
 localStorage.setItem(KEY,JSON.stringify(list));
 return item;
}
export function removeProfile(id:string){
 if(!canUseStorage())return;
 const list=readProfiles().filter(v=>v.id!==id);
 localStorage.setItem(KEY,JSON.stringify(list));
}
export function clearProfiles(){
 if(canUseStorage())localStorage.removeItem(KEY);
}
export function queueProfile(id:string){
 if(typeof sessionStorage!=='undefined')sessionStorage.setItem(OPEN_KEY,id);
}
export function takeQueuedProfile():SavedProfile|null {
 if(typeof sessionStorage==='undefined')return null;
 const id=sessionStorage.getItem(OPEN_KEY);
 if(!id)return null;
 sessionStorage.removeItem(OPEN_KEY);
 return readProfiles().find(x=>x.id===id)||null;
}
