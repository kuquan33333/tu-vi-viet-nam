'use client';
import {createContext,useContext,useEffect,useState} from 'react';
export type Theme='dark'|'light';
const ThemeContext=createContext<{theme:Theme;toggle:()=>void}>({theme:'light',toggle:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){
 const [theme,setTheme]=useState<Theme>('light');
 useEffect(()=>{
  const root=document.documentElement;
  const current='light' as const;
  setTheme(current);root.setAttribute('data-theme',current);root.dataset.themeReady='true';
 },[]);
 // Dark mode intentionally suspended per UI-BRIEF; the old preference is not erased.
 function toggle(){ /* restored in a future dark-theme release */ }
 return <ThemeContext.Provider value={{theme,toggle}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
