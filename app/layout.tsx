import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './tokens.css';
import './globals.css';
import './triad.css';
import './revamp.css';
import './ui.css';
import AppChrome from '@/components/AppChrome';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SITE_URL } from '@/lib/site';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo/metadata';

// Licensed full-glyph fonts are pinned in the repository; no font download at build or runtime.
const Be_Vietnam_Pro = localFont({
  src: [
    {path:'./fonts/BeVietnamPro-Regular.ttf',weight:'400',style:'normal'},
    {path:'./fonts/BeVietnamPro-Medium.ttf',weight:'500',style:'normal'},
    {path:'./fonts/BeVietnamPro-SemiBold.ttf',weight:'600',style:'normal'},
  ],
  display:'swap',variable:'--font-be-vietnam',preload:false,
});
const Noto_Serif = localFont({
  src:'./fonts/NotoSerif-Bold.ttf',weight:'700',style:'normal',
  display:'swap',variable:'--font-noto-serif',adjustFontFallback:'Times New Roman',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
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
    <html lang="vi" data-theme="light" className={Be_Vietnam_Pro.variable+' '+Noto_Serif.variable} suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}