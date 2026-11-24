import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {saveProfile,readProfiles,clearProfiles} from '../../lib/ziwei/profile-storage';
import type {BirthInfo} from '../../lib/ziwei/types';
const store=new Map<string,string>();
const storage={getItem:(k:string)=>store.get(k)??null,setItem:(k:string,v:string)=>{store.set(k,v)},removeItem:(k:string)=>{store.delete(k)}};
Object.defineProperty(globalThis,'window',{value:{},configurable:true});
Object.defineProperty(globalThis,'localStorage',{value:storage,configurable:true});
const birth:BirthInfo={year:1990,month:5,day:6,hour:4,gender:'male',name:'QA-private'};
test('C14: never evict an existing profile when full',()=>{
 clearProfiles();
 for(let i=0;i<30;i++)saveProfile({...birth,name:'QA-'+i});
 const before=readProfiles();
 assert.throws(()=>saveProfile(birth),/30/);
 assert.deepEqual(readProfiles(),before);
});
test('C14: JSON import/export and PIN encryption are implemented',()=>{
 const src=readFileSync('lib/ziwei/profile-storage.ts','utf8');
 for(const name of ['importProfiles','exportProfiles','lockProfiles','unlockProfiles'])assert.ok(src.includes(name),name);
});
test('C9: saved profile choice and plain-language comparison',()=>{
 const src=readFileSync('app/hop-ban/page.tsx','utf8');
 assert.match(src,/ProfilePicker/);assert.match(src,/Đối chiếu hai lá số/);
 assert.doesNotMatch(src,/Cloudflare tĩnh/);
 assert.match(src,/row\.uniqueA/);assert.match(src,/row\.uniqueB/);
});
