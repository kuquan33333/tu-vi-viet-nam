import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './tokens.css';
import './globals.css';
import './triad.css';
import './revamp.css';
import './ui.css';
import './remaining-ui.css';
import './brand.css';
import AppChrome from '@/components/AppChrome';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SITE_URL } from '@/lib/site';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo/metadata';

// Licensed WOFF2 fonts are pinned in the repository; no font download at build or runtime.
const Be_Vietnam_Pro = localFont({
  src: [
    {path:'./fonts/BeVietnamPro-Regular.woff2',weight:'400',style:'normal'},
    {path:'./fonts/BeVietnamPro-Medium.woff2',weight:'500',style:'normal'},
    {path:'./fonts/BeVietnamPro-SemiBold.woff2',weight:'600',style:'normal'},
  ],
  display:'swap',variable:'--font-be-vietnam',preload:false,
});
const Noto_Serif = localFont({
  src:'./fonts/NotoSerif-Bold-latin.woff2',weight:'700',style:'normal',
  display:'swap',variable:'--font-noto-serif',preload:true,adjustFontFallback:false,
  declarations:[{prop:'unicode-range',value:'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'}],
});
const Noto_Serif_Vietnamese = localFont({
  src:'./fonts/NotoSerif-Bold-vietnamese.woff2',weight:'700',style:'normal',
  display:'swap',variable:'--font-noto-serif-vietnamese',preload:true,adjustFontFallback:false,
  declarations:[{prop:'unicode-range',value:'U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB'}],
});
const Noto_Serif_Extended = localFont({
  src:'./fonts/NotoSerif-Bold-latin-ext.woff2',weight:'700',style:'normal',
  display:'swap',variable:'--font-noto-serif-extended',preload:false,adjustFontFallback:false,
  declarations:[{prop:'unicode-range',value:'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'}],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  icons: {icon:[{url:'/brand/favicon.svg',type:'image/svg+xml'},{url:'/brand/emblem.webp',type:'image/webp'}],apple:[{url:'/brand/apple-touch.png',sizes:'180x180',type:'image/png'}]},
  description: SITE_DESCRIPTION,
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" data-theme="light" className={[Be_Vietnam_Pro.variable,Noto_Serif.variable,Noto_Serif_Vietnamese.variable,Noto_Serif_Extended.variable].join(' ')} suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}