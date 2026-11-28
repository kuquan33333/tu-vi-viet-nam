'use client';
import Icon from '@/components/Icon';
import {BirthDateFields,BirthClockInput,BirthSelect} from './BirthDateTimeFields';
import TermTooltip from '@/components/TermTooltip';
import { useState, useMemo, useEffect, useId } from 'react';
import type { BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN, BRANCHES } from '@/lib/ziwei/constants';
import { useTheme } from '@/components/ThemeProvider';
import { PROVINCES } from '@/lib/ziwei/cities';
import type {BirthRegion,BirthLocation} from '@/lib/ziwei/legacy-birthplaces';
import { formToBirthInfo, birthFormProblem, solarPreview } from '@/lib/ziwei/share';
import { candidateLunarToSolar as lunarToSolarVN, candidateSolarToLunar as solarToLunarVN } from '@/lib/ziwei/vn-calendar-candidate';
import { getHistoricalTzPeriod, resolveHistoricalCivilTime } from '@/lib/ziwei/dst-vn';

export interface BirthFormState {
  name: string;
  year: string;
  month: string;
  day: string;
  clockHour: string;
  clockMinute: string;
  clockSecond?: string;
  unknownTime: boolean;
  province: string;
  city: string;
  longitude: number;
  longitudeReferenceId?: number;
  gender: 'male' | 'female';
  trueSolar?: boolean;
  lateZishi?: 'next-day' | 'current-day';
  utcOffsetMinutes?: number;
  civilTimeIssue?: string;
  historicalRegion?: BirthRegion;
  calendarType?: 'solar' | 'lunar';
  isLeapMonth?: boolean;
}

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void;
  onUnknownTime?: (form: BirthFormState) => void;
  loading?: boolean;
  initialData?: Partial<BirthFormState>;
  onFormSave?: (data: BirthFormState) => void;
  /** Ẩn nút nộp biểu mẫu nội bộ (cho kịch bản kết hợp lá số vợ chồng/đối tác) */
  hideSubmit?: boolean;
  chartLayout?: boolean;
}

