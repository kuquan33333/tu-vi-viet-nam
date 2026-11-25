export default function HexagramFigure({bits,label,moving=[]}:{bits:string;label:string;moving?:readonly number[]}){
 return <svg role="img" aria-label={label+': sáu hào từ dưới lên'+(moving.length?', hào động '+moving.join(', '):'')} viewBox="0 0 240 156" className="ui5-hexagram" style={{display:'block',width:'min(100%,240px)',margin:'auto',color:'var(--ink)'}}>
 {[...bits].reverse().map((bit,i)=>{const n=6-i,y=8+i*24,active=moving.includes(n);return <g key={i} data-line={n} fill={active?'var(--accent)':'currentColor'}><text x="4" y={y+10} fontSize="12">{n}</text>{bit==='1'?<rect x="28" y={y} width="150" height="12" rx="2"/>:<><rect x="28" y={y} width="65" height="12" rx="2"/><rect x="113" y={y} width="65" height="12" rx="2"/></>}{active&&<text x="187" y={y+10} fontSize="12">Động</text>}</g>})}
 </svg>;
}
