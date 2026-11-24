'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import TriadNav from '@/components/TriadNav';
import {
 HEXAGRAMS, castHexagram, changedLines, hexFromLines, readingRule,
 LINE_GUIDE, type Hexagram, type LineValue,
} from '@/lib/triad/iching';
import {
 TERM_NAMES, TERM_RULES, buildEarthPlate, type Term
} from '@/lib/triad/qimen';

type Tab = 'dich' | 'qimen' | 'tuvi';
type Saved = {date:string;lines:LineValue[];question:string};
const STORAGE_KEY='thienky-casts-v1';
function HexFigure({lines}:{lines:readonly LineValue[]}) {
 return <div className="study-hex" role="img" aria-label="Sáu hào, từ dưới lên trên">
  {[...lines].reverse().map((n,idx)=>{
   const yang=n===7||n===9; const moving=n===6||n===9;
   return <div key={idx} className={'study-hex-row'+(moving?' moving':'')} title={'Hào '+(6-idx)+': '+n}>
    {yang?<span className="study-hex-seg"/>:<><span className="study-hex-seg half"/><span className="study-hex-seg half"/></>}
    <small style={{width:22,textAlign:'right',color:'var(--tx-3)',fontSize:11}}>{moving?'●':String(6-idx)}</small>
   </div>
  })}
 </div>;
}
function HexCard({hex,lines}:{hex:Hexagram;lines:readonly LineValue[]}) {
 return <div className="study-card">
   <div className="study-pill">Quẻ số {hex.number} · {hex.upper.label} trên {hex.lower.label} dưới</div>
   <h2 style={{marginTop:13}}>{hex.name}</h2>
   <HexFigure lines={lines}/>
   <p style={{textAlign:'center',fontSize:13,marginTop:12}}>{hex.upper.nature} / {hex.lower.nature}</p>
   <p style={{textAlign:'center',fontWeight:600}}>{hex.theme}</p><Link className="action-outline" href={'/thien-ky/que/'+hex.number}>Xem kinh văn quẻ {hex.number}</Link>
 </div>;
}
function linesForHex(hex:Hexagram):LineValue[] {
 return (hex.lower.bits+hex.upper.bits).split('').map(v=>v==='1'?7:8) as LineValue[];
}
function IChingTool(){
 const [lines,setLines]=useState<LineValue[]|null>(null);
 const [question,setQuestion]=useState('');
 const [history,setHistory]=useState<Saved[]>([]);
 const [selected,setSelected]=useState<Hexagram>(HEXAGRAMS[0]);
 const [filter,setFilter]=useState('');
 const [manual,setManual]=useState<LineValue[]>([7,8,7,8,7,8]);
 useEffect(()=>{
  try {const saved=localStorage.getItem(STORAGE_KEY);if(saved){const val=JSON.parse(saved);if(Array.isArray(val))setHistory(val.filter((x:Saved)=>x&&Array.isArray(x.lines)&&x.lines.length===6&&x.lines.every(v=>[6,7,8,9].includes(v))&&typeof x.question==='string'&&typeof x.date==='string').slice(0,10));}}
  catch {}
 },[]);
 const primary=useMemo(()=>lines?hexFromLines(lines):null,[lines]);
 const transformed=useMemo(()=>lines?changedLines(lines):null,[lines]);
 const secondary=useMemo(()=>transformed?hexFromLines(transformed):null,[transformed]);
 const moving=lines?.filter(n=>n===6||n===9).length||0;
 function saveCast(values:LineValue[]){
  setLines(values);
  const updated=[{date:new Date().toLocaleString('vi-VN'),question:question.trim().slice(0,150),lines:values},...history].slice(0,10);
  setHistory(updated);
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(updated));}catch{}
 }
 const listed=HEXAGRAMS.filter(h=>(String(h.number)+' '+h.name+' '+h.theme).toLocaleLowerCase('vi').includes(filter.trim().toLocaleLowerCase('vi')));
 return <>
  <div className="study-grid">
   <section className="study-card">
    <h2>Gieo quẻ Chu Dịch</h2>
    <p>Gieo ba đồng xu sáu lần, dựng các hào từ dưới lên trên. Xem quẻ chủ, hào động và quẻ biến.</p>
    <label className="study-label" htmlFor="dich-question">Điều bạn muốn chiêm nghiệm (không bắt buộc)</label>
    <input id="dich-question" className="study-input" maxLength={150} value={question}
      onChange={e=>setQuestion(e.target.value)} placeholder="Ví dụ: Nên cân nhắc điều gì trước quyết định?"/>
    <div className="study-actions" style={{margin:'16px 0'}}>
     <button className="study-btn" type="button" onClick={()=>saveCast(castHexagram())}>Gieo ba đồng xu × 6</button>
     <button type="button" className="study-btn secondary" onClick={()=>saveCast([...manual])}>Lập từ 6 hào nhập tay</button>
    </div>
    <div className="study-picks" role="group" aria-label="Sáu hào nhập thủ công">
     {manual.map((v,i)=><label key={i} className="study-label">
      Hào {i+1} (từ dưới)
      <select className="study-input" value={v} onChange={e=>setManual(p=>p.map((n,j)=>i===j?Number(e.target.value) as LineValue:n))}>
       <option value={6}>6 · Lão âm, động</option><option value={7}>7 · Thiếu dương</option>
       <option value={8}>8 · Thiếu âm</option><option value={9}>9 · Lão dương, động</option>
      </select>
     </label>)}
    </div>
    <div className="study-notice">{LINE_GUIDE} Đây là phép chiêm nghiệm văn hóa, không dùng làm căn cứ duy nhất cho quyết định quan trọng.</div>
   </section>
   <section className="study-card">
    <h2>Lịch sử gieo trên thiết bị</h2>
    <p>Chỉ lưu trong trình duyệt này, không gửi thông tin lên máy chủ.</p>
    {!history.length?<p className="study-muted">Chưa có lượt gieo nào. Bạn có thể thử ngay.</p>:
     <ul className="study-items">{history.map((h,i)=><li key={h.date+'-'+i}>
      <button type="button" className="study-btn secondary" style={{width:'100%',textAlign:'left',justifyContent:'flex-start'}}
       onClick={()=>{setLines(h.lines);setQuestion(h.question);}}>
       <span style={{flex:1}}>#{i+1} · {hexFromLines(h.lines).name}<small style={{display:'block',fontWeight:400}}>{h.date} {h.question?'· '+h.question:''}</small></span>
       →
      </button>
     </li>)}</ul>}
    {!!history.length&&<button className="study-btn secondary" type="button" onClick={()=>{setHistory([]);try{localStorage.removeItem(STORAGE_KEY);}catch{}}}>Xóa lịch sử trên máy</button>}
   </section>
  </div>
  {lines&&primary&&secondary&&transformed&&<>
   <div className="study-grid" style={{marginTop:18}}>
    <HexCard hex={primary} lines={lines}/>
    <HexCard hex={secondary} lines={transformed}/>
   </div>
   <div className="study-card">
    <h2>Giải thích cách đọc</h2>
    <p>Quẻ chủ: <strong>{primary.name}</strong>. Quẻ biến: <strong>{secondary.name}</strong>. Có <strong>{moving} hào động</strong>
     {moving? ' (hào '+lines.map((n,i)=>(n===6||n===9)?i+1:null).filter(Boolean).join(', ')+')':''}.</p>
    {lines.map((n,i)=>(n===6||n===9)?<p key={i}>Hào {i+1} {n===6?'âm động chuyển dương':'dương động chuyển âm'} · <Link href={'/thien-ky/que/'+primary.number+'#hao-'+(i+1)}>Đọc hào từ có nguồn</Link></p>:null)}
    <div className="study-notice">{readingRule(moving)} Đọc nguyên văn có ghi nguồn ở trang quẻ. Bản dịch và bình giải chưa thẩm định.</div>
   </div>
  </>}
  <div className="study-card" style={{marginTop:18}}>
   <h2>Từ điển 64 quẻ</h2>
   <label className="study-label" htmlFor="dich-search">Tra cứu theo tên, số quẻ hoặc ý chính</label>
   <input className="study-input" id="dich-search" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Ví dụ: Thái, 29, hòa thuận..."/>
   <div className="study-grid study-dictionary-layout" style={{alignItems:'start'}}>
    <div className="study-point-list">
     {listed.map(h=><button type="button" key={h.number} className={selected.number===h.number?'active':''} onClick={()=>setSelected(h)}>
       {h.number}. {h.name}<small>{h.theme}</small>
     </button>)}
    </div>
    <HexCard hex={selected} lines={linesForHex(selected)}/>
   </div>
   <p className="study-muted">Bảng 64 quẻ theo thứ tự Văn Vương. Nội dung giải thích được viết để phục vụ nghiên cứu, không phải tiên đoán chắc chắn.</p>
  </div>
 </>;
}
function QimenTool(){
 const [term,setTerm]=useState<Term>('Đông chí');
 const [showExternal,setShowExternal]=useState(false);
 const [yuan,setYuan]=useState<0|1|2>(0);
 const plate=useMemo(()=>buildEarthPlate(term,yuan),[term,yuan]);
 return <>
  <div className="study-grid">
   <section className="study-card">
    <h2>Địa bàn Kỳ Môn – Cửu cung</h2>
    <p>Định âm/dương độn, cục số theo tiết khí và thượng/trung/hạ nguyên; an địa bàn Tam Kỳ Lục Nghi bằng phép thuận/nghịch phi 9 cung.</p>
    <div className="study-picks">
     <label className="study-label">Tiết khí
      <select className="study-input" value={term} onChange={e=>setTerm(e.target.value as Term)}>
       {TERM_NAMES.map(t=><option key={t}>{t}</option>)}
      </select>
     </label>
     <label className="study-label">Nguyên (tự chọn)
      <select className="study-input" value={yuan} onChange={e=>setYuan(Number(e.target.value) as 0|1|2)}>
       <option value={0}>Thượng nguyên</option><option value={1}>Trung nguyên</option><option value={2}>Hạ nguyên</option>
      </select>
     </label>
    </div>
    <div className="study-picks" style={{marginTop:17}}>
     <div><div className="study-muted">Phương pháp</div><strong>{plate.yang?'Dương độn thuận phi':'Âm độn nghịch phi'}</strong></div>
     <div><div className="study-muted">Cục số</div><div className="study-stat">{plate.ju}</div></div>
    </div>
    <div className="study-notice"><strong>Giới hạn quan trọng:</strong> Đây là <strong>địa bàn phục vụ nghiên cứu</strong>, không phải thời gia Kỳ Môn đầy đủ. Bạn phải tự xác định tiết khí/nguyên; Thiên bàn, Trực Phù/Trực Sử, Bát môn chuyển bàn theo giờ và Bát thần chuyển bàn chưa được tính.</div>
   </section>
   <section className="study-card">
    <h2>Cửu cung Lạc Thư</h2>
    <div className="study-palace-grid">
     {plate.palaces.map(p=><div className="study-palace" key={p.index}>
      <div className="top">{p.name} {p.index} · {p.direction}</div>
      <div className="stem">{p.earthStem}</div>
      <div className="base">{p.element} · {p.originalStar}</div>
      <div className="base" style={{fontSize:10}}>{p.originalGate} (bản vị)</div>
     </div>)}
    </div>
    <p className="study-muted">Cột sao và môn là tên <strong>bản vị cố định</strong>, không phải sao/môn đã chuyển theo giờ. Trung cung số 5 không có môn.</p>
   </section>
  </div>
  <div className="study-card">
   <h2>Ghi chú trường phái và nguồn thuật toán</h2>
   <p>Quy tắc ba nguyên và bảng 24 tiết khí được tham chiếu từ dự án MIT <a href="https://github.com/qilaidev/metaphysics-engine" target="_blank" rel="noopener noreferrer">qilaidev/metaphysics-engine</a>. Với ứng dụng Kỳ Môn đầy đủ cần thêm các bước: xác định chính xác giao tiết theo phút, phù đầu, trực phù/trực sử, chuyển Thiên bàn – Bát môn – Bát thần, và bộ kiểm thử cho trường phái lựa chọn.</p>
   <p>Để tham khảo một bộ tính thời gia Kỳ Môn đầy đủ, bạn có thể mở ứng dụng bên ngoài <a href="https://qimen-2i1.pages.dev" target="_blank" rel="noopener noreferrer">qimen</a>. Ứng dụng đó có thuật toán và điều khoản riêng, không phải kết quả do module này tính.</p>
   <button className="study-btn secondary" type="button" onClick={()=>setShowExternal(v=>!v)}>{showExternal?'Ẩn công cụ bên ngoài':'Thử bản Kỳ Môn đầy đủ tại đây →'}</button>
   {showExternal&&<div style={{marginTop:15}}>
    <iframe title="Ứng dụng Kỳ Môn tham khảo của tác giả idavailable" src="https://qimen-2i1.pages.dev" loading="lazy" referrerPolicy="no-referrer"
      sandbox="allow-scripts allow-same-origin" style={{width:'100%',height:580,border:'1px solid var(--ac-bdr)',borderRadius:12}}/>
    <p className="study-muted">Nếu ứng dụng bên ngoài chặn nhúng, hãy mở link tác giả ở trên.</p>
   </div>}
  </div>
 </>;
}
export default function ThienKyPage(){
 const [tab,setTab]=useState<Tab>('dich');
 return <div className="study-shell">
  <TriadNav active="thien-ky"/>
  <main className="study-container">
   <div className="study-hero">
    <div className="study-kicker">Hệ thống tri thức · Thiên Kỷ</div>
    <h1 className="study-title">Thiên Kỷ · Thiên cơ và thuật số</h1>
    <p className="study-lead">Từ Tử Vi Đẩu Số đến Chu Dịch và Kỳ Môn Độn Giáp. Tra cứu quy tắc, thao tác quẻ và khám phá cửu cung minh bạch.</p>
    <div className="study-tabs" role="tablist" aria-label="Chọn phân hệ Thiên Kỷ">
     <button type="button" role="tab" aria-selected={tab==='dich'} onClick={()=>setTab('dich')} className={'study-tab'+(tab==='dich'?' active':'')}>Chu Dịch · 64 quẻ</button>
     <button type="button" role="tab" aria-selected={tab==='qimen'} onClick={()=>setTab('qimen')} className={'study-tab'+(tab==='qimen'?' active':'')}>Địa bàn Kỳ Môn – Cửu cung</button>
     <button type="button" role="tab" aria-selected={tab==='tuvi'} onClick={()=>setTab('tuvi')} className={'study-tab'+(tab==='tuvi'?' active':'')}>Tử Vi Đẩu Số</button>
    </div>
   </div>
   {tab==='dich'?<IChingTool/>:tab==='qimen'?<QimenTool/>:
    <section className="study-card" style={{textAlign:'center',maxWidth:680,margin:'auto'}}>
     <h2>Tử Vi Đẩu Số – hệ thống hiện có</h2><p>Lập mệnh bàn 12 cung, an sao, đại hạn, lưu niên và xem giải thích trong công cụ hiện hữu. Thiên Kỷ dùng chung nền tri thức, không tạo bản tính Tử Vi thứ hai.</p>
     <Link className="study-btn" href="/chart">Mở công cụ lập lá số →</Link>
    </section>}
   <footer className="study-footer">Thiên Kỷ – công cụ nghiên cứu văn hóa và lịch sử thuật số. Nguồn thuật toán được ghi trong từng công cụ; không dùng các kết quả chiêm nghiệm thay cho chuyên gia hay bằng chứng thực tế.</footer>
  </main>
 </div>;
}
