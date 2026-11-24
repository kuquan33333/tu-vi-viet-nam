'use client';
import {createContext,useContext,useEffect,useState} from 'react';
export type Theme='dark'|'light';
const ThemeContext=createContext<{theme:Theme;toggle:()=>void}>({theme:'light',toggle:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){
 const [theme,setTheme]=useState<Theme>('light');
 useEffect(()=>{
  const root=document.documentElement;
  const current=root.getAttribute('data-theme')==='dark'?'dark':'light';
  setTheme(current);root.setAttribute('data-theme',current);root.dataset.themeReady='true';
 },[]);
 function toggle(){
  const root=document.documentElement;
  const next:Theme=root.getAttribute('data-theme')==='dark'?'light':'dark';
  root.setAttribute('data-theme',next);setTheme(next);
  try{localStorage.setItem('ziwei-theme',next)}catch{}
 }
 return <ThemeContext.Provider value={{theme,toggle}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
