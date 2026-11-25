export type IconName='logo'|'user'|'external'|'yin-yang'|'home'|'chart'|'tools'|'book'|'folder'|'sun'|'moon'|'menu'|'close'|'arrow'|'info'|'calendar'|'compass'|'health'|'compare'|'check'|'print'|'copy'|'reset'|'save';
const paths:Record<IconName,React.ReactNode>={
 logo:<><circle cx="12" cy="12" r="9.75"/><circle cx="12" cy="12" r="3.75"/><path d="M12 2.25v6M12 15.75v6M2.25 12h6M15.75 12h6"/></>,
 user:<><circle cx="12" cy="8" r="3.5"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
 external:<><path d="M13 4h7v7m0-7-9 9"/><path d="M10 4H4v16h16v-6"/></>,
 'yin-yang':<><circle cx="12" cy="12" r="9"/><path d="M12 3a4.5 4.5 0 0 1 0 9 4.5 4.5 0 0 0 0 9"/><circle cx="12" cy="7.5" r=".7" fill="currentColor"/><circle cx="12" cy="16.5" r=".7" fill="currentColor"/></>,
 home:<><path d="M3 10l9-7 9 7v10H3z"/><path d="M9 20v-6h6v6"/></>,
 chart:<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></>,
 tools:<><path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/></>,
 book:<><path d="M3 5c4-2 7-1 9 1v15c-3-2-6-3-9-1zM21 5c-4-2-7-1-9 1v15c3-2 6-3 9-1z"/></>,
 folder:<path d="M3 7V5h7l2 2h9v13H3z"/>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/></>,
 moon:<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>,
 menu:<path d="M4 6h16M4 12h16M4 18h16"/>,close:<path d="m5 5 14 14M19 5 5 19"/>,
 arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,
 info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4m-8 7h2m4 0h2m-8 4h2"/></>,
 compass:<><circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4z"/></>,
 health:<><path d="M12 21C9 18 3 14 3 9c0-6 7-7 9-2 2-5 9-4 9 2 0 5-6 9-9 12Z"/><path d="M5 12h4l2-4 2 7 2-3h4"/></>,
 compare:<><rect x="3" y="4" width="7" height="16" rx="2"/><rect x="14" y="4" width="7" height="16" rx="2"/><path d="M6 9h1m10 0h1M6 14h1m10 0h1"/></>,
 check:<path d="m4 12 5 5L20 6"/>,
 print:<><path d="M6 8V3h12v5M6 17H3V8h18v9h-3M6 14h12v7H6z"/><path d="M17 11h1"/></>,
 copy:<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></>,
 reset:<><path d="M4 9a8 8 0 1 1 1 8M4 4v5h5"/></>,
 save:<><path d="M4 3h13l3 3v15H4zM8 3v7h8V3M8 21v-7h8v7"/></>
};
const pcPaths:Partial<Record<IconName,React.ReactNode>>={
 home:<><path d="M2.5 10.5 12 3l9.5 7.5M5 9v12h14V9M9.5 21v-7h5v7" strokeWidth="1.65"/></>,
 chart:<><rect x="4" y="3" width="16" height="18" rx="1.4"/><path d="M7.5 7h9M7.5 11h9M7.5 15h6M7.5 18h4"/></>,
 'yin-yang':<><circle cx="12" cy="12" r="10" strokeWidth="1.25"/><path d="M12 2a10 10 0 0 1 0 20 5 5 0 0 1 0-10 5 5 0 0 0 0-10Z" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1.45" fill="currentColor" stroke="none"/><circle cx="12" cy="17" r="1.45" fill="var(--pc-icon-cutout, #fff5df)" stroke="none"/></>,
 calendar:<><rect x="2.8" y="5.2" width="18.4" height="16" rx="1.15"/><path d="M2.8 10h18.4M7.4 2.8v5M16.6 2.8v5"/>{[7,12,17].flatMap(x=>[13.5,17.4].map(y=><circle key={x+'-'+y} cx={x} cy={y} r=".75" fill="currentColor" stroke="none"/>))}</>,
 compare:<><circle cx="7.7" cy="7" r="3.65"/><circle cx="17.1" cy="7.3" r="3.15"/><path d="M1.9 21v-2.1a5.8 5.8 0 0 1 11.6 0V21M14.8 13.4a5.5 5.5 0 0 1 7.3 5.2V21"/></>,
 book:<><path d="M12 5.6C8.8 3.6 5.2 3.7 2.2 4.7v15.1c3.1-1.4 6.5-1.2 9.8.8 3.3-2 6.7-2.2 9.8-.8V4.7c-3-1-6.6-1.1-9.8.9Zm0 0v15M5.5 6.5v10.3c2-.4 3.5-.1 4.7.6m8.3-10.9v10.3c-2-.4-3.5-.1-4.7.6"/></>,
 tools:<>{[3,13].flatMap(x=>[3,13].map(y=><rect key={x+'-'+y} x={x} y={y} width="8" height="8" rx="1.4"/>))}</>,
 user:<><circle cx="12" cy="6.5" r="3.5"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/></>,
};
export default function Icon({name,label,size=20}:{name:IconName;label?:string;size?:number}){
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" focusable="false" {...(label?{role:'img','aria-label':label}:{'aria-hidden':true})}>{pcPaths[name]?<><g className="icon-original">{paths[name]}</g><g className="icon-pc" style={{display:'none'}}>{pcPaths[name]}</g>{name==='chart'&&<g className="icon-pc-telescope" style={{display:'none'}}><path d="m3 10 13-7 2.5 4-13 7zM16 3l2-1 3 5-2.5 1.4M11.2 10.8l1 5.2m0-2.3-5.4 7.3m5.4-7.3 5.1 7.3m-5.1-5.4V21"/></g>}</>:paths[name]}</svg>;
}
