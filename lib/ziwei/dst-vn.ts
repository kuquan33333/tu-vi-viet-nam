/**
 * Lịch sử thay đổi múi giờ và Giờ Mùa Hè tại Việt Nam trong thế kỷ 20.
 *
 * Trong lịch sử, Việt Nam từng có các giai đoạn áp dụng múi giờ UTC+8 hoặc UTC+9:
 * 1. 01/01/1943 - 14/03/1945: Toàn quốc áp dụng UTC+8 (Pháp đổi giờ mùa hè Đông Dương, chênh +60 phút so với chuẩn UTC+7).
 * 2. 15/03/1945 - 01/09/1945: Toàn quốc áp dụng UTC+9 (Thời kỳ Nhật chiếm đóng, giờ Tokyo, chênh +120 phút so với chuẩn UTC+7).
 * 3. 01/04/1947 - 30/06/1955: Vùng Pháp kiểm soát áp dụng UTC+8 (Hà Nội và Miền Bắc về UTC+7 sau ngày 10/10/1954).
 * 4. 01/01/1960 - 12/06/1975: Miền Nam (từ vĩ tuyến 17 trở vào) áp dụng UTC+8 theo Sắc lệnh 362-TTP. Miền Bắc giữ UTC+7.
 *    Từ ngày 13/06/1975, toàn quốc thống nhất múi giờ chuẩn UTC+7.
 */

export interface VietnamTimezonePeriod {
  id: string;
  name: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  actualOffsetMinutes: number;   // 480 (UTC+8) hoặc 540 (UTC+9)
  standardOffsetMinutes: number; // 420 (UTC+7)
  deltaMinutes: number;          // -60 hoặc -120 (số phút cần trừ để về giờ chuẩn UTC+7)
  appliesTo: 'all' | 'south_only'; // Áp dụng toàn quốc hay chỉ vùng Nam vĩ tuyến 17
  description: string;
}

export const VN_TIMEZONE_PERIODS: VietnamTimezonePeriod[] = [
  {
    id: 'vn-ww2-french',
    name: 'Giờ Đông Dương UTC+8 (Thế chiến II)',
    startYear: 1943,
    startMonth: 1,
    startDay: 1,
    endYear: 1945,
    endMonth: 3,
    endDay: 14,
    actualOffsetMinutes: 480,
    standardOffsetMinutes: 420,
    deltaMinutes: -60,
    appliesTo: 'all',
    description: 'Chính quyền Đông Dương thuộc Pháp áp dụng giờ UTC+8 trên toàn quốc',
  },
  {
    id: 'vn-ww2-japanese',
    name: 'Giờ Tokyo UTC+9 (Thời kỳ Nhật chiếm đóng)',
    startYear: 1945,
    startMonth: 3,
    startDay: 15,
    endYear: 1945,
    endMonth: 9,
    endDay: 1,
    actualOffsetMinutes: 540,
    standardOffsetMinutes: 420,
    deltaMinutes: -120,
    appliesTo: 'all',
    description: 'Áp dụng giờ Tokyo UTC+9 trên toàn quốc trước ngày Quốc khánh 02/09/1945',
  },
  {
    id: 'vn-indochina-1947',
    name: 'Giờ Đông Dương UTC+8 (1947–1955)',
    startYear: 1947,
    startMonth: 4,
    startDay: 1,
    endYear: 1955,
    endMonth: 6,
    endDay: 30,
    actualOffsetMinutes: 480,
    standardOffsetMinutes: 420,
    deltaMinutes: -60,
    appliesTo: 'all', // Vùng kiểm soát của Pháp / Quốc gia Việt Nam
    description: 'Khu vực quản lý của Pháp/Quốc gia Việt Nam áp dụng UTC+8 (Miền Bắc trở về UTC+7 sau 10/10/1954)',
  },
  {
    id: 'vn-south-1960-1975',
    name: 'Giờ Miền Nam UTC+8 (1960–1975)',
    startYear: 1960,
    startMonth: 1,
    startDay: 1,
    endYear: 1975,
    endMonth: 6,
    endDay: 12,
    actualOffsetMinutes: 480,
    standardOffsetMinutes: 420,
    deltaMinutes: -60,
    appliesTo: 'south_only',
    description: 'Việt Nam Cộng Hòa áp dụng múi giờ UTC+8 tại Miền Nam (từ vĩ tuyến 17 trở vào)',
  },
];

