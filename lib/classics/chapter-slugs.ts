// Explicit immutable URL identifiers; do not regenerate from mutable chapter titles.
// Keep existing index-to-slug mapping when correcting titles. Append new chapters.
import { ALL_BOOKS, getChapter } from './index';
export const CHAPTER_SLUGS: Readonly<Record<string,readonly string[]>> = {
  "gusuifu": [
    "tong-luan-thien",
    "tu-vi-tinh-luan",
    "that-sat-tinh-luan",
    "sat-pha-tham-cach",
    "co-nguyet-dong-luong-cach",
    "tu-hoa-tinh-luan",
    "phu-bat-khoi-viet-luan",
    "luc-sat-tinh-luan",
    "thap-nhi-cung-luan"
  ],
  "quanji": [
    "tong-luan",
    "tu-vi-tinh-luan",
    "nam-dau-luc-tinh-luan",
    "bac-dau-luc-tinh-luan",
    "tu-hoa-va-cach-cuc-luan"
  ],
  "quanshu": [
    "cung-menh",
    "cung-tai-bach",
    "cung-quan-loc",
    "cung-phu-the",
    "tu-hoa-luan",
    "co-nguyet-dong-luong-cach",
    "song-loc-trieu-vien-cach"
  ]
};
export function chapterSlug(book:string,index:number):string{
 const slug=CHAPTER_SLUGS[book]?.[index];
 if(!slug)throw new Error('Thiếu slug chương: '+book+'/'+index);
 return slug;
}
export function chapterPath(book:string,index:number):string{return '/library/'+book+'/'+chapterSlug(book,index);}
export function getChapterBySlug(book:string,slug:string){
 const index=CHAPTER_SLUGS[book]?.indexOf(slug)??-1;
 return index<0?null:getChapter(book,index);
}
export function chapterParams(){
 return ALL_BOOKS.flatMap(b=>b.chapters.map((_,i)=>({book:b.slug,chapter:chapterSlug(b.slug,i)})));
}
