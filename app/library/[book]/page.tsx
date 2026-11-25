import Icon from '@/components/Icon';
import Breadcrumb from '@/components/Breadcrumb';
import { chapterPath } from '@/lib/classics/chapter-slugs';
import { pageMetadata } from '@/lib/seo/metadata';
/**
 * /library/[book] — Trang mục lục tác phẩm cổ thư
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_BOOKS, getBookBySlug } from '@/lib/classics';

export async function generateStaticParams() {
  return ALL_BOOKS.map(b => ({ book: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};
  return pageMetadata({title: `《${book.title}》 · Thư viện Tử Vi Đẩu Số`,description:book.intro,path:`/library/${book.slug}`});
}

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  return (
    <div className="ui5-page ui5-library">
      <Breadcrumb items={[{label:'Thư viện',href:'/library'},{label:book.title,href:'/library/'+book.slug}]} />

      <div className="site-wrap ui5-book-index">
        {/* Thông tin tác phẩm */}
        <div className="text-center mb-12">
          <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.15em', marginBottom: '8px' }}>
            {book.dynasty} · {book.author}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.04em', marginBottom: '14px' }}>
            《{book.title}》
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.8, maxWidth: '540px', margin: '0 auto' }}>
            {book.intro}
          </p>
        </div>

        {/* Mục lục các chương / quyển */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--line)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.15em', fontWeight: 600 }}>
            MỤC LỤC TÁC PHẨM
          </div>
          {book.chapters.map((chapter, i) => (
            <Link
              key={i}
              href={chapterPath(book.slug,i)}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '14px',
                padding: '14px 20px',
                borderBottom: i === book.chapters.length - 1 ? 'none' : '1px dashed var(--line)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background 0.15s',
              }}
              className="hover:bg-[var(--accent-soft)]"
            >
              <div style={{ fontSize: '12px', color: 'var(--ac)', fontWeight: 600, minWidth: '40px', letterSpacing: '0.05em' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', color: 'var(--tx-0)', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '2px' }}>
                  {chapter.title}
                </div>
                {chapter.subtitle && (
                  <div style={{ fontSize: '11px', color: 'var(--tx-3)' }}>
                    {chapter.subtitle}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.05em' }}>
                {chapter.paragraphs.length} đoạn
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ac)' }}><Icon name="arrow" size={16}/></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}