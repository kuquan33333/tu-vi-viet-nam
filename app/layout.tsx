import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Noto_Serif } from 'next/font/google';
import './tokens.css';
import './globals.css';
import './triad.css';
import './revamp.css';
import './ui.css';
import AppChrome from '@/components/AppChrome';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SITE_URL } from '@/lib/site';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo/metadata';

// next/font fetches at build time and serves font files from this origin, never from Google in the browser.
const sans = Be_Vietnam_Pro({weight:['400','500','600'],subsets:['latin','vietnamese'],display:'swap',variable:'--font-be-vietnam'});
const serif = Noto_Serif({weight:'700',subsets:['latin','vietnamese'],display:'swap',variable:'--font-noto-serif'});

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
    <html lang="vi" data-theme="light" className={sans.variable+' '+serif.variable} suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}