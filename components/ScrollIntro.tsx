'use client';
import Icon from '@/components/Icon';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollIntroProps {
  onComplete: () => void;
  /** Nhãn nút bỏ qua */
  skipLabel?: string;
}

const BEIDOU = ['Thiên Xu', 'Thiên Toàn', 'Thiên Cơ', 'Thiên Quyền', 'Ngọc Hoành', 'Khai Dương', 'Dao Quang'];

export default function ScrollIntro({ onComplete, skipLabel = 'Bỏ qua' }: ScrollIntroProps) {
  const [visible, setVisible] = useState(true);
  const [unrolled, setUnrolled] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setUnrolled(true), 1900);
    const t2 = setTimeout(() => setVisible(false), 3500);
    const t3 = setTimeout(onComplete, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const handleSkip = () => {
    setVisible(false);
    setTimeout(onComplete, 700);
  };

  const easeUnroll = [0.32, 0.72, 0.36, 1.0] as const;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Tinh tú nền trời xa */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'none',
          }} />

          {/* Trục cuộn thư họa */}
          <div style={{
            position: 'relative',
            width: 'min(90vw, 1080px)',
            height: 'min(60vh, 480px)',
          }}>
            {/* Mặt giấy cuộn thư */}
            <motion.div
              initial={{ width: 0, opacity: 0.92 }}
              animate={{ width: 'calc(100% - 32px)', opacity: 1 }}
              transition={{ duration: 1.9, ease: easeUnroll }}
              style={{
                position: 'absolute',
                top: '8%', bottom: '8%',
                right: '16px',
                background: 'var(--paper)',
                boxShadow: 'none',
                overflow: 'hidden',
              }}
            >
              {/* Bóng nếp gấp mép cuộn */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '8px',
                background: 'var(--line)',
              }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '8px',
                background: 'var(--line)',
              }} />

              {/* Vân giấy cổ */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'transparent',
                opacity: 0.7,
              }} />

              {/* Nội dung cuộn thư */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={unrolled ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '0 clamp(40px, 8vw, 120px)',
                  fontFamily: '"Noto Serif", "Songti SC", serif',
                }}
              >
                {/* Bắc Đẩu Thất Tinh */}
                <div style={{
                  fontSize: 'clamp(10px, 1.1vw, 12px)',
                  color: 'var(--accent)',
                  letterSpacing: '0.35em',
                  marginBottom: 'clamp(20px, 3vh, 36px)',
                  whiteSpace: 'nowrap',
                  opacity: 0.9,
                }}>
                  {BEIDOU.join(' · ')}
                </div>

                {/* Đường chỉ vàng kim */}
                <div style={{
                  width: '60px', height: '1px',
                  background: 'var(--line)',
                  marginBottom: 'clamp(16px, 2.5vh, 28px)',
                }} />

                {/* Tiêu đề đại tự TỬ VI ĐẨU SỐ */}
                <h1 style={{
                  fontSize: 'clamp(42px, 7vw, 96px)',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  letterSpacing: 'clamp(0.12em, 0.2vw, 0.25em)',
                  lineHeight: 1.1,
                  margin: 0,
                  textShadow: 'none',
                  whiteSpace: 'nowrap',
                }}>
                  TỬ VI ĐẨU SỐ
                </h1>

                {/* Khẩu quyết tiền nhân */}
                <div style={{
                  fontSize: 'clamp(13px, 1.5vw, 18px)',
                  color: 'var(--muted)',
                  letterSpacing: '0.3em',
                  marginTop: 'clamp(16px, 2.5vh, 24px)',
                  marginBottom: '6px',
                  whiteSpace: 'nowrap',
                }}>
                  Quan Thiên Chi Tượng · Sát Nhân Chi Mệnh
                </div>
                <div style={{
                  fontSize: 'clamp(11px, 1.2vw, 14px)',
                  color: 'var(--muted)',
                  letterSpacing: '0.2em',
                  whiteSpace: 'nowrap',
                  opacity: 0.9,
                }}>
                  Nghê Hải Hạ《Thiên Kỷ》Chính Tông
                </div>

                {/* Con dấu chu sa đỏ */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                  animate={unrolled ? { opacity: 1, scale: 1, rotate: -4 } : {}}
                  transition={{ delay: 0.4, duration: 0.5, ease: 'backOut' }}
                  style={{
                    marginTop: 'clamp(18px, 2.8vh, 30px)',
                    width: 'clamp(50px, 6vw, 64px)',
                    height: 'clamp(50px, 6vw, 64px)',
                    background: 'var(--accent)',
                    color: 'var(--white)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: 0,
                    boxShadow: 'none',
                    fontSize: 'clamp(10px, 1.1vw, 12px)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '2px' }}><span>TỬ</span><span>VI</span></div>
                  <div style={{ display: 'flex', gap: '2px' }}><span>ĐẨU</span><span>SỐ</span></div>
                </motion.div>

                {/* Bát Quái */}
                <div style={{
                  marginTop: 'clamp(18px, 2.8vh, 30px)',
                  fontSize: 'clamp(13px, 1.4vw, 16px)',
                  color: 'var(--accent)',
                  letterSpacing: '0.6em',
                  opacity: 0.75,
                  whiteSpace: 'nowrap',
                }}>
                  <span aria-label="Bát quái" role="img" style={{display:'inline-flex',gap:8}}>{['111','110','101','100','011','010','001','000'].map(bits=><svg aria-hidden="true" key={bits} width="22" height="20" viewBox="0 0 22 20" fill="none" stroke="currentColor" strokeWidth="1.6">{bits.split('').map((b,i)=>b==='1'?<path key={i} d={'M1 '+(4+i*6)+'h20'}/>:<path key={i} d={'M1 '+(4+i*6)+'h8m4 0h8'}/>)}</svg>)}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Trục cuộn phải cố định */}
            <div
              style={{
                position: 'absolute', top: 0, bottom: 0, right: 0,
                width: '32px',
                background: 'var(--ink)',
                borderRadius: '4px',
                boxShadow: 'none',
                zIndex: 2,
              }}
            >
              <div style={{
                position: 'absolute', top: '-14px', left: '-6px', right: '-6px',
                height: '20px',
                background: 'var(--accent)',
                borderRadius: '50%',
                boxShadow: 'none',
              }} />
              <div style={{
                position: 'absolute', bottom: '-14px', left: '-6px', right: '-6px',
                height: '20px',
                background: 'var(--accent)',
                borderRadius: '50%',
                boxShadow: 'none',
              }} />
            </div>

            {/* Trục cuộn trái mở rộng */}
            <motion.div
              initial={{ right: '0px' }}
              animate={{ right: 'calc(100% - 32px)' }}
              transition={{ duration: 1.9, ease: easeUnroll }}
              style={{
                position: 'absolute', top: 0, bottom: 0,
                width: '32px',
                background: 'var(--ink)',
                borderRadius: '4px',
                boxShadow: 'none',
                zIndex: 3,
              }}
            >
              <div style={{
                position: 'absolute', top: '-14px', left: '-6px', right: '-6px',
                height: '20px',
                background: 'var(--accent)',
                borderRadius: '50%',
                boxShadow: 'none',
              }} />
              <div style={{
                position: 'absolute', bottom: '-14px', left: '-6px', right: '-6px',
                height: '20px',
                background: 'var(--accent)',
                borderRadius: '50%',
                boxShadow: 'none',
              }} />
            </motion.div>
          </div>

          {/* Nút bấm bỏ qua */}
          <button
            onClick={handleSkip}
            style={{
              position: 'absolute', bottom: '32px', right: '32px',
              padding: '8px 18px',
              background: 'transparent',
              color: 'var(--on-dark-muted)',
              border: '1px solid var(--on-dark-muted)',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              letterSpacing: '0.15em',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--on-dark-muted)';
              e.currentTarget.style.color = 'var(--on-dark-muted)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--on-dark-muted)';
              e.currentTarget.style.color = 'var(--on-dark-muted)';
            }}
          >
            {skipLabel} <Icon name="arrow" size={16}/>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}