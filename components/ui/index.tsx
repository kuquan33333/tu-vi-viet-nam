import type {ButtonHTMLAttributes,HTMLAttributes,InputHTMLAttributes,ReactNode} from 'react';
import Link from 'next/link';
export {default as Icon} from '../Icon';
export function Container({className='',...props}:HTMLAttributes<HTMLDivElement>){return <div className={'ui-container '+className} {...props}/>}
export function Card({className='',large=false,...props}:HTMLAttributes<HTMLDivElement>&{large?:boolean}){return <div className={'ui-card '+(large?'ui-card-large ':'')+className} {...props}/>}
export function Eyebrow({className='',...props}:HTMLAttributes<HTMLParagraphElement>){return <p className={'ui-eyebrow '+className} {...props}/>}
export function Button({variant='primary',className='',type='button',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'}){return <button type={type} className={'ui-button ui-button-'+variant+' '+className} {...props}/>}
export function ButtonLink({href,variant='primary',children,className=''}:{href:string;variant?:'primary'|'secondary';children:ReactNode;className?:string}){return <Link href={href} prefetch={false} className={'ui-button ui-button-'+variant+' '+className}>{children}</Link>}
export function Field({id,label,hint,error,className='',...props}:InputHTMLAttributes<HTMLInputElement>&{id:string;label:ReactNode;hint?:ReactNode;error?:ReactNode}){
 const described=[props['aria-describedby'],hint?id+'-hint':'',error?id+'-error':''].filter(Boolean).join(' ')||undefined;
 return <div className="ui-field"><label htmlFor={id}>{label}{props.required&&' *'}</label><input {...props} id={id} className={'ui-input '+className} aria-invalid={error?true:props['aria-invalid']} aria-describedby={described}/>{hint&&<p id={id+'-hint'} className="ui-hint">{hint}</p>}{error&&<p id={id+'-error'} className="ui-error" role="alert">{error}</p>}</div>
}
export function Segmented({label,options,value,onChange,disabled=false}:{label:string;options:readonly {value:string;label:string;disabled?:boolean}[];value:string;onChange:(v:string)=>void;disabled?:boolean}){return <div className="ui-segmented" role="group" aria-label={label}>{options.map(o=><button key={o.value} type="button" aria-pressed={value===o.value} disabled={disabled||o.disabled} onClick={()=>onChange(o.value)}>{o.label}</button>)}</div>}
export function Checkbox({label,id,...props}:Omit<InputHTMLAttributes<HTMLInputElement>,'type'>&{id:string;label:ReactNode}){return <label className="ui-checkbox" htmlFor={id}><input {...props} id={id} type="checkbox"/><span>{label}</span></label>}
export function Notice({children,tone='note'}:{children:ReactNode;tone?:'note'|'error'}){return <div className={'ui-notice '+(tone==='error'?'ui-notice-error':'')} role={tone==='error'?'alert':'note'}>{children}</div>}
