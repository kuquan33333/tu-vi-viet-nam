# Tử Vi Đẩu Số Việt Nam · Thư quán phương Đông

Bản fork của dự án [naot7/tu-vi-viet-nam](https://github.com/naot7/tu-vi-viet-nam), triển khai Next.js + TypeScript trên Cloudflare Pages.

**Trải nghiệm:** https://lichvannien-9sv.pages.dev/  
**Mã đang vận hành:** nhánh [revamp-v2](https://github.com/kuquan33333/tu-vi-viet-nam/tree/revamp-v2) (không phải mặc định \`main\`).  
**Đối chiếu yêu cầu bốn đợt:** [docs/audit-four-phases-2026-11-24.md](docs/audit-four-phases-2026-11-24.md).

Ứng dụng nghiên cứu **văn hóa và thuật số truyền thống**, không phải công cụ chứng minh khả năng dự đoán tương lai. Phân hệ y thư chỉ để học tập, không chẩn đoán hoặc hướng dẫn tự điều trị.

## Tính năng thực tế trên bản Cloudflare tĩnh

| Phân hệ | Đang cung cấp | Giới hạn cần biết |
|---|---|---|
| **Tử Vi /chart** | Lập lá số, 12 cung, an sao, đại hạn/lưu niên, tra cứu sao/cung, giờ sinh không rõ (12 phương án), in A4 | Giờ và kinh độ không chắc chắn có thể cho kết quả khác; thuật số không có giá trị dự báo được xác nhận |
| **Hợp Bàn /hop-ban** | Nhập hai người hoặc chọn hồ sơ; so sánh dữ liệu 12 cung **offline**, không tự đặt điểm hợp nhau | Đối chiếu mang tính cấu trúc, không đánh giá chất lượng quan hệ thực tế |
| **Hồ sơ /ho-so** | Tối đa 30 hồ sơ cục bộ, JSON nhập/xuất, xóa, mã hóa AES-GCM qua PIN Web Crypto tùy chọn | PIN không khôi phục được, bản xuất JSON **không mã hóa**, dữ liệu không tự đồng bộ |
| **Lịch Vạn Niên /lich-van-nien** | Âm dương lịch Việt Nam 1900–2050, Can Chi, mùng 1/rằm, ngày lễ, 24 tiết khí và giờ giao tiết, in lịch | Lịch cố định UTC+7 theo phương pháp nêu trong tài liệu; mốc sát nửa đêm cần thẩm định, không tự tính nghỉ bù |
| **Thiên Kỷ /thien-ky** | 64 quẻ, dịch ý và bình giải quái từ; Kỳ Môn thời gia Chia bổ/Chuyển bàn, Địa bàn thủ công | 384 hào chưa được dịch/hiệu khảo, Kỳ Môn chưa gồm mọi trường phái |
| **Địa Kỷ /dia-ky** | La Kinh/Bát Trạch, Huyền Không Phi Tinh Hạ quái, bản đồ OSM có đồng ý và lưới mặt bằng tải cục bộ | Không phải GIS địa chính, không có Thế quái/kiêm hướng; không nghiệm thu cảm biến mọi máy |
| **Nhân Kỷ /nhan-ky** | 16 chuyên đề, danh mục 4 nguồn cổ thư Hán, 361 mã huyệt đối chiếu TARA, 2D/3D tham khảo | Vị trí lâm sàng thẩm định 0/361; không phải toàn văn y thư được dịch/cấp phép |
| **Thư viện /library** | Ba bộ tư liệu Tử Vi trong số **21 chương đang có**; tìm kiếm và URL slug chương | Không tuyên bố sở hữu toàn văn mọi ấn bản |
| **Kho kiến thức /knowledge** | Giới thiệu **14 chính tinh** | Các trang 182 chuyên đề động có trong mã gốc **không phát hành** trên Pages tĩnh vì thiếu dữ liệu |

**Không có API AI trên bản Pages tĩnh.** Hai route trong \`app/api/\` chỉ dùng khi vận hành Next.js ở chế độ máy chủ tương thích. Không đưa API key vào trình duyệt hoặc tuyên bố AI offline.

### Chính sách lịch và hồ sơ cũ

Lá số mới trong phạm vi 1900–2050 dùng provider âm lịch Việt Nam UTC+7 theo tài liệu phương pháp. Hồ sơ đã lưu với \`calendarVersion=legacy-cn\` tiếp tục giữ phương pháp gốc, **không tự đổi kết quả**. Kinh độ huyện chỉ là điểm tham khảo có nguồn; người dùng nên nhập tọa độ chính xác nếu sinh gần ranh giờ. Các trường hợp lịch sử gần giờ chuyển múi, tiết khí và mốc sóc được đánh dấu theo mức độ chắc chắn.

## Khởi chạy và build

Yêu cầu: **Node.js 22**, npm và môi trường có thể cài phụ thuộc.

\`\`\`bash
git clone https://github.com/kuquan33333/tu-vi-viet-nam.git
cd tu-vi-viet-nam
git checkout revamp-v2
npm ci
npm run typecheck
npm test
npm run dev
\`\`\`

Mở http://localhost:3000 để chạy ứng dụng Next.js chế độ phát triển.

Bản Cloudflare Pages dùng static export, \`out/\`:

\`\`\`bash
npx tsx scripts/test-triad.ts
npx tsx scripts/test-revamp.ts
node scripts/prepare-cloudflare-demo.mjs
NEXT_PUBLIC_SITE_URL=https://lichvannien-9sv.pages.dev npm run build
\`\`\`

**Lưu ý:** \`prepare-cloudflare-demo.mjs\` sửa \`next.config.js\`, metadata export và **loại route API/knowledge động trong bản checkout hiện tại**. Hãy chạy trên checkout/branch build riêng và không commit các thay đổi sinh ra từ bước chuẩn bị. Cloudflare Pages đã có cấu hình build tự động riêng; project hiện đặt tự động triển khai ở chế độ tắt để tránh tiêu hao quota ngoài ý muốn.

QA thực hiện trên GitHub Actions: \`.github/workflows/ci.yml\`, \`.github/workflows/seo.yml\` và script dưới \`scripts/regression/\`. Lighthouse được đo trên môi trường QA mô phỏng nén CDN, **không thay thế đo trực tiếp trên thiết bị thật hoặc hiện trường mạng của người dùng**.

## Phương pháp, nguồn và giấy phép

- [docs/methodology.md](docs/methodology.md): lịch pháp, nguồn đối chiếu thiên văn, múi giờ lịch sử, trường hợp chưa chắc chắn.
- [docs/triad-implementation.md](docs/triad-implementation.md): phạm vi thực của Thiên Kỷ/Địa Kỷ/Nhân Kỷ và nguồn thư viện.
- [docs/licenses/yijing-data.txt](docs/licenses/yijing-data.txt): giấy phép dữ liệu 64 quẻ và ghi chú dị bản.
- [docs/tianji-ziwei/LICENSE.md](docs/tianji-ziwei/LICENSE.md): nội dung nghiên cứu thuộc **CC BY-NC-SA 4.0 riêng**, **không** được coi là MIT và không mặc nhiên thích hợp cho sản phẩm thương mại.

Mã nguồn do [naot7](https://github.com/naot7) phát triển, có đóng góp và thư viện từ cộng đồng, gồm [iztro](https://github.com/SylarLong/iztro), [lunar-javascript](https://github.com/6tail/lunar-javascript) cùng các tác giả được ghi trong tài liệu nguồn. Phần **mã riêng của repository** sử dụng MIT theo [LICENSE](LICENSE); giấy phép của các tệp dữ liệu, thư tịch, hình ảnh và các trang nhúng bên ngoài áp dụng **riêng theo từng nguồn**. Việc GitHub hiển thị một tệp không đồng nghĩa có quyền tái sử dụng thương mại nội dung của tệp đó.
