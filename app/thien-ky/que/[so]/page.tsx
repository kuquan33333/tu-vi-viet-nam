import Link from 'next/link';
import {notFound} from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import {pageMetadata} from '@/lib/seo/metadata';
import {HEXAGRAMS} from '@/lib/triad/iching';
import {hexText,HEX_TEXT_SOURCE} from '@/lib/triad/iching-text';
import HexagramFigure from '@/components/HexagramFigure';
import {hexVietnamese} from '@/lib/triad/iching-vi';
export const dynamicParams=false;
export function generateStaticParams(){return HEXAGRAMS.map(h=>({so:String(h.number)}));}
type Props={params:Promise<{so:string}>};
async function resolveHex(params:Props['params']){const {so}=await params;return HEXAGRAMS.find(h=>String(h.number)===so);}
export async function generateMetadata({params}:Props){const h=await resolveHex(params);return h?pageMetadata({title:'Quẻ '+h.number+' – '+h.name+' | Chu Dịch',description:'Tra cứu quái từ, Thoán, Tượng, sáu hào và nguồn văn bản của quẻ '+h.name+'.',path:'/thien-ky/que/'+h.number}):{};}
export default async function HexPage({params}:Props){const h=await resolveHex(params);if(!h)notFound();const t=hexText(h.number);const vn=hexVietnamese(h.number);
 return <><Breadcrumb items={[{label:'Thiên Kỷ',href:'/thien-ky'},{label:'Quẻ '+h.number+' – '+h.name,href:'/thien-ky/que/'+h.number}]}/>
 <main className="site-wrap page-content ui5-page"><div className="tool-hero"><div className="eyebrow">CHU DỊCH · QUẺ {h.number}/64</div><h1 className="display-small">{h.name}</h1><p>{h.theme}</p></div>
 <div className="profile-split"><section className="surface-card reading-panel"><HexagramFigure bits={h.lower.bits+h.upper.bits} label={h.name}/><p>Thượng quái: {h.upper.label} · Hạ quái: {h.lower.label}</p></section><section className="surface-card reading-panel"><h2>Nguồn văn bản</h2><p>Nguyên văn Hán từ bản chép dữ liệu mở, chưa đối chiếu toàn bộ dị bản. Không phải bản dịch tiếng Việt được thẩm định.</p><a href={HEX_TEXT_SOURCE} target="_blank" rel="noopener noreferrer">Nguồn Chu Dịch – yijing-data (MIT)</a></section></div>
 <div className="surface-card reading-panel" style={{marginTop:16}}>
 {([['Quái từ',t?.guaCi],['Thoán truyện',t?.tuan],['Tượng truyện',t?.xiang]] as const).map(([label,v])=><section key={label}><h2>{label}</h2>{v?<p lang="zh-Hans" style={{fontSize:17,lineHeight:1.9}}>{v}</p>:<p>CẦN BỔ SUNG NGUỒN</p>}<p className="workspace-note">Bản dịch và bình giải tiếng Việt: CẦN BỔ SUNG NGUỒN.</p></section>)}
 {vn&&<section className="surface-card reading-panel" style={{margin:'16px 0'}}>
 <h2>Bản dịch ý quái từ (tiếng Việt) · biên soạn mới</h2>
 <p style={{fontSize:16,lineHeight:1.9}}>{vn.judgement}</p>
 <h3>Bình giải bối cảnh và thông điệp</h3><p>{vn.commentary}</p>
 <p className="workspace-note">Đây là dịch ý và nhận định biên tập từ Hán văn cổ, không phải bản dịch từng chữ hoặc lời đoán định. Chưa qua hiệu khảo với các dị bản và chuyên gia Hán Nôm. Sáu hào từ phía dưới vẫn giữ nguyên Hán văn, bản dịch hào từ cần biên tập riêng.</p>
 </section>}
 <h2>Sáu hào từ (từ dưới lên trên)</h2>{Array.from({length:6},(_,i)=><section key={i} id={'hao-'+(i+1)} style={{padding:'16px 0',borderTop:'1px solid var(--bdr)'}}><h3>Hào {i+1}</h3>{t?.lines[i]?<p lang="zh-Hans" style={{whiteSpace:'pre-line',fontSize:16}}>{t.lines[i].position} · {t.lines[i].content}</p>:<p>CẦN BỔ SUNG NGUỒN</p>}</section>)}
 <h2>Hào động và quẻ biến</h2><p>Đổi hào 6 (âm động) thành dương, hào 9 (dương động) thành âm; hào 7 và 8 giữ nguyên. Để xác định quẻ biến cụ thể, nhập đủ sáu hào ở công cụ gieo quẻ. Đây là quy tắc biểu diễn, không phải lời dự báo.</p><Link className="action-outline" href="/thien-ky">Lập quẻ và xem hào động</Link></div>
 <nav aria-label="Quẻ trước và sau" className="workspace-head" style={{marginTop:20}}>{h.number>1&&<Link className="action-outline" href={'/thien-ky/que/'+(h.number-1)}>Quẻ trước</Link>}<Link className="action-outline" href="/thien-ky">Danh mục 64 quẻ</Link>{h.number<64&&<Link className="action-outline" href={'/thien-ky/que/'+(h.number+1)}>Quẻ sau</Link>}</nav>
 </main></>;
}
