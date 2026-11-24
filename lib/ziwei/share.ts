import type { BirthFormState } from '@/components/BirthForm';
import type { BirthInfo } from './types';
import { PROVINCES } from './cities';
import { calculateTrueSolarTime, shiftGregorianDate, isValidGregorianDate } from './true-solar-time';

/** Kinh độ chuẩn của Thủ đô Hà Nội (làm mốc mặc định) */
export const DEFAULT_LONGITUDE = 105.85;

/**
 * Tính chi của giờ sinh dựa trên Chân Thái Dương Thời theo chuẩn kinh tuyến Việt Nam (105°E)
 * và Phương trình thời gian (EoT).
 */
export function calcTrueSolarBranch(
  clockHour: number,
  clockMinute: number,
  longitude: number,
  clockSecond = 0,
): number {
  const result = calculateTrueSolarTime({
    year: 2000,
    month: 1,
    day: 1,
    clockHour,
    clockMinute,
    clockSecond,
    longitude,
    utcOffsetMinutes: 420,
  });
  return result.branch;
}

/**
 * Chuyển đổi trạng thái biểu mẫu BirthFormState → BirthInfo
 *
 * Quy tắc giờ Tý (Hệ phái chuẩn truyền thống):
 * · 23:00-23:59 = Giờ Tý muộn, tính theo NGÀY HÔM SAU (ngày +1)
 * · 00:00-00:59 = Giờ Tý sớm, tính theo NGÀY HIỆN TẠI
 *
 * Phép đổi ngày được xác định chính xác theo Chân Thái Dương Thời (đã tính độ lệch kinh độ và EoT).
 */
export function birthFormProblem(form: BirthFormState | null, now = new Date()): string {
  if (!form) return 'Vui lòng nhập đủ thông tin sinh.';
  if(form.civilTimeIssue)return form.civilTimeIssue;
  const y=Number(form.year),m=Number(form.month),d=Number(form.day);
  if(y<1900||y>Math.min(2050,now.getFullYear())||!isValidGregorianDate(y,m,d)||new Date(y,m-1,d)>new Date(now.getFullYear(),now.getMonth(),now.getDate()))return 'Ngày sinh phải hợp lệ, từ năm 1900 đến hôm nay.';
  if(!form.province||!form.city||!Number.isFinite(form.longitude)||Math.abs(form.longitude)>180)return 'Vui lòng chọn nơi sinh hoặc nhập kinh độ hợp lệ.';
  if(form.province==='Nước ngoài'&&(!Number.isFinite(form.utcOffsetMinutes)||form.utcOffsetMinutes! < -12*60||form.utcOffsetMinutes! > 14*60))return 'Vui lòng nhập múi giờ UTC tại thời điểm sinh.';
  if(!form.unknownTime&&(!form.clockHour.trim()||!form.clockMinute.trim()||!Number.isInteger(Number(form.clockHour))||Number(form.clockHour)<0||Number(form.clockHour)>23||!Number.isInteger(Number(form.clockMinute))||Number(form.clockMinute)<0||Number(form.clockMinute)>59||!Number.isInteger(Number(form.clockSecond||0))||Number(form.clockSecond||0)<0||Number(form.clockSecond||0)>59))return 'Vui lòng nhập giờ, phút và giây hợp lệ.';
  return '';
}

