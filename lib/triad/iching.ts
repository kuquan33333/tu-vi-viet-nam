/**
 * Chu Dịch: 64 quẻ theo thứ tự Văn Vương.
 * Các quẻ được lập bằng 6 hào từ DƯỚI lên TRÊN.
 * Tên quẻ / ý chính là tri thức cổ học; không thay thế văn bản kinh điển.
 * Phần gieo 3 đồng xu lấy xác suất hào 6/7/8/9 tương ứng 1/8,3/8,3/8,1/8.
 */
export type LineValue = 6 | 7 | 8 | 9;
export type TrigramKey = 'can' | 'doai' | 'ly' | 'chan' | 'ton' | 'kham' | 'canN' | 'khon';
export const TRIGRAMS: {key: TrigramKey; label: string; symbol: string; bits: string; nature: string}[] = [
  {key:'can',label:'Càn',symbol:'☰',bits:'111',nature:'Trời'},
  {key:'doai',label:'Đoài',symbol:'☱',bits:'110',nature:'Đầm'},
  {key:'ly',label:'Ly',symbol:'☲',bits:'101',nature:'Lửa'},
  {key:'chan',label:'Chấn',symbol:'☳',bits:'100',nature:'Sấm'},
  {key:'ton',label:'Tốn',symbol:'☴',bits:'011',nature:'Gió'},
  {key:'kham',label:'Khảm',symbol:'☵',bits:'010',nature:'Nước'},
  {key:'canN',label:'Cấn',symbol:'☶',bits:'001',nature:'Núi'},
  {key:'khon',label:'Khôn',symbol:'☷',bits:'000',nature:'Đất'},
];
const NAMES = 'Thuần Càn|Thuần Khôn|Thủy Lôi Truân|Sơn Thủy Mông|Thủy Thiên Nhu|Thiên Thủy Tụng|Địa Thủy Sư|Thủy Địa Tỷ|Phong Thiên Tiểu Súc|Thiên Trạch Lý|Địa Thiên Thái|Thiên Địa Bĩ|Thiên Hỏa Đồng Nhân|Hỏa Thiên Đại Hữu|Địa Sơn Khiêm|Lôi Địa Dự|Trạch Lôi Tùy|Sơn Phong Cổ|Địa Trạch Lâm|Phong Địa Quán|Hỏa Lôi Phệ Hạp|Sơn Hỏa Bí|Sơn Địa Bác|Địa Lôi Phục|Thiên Lôi Vô Vọng|Sơn Thiên Đại Súc|Sơn Lôi Di|Trạch Phong Đại Quá|Thuần Khảm|Thuần Ly|Trạch Sơn Hàm|Lôi Phong Hằng|Thiên Sơn Độn|Lôi Thiên Đại Tráng|Hỏa Địa Tấn|Địa Hỏa Minh Di|Phong Hỏa Gia Nhân|Hỏa Trạch Khuê|Thủy Sơn Kiển|Lôi Thủy Giải|Sơn Trạch Tổn|Phong Lôi Ích|Trạch Thiên Quải|Thiên Phong Cấu|Trạch Địa Tụy|Địa Phong Thăng|Trạch Thủy Khốn|Thủy Phong Tỉnh|Trạch Hỏa Cách|Hỏa Phong Đỉnh|Thuần Chấn|Thuần Cấn|Phong Sơn Tiệm|Lôi Trạch Quy Muội|Lôi Hỏa Phong|Hỏa Sơn Lữ|Thuần Tốn|Thuần Đoài|Phong Thủy Hoán|Thủy Trạch Tiết|Phong Trạch Trung Phu|Lôi Sơn Tiểu Quá|Thủy Hỏa Ký Tế|Hỏa Thủy Vị Tế'.split('|');
const THEMES = 'Sáng tạo, khởi nguyên, mạnh mẽ|Tiếp nhận, nâng đỡ, bền bỉ|Khó khăn bước đầu, khai mở|Học hỏi khi còn non trẻ|Chờ thời, kiên nhẫn|Tranh chấp, thận trọng|Kỷ luật, tổ chức tập thể|Đoàn kết, gần gũi|Tích lũy từ việc nhỏ|Lễ nghĩa, bước đi đúng mực|Giao hòa, thông thuận|Bế tắc, cần kiên trì|Đồng tâm, hợp tác|Sở hữu lớn, giữ đức|Khiêm nhường, giữ chính|Chuẩn bị và hứng khởi|Thuận theo điều hợp lý|Sửa điều hư cũ|Tiếp cận, dìu dắt|Quan sát, xem xét|Phân định, xử lý trở ngại|Vẻ đẹp và hình thức|Suy giảm, cần giữ gốc|Quay về điều đúng|Chân thực, tránh vọng động|Tích lũy năng lực|Nuôi dưỡng thân tâm|Gánh nặng vượt sức|Đối diện thử thách|Sáng tỏ, văn minh|Cảm ứng và tương hợp|Kiên trì, lâu bền|Biết lui để giữ sức|Sức mạnh cần đúng mực|Tiến lên, tỏa sáng|Giữ ánh sáng lúc khó khăn|Kỷ cương trong gia đình|Khác biệt, tìm điểm chung|Khó đi, phải xét đường|Cởi mở, tháo gỡ|Giảm bớt để cân bằng|Bồi đắp, cùng có lợi|Quyết đoán nhưng tỉnh táo|Gặp gỡ, chú ý giới hạn|Quần tụ, gắn kết|Đi lên từng bước|Khó khăn, giữ nội lực|Nguồn sống, chăm nền tảng|Đổi mới đúng thời|Thiết lập trật tự mới|Chấn động, ứng biến|Dừng lại để suy xét|Tiến triển dần dần|Quan hệ cần đúng vị|Sung túc nhưng không chủ quan|Đi xa, thích nghi|Thuận nhập, mềm dẻo|Vui vẻ, giao tiếp|Phân tán, tái kết nối|Tiết chế, giữ giới hạn|Thành thực, đáng tin|Việc nhỏ làm cho khéo|Đã xong, giữ ổn định|Chưa xong, hoàn tất từng bước'.split('|');
// Bảng Văn Vương: mỗi hàng là thượng quái, cột là hạ quái.
// Thứ tự cột/hàng: Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn.
const KWW: number[][] = [
 [1,10,13,25,44,6,33,12],
 [43,58,49,17,28,47,31,45],
 [14,38,30,21,50,64,56,35],
 [34,54,55,51,32,40,62,16],
 [9,61,37,42,57,59,53,20],
 [5,60,63,3,48,29,39,8],
 [26,41,22,27,18,4,52,23],
 [11,19,36,24,46,7,15,2],
];
export interface Hexagram {
  number: number;
  name: string;
  theme: string;
  upper: typeof TRIGRAMS[number];
  lower: typeof TRIGRAMS[number];
}
export const HEXAGRAMS: Hexagram[] = KWW.flatMap((row, r) =>
  row.map((number, c) => ({
    number, name: NAMES[number - 1], theme: THEMES[number - 1],
    upper: TRIGRAMS[r], lower: TRIGRAMS[c],
  }))
).sort((a,b)=>a.number-b.number);
export function hexFromLines(lines: readonly number[]): Hexagram {
  if (lines.length !== 6) throw new Error('Lá quẻ phải có đủ sáu hào.');
  const lowerBits = lines.slice(0,3).map(v => (v === 7 || v === 9) ? '1' : '0').join('');
  const upperBits = lines.slice(3,6).map(v => (v === 7 || v === 9) ? '1' : '0').join('');
  const lower = TRIGRAMS.findIndex(t => t.bits === lowerBits);
  const upper = TRIGRAMS.findIndex(t => t.bits === upperBits);
  return HEXAGRAMS[KWW[upper][lower] - 1];
}
function coin(): number {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
    const bytes = new Uint32Array(1);
    window.crypto.getRandomValues(bytes);
    return bytes[0] % 2;
  }
  return Math.random() < .5 ? 0 : 1;
}
export function castHexagram(): LineValue[] {
  return Array.from({length:6}, () => (6 + coin() + coin() + coin()) as LineValue);
}
export function changedLines(lines: readonly LineValue[]): LineValue[] {
  return lines.map(n => n === 6 ? 7 : n === 9 ? 8 : n) as LineValue[];
}
export function readingRule(moving: number): string {
  return [
    'Không có hào động: đọc quái từ quẻ chủ để chiêm nghiệm.',
    'Một hào động: xem quái từ và hào từ của hào động.',
    'Hai hào động: đối chiếu hai hào từ; tham khảo quy tắc Chu Hy.',
    'Ba hào động: đối chiếu quẻ chủ và quẻ biến.',
    'Bốn hào động: xem hai hào tĩnh của quẻ biến.',
    'Năm hào động: xem hào tĩnh còn lại của quẻ biến.',
    'Sáu hào động: xem quẻ biến; Càn, Khôn có quy tắc đặc biệt.',
  ][Math.max(0,Math.min(6,moving))];
}
export const LINE_GUIDE = 'Các hào đánh số từ 1 ở dưới lên 6 ở trên. 6 = lão âm (động), 7 = thiếu dương, 8 = thiếu âm, 9 = lão dương (động).';
