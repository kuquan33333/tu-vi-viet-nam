'use client';
import {useId} from 'react';
import type {CSSProperties} from 'react';
type DateField='year'|'month'|'day';
export function BirthDateFields({lunar,year,month,day,onChange,inputStyle,errorStyle,errors}:{lunar:boolean;year:string;month:string;day:string;onChange:(field:DateField,value:string)=>void;inputStyle:CSSProperties;errorStyle:CSSProperties;errors?:Partial<Record<DateField,string>>}){
 const id=useId();
 const style=(field:DateField)=>errors?.[field]?errorStyle:inputStyle;
 return <div className="birth-date-grid">
  <div><select aria-label={lunar?'Ngày sinh âm lịch':'Ngày sinh dương lịch'} aria-invalid={Boolean(errors?.day)} aria-describedby={errors?.day?id+'-day':undefined} value={day} onChange={e=>onChange('day',e.target.value)} style={style('day')} required><option value="">Ngày</option>{Array.from({length:lunar?30:31},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select>{errors?.day&&<p className="field-error" id={id+'-day'}>{errors.day}</p>}</div>
  <div><select aria-label={lunar?'Tháng sinh âm lịch':'Tháng sinh dương lịch'} aria-invalid={Boolean(errors?.month)} aria-describedby={errors?.month?id+'-month':undefined} value={month} onChange={e=>onChange('month',e.target.value)} style={style('month')} required><option value="">Tháng</option>{Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select>{errors?.month&&<p className="field-error" id={id+'-month'}>{errors.month}</p>}</div>
  <div><input type="number" inputMode="numeric" aria-label={lunar?'Năm âm lịch':'Năm sinh'} aria-invalid={Boolean(errors?.year)} aria-describedby={errors?.year?id+'-year':undefined} min={lunar?1899:1900} max={Math.min(2050,new Date().getFullYear())} placeholder="Năm" value={year} onChange={e=>onChange('year',e.target.value)} style={style('year')} required/>{errors?.year&&<p className="field-error" id={id+'-year'}>{errors.year}</p>}</div>
 </div>;
}
export function BirthClockInput({hour,minute,disabled,onChange,style,invalid=false,describedBy}:{hour:string;minute:string;disabled:boolean;onChange:(h:string,m:string)=>void;style:CSSProperties;invalid?:boolean;describedBy?:string}){
 return <input aria-label="Giờ và phút sinh" type="time" inputMode="numeric" aria-invalid={invalid} aria-describedby={describedBy} step={60} disabled={disabled} value={hour!==''&&minute!==''?hour.padStart(2,'0')+':'+minute.padStart(2,'0'):''} onChange={e=>{const [h='',m='']=e.target.value.split(':');onChange(h,m);}} style={style}/>;
}