export function solarPreview(form: BirthFormState) {
  return calculateTrueSolarTime({
    year:Number(form.year),month:Number(form.month),day:Number(form.day),
    clockHour:Number(form.clockHour),clockMinute:Number(form.clockMinute),clockSecond:Number(form.clockSecond||0),
    longitude:form.trueSolar===false?undefined:form.longitude,
    utcOffsetMinutes:form.utcOffsetMinutes??420,
  });
}
export function formToBirthInfo(form: BirthFormState): BirthInfo {
  if(form.civilTimeIssue)throw new RangeError(form.civilTimeIssue);
  if(form.unknownTime)throw new RangeError('Chưa xác định giờ sinh; không thể lập một lá số chắc chắn.');
  let y=Number(form.year),m=Number(form.month),d=Number(form.day);
  if(!isValidGregorianDate(y,m,d)||!form.clockHour.trim()||!form.clockMinute.trim())throw new RangeError('Ngày hoặc giờ sinh không hợp lệ.');
  const clockHour=Number(form.clockHour),clockMinute=Number(form.clockMinute),clockSecond=Number(form.clockSecond||0);
  if(![clockHour,clockMinute,clockSecond].every(Number.isInteger)||clockHour<0||clockHour>23||clockMinute<0||clockMinute>59||clockSecond<0||clockSecond>59)throw new RangeError('Giờ sinh không hợp lệ.');
  const origInput={year:y,month:m,day:d,clockHour,clockMinute,clockSecond};
  const solar=solarPreview(form);
  const lateZishi=form.lateZishi??'next-day';
  // Apply day rollover and late Zi independently, including a solar shift across midnight.
  const dayOffset=solar.dayOffset+(lateZishi==='next-day'&&solar.branch===0&&solar.normalizedMinutes>=1380?1:0);
  ({year:y,month:m,day:d}=shiftGregorianDate({year:y,month:m,day:d},dayOffset));
  return {year:y,month:m,day:d,hour:solar.branch,gender:form.gender,name:form.name||undefined,province:form.province||undefined,city:form.city||undefined,longitude:form.province?form.longitude:undefined,longitudeReferenceId:form.longitudeReferenceId,origInput,
    timeConvention:{trueSolar:form.trueSolar!==false,lateZishi,utcOffsetMinutes:form.utcOffsetMinutes??420}};
}
export function uncertainBirthOptions(form:BirthFormState):BirthInfo[]{
  if(!form.unknownTime||birthFormProblem(form))throw new RangeError('Thiếu thông tin sinh.');
  return Array.from({length:12},(_,hour)=>({year:Number(form.year),month:Number(form.month),day:Number(form.day),hour,gender:form.gender,name:form.name||undefined,province:form.province,city:form.city,longitude:form.longitude,longitudeReferenceId:form.longitudeReferenceId,assumedHour:true}));
}

/** BirthFormState → URLSearchParams (lưu thông tin trên URL) */
export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  p.set('y', form.year);
  p.set('m', form.month);
  p.set('d', form.day);
  if (form.unknownTime) {
    p.set('u', '1');
  } else {
    p.set('h', form.clockHour);
    p.set('mi', form.clockMinute);
    if (form.clockSecond && form.clockSecond !== '0') {
      p.set('s', form.clockSecond);
    }
  }
  if (form.province) p.set('p', form.province);
  if (form.city) p.set('c', form.city);
  if (Number.isFinite(form.longitude)) {
    p.set('lo', String(form.longitude));
  }
  if(form.longitudeReferenceId)p.set('lr',String(form.longitudeReferenceId));
  if(form.trueSolar===false)p.set('ts','0');
  if(form.lateZishi==='current-day')p.set('zi','same');
  if(form.utcOffsetMinutes!==undefined)p.set('tz',String(form.utcOffsetMinutes));
  if(form.historicalRegion)p.set('hr',form.historicalRegion);
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  return p;
}

/** URLSearchParams → Partial<BirthFormState> */
export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y');
  const month = params.get('m');
  const day = params.get('d');
  if (!year || !month || !day) return null;
  const province=params.get('p')||'',city=params.get('c')||'';
  const known=PROVINCES.find(p=>p.name===province)?.cities.find(c=>c.name===city)?.longitude;
  const longitudeParam=params.get('lo');
  return {
    name: params.get('n') || '',
    year,
    month,
    day,
    unknownTime: params.get('u') === '1',
    clockHour: params.get('h') || '',
    clockMinute: params.get('mi') || '',
    clockSecond: params.get('s') || '0',
    province: params.get('p') || '',
    city: params.get('c') || '',
    longitude: longitudeParam!==null&&longitudeParam.trim()!==''?Number(longitudeParam):known??NaN,
    longitudeReferenceId:params.has('lr')&&Number.isSafeInteger(Number(params.get('lr')))&&Number(params.get('lr'))>0?Number(params.get('lr')):undefined,
    historicalRegion:params.get('hr')==='north'?'north':params.get('hr')==='south'?'south':undefined,
    trueSolar:params.get('ts')!=='0',
    lateZishi:params.get('zi')==='same'?'current-day':'next-day',
    utcOffsetMinutes:params.has('tz')?Number(params.get('tz')):undefined,
    gender: params.get('g') === 'f' ? 'female' : 'male',
  };
}
