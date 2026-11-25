'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import Icon from '../Icon';
import {vietnamToday,dayMarks,displayTerms,displayGanZhi,type CalendarData} from '@/lib/ziwei/calendar-display';
import {candidateSolarToLunar} from '@/lib/ziwei/vn-calendar-candidate';
const stems=[...'甲乙丙丁戊己庚辛壬癸'],branches=[...'子丑寅卯辰巳午未申酉戌亥'];
const sv=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'],bv=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
function vi(s?:string){return s?[...s].map(c=>sv[stems.indexOf(c)]??bv[branches.indexOf(c)]??c).join(' '):'—'}
const weekday=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
export default function HomeCalendar({initial,data}:{initial:ReturnType<typeof vietnamToday>;data:CalendarData}){
 const [today,setToday]=useState(initial);
 useEffect(()=>{const refresh=()=>setToday(old=>{const n=vietnamToday();return old.year===n.year&&old.month===n.month&&old.day===n.day?old:n});refresh();const timer=setInterval(refresh,60000);return()=>clearInterval(timer)},[]);
 const {year,month,day}=today, l=candidateSolarToLunar(year,month,day),gz=displayGanZhi(data,year,month,day);
 const terms=displayTerms(data,year),marks=dayMarks(year,month,day,terms),current=[...displayTerms(data,year-1),...terms].filter(t=>t.year*10000+t.month*100+t.day<=year*10000+month*100+day).at(-1);
 return <section className="brand-frame home-calendar" aria-labelledby="home-calendar-title">
  <div className="home-panel-head"><h2 id="home-calendar-title"><Icon name="calendar" size={24}/> Lịch Vạn Niên</h2><Link href="/lich-van-nien" prefetch={false}>Tra cứu chi tiết <Icon name="arrow" size={16}/></Link></div>
  <div className="home-calendar-body"><div className="brand-date" data-date={year+'-'+String(month).padStart(2,'0')+'-'+String(day).padStart(2,'0')}>
   <div className="brand-date-week">{weekday[new Date(Date.UTC(year,month-1,day)).getUTCDay()]}</div><strong className="brand-date-number">{day}</strong><p>Tháng {month} năm {year}</p><div className="brand-date-lunar"><span>Âm lịch</span><strong>{l?l.lunarDay+' tháng '+l.lunarMonth+(l.isLeapMonth?' nhuận':''):'Ngoài phạm vi hỗ trợ'}</strong>{l&&<span>Năm {l.lunarYear}</span>}</div>
  </div><div className="brand-calendar-facts"><dl><dt>Ngày</dt><dd>{vi(gz?.day)}</dd><dt>Tháng</dt><dd>{vi(gz?.month)}</dd><dt>Năm</dt><dd>{vi(gz?.year)}</dd></dl><div><h3><Icon name="sun" size={18}/> Tiết khí</h3><p>{current?current.name+' · '+current.day+'/'+current.month:'Xem lịch chi tiết'}</p></div><div><h3><Icon name="calendar" size={18}/> Sự kiện trong ngày</h3><p>{marks.length?marks.map(m=>m.label).join(' · '):'Không có mốc lễ hoặc giao tiết được đánh dấu.'}</p></div><p className="brand-calendar-note">Lịch Việt Nam UTC+7 · Can Chi tháng theo tiết khí, tham khảo.</p></div></div>
 </section>;
}
