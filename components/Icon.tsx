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
export default function Icon({name,label,size=20}:{name:IconName;label?:string;size?:number}){
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" focusable="false" {...(label?{role:'img','aria-label':label}:{'aria-hidden':true})}>{paths[name]}</svg>;
}
