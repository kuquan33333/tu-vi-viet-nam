import type { ReactNode } from 'react';
import type { Palace } from '@/lib/ziwei/types';
import { BRANCHES } from '@/lib/ziwei/constants';

// Presentation only: no calculation and no mutation of the engine's data.
const POS: Record<number,[number,number]>={5:[1,1],6:[1,2],7:[1,3],8:[1,4],4:[2,1],9:[2,4],3:[3,1],10:[3,4],2:[4,1],1:[4,2],0:[4,3],11:[4,4]};
const ORDER=[5,6,7,8,4,9,3,10,2,1,0,11];
export default function ChartGrid({palaces=[],center,empty=false,showNames=false}:{palaces?:readonly Palace[];center:ReactNode;empty?:boolean;showNames?:boolean}){
 return <div className="ui-chart-grid" role="group" aria-label={empty?"Bố cục trống 12 cung":"Bố cục 12 cung lá số mẫu"}>
  {ORDER.map(branch=>{
   const palace=palaces.find(p=>p.branch===branch);
   const [row,col]=POS[branch];
   if(empty)return <div key={branch} className="ui-chart-cell" style={{gridRow:row,gridColumn:col}} aria-hidden="true"/>;
   if(!palace)throw new Error('Sample chart missing branch '+branch);
   return <div key={branch} data-branch={branch} data-palace={palace.name} data-ming={palace.isMingGong?'true':'false'} className={'ui-chart-cell'+(palace.isMingGong?' is-ming':'')} style={{gridRow:row,gridColumn:col}}>
    <span>{BRANCHES[branch]}</span>
    {palace.isMingGong?<strong>Mệnh</strong>:<span className={showNames?"home-palace-name":"sr-only"}>{palace.name}</span>}
   </div>;
  })}
  <div className="ui-chart-center">{center}</div>
 </div>;
}
