'use client';
import Icon from '@/components/Icon';
import Breadcrumb from '@/components/Breadcrumb';


import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { searchClassics, getParagraphById } from '@/lib/classics';
import { chapterPath } from '@/lib/classics/chapter-slugs';

// Trang tìm kiếm xử lý ở trình duyệt để hoạt động trên Cloudflare Pages tĩnh.
export default function SearchPage() {
  const [q, setQ] = useState('');

  useEffect(() => {
    setQ(new URLSearchParams(window.location.search).get('q')?.trim() || '');
  }, []);

  const hits = useMemo(() => q ? searchClassics(q, 50) : [], [q]);

  return (
    <div className="ui5-page ui5-library">
      <Breadcrumb items={[{label:'Thư viện',href:'/library'},{label:'Tra cứu',href:'/library/search'}]} />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div style={{ fontSize: 12, color: 'var(--tx-3)', letterSpacing: '0.1em' }}>THƯ VIỆN CỔ THƯ</div>
          <h1 style={{ fontSize: 'clamp(24px,4vw,34px)', fontWeight: 700, color: 'var(--tx-0)', margin: '10px 0 20px' }}>
            Tra cứu toàn văn
          </h1>
          <form action="/library/search" method="GET" className="flex gap-2 max-w-xl mx-auto">
            <input
              aria-label="Từ khóa tra cứu"
              name="q"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Nhập tên sao, cách cục, cung mệnh..."
              className="flex-1 min-w-0"
              style={{ padding: '12px 14px', background: 'var(--bg-card)', color: 'var(--tx-0)', border: '1px solid var(--t-border)', borderRadius: 9 }}
            />
            <button type="submit" style={{ padding: '11px 18px', borderRadius: 9, background: 'var(--ac)', color: 'var(--bg-page)', fontWeight: 600 }}>Tìm kiếm</button>
          </form>
          <p style={{ fontSize: 12, color: 'var(--tx-3)', marginTop: 14 }}>
            {q ? <>Tìm thấy <strong style={{ color: 'var(--ac)' }}>{hits.length}</strong> kết quả cho “{q}”</> : 'Nhập từ khóa để xem kết quả.'}
          </p>
        </div>

        {hits.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: '36px 24px', textAlign: 'center', color: 'var(--tx-2)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}><Icon name="book" size={32}/></div>
            {q ? 'Chưa tìm thấy nội dung phù hợp. Hãy thử từ khóa khác.' : 'Hãy nhập từ khóa cần tra cứu.'}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {hits.map((hit, i) => {
              const ctx = getParagraphById(hit.paragraphId);
              if (!ctx) return null;
               const chapterIdx = ctx.chapterIdx;
              return (
                <Link key={i} href={`${chapterPath(hit.bookSlug,chapterIdx)}#${hit.paragraphId}`}
                  style={{ display: 'block', padding: '17px 20px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10, textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ac)', marginBottom: 8 }}>
                    《{hit.bookTitle}》 · {hit.chapterTitle}
                  </div>
                  <div style={{ color: 'var(--tx-0)', fontSize: 14, lineHeight: 1.8 }}>{hit.text}</div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
