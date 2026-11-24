import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {formToBirthInfo,searchParamsToForm} from '../../lib/ziwei/share';
import {mountainAt,kuaFromYear} from '../../lib/triad/fengshui';
import type {BirthFormState} from '../../components/BirthForm';
const f:BirthFormState={name:'',year:'2000',month:'1',day:'31',clockHour:'23',clockMinute:'0',clockSecond:'0',unknownTime:false,province:'Tỉnh Gia Lai',city:'TP. Pleiku',longitude:108,gender:'male'};
test('C1: không mặc định nơi và giờ sinh',()=>{
 const src=readFileSync('components/BirthForm.tsx','utf8');
 for(const key of ['clockHour','clockMinute','province','city'])assert.match(src,new RegExp(key+": initialData\\?\\."+key+" \\?\\? ''"));
 const q=searchParamsToForm(new URLSearchParams('y=2000&m=1&d=31'));
 assert.equal(q?.clockHour,'');assert.equal(q?.clockMinute,'');
});
test('C2: không rõ giờ không được tự an giờ Tý',()=>assert.throws(()=>formToBirthInfo({...f,unknownTime:true})));
test('C3: ranh Tý khi không hiệu chỉnh mặt trời',()=>{
 for(const [h,m,day,month] of [['23','0',1,2],['23','59',1,2],['0','0',31,1],['0','59',31,1]] as const){
 const b=formToBirthInfo({...f,clockHour:h,clockMinute:m,trueSolar:false} as BirthFormState);
 assert.deepEqual([b.month,b.day,b.hour],[month,day,0]);
 }
 const b=formToBirthInfo({...f,trueSolar:false,lateZishi:'current-day'} as BirthFormState);
 assert.deepEqual([b.month,b.day,b.hour],[1,31,0]);
});
test('C10: tọa và hướng đối diện',()=>{
 const src=readFileSync('app/dia-ky/page.tsx','utf8');assert.match(src,/oppositeDegree|sittingDegree/);
 for(const x of [0,7.499,7.5,7.501,180,352.499,352.5,352.501])assert.equal((mountainAt(x+180).index-mountainAt(x).index+24)%24,12);
});
test('C11: cung phi 1900–2099, trung cung 5; ngoài phạm vi từ chối',()=>{
 for(let year=1900;year<=2099;year++)for(const sex of ['nam','nu'] as const){
 const dr=(n:number)=>((n-1)%9+9)%9+1;
 let k=dr(sex==='nam'?11-dr(year):dr(year)+4);
 if(k===5)k=sex==='nam'?2:8;
 assert.equal(kuaFromYear(year,sex).number,k,year+' '+sex);
 }
 assert.throws(()=>kuaFromYear(1800,'nam'));assert.throws(()=>kuaFromYear(2100,'nu'));
});
test('C12: biên La Kinh',()=>{for(const [a,n] of [[7.499,'Tý'],[7.5,'Quý'],[7.501,'Quý'],[352.499,'Nhâm'],[352.5,'Tý'],[352.501,'Tý']] as const)assert.equal(mountainAt(a).name,n)});