export interface VietnamDSTInfo {
  active: boolean;
  periodId: string;
  actualOffsetMinutes: number;
  standardOffsetMinutes: 420;
  deltaMinutes: number;
  periodLabel: string;
  startDate: string;
  endDate: string;
}

function isDateInRange(
  year: number,
  month: number,
  day: number,
  p: VietnamTimezonePeriod,
): boolean {
  const current = year * 10000 + month * 100 + day;
  const start = p.startYear * 10000 + p.startMonth * 100 + p.startDay;
  const end = p.endYear * 10000 + p.endMonth * 100 + p.endDay;
  return current >= start && current <= end;
}

/**
 * Kiểm tra xem ngày sinh và khu vực sinh có thuộc giai đoạn đổi múi giờ lịch sử tại Việt Nam hay không.
 *
 * @param year Năm dương lịch
 * @param month Tháng dương lịch (1-12)
 * @param day Ngày dương lịch (1-31)
 * @param isSouthOf17thParallel Cờ xác định nơi sinh nằm ở phía Nam vĩ tuyến 17 (từ Quảng Trị phía nam trở vào Cà Mau)
 */
export function getVietnamDSTInfo(
  year: number,
  month: number,
  day: number,
  isSouthOf17thParallel = false,
): VietnamDSTInfo | null {
  // The date-only compatibility API samples noon; use resolveHistoricalCivilTime for a birth clock.
  const offsets=resolveHistoricalCivilTime(year,month,day,12,0,0,isSouthOf17thParallel).offsets;
  const actual=offsets[0];
  if(actual===undefined||actual===420)return null;
  if(actual!==480&&actual!==540)return {active:true,periodId:'vn-local-mean-time',actualOffsetMinutes:actual,standardOffsetMinutes:420,deltaMinutes:420-actual,periodLabel:'Giờ địa phương lịch sử (IANA tzdb 2025b)',startDate:'01/01/1900',endDate:'30/04/1911'};
  for (const p of VN_TIMEZONE_PERIODS) {
    if (!isDateInRange(year, month, day, p) || p.actualOffsetMinutes!==actual) continue;

    // Giai đoạn sau 10/10/1954 của thời kỳ 1947–1955 chỉ áp dụng cho Miền Nam
    if (p.id === 'vn-indochina-1947' && (year > 1954 || (year === 1954 && (month > 10 || (month === 10 && day > 10))))) {
      if (!isSouthOf17thParallel) continue;
    }

    // Giai đoạn 1960–1975 chỉ áp dụng cho Miền Nam
    if (p.appliesTo === 'south_only' && !isSouthOf17thParallel) {
      continue;
    }

    return {
      active: true,
      periodId: p.id,
      actualOffsetMinutes: p.actualOffsetMinutes,
      standardOffsetMinutes: 420,
      deltaMinutes: p.deltaMinutes,
      periodLabel: `${p.name} (${p.description})`,
      startDate: `${String(p.startDay).padStart(2, '0')}/${String(p.startMonth).padStart(2, '0')}/${p.startYear}`,
      endDate: `${String(p.endDay).padStart(2, '0')}/${String(p.endMonth).padStart(2, '0')}/${p.endYear}`,
    };
  }
  return {active:true,periodId:'vn-transition',actualOffsetMinutes:actual,standardOffsetMinutes:420,deltaMinutes:420-actual,periodLabel:'Múi giờ lịch sử IANA tzdb 2025b',startDate:'',endDate:''};
}

