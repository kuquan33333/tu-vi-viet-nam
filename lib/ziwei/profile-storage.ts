import type {BirthInfo} from '@/lib/ziwei/types';
export interface SavedProfile {id:string;title:string;savedAt:string;birth:BirthInfo}
export const PROFILE_LIMIT=30;
const KEY='tuvivn.profiles.v2',OPEN_KEY='tuvivn.open-profile.v2';
const ITERATIONS=600000;
type Vault={version:1;format:'tuvivn-encrypted';salt:string;iv:string;ciphertext:string;iterations:number};
let unlocked:{raw:string;key:CryptoKey;profiles:SavedProfile[]}|null=null;
let busy=false;
function storage(){if(typeof window==='undefined'||typeof localStorage==='undefined')throw Error('Bộ nhớ trình duyệt không khả dụng.');return localStorage;}
function rawValue(){return storage().getItem(KEY);}
const enc=new TextEncoder(),dec=new TextDecoder();
const encode=(b:Uint8Array)=>btoa(Array.from(b,x=>String.fromCharCode(x)).join(''));
const decode=(s:string)=>Uint8Array.from(atob(s),x=>x.charCodeAt(0));
function asVault(raw:string|null):Vault|null{
 if(!raw)return null;
 const o=JSON.parse(raw);
 if(Array.isArray(o))return null;
 if(!o||o.version!==1||o.format!=='tuvivn-encrypted'||o.iterations!==ITERATIONS||
 typeof o.salt!=='string'||typeof o.iv!=='string'||typeof o.ciphertext!=='string'||decode(o.salt).length!==16||decode(o.iv).length!==12)throw Error('Dữ liệu hồ sơ không hợp lệ. Không ghi đè.');
 return o;
}
const int=(n:unknown,min:number,max:number):n is number=>typeof n==='number'&&Number.isInteger(n)&&n>=min&&n<=max;
function validDate(y:unknown,m:unknown,d:unknown):boolean{
 if(!int(y,1600,2051)||!int(m,1,12)||!int(d,1,31))return false;
 const t=new Date(Date.UTC(y,m-1,d));return t.getUTCFullYear()===y&&t.getUTCMonth()===m-1&&t.getUTCDate()===d;
}
function optionalText(v:unknown,max=200){return v===undefined||(typeof v==='string'&&v.length<=max);}
function sanitizeBirth(b:BirthInfo):BirthInfo{
 if(!b||!validDate(b.year,b.month,b.day)||!int(b.hour,0,11)||!['male','female'].includes(b.gender)||b.assumedHour||
 !optionalText(b.name)||!optionalText(b.province)||!optionalText(b.city)||!optionalText(b.calendarVersion,100)||!optionalText(b.calendarUncertain,1000)||
 (b.longitude!==undefined&&(!Number.isFinite(b.longitude)||Math.abs(b.longitude)>180))||
 (b.longitudeReferenceId!==undefined&&!int(b.longitudeReferenceId,1,2147483647)))throw Error('Ngày, giờ hoặc dữ liệu sinh không hợp lệ.');
 const o=b.origInput,t=b.timeConvention;
 if(o&&(!validDate(o.year,o.month,o.day)||!int(o.clockHour,0,23)||!int(o.clockMinute,0,59)||(o.clockSecond!==undefined&&!int(o.clockSecond,0,59))))throw Error('Giờ sinh gốc không hợp lệ.');
 if(t&&(typeof t.trueSolar!=='boolean'||!['next-day','current-day'].includes(t.lateZishi)||!Number.isFinite(t.utcOffsetMinutes)||t.utcOffsetMinutes < -720||t.utcOffsetMinutes>840))throw Error('Quy ước giờ sinh không hợp lệ.');
 if(b.calendarVersion!==undefined&&!['legacy-cn','utc7-moshier-2.10.03-v1'].includes(b.calendarVersion))throw Error('Phiên bản lịch không được hỗ trợ.');
 return {year:b.year,month:b.month,day:b.day,hour:b.hour,gender:b.gender,name:b.name,province:b.province,city:b.city,longitude:b.longitude,longitudeReferenceId:b.longitudeReferenceId,calendarVersion:b.calendarVersion??'legacy-cn',calendarUncertain:b.calendarUncertain,
 origInput:o?{year:o.year,month:o.month,day:o.day,clockHour:o.clockHour,clockMinute:o.clockMinute,clockSecond:o.clockSecond}:undefined,
 timeConvention:t?{trueSolar:t.trueSolar,lateZishi:t.lateZishi,utcOffsetMinutes:t.utcOffsetMinutes}:undefined};
}
function validateProfiles(v:unknown):SavedProfile[]{
 if(!Array.isArray(v)||v.length>PROFILE_LIMIT)throw Error('Tệp chỉ được chứa tối đa 30 hồ sơ.');
 const ids=new Set<string>();
 return v.map(p=>{
  if(!p||typeof p.id!=='string'||!p.id||p.id.length>100||ids.has(p.id)||typeof p.title!=='string'||p.title.length>200||typeof p.savedAt!=='string'||!Number.isFinite(Date.parse(p.savedAt)))throw Error('Hồ sơ không hợp lệ hoặc trùng mã.');
  ids.add(p.id);return {id:p.id,title:p.title,savedAt:p.savedAt,birth:sanitizeBirth(p.birth)};
 });
}
export function profileStatus():'plain'|'locked'|'unlocked'|'unavailable'{
 try{const raw=rawValue();if(!asVault(raw)){unlocked=null;return 'plain';}if(unlocked?.raw===raw)return 'unlocked';unlocked=null;return 'locked';}catch{return 'unavailable';}
}
function readStrict():SavedProfile[]{
 const raw=rawValue();
 if(asVault(raw)){if(!unlocked||unlocked.raw!==raw){unlocked=null;throw Error('Kho hồ sơ đang khóa. Hãy mở khóa tại mục Hồ sơ.');}return structuredClone(unlocked.profiles);}
 return validateProfiles(JSON.parse(raw??'[]'));
}
export function readProfiles():SavedProfile[]{try{return readStrict();}catch{return [];}}
function newItem(birth:BirthInfo):SavedProfile{
 if(birth.assumedHour)throw Error('Không lưu phương án giờ sinh chưa xác định.');
 return {id:crypto.randomUUID(),title:birth.name?.trim()||'Lá số '+birth.day+'/'+birth.month+'/'+birth.year,savedAt:new Date().toISOString(),birth:sanitizeBirth(birth)};
}
function merge(list:SavedProfile[],items:SavedProfile[]){
 const result=[...items,...list];
 if(result.length>PROFILE_LIMIT)throw Error('Đã đạt giới hạn 30 hồ sơ. Hãy xóa hồ sơ không cần thiết trước.');
 return validateProfiles(result);
}
function pinCheck(pin:string){if(!/^\d{6,12}$/.test(pin))throw Error('PIN phải gồm 6–12 chữ số.');}
async function derive(pin:string,salt:Uint8Array<ArrayBuffer>){
 pinCheck(pin);
 const material=await crypto.subtle.importKey('raw',enc.encode(pin),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function encrypt(profiles:SavedProfile[],key:CryptoKey,salt:string):Promise<string>{
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode('tuvivn-encrypted:v1')},key,enc.encode(JSON.stringify(profiles)));
 return JSON.stringify({format:'tuvivn-encrypted',version:1,iterations:ITERATIONS,salt,iv:encode(iv),ciphertext:encode(new Uint8Array(ciphertext))});
}
async function exclusive<T>(fn:()=>Promise<T>):Promise<T>{
 if(busy)throw Error('Đang xử lý hồ sơ. Vui lòng thử lại.');
 busy=true;try{return await fn();}finally{busy=false;}
}
function writeChecked(before:string|null,next:string){if(rawValue()!==before)throw Error('Hồ sơ đã thay đổi ở tab khác. Hãy tải lại.');storage().setItem(KEY,next);}
async function persist(list:SavedProfile[],before:string|null){
 const vault=asVault(before);
 if(vault){if(!unlocked||unlocked.raw!==before)throw Error('Kho hồ sơ đang khóa.');
  const key=unlocked.key,next=await encrypt(list,key,vault.salt);writeChecked(before,next);unlocked={raw:next,key,profiles:structuredClone(list)};
 }else writeChecked(before,JSON.stringify(list));
}
export async function lockProfiles(pin:string){
 return exclusive(async()=>{if(profileStatus()!=='plain')throw Error('Kho hồ sơ đã được bảo vệ hoặc không khả dụng.');
  const before=rawValue(),list=readStrict(),salt=crypto.getRandomValues(new Uint8Array(16));
  const key=await derive(pin,salt),next=await encrypt(list,key,encode(salt));writeChecked(before,next);unlocked=null;
 });
}
export async function unlockProfiles(pin:string){
 return exclusive(async()=>{const raw=rawValue(),v=asVault(raw);if(!raw||!v)throw Error('Kho hồ sơ chưa khóa.');
  try{const key=await derive(pin,decode(v.salt));
   const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(v.iv),additionalData:enc.encode('tuvivn-encrypted:v1')},key,decode(v.ciphertext));
   const profiles=validateProfiles(JSON.parse(dec.decode(clear)));if(rawValue()!==raw)throw Error('Đã thay đổi');unlocked={raw,key,profiles};
  }catch{unlocked=null;throw Error('PIN không đúng hoặc dữ liệu mã hóa đã hỏng.');}
 });
}
export function relockProfiles(){if(busy)throw Error('Đang xử lý hồ sơ.');unlocked=null;}
export async function disableProfileLock(){
 return exclusive(async()=>{if(profileStatus()!=='unlocked')throw Error('Hãy mở khóa trước.');const before=rawValue(),list=readStrict();writeChecked(before,JSON.stringify(list));unlocked=null;});
}
// Compatibility API for unencrypted callers. Encrypted writes use the async APIs below.
export function saveProfile(birth:BirthInfo):SavedProfile{
 const item=newItem(birth);if(busy||profileStatus()!=='plain')throw Error('Kho hồ sơ đang khóa hoặc bận.');
 const before=rawValue();writeChecked(before,JSON.stringify(merge(readStrict(),[item])));return item;
}
export async function saveProfiles(births:BirthInfo[]):Promise<SavedProfile[]>{
 return exclusive(async()=>{const before=rawValue(),list=readStrict(),items=births.map(newItem);await persist(merge(list,items),before);return items;});
}
export async function deleteProfile(id:string){return exclusive(async()=>{const before=rawValue();await persist(readStrict().filter(p=>p.id!==id),before);});}
export async function deleteAllProfiles(){return exclusive(async()=>{const before=rawValue();readStrict();await persist([],before);});}
export function removeProfile(id:string){if(profileStatus()!=='plain'||busy)throw Error('Kho hồ sơ đang khóa hoặc bận.');const before=rawValue();writeChecked(before,JSON.stringify(readStrict().filter(p=>p.id!==id)));}
export function clearProfiles(){if(profileStatus()!=='plain'||busy)throw Error('Kho hồ sơ đang khóa hoặc bận.');storage().removeItem(KEY);}
export function exportProfiles():string{return JSON.stringify({format:'tuvivn-profiles',version:1,profiles:readStrict()},null,2);}
export async function importProfiles(json:string):Promise<number>{
 if(json.length>1000000)throw Error('Tệp quá lớn.');
 return exclusive(async()=>{const data=JSON.parse(json);if(data?.format!=='tuvivn-profiles'||data.version!==1)throw Error('Tệp JSON không đúng định dạng hồ sơ.');
  const incoming=validateProfiles(data.profiles),before=rawValue(),old=readStrict();
  const ids=new Set(old.map(p=>p.id));const items=incoming.filter(p=>!ids.has(p.id));await persist(merge(old,items),before);return items.length;
 });
}
export function queueProfile(id:string){if(typeof sessionStorage!=='undefined')sessionStorage.setItem(OPEN_KEY,id);}
export function takeQueuedProfile():SavedProfile|null{
 if(typeof sessionStorage==='undefined')return null;
 const id=sessionStorage.getItem(OPEN_KEY);if(!id)return null;sessionStorage.removeItem(OPEN_KEY);return readProfiles().find(p=>p.id===id)||null;
}
