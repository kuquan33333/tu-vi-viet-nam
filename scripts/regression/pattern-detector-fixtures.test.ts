/**
 * Synthetic unit fixtures for the 41 detector functions / 46 emitted variants.
 * These are tests of the current code contracts, not assertions of classical
 * authority or real historical natal charts. Each positive has a one-star
 * negative control and a canonical-ID-only version.
 */
import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as nodeModule from 'node:module';
import {generateChart} from '../../lib/ziwei/algorithm';
import {starId,siHuaId,PalaceId} from '../../lib/ziwei/identity';
import {SCHOOL_STAR_ID_TO_NAME} from '../../lib/ziwei/school-data';
import type {ZiweiChart,Star,SiHua} from '../../lib/ziwei/types';
type HookResult={url?:string;format?:string;source?:string;shortCircuit?:boolean};
const {registerHooks}=nodeModule as unknown as {registerHooks(hooks:{resolve(specifier:string,context:unknown,next:(s:string,c:unknown)=>HookResult):HookResult;load(url:string,context:unknown,next:(u:string,c:unknown)=>HookResult):HookResult}):void};
const stub='data:text/javascript,';
registerHooks({resolve(s,c,n){return s==='server-only'?{url:stub,shortCircuit:true}:n(s,c)},load(u,c,n){return u===stub?{format:'commonjs',source:'',shortCircuit:true}:n(u,c)}});
type Placement=[branch:number,name:string,hua?:SiHua];
type Case={name:string;stars:Placement[];ming?:number;shen?:number};
const cases:Case[]=[
 {name:'Quân Thần Khánh Hội',stars:[[0,'紫微'],[4,'左辅'],[8,'右弼']]},
 {name:'Tử Phủ Đồng Cung',stars:[[0,'紫微'],[0,'天府']]},
 {name:'Phủ Tướng Triều Viên',stars:[[4,'天府'],[8,'天相']]},
 {name:'Dương Lương Xương Lộc',stars:[[0,'太阳'],[4,'天梁'],[8,'文昌'],[6,'禄存']]},
 {name:'Hỏa Tham Cách',stars:[[0,'贪狼'],[4,'火星']]},
 {name:'Linh Tham Cách',stars:[[0,'贪狼'],[4,'铃星']]},
 {name:'Vũ Tham Đồng Hành',stars:[[0,'武曲'],[6,'贪狼']]},
 {name:'Sát Phá Tham',stars:[[0,'七杀'],[4,'破军'],[8,'贪狼']]},
 {name:'Cơ Nguyệt Đồng Lương',stars:[[0,'天机'],[4,'太阴'],[8,'天同'],[6,'天梁']]},
 {name:'Liêm Tướng Đồng Cung',stars:[[0,'廉贞'],[0,'天相']]},
 {name:'Vũ Sát Đồng Cung',stars:[[0,'武曲'],[0,'七杀']]},
 {name:'Đồng Lương Đồng Cung',stars:[[0,'天同'],[0,'天梁']]},
 {name:'Nhật Nguyệt Đồng Cung',stars:[[1,'太阳'],[1,'太阴']]},
 {name:'Nhật Nguyệt Giáp Mệnh',stars:[[11,'太阳'],[1,'太阴']]},
 {name:'Cự Nhật Đồng Cung',stars:[[2,'巨门'],[2,'太阳']]},
 {name:'Thạch Trung Ẩn Ngọc',stars:[[0,'巨门']]},
 {name:'Minh Châu Xuất Hải',ming:7,stars:[[1,'太阳'],[1,'太阴']]},
 {name:'Tử Vi Nhập Mệnh',stars:[[0,'紫微']]},
 {name:'Phụ Bật Giáp Mệnh',stars:[[11,'左辅'],[1,'右弼']]},
 {name:'Xương Khúc Giáp Mệnh',stars:[[11,'文昌'],[1,'文曲']]},
 {name:'Khôi Việt Giáp Mệnh',stars:[[11,'天魁'],[1,'天钺']]},
 {name:'Song Lộc Triều Viên',stars:[[0,'武曲','Lộc'],[4,'禄存']]},
 {name:'Tam Kỳ Gia Hội',stars:[[0,'武曲','Lộc'],[4,'紫微','Quyền'],[8,'天机','Khoa']]},
 {name:'Hóa Lộc Nhập Mệnh',stars:[[0,'武曲','Lộc']]},
 {name:'Hóa Kỵ Nhập Mệnh Thiên Di',stars:[[6,'巨门','Kỵ']]},
 {name:'Kình Đà Giáp Kỵ',stars:[[0,'巨门','Kỵ'],[11,'擎羊'],[1,'陀罗']]},
 {name:'Hỏa Linh Giáp Mệnh',stars:[[11,'火星'],[1,'铃星']]},
 {name:'Không Kiếp Giáp Mệnh',stars:[[11,'地空'],[1,'地劫']]},
 {name:'Liêm Sát Kình',stars:[[0,'廉贞'],[4,'七杀'],[8,'擎羊']]},
 {name:'Cự Hỏa Kình',stars:[[0,'巨门'],[4,'火星'],[8,'擎羊']]},
 {name:'Linh Xương Đà Vũ',stars:[[0,'铃星'],[4,'文昌'],[8,'陀罗'],[6,'武曲']]},
 {name:'Mã Đầu Đới Tiễn',ming:6,stars:[[6,'擎羊']]},
 {name:'Lộc Tồn Thủ Mệnh',stars:[[0,'禄存']]},
 {name:'Lộc Tồn Thủ Thân',shen:2,stars:[[2,'禄存']]},
 {name:'Thiên Mã Nhập Mệnh',stars:[[0,'天马']]},
 {name:'Thiên Mã Tại Thiên Di',stars:[[6,'天马']]},
 {name:'Hóa Lộc Nhập Tài',stars:[[8,'武曲','Lộc']]},
 {name:'Hóa Quyền Nhập Quan',stars:[[4,'紫微','Quyền']]},
 {name:'Hóa Khoa Nhập Mệnh',stars:[[0,'天机','Khoa']]},
 {name:'Hóa Khoa Nhập Thân',shen:2,stars:[[2,'天机','Khoa']]},
 {name:'Cơ Nguyệt Đồng Lương – hội ba sao',stars:[[0,'天机'],[4,'太阴'],[8,'天同']]},
 {name:'Xương Khúc Tọa Mệnh',stars:[[0,'文昌'],[0,'文曲']]},
 {name:'Xương Khúc Đồng Hội',stars:[[0,'文昌'],[4,'文曲']]},
 {name:'Phụ Bật Đồng Hội',stars:[[0,'左辅'],[4,'右弼']]},
 {name:'Khôi Việt Đồng Hội',stars:[[0,'天魁'],[4,'天钺']]},
 {name:'Khoa Quyền Song Hội',stars:[[0,'天机','Khoa'],[4,'紫微','Quyền']]},
];
const base=generateChart({year:1990,month:5,day:6,hour:4,gender:'male'});
const palaceNames=['Mệnh','Huynh Đệ','Phu Thê','Tử Tức','Tài Bạch','Tật Ách','Thiên Di','Nô Bộc (Giao Hữu)','Quan Lộc','Điền Trạch','Phúc Đức','Phụ Mẫu'];
function fixture(c:Case,mode:'vi'|'cn'|'id',negative=false):ZiweiChart{
 const chart=structuredClone(base);
 chart.mingGongBranch=c.ming??0;chart.shenGongBranch=c.shen??2;
 for(const p of chart.palaces){
  p.stars=[];
  p.id=((chart.mingGongBranch-p.branch+12)%12) as PalaceId;
  p.name=palaceNames[p.id];p.isMingGong=p.branch===chart.mingGongBranch;p.isShenGong=p.branch===chart.shenGongBranch;
 }
 for(const [branch,cn,hua] of negative?c.stars.slice(0,-1):c.stars){
  const id=starId(cn);assert.ok(id,cn);
  const name=mode==='cn'?cn:mode==='vi'?SCHOOL_STAR_ID_TO_NAME[id]:'star-'+id;
  const s:Star={name,type:id<=14?'major':'minor',brightness:'normal'};
  if(mode==='id'){s.id=id;s.siHuaId=siHuaId(hua);}else s.siHua=hua;
  chart.palaces.find(p=>p.branch===branch)!.stars.push(s);
 }
 return chart;
}
for(const c of cases){
 test('L2 fixture VI/CN: '+c.name,async()=>{
  const {detectPatterns}=await import('../../lib/ziwei/patterns');
  for(const mode of ['vi','cn'] as const){
   const p=detectPatterns(fixture(c,mode)).find(p=>p.name===c.name);assert.ok(p,mode+' missing '+c.name);
   assert.doesNotMatch(p.description,/\p{Script=Han}/u);
   assert.ok(p.conditions?.required.length);
   for(const t of [...(p.conditions?.required||[]),...(p.conditions?.bonus||[]),...(p.conditions?.breaking||[])])assert.doesNotMatch(t,/\p{Script=Han}/u);
   assert.ok(!detectPatterns(fixture(c,mode,true)).some(p=>p.name===c.name),mode+' false positive '+c.name);
  }
 });
 test('E5 fixture canonical ID: '+c.name,async()=>{
  const {detectPatterns}=await import('../../lib/ziwei/patterns');
  assert.ok(detectPatterns(fixture(c,'id')).some(p=>p.name===c.name),'ID missing '+c.name);
  assert.ok(!detectPatterns(fixture(c,'id',true)).some(p=>p.name===c.name),'ID false positive '+c.name);
 });
}
test('L2: Mệnh/Thân cùng cung không lặp cách Hóa Khoa',async()=>{
 const {detectPatterns}=await import('../../lib/ziwei/patterns');
 const c=fixture({name:'',ming:0,shen:0,stars:[[0,'天机','Khoa']]},'vi');
 assert.equal(detectPatterns(c).filter(p=>p.name==='Hóa Khoa Nhập Mệnh').length,1);
});
test('L2: fixture inventory covers all 46 emitted variants',()=>assert.equal(new Set(cases.map(c=>c.name)).size,46));
