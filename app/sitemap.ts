import type {MetadataRoute} from 'next';
import {ALL_BOOKS} from '@/lib/classics';
import {SITE_URL} from '@/lib/site';

export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap {
 const changed=new Date('2026-11-24');
 const pages=[
  ['/',1],['/chart',.95],['/heming',.85],['/lich-van-nien',.85],
  ['/thien-ky',.8],['/dia-ky',.8],['/nhan-ky',.8],['/library',.82],
  ['/knowledge',.8],['/terms',.3],['/privacy',.3]
 ] as const;
 const top=pages.map(([path,priority])=>({
  url:SITE_URL+path,priority,changeFrequency:'monthly' as const,lastModified:changed
 }));
 const books=ALL_BOOKS.flatMap(book=>[
  {url:SITE_URL+'/library/'+book.slug,priority:.65,changeFrequency:'monthly' as const,lastModified:changed},
  ...book.chapters.map((_,index)=>({
   url:SITE_URL+'/library/'+book.slug+'/'+index,priority:.55,changeFrequency:'yearly' as const,lastModified:changed
  }))
 ]);
 return [...top,...books];
}
