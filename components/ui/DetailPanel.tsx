import type {ReactNode} from 'react';
import {Eyebrow} from './index';
export default function DetailPanel({title,subtitle,children}:{title:string;subtitle:ReactNode;children:ReactNode}){
 return <aside className="ui-card calendar4-panel" aria-labelledby="calendar4-detail-title">
  <Eyebrow>Ngày đã chọn</Eyebrow>
  <div aria-live="polite" aria-atomic="true">
   <h2 id="calendar4-detail-title">{title}</h2>
   <p className="calendar4-subtitle">{subtitle}</p>
  </div>
  {children}
 </aside>;
}
