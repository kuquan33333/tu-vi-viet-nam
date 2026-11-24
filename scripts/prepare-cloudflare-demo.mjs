// Chuẩn bị bản demo Next.js xuất tĩnh cho Cloudflare Pages.
// Chỉ chạy trên nhánh cloudflare-demo, không thay đổi nhánh main.
import fs from 'node:fs';

const file = 'next.config.js';
const original = fs.readFileSync(file, 'utf8');
const marker = "transpilePackages: ['lunar-javascript'],";
if (!original.includes(marker)) {
  throw new Error('Không tìm thấy cấu hình Next.js dự kiến. Cần kiểm tra lại source trước khi build.');
}
fs.writeFileSync(
  file,
  original.replace(marker, marker + "\n  output: 'export',\n  images: { unoptimized: true },"),
);

// Route metadata được export tĩnh theo yêu cầu Next.js 16.
for (const route of ['app/robots.ts', 'app/sitemap.ts']) {
  if (fs.existsSync(route)) {
    const text = fs.readFileSync(route, 'utf8');
    if (!text.includes("export const dynamic = 'force-static'")) {
      fs.writeFileSync(route, "export const dynamic = 'force-static';\n" + text);
    }
  }
}

// Bản mã nguồn mở không bao gồm dữ liệu STAR_DB, vì vậy generateStaticParams()
// của /knowledge/[star]/[topic] trả về [] và Next.js 16 không cho static export.
// Không tạo các trang ảo hoặc giả lập luận đoán mà tác giả không phát hành.
fs.rmSync('app/knowledge/[star]', { recursive: true, force: true });
fs.writeFileSync('app/knowledge/page.tsx', `
import Link from 'next/link';

export const metadata = {
  title: 'Kho Tri Thức · Tử Vi Đẩu Số',
  description: 'Thông tin về nội dung kiến thức chuyên sâu trong bản mã nguồn mở.',
};

export default function KnowledgePage() {
  return (
    <main style={{ minHeight: '78vh', maxWidth: 760, margin: '0 auto', padding: '64px 20px', color: 'var(--tx-0)' }}>
      <Link href="/" style={{ color: 'var(--ac)', fontSize: 14 }}>← Trang chủ</Link>
      <div style={{ padding: '48px 0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 42, marginBottom: 16 }}>📜</div>
        <h1 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700, marginBottom: 18, color: 'var(--tx-0)' }}>Kho Tri Thức Tử Vi</h1>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: 'var(--tx-2)' }}>
          Bản mã nguồn mở hiện không bao gồm cơ sở dữ liệu luận giải 14 chính tinh theo 13 chuyên đề.
          Vì vậy các trang chuyên đề chi tiết tạm chưa có nội dung, thay vì hiển thị thông tin suy đoán không có trong mã nguồn.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--tx-2)', marginTop: 16 }}>
          Bạn vẫn có thể lập lá số Tử Vi, tra cứu cổ thư và trải nghiệm các thuật toán an sao được phát hành công khai.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap', marginTop:32 }}>
          <Link href="/chart" style={{ padding:'12px 22px', borderRadius:10, background:'var(--ac)', color:'var(--bg-page)', fontWeight:600 }}>Lập lá số</Link>
          <Link href="/library" style={{ padding:'12px 22px', borderRadius:10, border:'1px solid var(--ac)', color:'var(--ac)', fontWeight:600 }}>Xem thư viện cổ thư</Link>
        </div>
      </div>
    </main>
  );
}
`);

// API route không hỗ trợ khi build Next.js output: export.
// Phần lập lá số vẫn chạy bằng thuật toán trong trình duyệt.
fs.rmSync('app/api', { recursive: true, force: true });
console.log('Đã chuẩn bị bản export tĩnh Cloudflare Pages (không gồm AI APIs và dữ liệu luận giải riêng).');
