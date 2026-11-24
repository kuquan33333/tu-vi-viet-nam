import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {saveProfile,readProfiles,clearProfiles,lockProfiles,unlockProfiles,relockProfiles,saveProfiles,exportProfiles,importProfiles,deleteAllProfiles,profileStatus,disableProfileLock} from '../../lib/ziwei/profile-storage';
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

test('C14: encrypted storage, wrong PIN, atomic writes and JSON roundtrip',async()=>{
 clearProfiles();saveProfile(birth);
 const backup=exportProfiles();
 await lockProfiles('73918426');
 assert.equal(profileStatus(),'locked');assert.deepEqual(readProfiles(),[]);
 assert.ok(![...store.values()].join('').includes('QA-private'));
 await assert.rejects(unlockProfiles('00000000'),/PIN/);
 await assert.rejects(saveProfiles([birth]),/khóa/);
 await unlockProfiles('73918426');assert.equal(readProfiles().length,1);
 await saveProfiles([{...birth,name:'QA-second'}]);assert.equal(readProfiles().length,2);
 assert.ok(![...store.values()].join('').includes('QA-second'));
 assert.equal(await importProfiles(backup),0);
 const before=exportProfiles();
 await assert.rejects(importProfiles(JSON.stringify({format:'tuvivn-profiles',version:1,profiles:[{id:'bad',title:'bad',savedAt:new Date().toISOString(),birth:{...birth,day:99}}]})));
 assert.equal(exportProfiles(),before);
 relockProfiles();assert.deepEqual(readProfiles(),[]);
 await unlockProfiles('73918426');assert.equal(readProfiles().length,2);
 await deleteAllProfiles();assert.equal(readProfiles().length,0);
 await disableProfileLock();assert.equal(profileStatus(),'plain');
 assert.equal(await importProfiles(backup),1);assert.equal(readProfiles()[0].birth.name,'QA-private');
});
