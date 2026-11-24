import {BRANCHES,STAR_DESCRIPTIONS} from '@/lib/ziwei/constants';
import {palaceId,starId,siHuaId} from './identity';
import type {Palace,Star,ZiweiChart,BirthInfo} from '@/lib/ziwei/types';

export function getMajorStars(palace:Palace):Star[]{
 return palace.stars.filter(s=>s.type==='major');
}
export function getPalaceFact(palace:Palace){
 const stars=getMajorStars(palace);
 return {
  label:palace.name,
  branch:BRANCHES[palace.branch],
  major:stars.map(x=>x.name),
  transformations:palace.stars.filter(x=>Boolean(x.siHua)).map(x=>x.name+' Hóa '+x.siHua),
  empty:stars.length===0,
 };
}
export function getStudyReading(chart:ZiweiChart,palace:Palace){
 const fact=getPalaceFact(palace);
 const intros= getMajorStars(palace).map(s=>({
  name:s.name,description:STAR_DESCRIPTIONS[s.name]||null,brightness:s.brightnessRaw||null,transformation:s.siHua||null
 }));
 const opposite=chart.palaces.find(x=>x.branch===(palace.branch+6)%12);
 return {
  fact,intros,
  opposite:opposite ? {name:opposite.name,branch:BRANCHES[opposite.branch],major:getMajorStars(opposite).map(x=>x.name)}:null,
  trine:chart.palaces.filter(x=>[(palace.branch+4)%12,(palace.branch+8)%12].includes(x.branch)).map(x=>({name:x.name,major:getMajorStars(x).map(s=>s.name)})),
 };
}
export function chartLabel(birth:BirthInfo){
 return birth.name?.trim()||'Lá số '+String(birth.day).padStart(2,'0')+'/'+String(birth.month).padStart(2,'0')+'/'+birth.year;
}
export interface SynastryRow {
 name:string;
 a:string[];
 b:string[];
 shared:string[];
 uniqueA:string[];
 uniqueB:string[];
 branchA:string;branchB:string;huaA:string[];huaB:string[];
}
export function compareCharts(a:ZiweiChart,b:ZiweiChart):SynastryRow[]{
 const names=['Mệnh','Phu Thê','Phúc Đức','Tài Bạch','Quan Lộc','Thiên Di','Điền Trạch','Tử Tức','Phụ Mẫu','Huynh Đệ','Tật Ách','Nô Bộc'];
 return names.map(name=>{
  const find=(chart:ZiweiChart)=>chart.palaces.find(p=>(p.id??palaceId(p.name))===palaceId(name));
  const aa=find(a),bb=find(b);
  const as=aa?getMajorStars(aa):[],bs=bb?getMajorStars(bb):[];
  const key=(s:Star)=>s.id??starId(s.name)??s.name;
  const ak=new Set(as.map(key)),bk=new Set(bs.map(key));
  const hua=(p:Palace|undefined)=>p?.stars.filter(s=>s.siHua||s.siHuaId).map(s=>s.name+' Hóa '+(['','Lộc','Quyền','Khoa','Kỵ'][s.siHuaId??siHuaId(s.siHua)??0]||s.siHua))??[];
  return {name,a:as.map(s=>s.name),b:bs.map(s=>s.name),shared:as.filter(s=>bk.has(key(s))).map(s=>s.name),uniqueA:as.filter(s=>!bk.has(key(s))).map(s=>s.name),uniqueB:bs.filter(s=>!ak.has(key(s))).map(s=>s.name),branchA:aa?BRANCHES[aa.branch]:'—',branchB:bb?BRANCHES[bb.branch]:'—',huaA:hua(aa),huaB:hua(bb)};
 });
}
export function getSynastryFacts(a:ZiweiChart,b:ZiweiChart){
 const ma=a.palaces.find(p=>p.branch===a.mingGongBranch);
 const mb=b.palaces.find(p=>p.branch===b.mingGongBranch);
 return {
  aMing:ma?getPalaceFact(ma):null,bMing:mb?getPalaceFact(mb):null,
  sameJu:a.wuxingJu===b.wuxingJu,
  sameMingBranch:a.mingGongBranch===b.mingGongBranch,
  years:[a.lunarInfo.lunarYear,b.lunarInfo.lunarYear],
  rows:compareCharts(a,b),
 };
}
export const READING_NOTICE='Đây là cách trình bày dữ liệu lá số theo học thuyết Tử Vi truyền thống; không có cơ sở để xác định mức độ tương hợp hay tiên đoán chắc chắn sự kiện đời sống.';