/** Kiểm tra ngày tháng năm hợp lệ */
function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function BirthForm({ onSubmit, onUnknownTime, loading, initialData, onFormSave, hideSubmit, chartLayout=false }: BirthFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Chế độ lịch: Dương lịch ('solar') hoặc Âm lịch ('lunar')
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>(initialData?.calendarType ?? 'solar');

  // Trạng thái ngày Âm lịch riêng biệt cho tab Âm lịch
  const [lunarYear, setLunarYear] = useState<string>(initialData?.year ?? '');
  const [lunarMonth, setLunarMonth] = useState<string>(initialData?.month ?? '');
  const [lunarDay, setLunarDay] = useState<string>(initialData?.day ?? '');
  const [isLeapMonth, setIsLeapMonth] = useState<boolean>(initialData?.isLeapMonth ?? false);

  const [form, setForm] = useState<BirthFormState>({
    name: initialData?.name ?? '',
    year: initialData?.year ?? '',
    month: initialData?.month ?? '',
    day: initialData?.day ?? '',
    clockHour: initialData?.clockHour ?? '',
    clockMinute: initialData?.clockMinute ?? '',
    clockSecond: initialData?.clockSecond ?? '0',
    unknownTime: initialData?.unknownTime ?? false,
    province: initialData?.province ?? '',
    city: initialData?.city ?? '',
    longitude: initialData?.longitude ?? NaN,
    longitudeReferenceId:initialData?.longitudeReferenceId,
    trueSolar: initialData?.trueSolar ?? true,
    lateZishi: initialData?.lateZishi ?? 'next-day',
    utcOffsetMinutes: initialData?.utcOffsetMinutes,
    historicalRegion: initialData?.historicalRegion,
    gender: initialData?.gender ?? 'male',
    calendarType: initialData?.calendarType ?? 'solar',
    isLeapMonth: initialData?.isLeapMonth ?? false,
  });

  const [genderChosen,setGenderChosen]=useState(!chartLayout||Boolean(initialData?.gender));
  const errorId=useId();
  const [locationQuery,setLocationQuery]=useState('');
  type LegacyBirthplacesModule=typeof import('@/lib/ziwei/legacy-birthplaces');
  const [legacyPlaces,setLegacyPlaces]=useState<LegacyBirthplacesModule|null>(null);
  useEffect(()=>{
    if(legacyPlaces||((!form.province||form.province==='Nước ngoài')&&!locationQuery.trim()))return;
    let active=true;
    void import('@/lib/ziwei/legacy-birthplaces').then(module=>{if(active)setLegacyPlaces(module);});
    return()=>{active=false;};
  },[form.province,locationQuery,legacyPlaces]);
  const locationMatches=useMemo(()=>legacyPlaces&&locationQuery.trim()?legacyPlaces.searchBirthplaces(locationQuery):[],[legacyPlaces,locationQuery]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Đồng bộ cho component cha


  const currentProvince = useMemo(() => {
    return PROVINCES.find(p => p.name === form.province);
  }, [form.province]);

  const cityList = useMemo<BirthLocation[]>(() => form.province==='Nước ngoài'?[]:legacyPlaces?.birthLocationsForProvince(form.province)??(currentProvince?.cities??[]) as BirthLocation[],[form.province,currentProvince,legacyPlaces]);

  const currentCityData = useMemo(() => {
    return cityList.find(c => c.name === form.city);
  }, [cityList, form.city]);

  const region=legacyPlaces?.birthRegion(form.province,form.city,form.historicalRegion)??(form.province==='Tỉnh Quảng Trị'&&Boolean(form.city)?undefined:currentProvince?.isSouthOf17thParallel);
  const isSouth=region??false;

  // ─── Kiểm tra múi giờ lịch sử Việt Nam ───────────────────────────
  const y = parseInt(form.year, 10) || 0;
  const m = parseInt(form.month, 10) || 0;
  const d = parseInt(form.day, 10) || 0;
  const regionMissing=form.province==='Tỉnh Quảng Trị'&&Boolean(form.city)&&y>=1900&&y<=1975&&region===undefined;

  const historicalTz = useMemo(() => {
    if (regionMissing||form.province==='Nước ngoài'||!form.province||!form.city||!m||!d) return null;
    return getHistoricalTzPeriod(y, m, d, isSouth);
  }, [y, m, d, isSouth,form.province,form.city,regionMissing]);

  // Keep the original local civil clock and its date. Apply the historical UTC offset once in solarPreview.
  const civil = !regionMissing && form.province && form.province!=='Nước ngoài' && form.city && y>=1900 && m && d && !form.unknownTime && form.clockHour!=='' && form.clockMinute!=='' ? resolveHistoricalCivilTime(y,m,d,Number(form.clockHour),Number(form.clockMinute),Number(form.clockSecond||0),isSouth) : null;
  const [chosenOffset,setChosenOffset]=useState<number|undefined>(undefined);
  const civilKey=[form.province,form.city,y,m,d,form.clockHour,form.clockMinute,form.clockSecond].join('|');
  const [chosenKey,setChosenKey]=useState('');
  const chosen=chosenKey===civilKey?chosenOffset:undefined;
  const actualOffset=civil?.offsets.length===1?civil.offsets[0]:civil?.offsets.includes(chosen??NaN)?chosen:undefined;
  const civilTimeIssue=regionMissing?'Cần xác định phía Bắc hoặc Nam sông Bến Hải theo nơi sinh lịch sử; không tự chọn múi giờ.':civil?.offsets.length===0?'Giờ địa phương này không tồn tại do đổi múi giờ. Hãy kiểm tra lại giờ sinh.':civil&&actualOffset===undefined?'Giờ địa phương này lặp lại khi đổi múi giờ; cần chọn múi giờ ghi nhận.':civil?.uncertain?'Mốc chuyển giờ tháng 10/1954 tại miền Bắc chưa có ngày chính xác; chưa thể lập lá số chắc chắn với quy đổi tự động.':'';
  const effectiveForm = {...form,utcOffsetMinutes:form.province==='Nước ngoài'?form.utcOffsetMinutes:actualOffset??historicalTz?.actualOffsetMinutes??420,civilTimeIssue};
  const preview = !civilTimeIssue && Number.isFinite(form.longitude) && !form.unknownTime && form.clockHour!=='' && form.clockMinute!=='' && form.year && form.month && form.day && form.province && form.city ? solarPreview(effectiveForm) : null;
  const branch=preview?.branch;
  const offsetMin=preview?.longitudeCorrectionMinutes??0;
  const shichenInfo=branch===undefined?null:SHICHEN[branch];

  useEffect(() => {
    onFormSave?.({...effectiveForm,calendarType,isLeapMonth});
  }, [form,calendarType,isLeapMonth,onFormSave,effectiveForm.utcOffsetMinutes,civilTimeIssue]);
  // ─── Đồng bộ tab Âm lịch ↔ Dương lịch ──────────────────────────
  const handleSwitchToLunar = () => {
    setCalendarType('lunar');
    if (y && m && d && isValidDate(y, m, d)) {
      const lunar = solarToLunarVN(y, m, d);
      if (lunar) {
        setLunarYear(String(lunar.lunarYear));
        setLunarMonth(String(lunar.lunarMonth));
        setLunarDay(String(lunar.lunarDay));
        setIsLeapMonth(lunar.isLeapMonth);
      }
    }
  };

  const handleSwitchToSolar = () => {
    setCalendarType('solar');
  };

  const handleLunarDateChange = (newLy: string, newLm: string, newLd: string, newLeap: boolean) => {
    setLunarYear(newLy);
    setLunarMonth(newLm);
    setLunarDay(newLd);
    setIsLeapMonth(newLeap);

    const lyNum = parseInt(newLy, 10);
    const lmNum = parseInt(newLm, 10);
    const ldNum = parseInt(newLd, 10);

    if (lyNum && lmNum && ldNum) {
      try {
        const solar = lunarToSolarVN(lyNum, lmNum, ldNum, newLeap);
        if (solar) {
          setForm(prev => ({
            ...prev,
            year: String(solar.year),
            month: String(solar.month),
            day: String(solar.day),
            isLeapMonth: newLeap,
          }));
        } else setForm(prev=>({...prev,year:'',month:'',day:''}));
      } catch { setForm(prev=>({...prev,year:'',month:'',day:''})); }
    } else setForm(prev=>({...prev,year:'',month:'',day:''}));
  };

  // ─── Kiểm tra tính hợp lệ của dữ liệu ────────────────────────────
  const errors = {
    year: !form.year ? 'Vui lòng chọn năm sinh'
      : y < 1900 || y > Math.min(2050,new Date().getFullYear()) ? 'Năm sinh từ 1900 đến năm hiện tại'
      : '',
    month: !form.month ? 'Vui lòng chọn tháng' : '',
    day: !form.day ? 'Vui lòng chọn ngày'
      : form.year && form.month && !isValidDate(y, m, d) ? `Tháng ${m} không có ngày ${d}`
      : '',
  };
  const formProblem=birthFormProblem(effectiveForm);
  const genderError=!genderChosen?'Vui lòng chọn giới tính.':'';
  const clockError=!form.unknownTime&&(!form.clockHour||!form.clockMinute||!Number.isInteger(Number(form.clockHour))||Number(form.clockHour)<0||Number(form.clockHour)>23||!Number.isInteger(Number(form.clockMinute))||Number(form.clockMinute)<0||Number(form.clockMinute)>59||!Number.isInteger(Number(form.clockSecond||0))||Number(form.clockSecond||0)<0||Number(form.clockSecond||0)>59)?'Vui lòng nhập giờ, phút và giây hợp lệ.':'';
  const provinceError=!form.province?'Vui lòng chọn nơi sinh.':'';
  const cityError=!form.city?'Vui lòng nhập địa danh nơi sinh.':'';
  const longitudeError=form.province&&form.city&&(!Number.isFinite(form.longitude)||Math.abs(form.longitude)>180)?'Vui lòng nhập kinh độ hợp lệ.':'';
  const utcError=form.province==='Nước ngoài'&&(!Number.isFinite(form.utcOffsetMinutes)||form.utcOffsetMinutes! < -720||form.utcOffsetMinutes! > 840)?'Vui lòng nhập múi giờ UTC tại thời điểm sinh.':'';
  const dateError=Boolean(formProblem.startsWith('Ngày sinh'))||Object.values(errors).some(Boolean);
  const hasError = Object.values(errors).some(Boolean)||Boolean(formProblem)||Boolean(genderError);
  const invalid=(msg:string,key:string)=>({'aria-invalid':Boolean(submitAttempted&&msg),'aria-describedby':submitAttempted&&msg?errorId+'-'+key:undefined});
  const fieldMessage=(msg:string,key:string)=>submitAttempted&&msg?<p className="field-error" id={errorId+'-'+key}>{msg}</p>:null;

  // Tiến trình hoàn thành
  const steps = [
    Boolean(form.year && form.month && form.day && !errors.year && !errors.month && !errors.day),
    Boolean(form.province && form.city),
    form.unknownTime || Boolean(form.clockHour !== '' && form.clockMinute !== ''),
    genderChosen,
  ];

  // Chuỗi tóm tắt
  const showSummary = steps[0] && steps[2] && !hasError;
  const summaryText = showSummary
    ? [
        `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`,
        form.city || form.province || '',
        form.unknownTime ? 'Chưa xác định giờ sinh' : `Giờ ${(branch===undefined?'—':BRANCHES[branch])} (${form.clockHour.padStart(2, '0')}:${form.clockMinute.padStart(2, '0')}${form.clockSecond ? `:${form.clockSecond.padStart(2, '0')}` : ''})`,
        form.gender === 'male' ? 'Nam mệnh' : 'Nữ mệnh',
      ].filter(Boolean).join(' · ')
    : '';

  const handleProvince = (prov: string) => {
    setForm({ ...form, province: prov, city: '', longitude: NaN,longitudeReferenceId:undefined,utcOffsetMinutes:undefined,historicalRegion:undefined });
  };

  const handleCity = (cityName: string) => {
    const prov = PROVINCES.find(p => p.name === form.province);
    const cityData = prov?.cities.find(c => c.name === cityName);
    setForm({ ...form, city: cityName, longitude: cityData?.longitude ?? NaN,longitudeReferenceId:undefined,historicalRegion:undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ year: true, month: true, day: true });
    if (hasError) {
      const root=e.currentTarget;
      requestAnimationFrame(()=>{
        const first=root.querySelector<HTMLElement>('[aria-invalid="true"]:not(:disabled)');
        if(first){const detail=first.closest('details');if(detail)detail.open=true;first.focus();}
        else root.querySelector<HTMLElement>('[data-form-problem]')?.focus();
      });
      return;
    }
    onFormSave?.({ ...effectiveForm, calendarType, isLeapMonth });
    if(form.unknownTime){onUnknownTime?.(effectiveForm);return;}
    onSubmit(formToBirthInfo(effectiveForm));
  };

  // ─── Định nghĩa màu sắc & giao diện ──────────────────────────────
  const bg = 'var(--card)';
  const border = 'var(--line)';
  const labelClr = 'var(--tx-2)';
  const inputBg = 'var(--white)';
  const inputBorder = 'var(--field)';
  const inputClr = 'var(--ink)';
  const focusBorder = 'var(--accent)';
  const errorClr = 'var(--accent)';
  const panelBg = 'var(--paper)';
  const panelBorder = 'var(--line)';
  const goldText = 'var(--accent)';
  const summaryBg = 'var(--accent-soft)';
  const summaryBorder = 'var(--line)';
  const summaryClr = 'var(--ink)';

  const inputStyle = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: inputClr,
    borderRadius: 'var(--radius-control)',
    padding: '10px 14px',
    fontSize: 'var(--body-size)',
    width: '100%',
    minHeight:48,
    transition: 'border-color 0.2s',
  } as React.CSSProperties;

  const errorInputStyle = { ...inputStyle, border: '2px solid var(--accent)' };

  function FieldError({ msg }: { msg: string }) {
    return (
      <>
        {msg && (
          <p
            style={{ color: errorClr, fontSize: '11px', marginTop: '4px' }}
          >
            ✕ {msg}
          </p>
        )}
      </>
    );
  }

  const showErr = (field: string) => touched[field] || submitAttempted;

  return (
    <form
      className={"birth-form"+(chartLayout?" chart3-birth-form":"")}
      noValidate={chartLayout}
      onSubmit={handleSubmit}
      style={{ background: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius-card)', padding: 'var(--panel-padding)', backdropFilter: 'none' }}
    >
      {/* Tiêu đề */}
      <h2 style={{ color: goldText, fontSize: '12px', letterSpacing: '0.12em', textAlign: 'center', marginBottom: '16px', fontWeight: 600 }}>
        NHẬP THÔNG TIN SINH THẦN <TermTooltip term="Sinh thần" />
      </h2>

      {/* ── Tiến trình hoàn thành ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {steps.map((done, i) => (
          <div
            key={i}
            style={{background: done ? (isDark ? 'var(--accent)' : 'var(--accent)') : (isDark ? 'var(--line)' : 'var(--line)'),flex: 1, height: '2px', borderRadius: '2px',transition:'background .3s'}}
          />
        ))}
      </div>

      {/* ── Họ và tên ── */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor={errorId+"-name"}>Họ tên (không bắt buộc)</label>
        <input
          type="text"
          placeholder="Ví dụ: Nguyễn Văn A"
          id={errorId+"-name"} aria-label="Họ và tên (tùy chọn)"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = focusBorder; }}
          onBlur={e => { e.target.style.borderColor = inputBorder; }}
        />
      </div>

      {/* ── Giới tính ── */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Giới tính *</label>
        <div role="group" aria-label="Giới tính (bắt buộc)" style={{ display: 'flex', gap: '10px' }}>
          {(['male', 'female'] as const).map(g => {
            const active = genderChosen && form.gender === g;
            const isMale = g === 'male';
            const accent = 'var(--ink)';
            return (
              <button
                key={g}
                type="button"
                onClick={() => {setGenderChosen(true);setForm({ ...form, gender: g });}}
                aria-pressed={active} {...invalid(genderError,'gender')}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 'var(--radius-control)',
                  minHeight:48,fontSize: '14px',
                  fontWeight: 600,
                  border: `1px solid ${active ? accent : inputBorder}`,
                  background: active ? 'var(--ink)' : inputBg,
                  color: active ? 'var(--white)' : 'var(--ink)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                {isMale ? 'Nam' : 'Nữ'}
              </button>
            );
          })}
        </div>
        <p className="chart3-hint">Dùng để xác định chiều vận hành của đại hạn.</p>
        {fieldMessage(genderError,'gender')}
      </div>

      {/* ── Tab chuyển đổi Dương lịch / Âm lịch ── */}
      <div style={{ display: 'flex', background: isDark ? 'var(--line)' : 'var(--line)', borderRadius: '12px', padding: '3px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={handleSwitchToSolar}
          aria-pressed={calendarType === 'solar'}
          style={{
            minHeight: 44,
            flex: 1,
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: calendarType === 'solar' ? 600 : 400,
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: calendarType === 'solar' ? (isDark ? 'var(--accent)' : 'var(--ink)') : 'transparent',
            color: calendarType === 'solar' ? 'var(--white)' : 'var(--ink)',
            transition: 'all 0.2s',
          }}
        >
          Dương lịch (Mặt trời)
        </button>
        <button
          type="button"
          onClick={handleSwitchToLunar}
          aria-pressed={calendarType === 'lunar'}
          style={{
            minHeight: 44,
            flex: 1,
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: calendarType === 'lunar' ? 600 : 400,
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: calendarType === 'lunar' ? (isDark ? 'var(--accent)' : 'var(--ink)') : 'transparent',
            color: calendarType === 'lunar' ? 'var(--white)' : 'var(--ink)',
            transition: 'all 0.2s',
          }}
        >
          Âm lịch (Mặt trăng)
        </button>
      </div>
      <div className="calendar-term-help"><span>Dương lịch <TermTooltip term="Dương lịch (Mặt trời)" /></span><span>Âm lịch <TermTooltip term="Âm lịch (Mặt trăng)" /></span></div>

      {/* ── Ngày sinh (Dương lịch hoặc Âm lịch) ── */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '11px', color: labelClr, letterSpacing: '0.05em' }}>
            {calendarType === 'solar' ? 'Ngày sinh Dương lịch *' : 'Ngày sinh Âm lịch *'}
          </label>
          {calendarType === 'lunar' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: goldText, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isLeapMonth}
                onChange={e => handleLunarDateChange(lunarYear, lunarMonth, lunarDay, e.target.checked)}
              />
              Tháng nhuận
            </label>
          )}
        </div>

        <BirthDateFields lunar={calendarType==='lunar'} year={calendarType==='solar'?form.year:lunarYear} month={calendarType==='solar'?form.month:lunarMonth} day={calendarType==='solar'?form.day:lunarDay}
          onChange={(field,value)=>{if(calendarType==='solar'){setForm({...form,[field]:value});setTouched(t=>({...t,[field]:true}));}else handleLunarDateChange(field==='year'?value:lunarYear,field==='month'?value:lunarMonth,field==='day'?value:lunarDay,isLeapMonth);}}
          inputStyle={inputStyle} errorStyle={errorInputStyle} errors={calendarType==='solar'?{year:showErr('year')?errors.year:'',month:showErr('month')?errors.month:'',day:showErr('day')?(errors.day||(dateError&&!errors.year&&!errors.month?'Ngày sinh không hợp lệ hoặc ở tương lai.':'')):''}:submitAttempted?{year:!lunarYear?'Vui lòng nhập năm âm lịch':'',month:!lunarMonth?'Vui lòng chọn tháng âm lịch':'',day:!lunarDay?'Vui lòng chọn ngày âm lịch':dateError&&lunarYear&&lunarMonth?'Ngày âm lịch không hợp lệ hoặc ngoài phạm vi.':''}:undefined}/>

        {calendarType === 'lunar' && form.year && form.month && form.day && (
          <p style={{ fontSize: '11px', color: 'var(--tx-2)', marginTop: '6px' }}>
            Tương đương Dương lịch: {String(form.day).padStart(2, '0')}/{String(form.month).padStart(2, '0')}/{form.year}
          </p>
        )}
      </div>

      {/* ── Thời gian sinh (Giờ : Phút : Giây) ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>
          Giờ sinh * (theo đồng hồ dân dụng)
        </label>
        <div style={{ borderRadius: '14px', padding: '12px', background: panelBg, border: `1px solid ${panelBorder}`, opacity: 1, transition: 'opacity 0.2s' }}>
          <BirthClockInput hour={form.clockHour} minute={form.clockMinute} disabled={form.unknownTime} onChange={(h,m)=>setForm({...form,clockHour:h,clockMinute:m})} style={inputStyle} invalid={Boolean(submitAttempted&&clockError)} describedBy={submitAttempted&&clockError?errorId+'-clock':undefined}/>
          {fieldMessage(clockError,'clock')}
          <details style={{marginTop:8}} open={chartLayout||undefined}><summary>Tùy chọn nâng cao</summary>
          <label>Giây sinh<input type="number" min={0} max={59} disabled={form.unknownTime} value={form.clockSecond||'0'} onChange={e=>setForm({...form,clockSecond:e.target.value})} style={inputStyle}/></label>
          <label style={{display:'block',marginTop:6}}><input type="checkbox" checked={form.trueSolar!==false} onChange={e=>setForm({...form,trueSolar:e.target.checked})}/> Dùng Chân Thái Dương Thời</label>
          <p>Hiệu chỉnh theo kinh độ, múi giờ tại nơi sinh và phương trình thời gian (EoT); tắt để dùng nguyên giờ đồng hồ địa phương, không hiệu chỉnh lịch sử.</p>
          {preview&&<p>Kinh độ: {preview.longitudeCorrectionMinutes.toFixed(2)} phút · EoT: {preview.equationOfTimeMinutes.toFixed(2)} phút · Tổng: {preview.totalCorrectionMinutes.toFixed(2)} phút · Giờ tính: {String(preview.hour).padStart(2,'0')}:{String(preview.minute).padStart(2,'0')}:{String(preview.second).padStart(2,'0')}</p>}
          <label>Quy ước giờ Tý muộn (23:00–23:59)<BirthSelect style={inputStyle} value={form.lateZishi??'next-day'} onChange={e=>setForm({...form,lateZishi:e.target.value as 'next-day'|'current-day'})}><option value="next-day">Tính ngày hôm sau</option><option value="current-day">Giữ ngày hiện tại</option></BirthSelect></label>
          <p>Tý sớm 00:00–00:59 luôn tính theo ngày hiện tại; ranh giờ xét theo loại giờ đã chọn.</p></details>
          {/* Kết quả Chân Thái Dương Thời */}
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: '11px', color: 'var(--tx-2)' }}>Chân Thái Dương Thời: </span>
            <span style={{ fontSize: '15px', color: goldText, fontWeight: 700, letterSpacing: '0.08em' }}>
              {branch===undefined?'Chưa xác định':`Giờ ${BRANCHES[branch]}`}
            </span>
            {shichenInfo && (
              <span style={{ fontSize: '11px', color: 'var(--tx-2)', marginLeft: '4px' }}>
                ({shichenInfo.range})
              </span>
            )}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            aria-label="Không rõ giờ sinh cụ thể"
            checked={form.unknownTime}
            onChange={e => setForm({ ...form, unknownTime: e.target.checked })}
            style={{ width: '14px', height: '14px', borderRadius: '4px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '11px', color: 'var(--tx-2)' }}>
            Tôi không nhớ giờ sinh
          </span>
        </label>
      </div>

      {/* ── Nơi sinh (Địa giới hành chính 34 tỉnh/thành NQ 202/2025/QH15) ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>
          Nơi sinh *
        </label>
        <div className="form-term-note">Chân Thái Dương Thời <TermTooltip term="Chân Thái Dương Thời" /></div>
        {form.province!=='Nước ngoài'&&<input type="search" aria-label="Tìm nơi sinh theo địa danh cũ" placeholder="Tìm tỉnh, huyện hoặc địa danh cũ" value={locationQuery} onChange={e=>setLocationQuery(e.target.value)} style={{...inputStyle,marginBottom:8}}/>}
        {form.province!=='Nước ngoài'&&locationQuery.trim()&&<div style={{maxHeight:180,overflowY:'auto',marginBottom:8}}>{locationMatches.length?locationMatches.map(({p,c})=><button key={p.name+c.name} type="button" style={{...inputStyle,textAlign:'left',marginBottom:3}} onClick={()=>{setForm({...form,province:p.name,city:c.name,longitude:c.longitude,longitudeReferenceId:undefined,utcOffsetMinutes:undefined,historicalRegion:undefined});setLocationQuery('');}}>{c.name} · {p.name}{c.requiresLongitude?' · cần nhập kinh độ':''}</button>):<p>Chưa có địa danh này. Chọn tỉnh và nhập kinh độ chính xác ở mục nâng cao.</p>}</div>}
        <div className="chart3-location-grid" style={{ display: 'grid', gridTemplateColumns: form.province==='Nước ngoài'?'1fr':'minmax(0,1fr) minmax(0,1fr)', gap: '8px' }}>
          {form.province!=='Nước ngoài'&&<BirthSelect
            aria-label="Tỉnh hoặc thành phố nơi sinh" {...invalid(provinceError,"province")}
            value={form.province}
            onChange={e => handleProvince(e.target.value)}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = focusBorder; }}
            onBlur={e => { e.target.style.borderColor = inputBorder; }}
          >
            <option value="">Chọn Tỉnh / Thành phố</option>
            <option value="Nước ngoài">Nước ngoài</option>
            {PROVINCES.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </BirthSelect>}
          {form.province==='Nước ngoài'?<input aria-label="Thành phố và quốc gia" {...invalid(cityError,"city")} placeholder="Thành phố, quốc gia" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} style={inputStyle}/>:<BirthSelect
            aria-label="Quận huyện hoặc khu vực nơi sinh" {...invalid(cityError,"city")}
            value={form.city}
            onChange={e => handleCity(e.target.value)}
            disabled={!form.province}
            style={{ ...inputStyle, opacity: form.province ? 1 : 0.45 }}
            onFocus={e => { e.target.style.borderColor = focusBorder; }}
            onBlur={e => { e.target.style.borderColor = inputBorder; }}
          >
            <option value="">{form.province ? 'Chọn Quận/Huyện/Khu vực' : 'Chọn Tỉnh/TP trước'}</option>
            <option value="Địa danh khác (nhập kinh độ)">Địa danh khác (nhập kinh độ)</option>
            {cityList.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </BirthSelect>}
        </div>
        {fieldMessage(provinceError,'province')}{fieldMessage(cityError,'city')}
        <button type="button" className="chart3-foreign" onClick={()=>{handleProvince(form.province==='Nước ngoài'?'':'Nước ngoài');setLocationQuery('');}}>{form.province==='Nước ngoài'?'Sinh ở Việt Nam?':'Sinh ở nước ngoài? Nhập kinh độ và múi giờ'}</button>
        {form.province==='Nước ngoài'&&<label>Múi giờ UTC tại thời điểm sinh (giờ)<input type="number" aria-label="Múi giờ UTC tại thời điểm sinh" {...invalid(utcError,"utc")} placeholder="Ví dụ: +7" step="0.25" min={-12} max={14} value={form.utcOffsetMinutes===undefined?'':form.utcOffsetMinutes/60} onChange={e=>setForm({...form,utcOffsetMinutes:e.target.value===''?undefined:Number(e.target.value)*60})} style={inputStyle}/></label>}
        {fieldMessage(utcError,'utc')}
        {form.province&&<details style={{marginTop:8}} open={form.province==='Nước ngoài'||form.city==='Địa danh khác (nhập kinh độ)'||currentCityData?.requiresLongitude?true:undefined}><summary>Nhập kinh độ chính xác (độ Đông dương, độ Tây âm)</summary><input type="number" aria-label="Kinh độ" {...invalid(longitudeError,"longitude")} placeholder="Ví dụ: 108.2" min={-180} max={180} step="0.0001" value={Number.isFinite(form.longitude)?form.longitude:''} onChange={e=>setForm({...form,longitude:e.target.value===''?NaN:Number(e.target.value),longitudeReferenceId:undefined})} style={inputStyle}/>{fieldMessage(longitudeError,'longitude')}</details>}
        {currentCityData?.reference&&<div className="study-notice" style={{marginTop:8}}>
          <p>Điểm tham khảo của huyện: {currentCityData.reference.longitude.toFixed(4)}° Đông. Đây không phải tọa độ chính xác nơi sinh; sai số vị trí có thể làm đổi chi giờ nếu sinh gần ranh giờ.</p>
          <button type="button" className="action-outline" onClick={()=>{const r=currentCityData.reference;if(r)setForm({...form,longitude:r.longitude,longitudeReferenceId:r.geonamesId});}}>Dùng kinh độ tham khảo của huyện</button>
          <p style={{marginTop:6}}>Nguồn: <a href={'https://www.geonames.org/'+currentCityData.reference.geonamesId+'/'} target="_blank" rel="noopener noreferrer">GeoNames</a> · CC BY 4.0</p>
          {form.longitudeReferenceId===currentCityData.reference.geonamesId&&<p role="status">Đang dùng kinh độ tham khảo. Có thể sửa bằng tọa độ nơi sinh chính xác.</p>}
        </div>}
        <>
          {form.province ? (
            <p
              key="location-info"
              style={{ fontSize: '10px', color: 'var(--tx-2)', marginTop: '5px' }}
            >
              {form.city || form.province} · Kinh độ {Number.isFinite(form.longitude)?form.longitude.toFixed(4)+'°':'chưa nhập'} · Hiệu chỉnh kinh độ: {offsetMin.toFixed(2)} phút
            </p>
          ) : (
            <p
              key="location-hint"
              style={{ fontSize: '10px', color: 'var(--tx-2)', marginTop: '5px' }}
            >
              * Chọn địa danh gần nơi sinh hoặc nhập kinh độ chính xác để hạn chế sai số ở biên giờ.
            </p>
          )}
        </>
      </div>

      {form.province==='Tỉnh Quảng Trị'&&form.city&&y>=1900&&y<=1975&&currentCityData?.isSouthOf17thParallel===undefined&&<label style={{display:'block',margin:'10px 0'}}>Vị trí lịch sử so với sông Bến Hải<BirthSelect aria-label="Khu vực lịch sử" value={form.historicalRegion||''} onChange={e=>setForm({...form,historicalRegion:e.target.value?e.target.value as BirthRegion:undefined})} style={inputStyle}><option value="">Chưa xác định</option><option value="north">Phía Bắc</option><option value="south">Phía Nam</option></BirthSelect></label>}
      {civil&&civil.offsets.length>1&&<div className="study-notice" role="alert"><p>Giờ này xuất hiện hai lần trong lịch sử. Chọn múi giờ đã xác nhận từ hồ sơ:</p>{civil.offsets.map(offset=><label key={offset} style={{display:'block'}}><input type="radio" checked={chosen===offset} onChange={()=>{setChosenKey(civilKey);setChosenOffset(offset);}}/> UTC{offset>=0?'+':''}{offset/60}</label>)}</div>}
      <p className="study-notice">Ngày âm sử dụng lịch Việt Nam UTC+7 (1900–2050); các quy ước giờ sinh và lịch lịch sử vẫn cần đối chiếu hồ sơ thực tế.</p>
      {civilTimeIssue&&<p role="alert" className="study-notice">{civilTimeIssue}</p>}
      {/* ── Banner cảnh báo đổi múi giờ lịch sử Việt Nam ── */}
      {historicalTz && historicalTz.deltaMinutes !== 0 && (
        <div
          style={{
            background: isDark ? 'var(--line)' : 'var(--line)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '11px',
            color: isDark ? 'var(--ink)' : 'var(--ink)',
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            Lưu ý Múi giờ lịch sử: Giai đoạn này Việt Nam áp dụng {historicalTz.periodLabel} (UTC+{historicalTz.actualOffsetMinutes / 60}).
          </div>
          <div style={{ marginBottom: '8px' }}>
            Giờ ghi trên giấy khai sinh có thể chạy sớm hơn giờ chuẩn thiên văn UTC+7 là {Math.abs(historicalTz.deltaMinutes)} phút.
          </div>
          <div>Giữ nguyên ngày giờ trên giấy khai sinh; hệ thống áp dụng múi giờ lịch sử một lần khi tính. Dữ liệu lịch sử có thể không chính xác ở mọi địa phương.</div>
        </div>
      )}

      {form.unknownTime&&<p role="alert" className="study-notice">Không thể xác định chắc chắn Mệnh, Thân, Cục và đại hạn. {onUnknownTime?'Có thể xem 12 phương án tham khảo; không lưu như lá số đã xác định.':'Cần xác định giờ sinh trước khi Hợp bàn.'}</p>}
      {submitAttempted&&formProblem&&<p role="alert" tabIndex={-1} data-form-problem style={{color:errorClr}}>{formProblem}</p>}
      {/* ── Thanh tóm tắt thông tin đã chọn ── */}
      <>
        {showSummary && (
          <div
          >
            <div style={{
              background: summaryBg,
              border: `1px solid ${summaryBorder}`,
              borderRadius: '12px',
              padding: '9px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '12px', color: summaryClr }}><Icon name="check" size={16}/></span>
              <span style={{ fontSize: '11px', color: summaryClr, letterSpacing: '0.03em', flex: 1 }}>
                {summaryText}
              </span>
            </div>
          </div>
        )}
      </>

      {/* ── Nút xác nhận lập lá số ── */}
      {!hideSubmit && (
        <button
          type="submit" className="ui-button ui-button-primary chart3-submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? 'var(--accent-soft)' : 'var(--accent)',
            color: loading ? 'var(--muted)' : 'var(--white)',
            boxShadow: 'none',
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span
                className="form-spinner" style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
              Đang an sao lập lá số…
            </span>
          ) : form.unknownTime?'XEM 12 PHƯƠNG ÁN THAM KHẢO':'LẬP LÁ SỐ TỬ VI'}
        </button>
      )}
    </form>
  );
}
