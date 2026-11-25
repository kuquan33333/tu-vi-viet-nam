'use client';
import { motion } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { detectPatterns } from '@/lib/ziwei/patterns';

const LevelStyle = {
  excellent: { dot: 'bg-accent', label: 'text-accent', badge: 'text-accent bg-[var(--accent-soft)] border-[var(--accent-border)]' },
  good:      { dot: 'bg-quan',   label: 'text-quan',   badge: 'text-quan bg-[var(--quan-bg)] border-[var(--quan-border)]' },
  neutral:   { dot: 'bg-muted', label: 'text-muted', badge: 'text-muted bg-paper border-line' },
  caution:   { dot: 'bg-ji', label: 'text-ji', badge: 'text-ji bg-[var(--ji-bg)] border-[var(--ji-border)]' },
};

export default function PatternsCard({ chart }: { chart: ZiweiChart }) {
  const patterns = detectPatterns(chart);
  if (patterns.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-glass rounded-xl p-4 mb-4"
    >
      <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2 font-semibold" style={{ color: 'var(--t-faint)' }}>
        <span style={{ color: 'var(--t-gold)', opacity: 0.8 }}>◉</span>
        CÁCH CỤC MỆNH BÀN (ĐỐI CHIẾU CỔ THƯ)
        <span className="text-[9px] ml-auto font-normal" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>{patterns.length} cách cục</span>
      </div>
      <div className="space-y-2">
        {patterns.map((p, i) => {
          const st = LevelStyle[p.level];
          return (
            <motion.div
              key={`${p.name}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card-inner rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                <span className={`text-[11px] font-semibold ${st.label}`}>{p.name}</span>
                <div className="flex gap-1 ml-auto">
                  {p.palaces.slice(0, 2).map(pa => (
                    <span key={pa} className={`text-[8px] px-1.5 py-px rounded-full border ${st.badge}`}>
                      {pa}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[10px] leading-relaxed pl-3.5" style={{ color: 'var(--t-text2)' }}>
                {p.description}
              </p>

              {p.conditions && (
                <div className="mt-2 pl-3.5 space-y-0.5">
                  {p.conditions.required.length > 0 && (
                    <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                      <span className="font-semibold" style={{ color: 'var(--t-gold)' }}>Điều kiện cần</span>
                      <span style={{ opacity: 0.6 }}> · </span>
                      {p.conditions.required.join(', ')}
                    </div>
                  )}
                  {p.conditions.bonus && p.conditions.bonus.length > 0 && (
                    <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                      <span className="font-semibold text-lu">Cát hóa hỗ trợ</span>
                      <span style={{ opacity: 0.6 }}> · </span>
                      {p.conditions.bonus.join(', ')}
                    </div>
                  )}
                  {p.conditions.breaking && p.conditions.breaking.length > 0 && (
                    <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                      <span className="font-semibold text-ji">Cảnh báo phá cách</span>
                      <span style={{ opacity: 0.6 }}> · </span>
                      {p.conditions.breaking.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {p.source && (
                <div className="text-[9px] mt-1.5 pl-3.5" style={{ color: 'var(--t-faint)', opacity: 0.5 }}>
                  Xuất xứ · {p.source}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
