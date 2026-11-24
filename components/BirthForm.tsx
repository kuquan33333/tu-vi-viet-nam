'use client';
import TermTooltip from '@/components/TermTooltip';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN, BRANCHES } from '@/lib/ziwei/constants';
import { useTheme } from '@/components/ThemeProvider';
import { PROVINCES } from '@/lib/ziwei/cities';
import {birthLocationsForProvince,searchBirthplaces,birthRegion,type BirthRegion} from '@/lib/ziwei/legacy-birthplaces';
import { formToBirthInfo, birthFormProblem, solarPreview } from '@/lib/ziwei/share';
import { lunarToSolarVN, solarToLunarVN } from '@/lib/ziwei/lunar-solar';
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
}

/** Kiểm tra ngày tháng năm hợp lệ */
function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function BirthForm({ onSubmit, onUnknownTime, loading, initialData, onFormSave, hideSubmit }: BirthFormProps) {
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
    trueSolar: initialData?.trueSolar ?? true,
    lateZishi: initialData?.lateZishi ?? 'next-day',
    utcOffsetMinutes: initialData?.utcOffsetMinutes,
    historicalRegion: initialData?.historicalRegion,
    gender: initialData?.gender ?? 'male',
    calendarType: initialData?.calendarType ?? 'solar',
    isLeapMonth: initialData?.isLeapMonth ?? false,
  });

  const [locationQuery,setLocationQuery]=useState('');
  const locationMatches=useMemo(()=>searchBirthplaces(locationQuery),[locationQuery]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Đồng bộ cho component cha


  const cityList = useMemo(() => {
    return birthLocationsForProvince(form.province);
  }, [form.province]);

  const currentProvince = useMemo(() => {
    return PROVINCES.find(p => p.name === form.province);
  }, [form.province]);

  const currentCityData = useMemo(() => {
    return cityList.find(c => c.name === form.city);
  }, [cityList, form.city]);

  const region=birthRegion(form.province,form.city,form.historicalRegion);
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
  const hasError = Object.values(errors).some(Boolean)||Boolean(formProblem);

  // Tiến trình hoàn thành
  const steps = [
    Boolean(form.year && form.month && form.day && !errors.year && !errors.month && !errors.day),
    Boolean(form.province && form.city),
    form.unknownTime || Boolean(form.clockHour !== '' && form.clockMinute !== ''),
    true,
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
    setForm({ ...form, province: prov, city: '', longitude: NaN,utcOffsetMinutes:undefined,historicalRegion:undefined });
  };

  const handleCity = (cityName: string) => {
    const prov = PROVINCES.find(p => p.name === form.province);
    const cityData = prov?.cities.find(c => c.name === cityName);
    setForm({ ...form, city: cityName, longitude: cityData?.longitude ?? NaN,historicalRegion:undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ year: true, month: true, day: true });
    if (hasError) return;
    onFormSave?.({ ...effectiveForm, calendarType, isLeapMonth });
    if(form.unknownTime){onUnknownTime?.(effectiveForm);return;}
    onSubmit(formToBirthInfo(effectiveForm));
  };

  // ─── Định nghĩa màu sắc & giao diện ──────────────────────────────
  const bg = isDark ? 'rgba(8,16,40,0.85)' : 'rgba(255,255,255,0.92)';
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,160,60,0.2)';
  const labelClr = isDark ? 'rgba(180,200,225,0.9)' : 'rgba(120,80,10,0.55)';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,252,240,0.8)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(200,160,60,0.25)';
  const inputClr = isDark ? '#e8eef8' : '#2a1a00';
  const focusBorder = isDark ? 'rgba(212,168,67,0.5)' : 'rgba(180,120,20,0.5)';
  const errorClr = isDark ? '#f87171' : '#dc2626';
  const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,250,235,0.7)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(200,160,60,0.2)';
  const goldText = isDark ? '#d4a843' : '#7a5008';
  const summaryBg = isDark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.07)';
  const summaryBorder = isDark ? 'rgba(37,99,235,0.35)' : 'rgba(37,99,235,0.25)';
  const summaryClr = isDark ? 'rgba(147,197,253,0.9)' : 'rgba(37,99,235,0.85)';

  const inputStyle = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: inputClr,
    borderRadius: '14px',
    padding: '10px 14px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  } as React.CSSProperties;

  const errorInputStyle = { ...inputStyle, borderColor: errorClr };

  function FieldError({ msg }: { msg: string }) {
    return (
      <AnimatePresence>
        {msg && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ color: errorClr, fontSize: '11px', marginTop: '4px' }}
          >
            ✕ {msg}
          </motion.p>
        )}
      </AnimatePresence>
    );
  }

  const showErr = (field: string) => touched[field] || submitAttempted;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: bg, border: `1px solid ${border}`, borderRadius: '24px', padding: '28px', backdropFilter: 'blur(20px)' }}
    >
      {/* Tiêu đề */}
      <h3 style={{ color: goldText, fontSize: '12px', letterSpacing: '0.3em', textAlign: 'center', marginBottom: '16px', fontWeight: 600 }}>
        NHẬP THÔNG TIN SINH THẦN <TermTooltip term="Sinh thần" />
      </h3>

      {/* ── Tiến trình hoàn thành ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {steps.map((done, i) => (
          <motion.div
            key={i}
            animate={{ background: done ? (isDark ? '#d4a843' : '#b07820') : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,160,60,0.15)') }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, height: '2px', borderRadius: '2px' }}
          />
        ))}
      </div>

      {/* ── Tab chuyển đổi Dương lịch / Âm lịch ── */}
      <div style={{ display: 'flex', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(200,160,60,0.1)', borderRadius: '12px', padding: '3px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={handleSwitchToSolar}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: calendarType === 'solar' ? 600 : 400,
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: calendarType === 'solar' ? (isDark ? '#d4a843' : '#b07820') : 'transparent',
            color: calendarType === 'solar' ? (isDark ? '#08080a' : '#ffffff') : labelClr,
            transition: 'all 0.2s',
          }}
        >
          Dương lịch (Mặt trời)
        </button>
        <button
          type="button"
          onClick={handleSwitchToLunar}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: calendarType === 'lunar' ? 600 : 400,
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: calendarType === 'lunar' ? (isDark ? '#d4a843' : '#b07820') : 'transparent',
            color: calendarType === 'lunar' ? (isDark ? '#08080a' : '#ffffff') : labelClr,
            transition: 'all 0.2s',
          }}
        >
          Âm lịch (Mặt trăng)
        </button>
      </div>
      <div className="calendar-term-help"><span>Dương lịch <TermTooltip term="Dương lịch (Mặt trời)" /></span><span>Âm lịch <TermTooltip term="Âm lịch (Mặt trăng)" /></span></div>

      {/* ── Họ và tên ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Họ và tên (Tùy chọn)</label>
        <input
          type="text"
          placeholder="Ví dụ: Nguyễn Văn A"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = focusBorder; }}
          onBlur={e => { e.target.style.borderColor = inputBorder; }}
        />
      </div>

      {/* ── Ngày sinh (Dương lịch hoặc Âm lịch) ── */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '11px', color: labelClr, letterSpacing: '0.05em' }}>
            {calendarType === 'solar' ? 'Ngày sinh Dương lịch' : 'Ngày sinh Âm lịch'}
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

        {calendarType === 'solar' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <select
                aria-label="Ngày sinh dương lịch"
                value={form.day}
                onChange={e => { setForm({ ...form, day: e.target.value }); setTouched(t => ({ ...t, day: true })); }}
                style={showErr('day') && errors.day ? errorInputStyle : inputStyle}
                required
              >
                <option value="">Ngày</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(dy => (
                  <option key={dy} value={String(dy)}>Ngày {String(dy).padStart(2, '0')}</option>
                ))}
              </select>
              <FieldError msg={showErr('day') ? errors.day : ''} />
            </div>
            <div>
              <select
                aria-label="Tháng sinh dương lịch"
                value={form.month}
                onChange={e => { setForm({ ...form, month: e.target.value }); setTouched(t => ({ ...t, month: true })); }}
                style={showErr('month') && errors.month ? errorInputStyle : inputStyle}
                required
              >
                <option value="">Tháng</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(mo => (
                  <option key={mo} value={String(mo)}>Tháng {String(mo).padStart(2, '0')}</option>
                ))}
              </select>
              <FieldError msg={showErr('month') ? errors.month : ''} />
            </div>
            <div>
              <input type="number" inputMode="numeric" aria-label="Năm sinh" min={1900} max={Math.min(2050,new Date().getFullYear())} placeholder="Năm" value={form.year} onChange={e=>{setForm({...form,year:e.target.value});setTouched(t=>({...t,year:true}));}} style={inputStyle} required/>
              <FieldError msg={showErr('year') ? errors.year : ''} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <select
                aria-label="Ngày sinh âm lịch"
                value={lunarDay}
                onChange={e => handleLunarDateChange(lunarYear, lunarMonth, e.target.value, isLeapMonth)}
                style={inputStyle}
                required
              >
                <option value="">Mùng / Ngày</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map(ld => (
                  <option key={ld} value={String(ld)}>Ngày {String(ld).padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                aria-label="Tháng sinh âm lịch"
                value={lunarMonth}
                onChange={e => handleLunarDateChange(lunarYear, e.target.value, lunarDay, isLeapMonth)}
                style={inputStyle}
                required
              >
                <option value="">Tháng Âm</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(lm => (
                  <option key={lm} value={String(lm)}>Tháng {lm}{isLeapMonth ? ' (Nhuận)' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <input type="number" inputMode="numeric" aria-label="Năm âm lịch" min={1900} max={Math.min(2050,new Date().getFullYear())} placeholder="Năm âm" value={lunarYear} onChange={e=>handleLunarDateChange(e.target.value,lunarMonth,lunarDay,isLeapMonth)} style={inputStyle} required/>
            </div>
          </div>
        )}

        {calendarType === 'lunar' && form.year && form.month && form.day && (
          <p style={{ fontSize: '11px', color: isDark ? 'rgba(180,210,235,0.85)' : 'rgba(100,70,10,0.6)', marginTop: '6px' }}>
            → Tương đương Dương lịch: {String(form.day).padStart(2, '0')}/{String(form.month).padStart(2, '0')}/{form.year}
          </p>
        )}
      </div>

      {/* ── Nơi sinh (Địa giới hành chính 34 tỉnh/thành NQ 202/2025/QH15) ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>
          Nơi sinh (Hiệu chỉnh Chân Thái Dương Thời theo kinh độ)
        </label>
        <div className="form-term-note">Chân Thái Dương Thời <TermTooltip term="Chân Thái Dương Thời" /></div>
        <input type="search" aria-label="Tìm nơi sinh theo địa danh cũ" placeholder="Tìm tỉnh, huyện hoặc địa danh cũ" value={locationQuery} onChange={e=>setLocationQuery(e.target.value)} style={{...inputStyle,marginBottom:8}}/>
        {locationQuery.trim()&&<div style={{maxHeight:180,overflowY:'auto',marginBottom:8}}>{locationMatches.length?locationMatches.map(({p,c})=><button key={p.name+c.name} type="button" style={{...inputStyle,textAlign:'left',marginBottom:3}} onClick={()=>{setForm({...form,province:p.name,city:c.name,longitude:c.longitude,utcOffsetMinutes:undefined,historicalRegion:undefined});setLocationQuery('');}}>{c.name} · {p.name}{c.requiresLongitude?' · cần nhập kinh độ':''}</button>):<p>Chưa có địa danh này. Chọn tỉnh và nhập kinh độ chính xác ở mục nâng cao.</p>}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <select
            aria-label="Tỉnh hoặc thành phố nơi sinh"
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
          </select>
          {form.province==='Nước ngoài'?<input aria-label="Thành phố và quốc gia" placeholder="Thành phố, quốc gia" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} style={inputStyle}/>:<select
            aria-label="Quận huyện hoặc khu vực nơi sinh"
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
          </select>}
        </div>
        {form.province==='Nước ngoài'&&<label>Múi giờ UTC tại thời điểm sinh (giờ)<input type="number" step="0.25" min={-12} max={14} value={form.utcOffsetMinutes===undefined?'':form.utcOffsetMinutes/60} onChange={e=>setForm({...form,utcOffsetMinutes:e.target.value===''?undefined:Number(e.target.value)*60})} style={inputStyle}/></label>}
        {form.province&&<details style={{marginTop:8}} open={form.province==='Nước ngoài'||form.city==='Địa danh khác (nhập kinh độ)'||currentCityData?.requiresLongitude?true:undefined}><summary>Nhập kinh độ chính xác (độ Đông dương, độ Tây âm)</summary><input type="number" aria-label="Kinh độ" min={-180} max={180} step="0.0001" value={Number.isFinite(form.longitude)?form.longitude:''} onChange={e=>setForm({...form,longitude:e.target.value===''?NaN:Number(e.target.value)})} style={inputStyle}/></details>}
        <AnimatePresence mode="wait">
          {form.province ? (
            <motion.p
              key="location-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(180,210,235,0.85)' : 'rgba(100,70,10,0.5)', marginTop: '5px' }}
            >
              {form.city || form.province} · Kinh độ {Number.isFinite(form.longitude)?form.longitude.toFixed(4)+'°':'chưa nhập'} · Hiệu chỉnh kinh độ: {offsetMin.toFixed(2)} phút
            </motion.p>
          ) : (
            <motion.p
              key="location-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.45)', marginTop: '5px' }}
            >
              * Chọn địa danh gần nơi sinh hoặc nhập kinh độ chính xác để hạn chế sai số ở biên giờ.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {form.province==='Tỉnh Quảng Trị'&&form.city&&y>=1900&&y<=1975&&currentCityData?.isSouthOf17thParallel===undefined&&<label style={{display:'block',margin:'10px 0'}}>Vị trí lịch sử so với sông Bến Hải<select aria-label="Khu vực lịch sử" value={form.historicalRegion||''} onChange={e=>setForm({...form,historicalRegion:e.target.value?e.target.value as BirthRegion:undefined})} style={inputStyle}><option value="">Chưa xác định</option><option value="north">Phía Bắc</option><option value="south">Phía Nam</option></select></label>}
      {civil&&civil.offsets.length>1&&<div className="study-notice" role="alert"><p>Giờ này xuất hiện hai lần trong lịch sử. Chọn múi giờ đã xác nhận từ hồ sơ:</p>{civil.offsets.map(offset=><label key={offset} style={{display:'block'}}><input type="radio" checked={chosen===offset} onChange={()=>{setChosenKey(civilKey);setChosenOffset(offset);}}/> UTC{offset>=0?'+':''}{offset/60}</label>)}</div>}
      <p className="study-notice">Lịch âm hiện tại chưa đạt đối chiếu UTC+7 toàn phạm vi; lá số tại các ngày khác biệt cần kiểm tra theo lịch Việt Nam trước khi sử dụng.</p>
      {civilTimeIssue&&<p role="alert" className="study-notice">{civilTimeIssue}</p>}
      {/* ── Banner cảnh báo đổi múi giờ lịch sử Việt Nam ── */}
      {historicalTz && historicalTz.deltaMinutes !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: isDark ? 'rgba(234, 179, 8, 0.12)' : 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '11px',
            color: isDark ? '#fef08a' : '#854d0e',
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            ⚠️ Lưu ý Múi giờ lịch sử: Giai đoạn này Việt Nam áp dụng {historicalTz.periodLabel} (UTC+{historicalTz.actualOffsetMinutes / 60}).
          </div>
          <div style={{ marginBottom: '8px' }}>
            Giờ ghi trên giấy khai sinh có thể chạy sớm hơn giờ chuẩn thiên văn UTC+7 là {Math.abs(historicalTz.deltaMinutes)} phút.
          </div>
          <div>Giữ nguyên ngày giờ trên giấy khai sinh; hệ thống áp dụng múi giờ lịch sử một lần khi tính. Dữ liệu lịch sử có thể không chính xác ở mọi địa phương.</div>
        </motion.div>
      )}

      {/* ── Thời gian sinh (Giờ : Phút : Giây) ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>
          Thời gian sinh (HH:mm:ss theo đồng hồ dân dụng)
        </label>
        <div style={{ borderRadius: '14px', padding: '12px', background: panelBg, border: `1px solid ${panelBorder}`, opacity: form.unknownTime ? 0.45 : 1, pointerEvents: form.unknownTime ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <input aria-label="Giờ và phút sinh" type="time" step={60} disabled={form.unknownTime} value={form.clockHour!==''&&form.clockMinute!==''?form.clockHour.padStart(2,'0')+':'+form.clockMinute.padStart(2,'0'):''} onChange={e=>{const [h='',m='']=e.target.value.split(':');setForm({...form,clockHour:h,clockMinute:m});}} style={inputStyle}/>
          <details style={{marginTop:8}}><summary>Tùy chọn nâng cao</summary>
          <label>Giây sinh<input type="number" min={0} max={59} disabled={form.unknownTime} value={form.clockSecond||'0'} onChange={e=>setForm({...form,clockSecond:e.target.value})} style={inputStyle}/></label>
          <label style={{display:'block',marginTop:6}}><input type="checkbox" checked={form.trueSolar!==false} onChange={e=>setForm({...form,trueSolar:e.target.checked})}/> Dùng Chân Thái Dương Thời</label>
          <p>Hiệu chỉnh theo kinh độ, múi giờ tại nơi sinh và phương trình thời gian (EoT); tắt để dùng nguyên giờ đồng hồ địa phương, không hiệu chỉnh lịch sử.</p>
          {preview&&<p>Kinh độ: {preview.longitudeCorrectionMinutes.toFixed(2)} phút · EoT: {preview.equationOfTimeMinutes.toFixed(2)} phút · Tổng: {preview.totalCorrectionMinutes.toFixed(2)} phút · Giờ tính: {String(preview.hour).padStart(2,'0')}:{String(preview.minute).padStart(2,'0')}:{String(preview.second).padStart(2,'0')}</p>}
          <label>Quy ước giờ Tý muộn (23:00–23:59)<select style={inputStyle} value={form.lateZishi??'next-day'} onChange={e=>setForm({...form,lateZishi:e.target.value as 'next-day'|'current-day'})}><option value="next-day">Tý muộn tính ngày hôm sau; Tý sớm giữ ngày</option><option value="current-day">Tý muộn giữ ngày hiện tại</option></select></label>
          <p>Tý sớm 00:00–00:59 luôn tính theo ngày hiện tại; ranh giờ xét theo loại giờ đã chọn.</p></details>
          {/* Kết quả Chân Thái Dương Thời */}
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: '11px', color: isDark ? 'rgba(170,195,220,0.75)' : 'rgba(140,100,20,0.5)' }}>Chân Thái Dương Thời → </span>
            <span style={{ fontSize: '15px', color: goldText, fontWeight: 700, letterSpacing: '0.08em' }}>
              {branch===undefined?'Chưa xác định':`Giờ ${BRANCHES[branch]}`}
            </span>
            {shichenInfo && (
              <span style={{ fontSize: '11px', color: isDark ? 'rgba(170,195,220,0.75)' : 'rgba(140,100,20,0.5)', marginLeft: '4px' }}>
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
          <span style={{ fontSize: '11px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.45)' }}>
            Không rõ giờ sinh cụ thể
          </span>
        </label>
      </div>

      {form.unknownTime&&<p role="alert" className="study-notice">Không thể xác định chắc chắn Mệnh, Thân, Cục và đại hạn. {onUnknownTime?'Có thể xem 12 phương án tham khảo; không lưu như lá số đã xác định.':'Cần xác định giờ sinh trước khi Hợp bàn.'}</p>}
      {submitAttempted&&formProblem&&<p role="alert" style={{color:errorClr}}>{formProblem}</p>}
      {/* ── Giới tính ── */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Giới tính</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['male', 'female'] as const).map(g => {
            const active = form.gender === g;
            const isMale = g === 'male';
            const accent = isMale ? '37,99,235' : '225,29,72';
            return (
              <motion.button
                key={g}
                type="button"
                onClick={() => setForm({ ...form, gender: g })}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: `1px solid ${active ? `rgba(${accent},0.6)` : inputBorder}`,
                  background: active ? `rgba(${accent},0.08)` : inputBg,
                  color: active ? `rgba(${accent},0.9)` : (isDark ? 'rgba(190,205,225,0.7)' : 'rgba(100,80,40,0.4)'),
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                {isMale ? '♂ Nam Mệnh' : '♀ Nữ Mệnh'}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Thanh tóm tắt thông tin đã chọn ── */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
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
              <span style={{ fontSize: '12px', color: summaryClr }}>✓</span>
              <span style={{ fontSize: '11px', color: summaryClr, letterSpacing: '0.03em', flex: 1 }}>
                {summaryText}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nút xác nhận lập lá số ── */}
      {!hideSubmit && (
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={loading ? {} : { scale: 1.01 }}
          whileTap={loading ? {} : { scale: 0.98 }}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading
              ? (isDark ? 'rgba(212,168,67,0.15)' : 'rgba(180,120,20,0.15)')
              : (isDark
                ? 'linear-gradient(135deg, rgba(180,130,40,0.9), rgba(240,200,80,0.9))'
                : 'linear-gradient(135deg, #9a6210, #c88020)'),
            color: loading ? (isDark ? 'rgba(212,168,67,0.4)' : 'rgba(120,80,10,0.4)') : (isDark ? '#08080a' : '#fff8e8'),
            boxShadow: loading ? 'none' : (isDark ? '0 4px 20px rgba(212,168,67,0.2)' : '0 4px 16px rgba(140,100,20,0.25)'),
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
              Đang an sao lập lá số…
            </span>
          ) : form.unknownTime?'XEM 12 PHƯƠNG ÁN THAM KHẢO':'LẬP LÁ SỐ TỬ VI'}
        </motion.button>
      )}
    </motion.form>
  );
}