/**
 * Kiểm tra nhanh một ngày có thuộc giai đoạn đổi múi giờ không
 */
export function isVietnamDST(year: number, month: number, day: number, isSouthOf17thParallel = false): boolean {
  return getVietnamDSTInfo(year, month, day, isSouthOf17thParallel) !== null;
}

/**
 * Năm có thuộc bất kỳ giai đoạn đổi múi giờ lịch sử nào không
 */
export function isVietnamDSTYear(year: number): boolean {
  return (year>=1900&&year<=1911)||year===1942||year===1959||VN_TIMEZONE_PERIODS.some((p) => year >= p.startYear && year <= p.endYear);
}

/**
 * Danh sách các năm có biến động múi giờ trong lịch sử Việt Nam
 */
export function vietnamDSTYears(): number[] {
  const years = new Set<number>([1942,1959,...Array.from({length:12},(_,i)=>1900+i)]);
  for (const p of VN_TIMEZONE_PERIODS) {
    for (let y = p.startYear; y <= p.endYear; y++) {
      years.add(y);
    }
  }
  return Array.from(years).sort((a, b) => a - b);
}

// ─── Tương thích ngược với các module gọi dst-cn cũ ───
export const getHistoricalTzPeriod = getVietnamDSTInfo;
export const isChinaDST = (y: number, m: number, d: number) => isVietnamDST(y, m, d, false);
export const isChinaDSTYear = isVietnamDSTYear;
export const chinaDSTYears = vietnamDSTYears;

// Source: IANA tzdb 2025b, asia (Asia/Ho_Chi_Minh) and backzone (Asia/Hanoi).
// https://github.com/eggert/tz/blob/2025b/asia
// https://github.com/eggert/tz/blob/2025b/backzone
// Transition UNTIL is in the old local time. Convert to UTC using the old offset.
// Hanoi represents northern history only approximately: Oct 1954 exact date/time
// is unknown, and pre-1970 regional records are incomplete.
type LocalBoundary = readonly [number,number,number,number,number,number];
type Era = {offsetSeconds:number;until?:LocalBoundary};
const boundary=(y:number,m:number,d:number,h=0,min=0,sec=0):LocalBoundary=>[y,m,d,h,min,sec];
const shared=(first:number):Era[]=>[
 {offsetSeconds:first,until:boundary(1906,7,1)},
 {offsetSeconds:25590,until:boundary(1911,5,1)},
 {offsetSeconds:25200,until:boundary(1942,12,31,23)},
 {offsetSeconds:28800,until:boundary(1945,3,14,23)},
 {offsetSeconds:32400,until:boundary(1945,9,2)},
 {offsetSeconds:25200,until:boundary(1947,4,1)},
];
const north:Era[]=[...shared(25404),{offsetSeconds:28800,until:boundary(1954,10,1)},{offsetSeconds:25200}];
const south:Era[]=[...shared(25590),{offsetSeconds:28800,until:boundary(1955,7,1,1)},{offsetSeconds:25200,until:boundary(1959,12,31,23)},{offsetSeconds:28800,until:boundary(1975,6,13)},{offsetSeconds:25200}];
const epoch=([y,m,d,h,min,sec]:LocalBoundary)=>Date.UTC(y,m-1,d,h,min,sec)/1000;
export function resolveHistoricalCivilTime(year:number,month:number,day:number,hour:number,minute:number,second:number,isSouth:boolean){
 const local=epoch(boundary(year,month,day,hour,minute,second));
 let start=-Infinity;
 const candidates:number[]=[];
 for(const era of isSouth?south:north){
  const end=era.until?epoch(era.until)-era.offsetSeconds:Infinity;
  const utc=local-era.offsetSeconds;
  if(utc>=start&&utc<end)candidates.push(era.offsetSeconds/60);
  start=end;
 }
 return {offsets:[...new Set(candidates)].sort((a,b)=>a-b),uncertain:!isSouth&&year===1954&&month===10};
}
