import Breadcrumb from '@/components/Breadcrumb';
import { pageMetadata } from '@/lib/seo/metadata';
/**
 * /knowledge/[star]/[topic] — Trang chi tiết luận giải chuyên đề
 * 14 Chính Tinh × 13 Cung Vị / Chuyên đề
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import {
  ALL_STARS,
  ALL_TOPICS,
  getKnowledge,
  getAllKnowledgeRoutes,
  STAR_BRIEF_SEO,
  STAR_TO_SLUG,
  SLUG_TO_STAR,
} from '@/lib/seo/knowledge';
import { SITE_URL } from '@/lib/site';

export const dynamicParams = false;

export async function generateStaticParams() {
  const routes = getAllKnowledgeRoutes();
  return routes.map(r => ({ star: r.slug, topic: r.topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) return {};
  const data = getKnowledge(star, topic as TopicKey);
  if (!data.exists) return {};

  const title = `Sao ${star} tọa thủ ${data.palaceName} · ${data.topicLabel} · Luận Giải Nghê Hải Hạ`;
  const description = data.parsed.dingdiao
    || `Luận giải sao ${star} tọa thủ ${data.palaceName} trong Tử Vi Đẩu Số — Dựa trên hệ thống《Thiên Kỷ》Thầy Nghê Hải Hạ và cổ thư《Tử Vi Đẩu Số Toàn Tập》,《Cốt Tủy Phú》.`;

  return pageMetadata({title,description,path:`/knowledge/${slug}/${topic}`,type:'article'});
}

export default async function KnowledgePage({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) notFound();
  const data = getKnowledge(star, topic as TopicKey);
  if (!data.exists) notFound();

  const otherTopicsForStar = ALL_TOPICS.filter(t => t !== topic && getKnowledge(star, t).exists);
  const otherStarsForTopic = ALL_STARS.filter(s => s !== star && getKnowledge(s, topic as TopicKey).exists);


  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      <Breadcrumb items={[{label:'Kho kiến thức',href:'/knowledge'},{label:`${star} · ${data.topicLabel}`,href:`/knowledge/${slug}/${topic}`}]} />

      <article className="max-w-3xl mx-auto px-6 py-12">

        {/* Tiêu đề trang */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.15em', marginBottom: '8px', fontWeight: 600 }}>
            {data.topicLabel} · LUẬN GIẢI NGHÊ HẢI HẠ CHÍNH TÔNG
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.04em', lineHeight: 1.2 }}>
            Sao {star} tại {data.palaceName}
          </h1>
          {STAR_BRIEF_SEO[star] && (
            <p style={{ fontSize: '13px', color: 'var(--tx-2)', marginTop: '14px', lineHeight: 1.8 }}>
              {STAR_BRIEF_SEO[star]}
            </p>
          )}
        </div>

        {/* 4 phần luận giải cốt lõi */}
        {data.parsed.dingdiao && (
          <Section title="Định Tính Cốt Lõi" gradient>
            <p style={{ fontSize: '17px', color: 'var(--tx-0)', lineHeight: 1.9, fontWeight: 500, letterSpacing: '0.02em' }}>
              {data.parsed.dingdiao}
            </p>
          </Section>
        )}

        {data.parsed.lundian && (
          <Section title="Luận Đoán Trọng Tâm">
            <div style={{ fontSize: '15px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.01em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.lundian}
            </div>
          </Section>
        )}

        {data.parsed.yiju && (
          <Section title="Căn Cứ Tinh Bàn">
            <div style={{ fontSize: '14px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.01em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.yiju}
            </div>
          </Section>
        )}

        {data.parsed.chuchu && (
          <Section title="Xuất Xứ Cổ Thư" minimal>
            <div style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 2, letterSpacing: '0.01em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.chuchu}
            </div>
          </Section>
        )}

        {/* CTA kêu gọi an sao */}
        <div style={{
          margin: '40px 0 30px',
          padding: '24px',
          background: 'var(--accent-soft)',
          borderRadius: '14px',
          border: '1px solid var(--line)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '15px', color: 'var(--tx-0)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '6px' }}>
            Xem luận đoán cung {data.palaceName} trong chính lá số của bạn?
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx-2)', marginBottom: '16px' }}>
            Nhập ngày giờ sinh an sao chuẩn xác · Đối chiếu Nghê Hải Hạ chính tông · AI đồng hành đàm đạo
          </div>
          <Link href="/chart" style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textDecoration: 'none',
            boxShadow: 'none',
          }}>
            Lập lá số ngay →
          </Link>
        </div>

        {/* Liên kết nội bộ: Cùng sao ở các cung khác */}
        <Section title={`Các cung vị khác của sao ${star}`} minimal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherTopicsForStar.map(t => {
              const d = getKnowledge(star, t);
              return (
                <Link
                  key={t}
                  href={`/knowledge/${slug}/${t}`}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--line)',
                    borderRadius: '999px',
                    color: 'var(--tx-2)',
                    textDecoration: 'none',
                  }}
                >
                  {star} tại {d.palaceName}
                </Link>
              );
            })}
          </div>
        </Section>

        {/* Liên kết nội bộ: Các sao khác tại cùng cung */}
        <Section title={`Các chính tinh khác tọa thủ tại ${data.palaceName}`} minimal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherStarsForTopic.slice(0, 13).map(s => (
              <Link
                key={s}
                href={`/knowledge/${STAR_TO_SLUG[s]}/${topic}`}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--line)',
                  borderRadius: '999px',
                  color: 'var(--tx-2)',
                  textDecoration: 'none',
                }}
              >
                {s} tại {data.palaceName}
              </Link>
            ))}
          </div>
        </Section>

        {/* Link Thư viện Cổ thư */}
        <div style={{
          marginTop: '40px',
          padding: '16px 20px',
          background: 'var(--accent-soft)',
          border: '1px dashed var(--line)',
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--ac-dim)', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: 600 }}>
            MUỐN NGHIÊN CỨU SÂU NGUYÊN ĐIỂN?
          </div>
          <Link href="/library" style={{ fontSize: '13px', color: 'var(--ac)', fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none' }}>
            📜 Tra Cứu Thư Viện Cổ Thư — Toàn Tập / Toàn Thư / Cốt Tủy Phú →
          </Link>
        </div>
      </article>

      {/* Footer */}
      <p role="note" style={{ borderTop: '1px solid var(--line)', padding: '20px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.05em' }}>
        <div style={{ marginBottom: '6px' }}>Tử Vi Đẩu Số · Dựa trên hệ thống Nghê Hải Hạ Chính Tông · Phục vụ nghiên cứu học tập</div>
        <div style={{ opacity: 0.85 }}>Nền tảng không cấu thành bất kỳ lời khuyên y tế, đầu tư tài chính hay pháp lý nào</div>
      </p>
    </div>
  );
}

function Section({ title, children, gradient, minimal }: { title: string; children: React.ReactNode; gradient?: boolean; minimal?: boolean }) {
  return (
    <section style={{ marginBottom: minimal ? '24px' : '32px' }}>
      <h2 style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: 'var(--ac)',
        fontWeight: 600,
        letterSpacing: '0.1em',
        marginBottom: '12px',
      }}>
        <span style={{ width: '4px', height: '14px', background: 'var(--ac)', borderRadius: '2px' }} />
        {title}
      </h2>
      <div style={{
        background: gradient
          ? 'var(--accent-soft)'
          : 'var(--bg-card)',
        border: '1px solid var(--line)',
        borderRadius: '10px',
        padding: minimal ? '14px 18px' : '20px 22px',
      }}>
        {children}
      </div>
    </section>
  );
}