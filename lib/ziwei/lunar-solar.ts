/**
 * Lịch âm UTC+7 dùng chung cho form, lịch và lá số. Legacy chỉ dùng cho đối chiếu/hồ sơ cũ.
 */
import { Lunar, LunarMonth, Solar } from 'lunar-javascript';
import {candidateMonths,candidateSolarToLunar,candidateLunarToSolar,CANDIDATE_VERSION} from './vn-calendar-candidate';
export {CANDIDATE_VERSION};

export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

export interface LunarDate {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
}

export const LUNAR_YEAR_MIN = 1900;
export const LUNAR_YEAR_MAX = 2050;

function isIntInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

/**
 * Số ngày của một tháng Âm lịch (29 hoặc 30 ngày).
 * Nếu tháng đó không tồn tại (ví dụ: không có tháng nhuận đó) thì trả về 0.
 */
export function legacyLunarMonthDayCount(year: number, month: number, isLeapMonth = false): number {
  if (!isIntInRange(year, LUNAR_YEAR_MIN, LUNAR_YEAR_MAX) || !isIntInRange(month, 1, 12)) return 0;
  try {
    const lm = LunarMonth.fromYm(year, isLeapMonth ? -month : month);
    const dayCount = lm?.getDayCount();
    return typeof dayCount === 'number' && Number.isInteger(dayCount) && dayCount > 0 ? dayCount : 0;
  } catch {
    return 0;
  }
}

/**
 * Tháng nhuận của năm Âm lịch (1-12). Nếu không có tháng nhuận trả về 0.
 */
export function leapMonthOfLunarYear(year: number): number {
  if (!isIntInRange(year, LUNAR_YEAR_MIN, LUNAR_YEAR_MAX)) return 0;
  for (let month = 1; month <= 12; month++) {
    if (lunarMonthDayCount(year, month, true) > 0) return month;
  }
  return 0;
}

/**
 * Kiểm tra ngày Âm lịch có hợp lệ hay không.
 */
export function isValidLunarDate(year: number, month: number, day: number, isLeapMonth = false): boolean {
  if (!isIntInRange(day, 1, 30)) return false;
  const dayCount = lunarMonthDayCount(year, month, isLeapMonth);
  return dayCount > 0 && day <= dayCount;
}

/**
 * Chuyển đổi Âm lịch sang Dương lịch.
 */
export function legacyLunarToSolar(year: number, month: number, day: number, isLeapMonth = false): SolarDate | null {
  if (!isIntInRange(day,1,30)||day>legacyLunarMonthDayCount(year,month,isLeapMonth)) return null;
  try {
    const solar = Lunar.fromYmd(year, isLeapMonth ? -month : month, day).getSolar();
    const result = { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
    if (!Number.isInteger(result.year) || !Number.isInteger(result.month) || !Number.isInteger(result.day)) return null;
    return result;
  } catch {
    return null;
  }
}

/**
 * Chuyển đổi Dương lịch sang Âm lịch.
 */
export function legacySolarToLunar(year: number, month: number, day: number): LunarDate | null {
  try {
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    const rawMonth = Number(lunar.getMonth());
    return {
      lunarYear: Number(lunar.getYear()),
      lunarMonth: Math.abs(rawMonth),
      lunarDay: Number(lunar.getDay()),
      isLeapMonth: rawMonth < 0,
    };
  } catch {
    return null;
  }
}

/** Fixed UTC+7, proleptic (not a reconstruction of each region's historic administrative calendar). */
export function lunarMonthDayCount(year:number,month:number,isLeapMonth=false):number{
 return candidateMonths.find(r=>r.year===year&&r.month===month&&r.leap===isLeapMonth)?.length??0;
}
export function solarToLunarVN(year:number,month:number,day:number):LunarDate|null{return candidateSolarToLunar(year,month,day);}
export function lunarToSolarVN(year:number,month:number,day:number,isLeapMonth=false):SolarDate|null{return candidateLunarToSolar(year,month,day,isLeapMonth);}
export const solarToLunar=solarToLunarVN;
export const lunarToSolar=lunarToSolarVN;
/** Dates still awaiting precision-source adjudication; never silently label as confirmed. */
export function calendarUncertainty(year:number,month:number,day:number):string|undefined{
 const k=year*10000+month*100+day;
 if(k>=19380825&&k<=19381022)return 'Tháng nhuận 1938: các nguồn thiên văn chưa thống nhất ở mốc thu phân sát nửa đêm.';
 if(k>=19440620&&k<=19440719)return 'Ngày sóc tháng 6/1944 sát nửa đêm UTC+7; các nguồn còn khác nhau.';
 if(k>=19670707&&k<=19670806)return 'Ngày sóc tháng 7/1967 rất gần nửa đêm UTC+7; cần đối chiếu nguồn chính xác cao.';
 return undefined;
}
