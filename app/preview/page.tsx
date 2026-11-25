'use client';
import Icon from '@/components/Icon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrollIntro from '@/components/ScrollIntro';

export default function PreviewPage() {
  const router = useRouter();
  const [replayKey, setReplayKey] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <>
      {/* Hiệu ứng cuộn thư khai màn */}
      <ScrollIntro key={replayKey} onComplete={() => setDone(true)} />

      {done && (
        <main style={{
          minHeight: '100vh',
          background: 'var(--ink)',
          color: 'var(--on-dark)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px',
          fontFamily: 'var(--font-serif)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--on-dark-muted)', marginBottom: '16px' }}>
            HIỆU ỨNG CUỘN THƯ · XEM TRƯỚC
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            letterSpacing: '0.08em',
            color: 'var(--on-dark)',
            marginBottom: '16px',
            fontWeight: 700,
          }}>
            Khai Màn Tử Vi Đẩu Số
          </h1>
          <p style={{
            fontSize: '14px', color: 'var(--on-dark-muted)',
            maxWidth: '520px', lineHeight: 1.9,
            letterSpacing: '0.04em',
            marginBottom: '40px',
          }}>
            Hiệu ứng cuộn thư mở ra không gian cổ kính thanh nhã mỗi khi truy cập nền tảng.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => { setDone(false); setReplayKey(k => k + 1); }}
              style={{
                background: 'var(--accent)',
                color: 'var(--white)',
                padding: '14px 28px',
                fontSize: '14px',
                letterSpacing: '0.1em',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: '6px',
              }}
            >
              Phát Lại Một Lần Nữa
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: 'var(--on-dark)',
                padding: '14px 28px',
                fontSize: '14px',
                letterSpacing: '0.1em',
                border: '1px solid var(--on-dark-muted)',
                cursor: 'pointer',
                borderRadius: '6px',
              }}
            >
              Vào Trang Chủ Chính
            </button>
          </div>

          <div style={{
            marginTop: '40px', fontSize: '12px', color: 'var(--on-dark-muted)',
            letterSpacing: '0.1em',
            display: 'flex', gap: '20px',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang Chủ <Icon name="arrow" size={16}/></Link>
            <span>·</span>
            <Link href="/chart" style={{ color: 'inherit', textDecoration: 'none' }}>Lập lá số</Link>
            <span>·</span>
            <Link href="/hop-ban" style={{ color: 'inherit', textDecoration: 'none' }}>Hợp Bàn</Link>
          </div>
        </main>
      )}
    </>
  );
}