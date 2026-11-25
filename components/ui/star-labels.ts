// Presentation-only aliases for auxiliary names not localized by the legacy engine.
// Keep original names and IDs for all calculations, callbacks and description lookups.
const extra: Readonly<Record<string,string>> = {
 '天月':'Thiên Nguyệt', '天厨':'Thiên Trù', '天廚':'Thiên Trù',
 '台辅':'Đài Phụ', '台輔':'Đài Phụ', '臺輔':'Đài Phụ',
 '天巫':'Thiên Vu', '月德':'Nguyệt Đức', '劫煞':'Kiếp Sát',
 '封诰':'Phong Cáo', '封誥':'Phong Cáo', '诰':'Cáo', '誥':'Cáo',
};
export function starLabel(name:string):string {
 return Object.prototype.hasOwnProperty.call(extra,name)?extra[name]:name;
}
