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

// API route không hỗ trợ khi build Next.js output: export.
// Phần lập lá số vẫn chạy bằng thuật toán trong trình duyệt.
fs.rmSync('app/api', { recursive: true, force: true });
console.log('Đã chuẩn bị bản export tĩnh Cloudflare Pages (không bao gồm AI APIs).');
