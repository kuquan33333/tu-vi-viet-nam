'use client';

import {useMemo,useState} from 'react';
import TriadNav from '@/components/TriadNav';
import {MEDICAL_SOURCES} from '@/lib/triad/medical-sources';
import acupointAudit from '@/lib/triad/acupoint-provenance.generated.json';
import catalog from '@/lib/triad/acupoint-catalog.json';
import {CANONS,POINT_ALIASES,POINTS_ON_SCHEMATIC} from '@/lib/triad/renji';

type Tab='library'|'atlas'|'glossary';
type Point={code:string;name:string;channel:string;chineseMeridian:string;route:string};
const ALL_POINTS:Point[]=catalog.channels.flatMap(c=>c.names.map((name,i)=>({code:c.code+(i+1),name,channel:c.code,chineseMeridian:c.chinese,route:c.route})));
const CHANNELS_VI:Record<string,string>={
 LU:'Phế kinh',LI:'Đại Trường kinh',ST:'Vị kinh',SP:'Tỳ kinh',HT:'Tâm kinh',SI:'Tiểu Trường kinh',
 BL:'Bàng Quang kinh',KI:'Thận kinh',PC:'Tâm Bào kinh',TE:'Tam Tiêu kinh',GB:'Đởm kinh',LR:'Can kinh',
 GV:'Đốc mạch',CV:'Nhâm mạch',
};
function LibraryTool(){
 const [bookId,setBookId]=useState<string>('noi-kinh');
 const [search,setSearch]=useState('');
 const selected=CANONS.find(b=>b.id===bookId)||CANONS[0];
 const entries=CANONS.flatMap(b=>b.topics.map(t=>({...t,bookId:b.id,bookTitle:b.title})));
 const results=entries.filter(t=>(t.title+' '+t.tags+' '+t.text+' '+t.bookTitle).toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi')));
 return <>
  <div className="study-card">
   <h2>Thư viện bốn kinh điển</h2>
   <p>16 bài giới thiệu ngắn bằng tiếng Việt, phục vụ tra cứu thuật ngữ và lịch sử tư tưởng. Không phải bản dịch đầy đủ tác phẩm hoặc chỉ dẫn thực hành y khoa.</p>
   <div className="study-grid" style={{marginTop:15}}>
    {CANONS.map(b=><button type="button" key={b.id} onClick={()=>{setBookId(b.id);setSearch('');}}
      style={{textAlign:'left',padding:17,border:'1px solid '+(bookId===b.id?'var(--ac)':'var(--ac-bdr)'),borderRadius:12,
       background:bookId===b.id?'var(--ac-bg)':'var(--bg-0)',cursor:'pointer',color:'var(--tx-0)'}}>
     <strong style={{display:'block',fontSize:15}}>{b.title}</strong>
     <span style={{fontSize:12,color:'var(--tx-2)',lineHeight:1.7}}>{b.subtitle} · {b.topics.length} chuyên đề</span>
    </button>)}
   </div>
   <label className="study-label" htmlFor="medical-search">Tra cứu toàn bộ chuyên đề</label>
   <input id="medical-search" className="study-input" value={search} onChange={e=>setSearch(e.target.value)}
    placeholder="Ví dụ: âm dương, lục kinh, kinh lạc, phương tễ"/>
  </div>
  {!!search.trim()?<div className="study-grid" style={{marginTop:16}}>
   {results.length===0?<div className="study-card"><p>Chưa có bài phù hợp từ khóa tìm kiếm.</p></div>:
    results.map(x=><article className="study-card" key={x.bookId+x.title}>
      <div className="study-pill">{x.bookTitle}</div>
      <h2 style={{marginTop:13}}>{x.title}</h2>
      <p>{x.text}</p>
      <p className="study-muted">Từ khóa: {x.tags}</p>
    </article>)}
  </div>:<>
   <div className="study-card" style={{marginTop:16}}>
    <div className="study-pill">{selected.period}</div>
    <h2 style={{marginTop:12,fontSize:25}}>{selected.title}</h2>
    <p>{selected.summary}</p><p className="study-muted">Tên tư liệu tham chiếu: {selected.source}</p>
   </div>
   <div className="study-grid" style={{marginTop:16}}>
    {selected.topics.map((topic,i)=><article key={topic.title} className="study-card">
     <div className="study-pill">Chuyên đề {i+1} / {selected.topics.length}</div>
     <h2 style={{marginTop:13}}>{topic.title}</h2>
     <p>{topic.text}</p><div className="study-muted">Chủ đề: {topic.tags}</div>
    </article>)}
   </div>
  </>}
  <div className="study-notice">Tài liệu tổng thuật chỉ nhằm học thuật. Tên các bệnh, khái niệm tạng phủ và lời văn cổ không được dùng để tự xác định bệnh, tự kê thuốc hoặc thay cho dịch vụ y tế.</div>
 </>;
}
function BodyFigure({side,selected,onSelect}:{side:'front'|'back';selected:string;onSelect:(code:string)=>void}) {
 const points=POINTS_ON_SCHEMATIC.filter(x=>x.side===side);
 return <div className="study-figure">
  <svg role="img" aria-label={'Sơ đồ cơ thể minh họa '+(side==='front'?'phía trước':'phía sau')} viewBox="0 0 260 480">
   <defs>
    <linearGradient id="medicalBody" x1="0" y1="0" x2="1" y2="1">
     <stop offset="0" stopColor="var(--ac-bg)"/><stop offset="1" stopColor="var(--bg-1)"/>
    </linearGradient>
   </defs>
   <g fill="url(#medicalBody)" stroke="var(--ac)" strokeWidth="1.7" strokeLinejoin="round" opacity=".86">
    <ellipse cx="130" cy="54" rx="31" ry="37"/>
    <path d="M115 90 Q95 98 87 111 L78 170 L88 230 L89 274 Q105 299 130 302 Q155 299 171 274 L172 230 L182 170 L174 111 Q165 98 145 90 Z"/>
    <path d="M89 112 Q77 121 70 150 L43 243 Q37 263 38 283 L45 292 Q57 283 58 269 L94 178 Z"/>
    <path d="M171 112 Q183 121 190 150 L217 243 Q223 263 222 283 L215 292 Q203 283 202 269 L166 178 Z"/>
    <path d="M91 279 Q94 310 95 330 L93 402 Q92 433 94 453 L112 455 Q117 433 117 406 L124 309 Z"/>
    <path d="M169 279 Q166 310 165 330 L167 402 Q168 433 166 453 L148 455 Q143 433 143 406 L136 309 Z"/>
   </g>
   <path d="M130 95 L130 298" stroke="var(--ac-bdr)" strokeDasharray="3 5" strokeWidth="2"/>
   {points.map(p=><g key={p.code} onClick={()=>onSelect(p.code)} style={{cursor:'pointer'}}>
    <circle className={'hotspot'+(selected===p.code?' active':'')} cx={p.x} cy={p.y} r={selected===p.code?7:5}/>
    {selected===p.code&&<text x={p.x+9} y={p.y-8} fontWeight="700" fill="var(--ac-dim)">{p.code}</text>}
   </g>)}
   <text x="130" y="475" textAnchor="middle" fill="var(--tx-3)" fontSize="9">Sơ đồ giáo dục, không theo tỉ lệ giải phẫu</text>
  </svg>
 </div>;
}
function AtlasTool(){
 const [channel,setChannel]=useState('LI');
 const [search,setSearch]=useState('');
 const [selected,setSelected]=useState('LI4');
 const [side,setSide]=useState<'front'|'back'>('front');
 const [show3d,setShow3d]=useState(false);
 const visible=useMemo(()=>ALL_POINTS.filter(p=>{
  const q=search.trim().toLocaleLowerCase('vi');
  if(q){return (p.code+' '+p.name+' '+(POINT_ALIASES[p.code]||'')+' '+(CHANNELS_VI[p.channel]||'')).toLocaleLowerCase('vi').includes(q);}
  return p.channel===channel;
 }),[channel,search]);
 const info=ALL_POINTS.find(p=>p.code===selected);
 const hasMarker=POINTS_ON_SCHEMATIC.some(p=>p.code===selected&&p.side===side);
 return <>
  <div className="study-card">
   <h2>Atlas 14 kinh mạch · 361 huyệt</h2>
   <p>Danh mục mã huyệt quốc tế, tên nguyên ngữ và tên Hán–Việt phổ biến. 361 mục trong danh sách, nhưng chỉ một nhóm có điểm minh họa trên sơ đồ 2D. Không mặc nhiên coi tất cả điểm đã có tọa độ giải phẫu.</p>
   <div className="study-meridian-list">
    {catalog.channels.map(c=><button type="button" key={c.code}
       className={channel===c.code?'active':''} onClick={()=>{setChannel(c.code);setSearch('');setSelected(c.code+'1');}}>
       {c.code} · {CHANNELS_VI[c.code]}
     </button>)}
   </div>
  </div>
  <div className="study-grid" style={{marginTop:16}}>
   <section className="study-card">
    <h2>Danh mục tìm kiếm</h2>
    <label className="study-label" htmlFor="acu-search">Tên huyệt, mã quốc tế hoặc tên Hán–Việt</label>
    <input className="study-input" id="acu-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="LI4, Hợp Cốc, 合谷, ST36..."/>
    <p className="study-muted" style={{marginTop:9}}>Tìm được {visible.length} mục. Các danh mục tên gốc lưu bằng chữ Hán và mã kinh quốc tế.</p>
    <div className="study-point-list">
     {visible.map(p=><button className={selected===p.code?'active':''} key={p.code} type="button" onClick={()=>{
      setSelected(p.code);const marker=POINTS_ON_SCHEMATIC.find(x=>x.code===p.code);if(marker)setSide(marker.side);
     }}>
      <strong>{p.code} · {POINT_ALIASES[p.code]||p.name}</strong>
      <small>{POINT_ALIASES[p.code]?p.name+' · ':''}{CHANNELS_VI[p.channel]}</small>
     </button>)}
    </div>
   </section>
   <section className="study-card">
    <h2>Sơ đồ vùng cơ thể</h2>
    <div className="study-tabs" style={{margin:'4px 0 8px'}}>
     <button type="button" className={'study-tab'+(side==='front'?' active':'')} onClick={()=>setSide('front')}>Phía trước</button>
     <button type="button" className={'study-tab'+(side==='back'?' active':'')} onClick={()=>setSide('back')}>Phía sau</button>
    </div>
    <BodyFigure side={side} selected={selected} onSelect={setSelected}/>
    {info&&<div className="study-card" style={{padding:16,marginTop:15,background:'var(--ac-bg)'}}>
     <div className="study-muted">Huyệt được chọn</div>
     <h2 style={{margin:'6px 0'}}>{POINT_ALIASES[info.code]||info.name} · {info.code}</h2>
     <p>Tên gốc: {info.name}. Kinh: {CHANNELS_VI[info.channel]}. Tuyến theo tài liệu: {info.route}.</p>
     <p className="study-muted">{hasMarker?'Điểm nổi trên sơ đồ chỉ mang tính phác họa.':'Huyệt này chưa có tọa độ minh họa được kiểm duyệt trên sơ đồ.'}</p>
    </div>}
   </section>
  </div>
  <div className="study-card">
   <h2>Bản đồ huyệt đạo 3D từ dự án tham khảo</h2>
   <p>Atlas 3D do cộng đồng <a href="https://github.com/aicuc/3d-acupoint-atlas" target="_blank" rel="noopener noreferrer">aicuc/3d-acupoint-atlas</a> phát hành theo MIT. Bản 3D có mô hình tương tác riêng; liên kết ở đây chỉ nhúng nội dung từ trang tác giả, không sao chép hay cam kết mọi vị trí đều chuẩn giải phẫu.</p>
   <div className="study-actions">
    <button className="study-btn" type="button" onClick={()=>setShow3d(v=>!v)}>{show3d?'Ẩn bản đồ 3D':'Mở bản đồ 3D tại đây'}</button>
    <a className="study-btn secondary" target="_blank" rel="noopener noreferrer" href="https://aicuc.github.io/3d-acupoint-atlas/">Mở trang gốc ↗</a>
   </div>
   {show3d&&<div style={{marginTop:15}}>
    <iframe title="Atlas 3D nguồn mở của aicuc" src="https://aicuc.github.io/3d-acupoint-atlas/" loading="lazy"
      referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin" style={{width:'100%',height:520,border:'1px solid var(--ac-bdr)',borderRadius:12}}/>
    <p className="study-muted">Nếu trình duyệt hoặc trang gốc chặn nhúng, sử dụng liên kết “Mở trang gốc”.</p>
   </div>}
   <div className="study-notice">Sơ đồ không dành cho hướng dẫn châm cứu. Không tự châm kim, cứu ngải, ấn sâu các huyệt hoặc tự điều trị bệnh dựa vào hình minh họa.</div>
  </div>
 </>;
}
function GlossaryTool(){
 const DATA=[
  ['Âm / Dương','Hai thuộc tính tương quan trong triết học và y học cổ, không phải đơn vị đo sinh học.'],
  ['Ngũ hành','Mộc, Hỏa, Thổ, Kim, Thủy — mô hình phân loại và tương quan trong tư tưởng truyền thống.'],
  ['Tạng tượng','Khái niệm mô tả chức năng theo cổ y, không đồng nhất 1–1 với cơ quan giải phẫu.'],
  ['Kinh mạch','Nhóm đường kinh trong văn bản y học truyền thống. Không xác nhận đó là một mạng lưới giải phẫu độc lập.'],
  ['Huyệt vị','Tên vị trí được mô tả trong kinh điển châm cứu, cần chuẩn định vị riêng khi sử dụng chuyên môn.'],
  ['Lục kinh','Hệ phân loại sáu kinh của Thương Hàn Luận, không phải tiến trình của mọi bệnh hiện đại.'],
  ['Phương tễ','Bài thuốc trong y thư cổ; học thuật không đồng nghĩa cho phép tự sử dụng hay kê đơn.'],
  ['Biện chứng','Cách sắp xếp thông tin về chứng trong lý luận Đông y; không thay thế chẩn đoán lâm sàng.'],
  ['Nội Kinh','Hoàng Đế Nội Kinh, gồm các nhánh Tố Vấn và Linh Khu trong hệ thống văn bản cổ.'],
  ['Thương Hàn Luận','Kinh điển thường gắn với Trương Trọng Cảnh, nghiên cứu về phân loại chứng và phương tễ.'],
  ['Kim Quỹ Yếu Lược','Tác phẩm cổ gắn với nghiên cứu tạp bệnh và phương tễ.'],
 ];
 const [query,setQuery]=useState('');
 const visible=DATA.filter(x=>x.join(' ').toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')));
 return <div className="study-card">
  <h2>Từ điển thuật ngữ</h2>
  <p>Tra nhanh từ vựng xuất hiện trong thư viện Nhân Kỷ, với chú giải các giới hạn khi đọc dưới góc nhìn khoa học hiện đại.</p>
  <input className="study-input" aria-label="Tìm thuật ngữ" placeholder="Tìm âm dương, kinh mạch, lục kinh..." value={query} onChange={e=>setQuery(e.target.value)}/>
  <div className="study-grid" style={{marginTop:16}}>
   {visible.map(([name,description])=><div key={name} className="study-card" style={{padding:16}}>
     <h3>{name}</h3><p>{description}</p>
   </div>)}
  </div>
 </div>;
}
export default function NhanKyPage(){
 const [tab,setTab]=useState<Tab>('library');
 return <div className="study-shell">
  <TriadNav active="nhan-ky"/>
  <main className="study-container">
   <div className="study-hero">
    <div className="study-kicker">Hệ thống tri thức · Nhân Kỷ</div>
    <h1 className="study-title">Nhân Kỷ · Y thư và kinh lạc</h1><div className="study-notice" role="note"><strong>Thông tin giáo dục, không thay thế tư vấn y tế.</strong> Không tự chẩn đoán, kê thuốc, châm cứu, cứu ngải hoặc tự điều trị dựa vào nội dung này. Khi cần chăm sóc sức khỏe hãy gặp nhân viên y tế được cấp phép.</div><div className="study-picks"><div><strong>Học thuyết cổ truyền</strong><p>Y thư và kinh lạc trình bày quan niệm lịch sử.</p></div><div><strong>Chứng cứ y học hiện đại</strong><p>Chưa có bộ tổng quan bằng chứng lâm sàng được thẩm định trong thư viện này.</p></div></div>
    <p className="study-lead">Học và tra cứu Nội Kinh, Thương Hàn, Kim Quỹ, Châm Cứu; khám phá danh mục huyệt đạo, thuật ngữ cổ học và sơ đồ giáo dục.</p>
    <div className="study-tabs" role="tablist" aria-label="Chọn phân hệ Nhân Kỷ">
     <button role="tab" aria-selected={tab==='library'} className={'study-tab'+(tab==='library'?' active':'')} type="button" onClick={()=>setTab('library')}>Thư viện y thư</button>
     <button role="tab" aria-selected={tab==='atlas'} className={'study-tab'+(tab==='atlas'?' active':'')} type="button" onClick={()=>setTab('atlas')}>Atlas 361 huyệt</button>
     <button role="tab" aria-selected={tab==='glossary'} className={'study-tab'+(tab==='glossary'?' active':'')} type="button" onClick={()=>setTab('glossary')}>Từ điển thuật ngữ</button>
    </div>
   </div>
   {tab==='library'?<LibraryTool/>:tab==='atlas'?<AtlasTool/>:<GlossaryTool/>}
   <div className="study-card" style={{marginTop:16}}>
    <h2>Nguồn dữ liệu và giới hạn</h2>
    <p>Danh mục tên và mã 361 huyệt, 14 kinh mạch được chuyển từ <a href="https://github.com/aicuc/3d-acupoint-atlas" target="_blank" rel="noopener noreferrer">aicuc/3d-acupoint-atlas</a> (MIT, ghi công tác giả). Các mục giới thiệu y thư do dự án biên soạn mới, không sao chép nguyên văn giáo trình có bản quyền.</p>
    
   </div>
   <section className="study-card" style={{marginTop:18}}>
    <h2>Kiểm chứng danh mục và thư mục có nguồn</h2>
    <p className="study-notice"><strong>{acupointAudit.pointCodeMatch}/361 mã huyệt</strong> đã đối chiếu với TARA Ontology; {acupointAudit.variantReviewCount} tên có biểu diễn Hán tự khác dạng, cần hiệu đính; vị trí huyệt được chuyên gia thẩm định: <strong>{acupointAudit.clinicallyVerifiedLocations}/361</strong>. Mã số trùng nhau không chứng minh tọa độ y khoa chính xác.</p>
    <div className="study-grid">
     {MEDICAL_SOURCES.map(b=><article className="study-card" key={b.url}><h3>{b.title}</h3><p className="study-muted">{b.name}</p><p>{b.limits}</p><a className="study-btn secondary" href={b.url} target="_blank" rel="noopener noreferrer">Mở bản Hán cổ ở Wikisource</a></article>)}
    </div>
    <p className="study-muted">Bản Hán cổ không mặc định đồng nghĩa bản chép số hóa có thể sao chép mà không ghi nguồn. Các bản dịch hiện đại có thể có bản quyền. Tài liệu <a href="https://www.who.int/publications/i/item/9290611057" target="_blank" rel="noopener noreferrer">danh pháp 361 huyệt WHO</a> và sách định vị WHO 2008 có bản quyền; chưa đưa toàn bộ mô tả vào website. TARA chỉ dùng đối chiếu mã, không nhập mô tả phương pháp châm cứu.</p>
   </section>
   <footer className="study-footer">Nhân Kỷ · Thư viện giáo dục.</footer>
  </main>
 </div>;
}
