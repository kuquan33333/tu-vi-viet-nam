/**
 * Kỳ Môn Độn Giáp — lớp ĐỊA BÀN dùng cho học tập.
 * Theo cấu trúc bảng JIEQI_JU, YIQI_ORDER trong:
 * qilaidev/metaphysics-engine (MIT, https://github.com/qilaidev/metaphysics-engine).
 * Chưa tính Thiên bàn, trực phù/trực sử theo giờ; tuyệt đối không coi là full thời gia bàn.
 */
export type Term = keyof typeof TERM_RULES;
export interface QimenPalace {
  index:number; name:string; direction:string; element:string;
  earthStem:string; originalStar:string; originalGate:string;
}
export const TERM_RULES = {
 'Đông chí': {yang:true, ju:[1,7,4]}, 'Tiểu hàn':{yang:true,ju:[2,8,5]},
 'Đại hàn':{yang:true,ju:[3,9,6]}, 'Lập xuân':{yang:true,ju:[8,5,2]},
 'Vũ thủy':{yang:true,ju:[9,6,3]}, 'Kinh trập':{yang:true,ju:[1,7,4]},
 'Xuân phân':{yang:true,ju:[3,9,6]}, 'Thanh minh':{yang:true,ju:[4,1,7]},
 'Cốc vũ':{yang:true,ju:[5,2,8]}, 'Lập hạ':{yang:true,ju:[4,1,7]},
 'Tiểu mãn':{yang:true,ju:[5,2,8]}, 'Mang chủng':{yang:true,ju:[6,3,9]},
 'Hạ chí':{yang:false,ju:[9,3,6]}, 'Tiểu thử':{yang:false,ju:[8,2,5]},
 'Đại thử':{yang:false,ju:[7,1,4]}, 'Lập thu':{yang:false,ju:[2,5,8]},
 'Xử thử':{yang:false,ju:[1,4,7]}, 'Bạch lộ':{yang:false,ju:[9,3,6]},
 'Thu phân':{yang:false,ju:[7,1,4]}, 'Hàn lộ':{yang:false,ju:[6,9,3]},
 'Sương giáng':{yang:false,ju:[5,8,2]}, 'Lập đông':{yang:false,ju:[6,9,3]},
 'Tiểu tuyết':{yang:false,ju:[5,8,2]}, 'Đại tuyết':{yang:false,ju:[4,7,1]},
} as const;
export const TERM_NAMES=Object.keys(TERM_RULES) as Term[];
export const PALACE_LAYOUT=[4,9,2,3,5,7,8,1,6] as const;
const STEMS=['Mậu','Kỷ','Canh','Tân','Nhâm','Quý','Đinh','Bính','Ất'];
const BASE:Record<number,{name:string;direction:string;element:string;star:string;gate:string}>={
 1:{name:'Khảm',direction:'Bắc',element:'Thủy',star:'Thiên Bồng',gate:'Hưu môn'},
 2:{name:'Khôn',direction:'Tây Nam',element:'Thổ',star:'Thiên Nhuế',gate:'Tử môn'},
 3:{name:'Chấn',direction:'Đông',element:'Mộc',star:'Thiên Xung',gate:'Thương môn'},
 4:{name:'Tốn',direction:'Đông Nam',element:'Mộc',star:'Thiên Phụ',gate:'Đỗ môn'},
 5:{name:'Trung cung',direction:'Trung tâm',element:'Thổ',star:'Thiên Cầm',gate:'Không có môn'},
 6:{name:'Càn',direction:'Tây Bắc',element:'Kim',star:'Thiên Tâm',gate:'Khai môn'},
 7:{name:'Đoài',direction:'Tây',element:'Kim',star:'Thiên Trụ',gate:'Kinh môn'},
 8:{name:'Cấn',direction:'Đông Bắc',element:'Thổ',star:'Thiên Nhậm',gate:'Sinh môn'},
 9:{name:'Ly',direction:'Nam',element:'Hỏa',star:'Thiên Anh',gate:'Cảnh môn'},
};
// Array phiên bản tường minh, giữ metadata để trang có thể hiển thị cùng phép tính.
export function buildEarthPlate(term:Term,yuan:0|1|2) {
 const rule=TERM_RULES[term]; if(!rule) throw new Error('Tiết khí không tồn tại');
 const ju=rule.ju[yuan],yang=rule.yang;
 const stems:Record<number,string>={};
 STEMS.forEach((stem,i)=>{const n=((ju-1+(yang?i:-i))%9+9)%9+1;stems[n]=stem;});
 const palaces:QimenPalace[]=PALACE_LAYOUT.map(index=>({
  index,name:BASE[index].name,direction:BASE[index].direction,element:BASE[index].element,
  earthStem:stems[index],originalStar:BASE[index].star,originalGate:BASE[index].gate,
 }));
 return {ju,yang,term,yuan,palaces};
}
