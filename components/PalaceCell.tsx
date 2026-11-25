'use client';
import { motion } from 'framer-motion';
import type { Palace, Star } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import clsx from 'clsx';

interface PalaceCellProps {
  palace: Palace;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  isSelected?: boolean;
  isSanFang?: boolean;
  delay?: number;
  /** 叠加四化：星名 → 四化类型（'禄'/'权'/'科'/'忌'） */
  overlayStarSiHua?: Record<string, string>;
  /** 叠加标签：'年'（流年）或 '限'（大限） */
  overlayLabel?: string;
  /** 点击叠加四化 badge 回调 */
  onSiHuaClick?: (starName: string, siHua: string) => void;
}

const SIHUA_STYLES: Record<string, string> = {
  'Lộc': 'text-lu bg-[var(--lu-bg)] border-[var(--lu-border)]',
  'Quyền': 'text-quan bg-[var(--quan-bg)] border-[var(--quan-border)]',
  'Khoa': 'text-ke bg-[var(--ke-bg)] border-[var(--ke-border)]',
  'Kỵ': 'text-ji bg-[var(--ji-bg)] border-[var(--ji-border)]',
  '禄': 'text-lu bg-[var(--lu-bg)] border-[var(--lu-border)]',
  '权': 'text-quan bg-[var(--quan-bg)] border-[var(--quan-border)]',
  '科': 'text-ke bg-[var(--ke-bg)] border-[var(--ke-border)]',
  '忌': 'text-ji bg-[var(--ji-bg)] border-[var(--ji-border)]',
};

const SiHuaBadge = ({
  siHua,
  overlay,
  label,
  onClick,
}: {
  siHua: string;
  overlay?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-1 rounded border font-medium ml-1 chart3-hua',
        SIHUA_STYLES[siHua],
        overlay && 'border-dashed',
        onClick && 'cursor-pointer hover:opacity-100',
      )}
      onClick={onClick}
      {...(onClick?{role:'button',tabIndex:0,onKeyDown:(e:React.KeyboardEvent<HTMLSpanElement>)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();e.currentTarget.click();}}}:{})}
    >
      {overlay && label && <span className="mr-px">{label==='年'?'Năm':label==='限'?'Hạn':label}</span>}
      {({'禄':'Lộc','权':'Quyền','科':'Khoa','忌':'Kỵ'} as Record<string,string>)[siHua]||siHua}
    </span>
  );
};

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick,
}: PalaceCellProps) {
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = `${STEMS[stem]}${BRANCHES[branch]}`;

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');
  const otherStars=stars.filter(s=>!['major','lucky','sha'].includes(s.type));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      tabIndex={0} role="group" aria-label={'Cung '+name} onKeyDown={e=>{if(e.target===e.currentTarget&&(e.key==='Enter'||e.key===' ')){e.preventDefault();onClick?.();}}}
      className="relative flex flex-col p-1.5 cursor-pointer transition-all duration-200 h-full chart3-palace"
      style={{
        minHeight: '90px',
        background: isCurrentDaXian
          ? 'var(--quan-bg)'
          : isSelected
          ? 'var(--quan-border)'
          : isSanFang
          ? 'var(--quan-bg)'
          : isMingGong
          ? 'var(--accent-soft)'
          : 'var(--t-bg)',
        boxShadow: isCurrentDaXian
          ? 'inset 3px 0 0 var(--quan)'
          : isSelected
          ? 'inset 0 0 0 1.5px var(--quan)'
          : isSanFang
          ? 'inset 0 0 0 1px var(--quan)'
          : 'none',
      }}
    >
      {/* 大限年龄 */}
      {daXianAge && (
        <div className={clsx(
          'absolute top-1 right-1 text-[9px] font-mono tabular-nums',
          isCurrentDaXian ? 'text-ink' : ''
        )}
          style={!isCurrentDaXian ? { color: 'var(--t-faint)', opacity: 1 } : undefined}
        >
          {daXianAge[0]}–{daXianAge[1]}
        </div>
      )}

      <span className="chart3-branch">{BRANCHES[branch]}</span>
      {/* 宫名行 */}
      <div className="flex items-center gap-1 mb-0.5 pr-8">
        <span className={clsx('chart3-palace-title font-medium tracking-wide',
          isMingGong || isShenGong ? 'text-accent' : ''
        )}
          style={!isMingGong && !isShenGong ? { color: 'var(--t-faint)' } : undefined}
        >
          {name}
        </span>
        {isMingGong && (
          <span className="text-[7px] text-accent border border-[var(--accent-border)] px-0.5 rounded leading-tight font-bold">MỆNH</span>
        )}
        {isShenGong && (
          <span className="text-[7px] text-quan border border-[var(--quan-border)] px-0.5 rounded leading-tight font-bold">THÂN</span>
        )}
      </div>

      {/* 干支 */}
      <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>{ganzhi}</div>

      {/* 主星 */}
      <div className="flex flex-col gap-0.5 flex-1">
        {majorStars.length === 0 && (
          <span className="text-[10px] italic" style={{ color: 'var(--t-faint)', opacity: 1 }}>Vô chính diệu</span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          return (
            <div
              key={star.name}
              className="flex items-center"
              role="button" tabIndex={0} aria-label={star.name} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();onStarClick?.(star);}}}
              onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
            >
              <span className={clsx(
                'text-[13px] leading-tight font-bold tracking-tight cursor-pointer chart3-major-name',
                star.brightness === 'bright' ? 'text-accent' : star.brightness === 'dim' ? 'text-accent' : 'text-accent',
              )}>
                {star.name}
              </span>
              {star.brightnessRaw && (
                <span className="chart3-brightness">
                  [{star.brightnessRaw}]
                </span>
              )}
              {star.siHua && <SiHuaBadge siHua={star.siHua} />}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  overlay
                  label={overlayLabel}
                  onClick={e => {
                    e.stopPropagation();
                    onSiHuaClick?.(star.name, overlaySiHua);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 吉星 */}
      {luckyStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1 mt-0.5">
          {luckyStars.map(s => {
            const overlaySiHua = overlayStarSiHua?.[s.name];
            return (
              <span key={s.name} className="inline-flex items-center text-[9px] chart3-minor-name leading-tight"><button type="button" onClick={e=>{e.stopPropagation();onStarClick?.(s);}}>{s.name}{s.brightnessRaw?' · '+s.brightnessRaw:''}</button>
                {s.siHua && <SiHuaBadge siHua={s.siHua} />}
                {overlaySiHua && (
                  <SiHuaBadge
                    siHua={overlaySiHua}
                    overlay
                    label={overlayLabel}
                    onClick={e => {
                      e.stopPropagation();
                      onSiHuaClick?.(s.name, overlaySiHua);
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* 煞星 */}
      {shaStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1">
          {shaStars.map(s => (
            <span key={s.name} className="text-[9px] chart3-minor-name leading-tight"><button type="button" onClick={e=>{e.stopPropagation();onStarClick?.(s);}}>{s.name}{s.brightnessRaw?' · '+s.brightnessRaw:''}</button>{s.siHua && <SiHuaBadge siHua={s.siHua} />}
            </span>
          ))}
        </div>
      )}

      {otherStars.length>0&&<div className="chart3-other-stars">{otherStars.map((s,i)=><span key={s.name+i}><button type="button" onClick={e=>{e.stopPropagation();onStarClick?.(s);}}>{s.name}{s.brightnessRaw?' · '+s.brightnessRaw:''}</button>{s.siHua&&<SiHuaBadge siHua={s.siHua}/>}</span>)}</div>}
    </motion.div>
  );
}
