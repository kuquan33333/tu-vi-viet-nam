'use client';

import Icon,{type IconName} from '@/components/Icon';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import ShareCardCanvas, { captureShareCard, downloadDataURL } from './ShareCardCanvas';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  chart: ZiweiChart | null;
  birth: { year: string; month: string; day: string; hour: string; minute: string; gender: 'male' | 'female'; city?: string };
  highlight?: string;
}

export default function ShareModal({ open, onClose, shareUrl, chart, birth, highlight }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('input');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadImage = async () => {
    setDownloading(true);
    try {
      const dataURL = await captureShareCard();
      if (!dataURL) {
        alert('Tạo ảnh thất bại, quý bạn vui lòng chụp màn hình hoặc tải lại trang để thử lại.');
        return;
      }
      downloadDataURL(dataURL, `La_So_Tu_Vi_${Date.now()}.png`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'var(--overlay)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={e => e.stopPropagation()}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'white',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: 'none',
            }}
          >
            {/* Tiêu đề modal */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--accent-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.08em' }}>
                <Icon name="tools" size={18}/> Chia Sẻ Lá Số Tử Vi
              </div>
              <button
                onClick={onClose}
                aria-label="Đóng cửa sổ chia sẻ"
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                  background: 'var(--line)', color: 'var(--muted)', fontSize: '16px',
                  cursor: 'pointer', lineHeight: 1,
                }}
              >×</button>
            </div>

            {/* Xem trước ảnh lá số */}
            <div style={{ padding: '20px', background: 'var(--paper)', display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
              {chart && (
                <ShareCardCanvas chart={chart} birth={birth} highlight={highlight} />
              )}
            </div>

            <div style={{ padding: '0 20px 12px', textAlign: 'center', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.05em' }}>
              ↑ Thích hợp chia sẻ lên Facebook, Zalo, Telegram, Messenger
            </div>

            {/* Vùng thao tác */}
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={downloadImage} disabled={downloading}
                style={{
                  padding: '14px', borderRadius: '10px', border: 'none',
                  background: 'var(--accent)',
                  color: 'white', fontSize: '14px', fontWeight: 600, letterSpacing: '0.08em',
                  cursor: downloading ? 'not-allowed' : 'pointer',
                  boxShadow: 'none',
                  opacity: downloading ? 0.7 : 1,
                }}
              >
                {downloading ? 'Đang tạo ảnh…' : 'Tải Ảnh Lá Số'}
              </button>

              <button onClick={copyLink}
                style={{
                  padding: '14px', borderRadius: '10px',
                  border: '1px solid var(--accent-border)', background: 'white',
                  color: 'var(--accent)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.06em',
                  cursor: 'pointer',
                }}
              >
                {copied ? '✓ Đã sao chép liên kết lá số' : 'Sao Chép Liên Kết Lá Số'}
              </button>

              <div style={{
                fontSize: '11px', color: 'var(--muted)', lineHeight: 1.7,
                padding: '10px 12px', background: 'var(--accent-soft)',
                borderRadius: '8px', marginTop: '4px',
              }}>
                <div style={{ marginBottom: '4px', fontWeight: 600, color: 'var(--accent)' }}>Hướng dẫn sử dụng:</div>
                · Nhấn Tải Ảnh để lưu ảnh lá số độ nét cao về thiết bị cá nhân<br />
                · Sao chép liên kết để gửi cho bạn bè cùng mở xem và đàm đạo mệnh lý
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}