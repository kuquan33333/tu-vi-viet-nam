/**
 * 24 sơn hướng + cung phi Bát Trạch, phần tính tham khảo nghiên cứu văn hóa.
 * Góc đo tính theo độ Bắc = 0, thuận chiều kim đồng hồ.
 * Cung phi được tính theo năm Bát Trạch đã quy đổi sau Lập Xuân,
 * không tự suy đoán ngày giao tiết chính xác.
 */
export const DIRECTIONS = [
 {key:'N',name:'Bắc',degree:0,group:'Đông tứ'},
 {key:'NE',name:'Đông Bắc',degree:45,group:'Tây tứ'},
 {key:'E',name:'Đông',degree:90,group:'Đông tứ'},
 {key:'SE',name:'Đông Nam',degree:135,group:'Đông tứ'},
 {key:'S',name:'Nam',degree:180,group:'Đông tứ'},
 {key:'SW',name:'Tây Nam',degree:225,group:'Tây tứ'},
 {key:'W',name:'Tây',degree:270,group:'Tây tứ'},
 {key:'NW',name:'Tây Bắc',degree:315,group:'Tây tứ'},
] as const;
export type Dir=typeof DIRECTIONS[number]['key'];
const MOUNTAINS = ['Tý','Quý','Sửu','Cấn','Dần','Giáp','Mão','Ất','Thìn','Tốn','Tỵ','Bính','Ngọ','Đinh','Mùi','Khôn','Thân','Canh','Dậu','Tân','Tuất','Càn','Hợi','Nhâm'] as const;
export function normalizeDegree(v:number):number {return ((v%360)+360)%360;}
export function mountainAt(v:number){
 const deg=normalizeDegree(v);
 const index=Math.floor((deg+7.5)/15)%24;
 return {name:MOUNTAINS[index],center:index*15,from:normalizeDegree(index*15-7.5),to:normalizeDegree(index*15+7.5),index};
}
export function directionAt(v:number){
 const index=Math.floor((normalizeDegree(v)+22.5)/45)%8;
 return DIRECTIONS[index];
}
const REDUCE=(n:number):number=>{let x=Math.abs(n);while(x>9)x=String(x).split('').reduce((a,d)=>a+Number(d),0);return x;};
export type Gender='nam'|'nu';
export interface Kua{number:number;name:string;group:'Đông tứ'|'Tây tứ';home:Dir;good:Record<string,Dir>}
export const KUA:Record<number,Kua>={
 1:{number:1,name:'Khảm',group:'Đông tứ',home:'N',good:{'Sinh Khí':'SE','Thiên Y':'E','Diên Niên':'S','Phục Vị':'N'}},
 2:{number:2,name:'Khôn',group:'Tây tứ',home:'SW',good:{'Sinh Khí':'NE','Thiên Y':'W','Diên Niên':'NW','Phục Vị':'SW'}},
 3:{number:3,name:'Chấn',group:'Đông tứ',home:'E',good:{'Sinh Khí':'S','Thiên Y':'N','Diên Niên':'SE','Phục Vị':'E'}},
 4:{number:4,name:'Tốn',group:'Đông tứ',home:'SE',good:{'Sinh Khí':'N','Thiên Y':'S','Diên Niên':'E','Phục Vị':'SE'}},
 6:{number:6,name:'Càn',group:'Tây tứ',home:'NW',good:{'Sinh Khí':'W','Thiên Y':'NE','Diên Niên':'SW','Phục Vị':'NW'}},
 7:{number:7,name:'Đoài',group:'Tây tứ',home:'W',good:{'Sinh Khí':'NW','Thiên Y':'SW','Diên Niên':'NE','Phục Vị':'W'}},
 8:{number:8,name:'Cấn',group:'Tây tứ',home:'NE',good:{'Sinh Khí':'SW','Thiên Y':'NW','Diên Niên':'W','Phục Vị':'NE'}},
 9:{number:9,name:'Ly',group:'Đông tứ',home:'S',good:{'Sinh Khí':'E','Thiên Y':'SE','Diên Niên':'N','Phục Vị':'S'}},
};
export function kuaFromYear(year:number,gender:Gender):Kua {
 if(!Number.isInteger(year)||year<1900||year>2099)throw Error('Năm chỉ hỗ trợ 1900–2099.');
 const digits=REDUCE(year%100);
 let value=year>=2000?(gender==='nam'?9-digits:6+digits):(gender==='nam'?10-digits:5+digits);
 while(value<=0)value+=9;
 value=REDUCE(value);
 if(value===5)value=gender==='nam'?2:8;
 const result=KUA[value];
 if(!result)throw Error('Không xác định được cung phi.');
 return result;
}
export function directionName(key:Dir){return DIRECTIONS.find(d=>d.key===key)!.name;}
export function directionCategory(kua:Kua,dir:Dir){
 const good=Object.entries(kua.good).find(([,v])=>v===dir);
 return good?good[0]:'Ngoài nhóm bốn hướng cát';
}
