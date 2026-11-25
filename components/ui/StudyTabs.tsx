'use client';
import type {ReactNode,KeyboardEvent} from 'react';
export function StudyTabs<T extends string>({id,label,tabs,value,onChange}:{id:string;label:string;tabs:readonly {value:T;label:ReactNode}[];value:T;onChange:(v:T)=>void}){
 function handle(e:KeyboardEvent<HTMLButtonElement>,index:number){
  const next=e.key==='ArrowRight'?(index+1)%tabs.length:e.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:e.key==='Home'?0:e.key==='End'?tabs.length-1:-1;
  if(next<0)return;e.preventDefault();onChange(tabs[next].value);document.getElementById(id+'-tab-'+tabs[next].value)?.focus();
 }
 return <div className="study-tabs ui5-tabs" role="tablist" aria-label={label}>{tabs.map((t,i)=><button key={t.value} type="button" role="tab" id={id+'-tab-'+t.value} aria-controls={id+'-panel-'+t.value} aria-selected={value===t.value} tabIndex={value===t.value?0:-1} className={'study-tab'+(value===t.value?' active':'')} onClick={()=>onChange(t.value)} onKeyDown={e=>handle(e,i)}>{t.label}</button>)}</div>;
}
export function StudyPanel<T extends string>({id,tabs,value,children}:{id:string;tabs:readonly T[];value:T;children:ReactNode}){
 return <>{tabs.map(t=><section key={t} role="tabpanel" id={id+'-panel-'+t} aria-labelledby={id+'-tab-'+t} hidden={t!==value} tabIndex={t===value?0:-1}>{t===value?children:null}</section>)}</>;
}
