'use client';
import {useId,useState,useEffect,useRef} from 'react';
export const TERM_EXPLANATIONS={
 'Sinh thần':'Thông tin ngày và giờ sinh dùng để lập lá số.',
 'Dương lịch (Mặt trời)':'Lịch dương sử dụng phổ biến hằng ngày, dựa trên chu kỳ năm Mặt Trời.',
 'Âm lịch (Mặt trăng)':'Lịch âm dương truyền thống dùng chu kỳ Mặt Trăng để xác định tháng và điều chỉnh bằng tháng nhuận.',
 'Chân Thái Dương Thời':'Giờ Mặt Trời biểu kiến tại nơi sinh, có xét kinh độ và phương trình thời gian.',
} as const;
export default function TermTooltip({term}:{term:keyof typeof TERM_EXPLANATIONS}){
 const [open,setOpen]=useState(false);
 const id=useId();const root=useRef<HTMLSpanElement>(null);
 useEffect(()=>{if(!open)return;const onPointer=(e:PointerEvent)=>{if(e.target instanceof Node&&!root.current?.contains(e.target))setOpen(false);};document.addEventListener('pointerdown',onPointer);return()=>document.removeEventListener('pointerdown',onPointer);},[open]);
 return <span className="term-help" ref={root}>
  <button className="term-help-button" type="button" aria-label={'Giải thích: '+term} aria-expanded={open} aria-controls={id} aria-describedby={id}
   onClick={()=>setOpen(v=>!v)} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);e.stopPropagation();}}}>ⓘ</button>
  <span id={id} className={'term-help-popup'+(open?' is-open':'')} role="tooltip">{TERM_EXPLANATIONS[term]}</span>
 </span>;
}
