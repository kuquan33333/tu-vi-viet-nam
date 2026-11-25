import Icon from '@/components/Icon';
import Breadcrumb from '@/components/Breadcrumb';
import { pageMetadata } from '@/lib/seo/metadata';
/**
 * /library/[book]/[chapter] — Trang đọc toàn văn từng chương / quyển
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { chapterParams, getChapterBySlug, chapterPath } from '@/lib/classics/chapter-slugs';

export const dynamicParams = false;
export async function generateStaticParams() { return chapterParams(); }

export async function generateMetadata({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book: bookSlug, chapter: chIdx } = await params;
  const result = getChapterBySlug(bookSlug, chIdx);
  if (!result) return {};
  return pageMetadata({title:`${result.chapter.title} · 《${result.book.title}》`,description:result.chapter.subtitle || `Nội dung chương ${result.chapter.title} trong 《${result.book.title}》`,path:chapterPath(result.book.slug,result.chapterIdx),type:'article'});
}

export default async function ChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book: bookSlug, chapter: chIdx } = await params;
  const result = getChapterBySlug(bookSlug, chIdx);
  if (!result) notFound();

  const { book, chapter, chapterIdx } = result;
  const prevIdx = chapterIdx - 1;
  const nextIdx = chapterIdx + 1;

  return <div className="ui5-page ui5-library">
   <Breadcrumb items={[{label:'Thư viện',href:'/library'},{label:book.title,href:'/library/'+book.slug},{label:chapter.title,href:chapterPath(book.slug,chapterIdx)}]}/>
   <div className="site-wrap ui5-reader-layout">
    <nav className="ui-card ui5-chapters" aria-label="Mục lục chương">
     <Link className="ui5-chapter-book" href={'/library/'+book.slug}>{book.title}</Link>
     <details open><summary>Mục lục chương</summary><ol>{book.chapters.map((c,i)=><li key={i}><Link href={chapterPath(book.slug,i)} aria-current={i===chapterIdx?'page':undefined}>{c.title}</Link></li>)}</ol></details>
    </nav>
    <article className="ui5-reader">
     <header><p className="ui-eyebrow">{book.title} · {book.dynasty}</p><h1>{chapter.title}</h1>{chapter.subtitle&&<p className="ui-hint">{chapter.subtitle}</p>}</header>
     <div className="ui-card ui5-reading-body">
      {chapter.paragraphs.map(p=>{const han=/\p{Script=Han}/u.test(p.text);return <section className="ui5-passage" key={p.id} id={p.id}>
       <p className="ui-eyebrow">Đoạn {String(p.idx).padStart(2,'0')}</p>
       {han?<><h2 className="ui5-reading-label">Hán</h2><p className="ui5-han" lang="zh-Hans">{p.text}</p><h2 className="ui5-reading-label">Hán-Việt</h2><p className="ui5-missing">Chưa có phiên âm riêng trong dữ liệu.</p></>:<><h2 className="ui5-reading-label">Hán</h2><p className="ui5-missing">Chưa có nguyên văn chữ Hán trong dữ liệu.</p><h2 className="ui5-reading-label">Hán-Việt</h2><p>{p.text}</p></>}
       <h2 className="ui5-reading-label">Dịch nghĩa</h2>{p.translation?<p>{p.translation}</p>:<p className="ui5-missing">Chưa có bản dịch trong dữ liệu.</p>}
       {p.niNote&&<><h2 className="ui5-reading-label">Thầy Nghê chú</h2><p>{p.niNote}</p></>}
      </section>})}
     </div>
     <nav className="ui5-reader-nav" aria-label="Chuyển chương">
      {prevIdx>=0&&<Link className="ui-button ui-button-secondary" href={chapterPath(book.slug,prevIdx)}>Chương trước: {book.chapters[prevIdx].title}</Link>}
      {nextIdx<book.chapters.length&&<Link className="ui-button ui-button-secondary" href={chapterPath(book.slug,nextIdx)}>Chương kế tiếp: {book.chapters[nextIdx].title}</Link>}
     </nav>
    </article>
   </div>
  </div>;
}
