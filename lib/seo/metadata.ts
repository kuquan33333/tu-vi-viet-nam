import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const SITE_NAME = 'Tử Vi Đẩu Số';
export const SITE_DESCRIPTION = 'Lập lá số, tra cứu lịch âm dương và khám phá cổ học phương Đông. Các công cụ văn hóa và tham khảo, không thay thế tư vấn chuyên môn.';
export const OG_IMAGE = '/og-default.png';

export function pageMetadata({title,description,path,noindex=false,type='website'}:{title:string;description:string;path:string;noindex?:boolean;type?:'website'|'article'}):Metadata {
 const url = SITE_URL + path;
 const image = {url:SITE_URL+OG_IMAGE,width:1200,height:630,alt:'Tử Vi Đẩu Số · Thư quán phương Đông'};
 return {
  title, description,
  alternates:{canonical:url},
  openGraph:{title,description,url,siteName:SITE_NAME,locale:'vi_VN',type,images:[image]},
  twitter:{card:'summary_large_image',title,description,images:[{url:image.url,alt:image.alt}]},
  ...(noindex ? {robots:{index:false,follow:false}} : {}),
 };
}
export function websiteSchema(){
 return {'@context':'https://schema.org','@type':'WebSite',name:SITE_NAME,url:SITE_URL+'/',inLanguage:'vi',description:SITE_DESCRIPTION};
}
