export default function HexagramFigure({bits,label}:{bits:string;label:string}){
 return <svg role="img" aria-label={label+': sáu hào từ dưới lên'} viewBox="0 0 180 134" style={{display:'block',width:'min(100%,180px)',margin:'auto',color:'var(--tx-0)'}}>
 {[...bits].reverse().map((bit,i)=>bit==='1'?<rect key={i} x="18" y={7+i*21} width="144" height="12" rx="2" fill="currentColor"/>:<g key={i} fill="currentColor"><rect x="18" y={7+i*21} width="63" height="12" rx="2"/><rect x="99" y={7+i*21} width="63" height="12" rx="2"/></g>)}
 </svg>;
}
