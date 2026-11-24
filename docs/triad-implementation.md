# Ba phân hệ Thiên Kỷ · Địa Kỷ · Nhân Kỷ — bản Cloudflare demo

## Các đường dẫn

- \`/thien-ky\`: Chu Dịch gieo 3 đồng xu, 64 quẻ theo Văn Vương, quẻ chủ/quẻ biến, hào động, tra cứu quẻ, lịch sử lưu tại máy; địa bàn Kỳ Môn 24 tiết khí × 3 nguyên và hiển thị Tam Kỳ Lục Nghi.
- \`/dia-ky\`: La Kinh 24 sơn theo góc 0–360°, hỗ trợ quyền DeviceOrientation trên trình duyệt (khi có), Bát Trạch theo cung phi & năm trước/sau Lập Xuân do người dùng chọn, phiếu kiểm tra hình thế.
- \`/nhan-ky\`: 16 chủ đề mở đầu cho bốn nhánh Nội Kinh, Thương Hàn, Kim Quỹ, Châm Cứu; tìm kiếm; catalog 14 kinh/361 huyệt (tên Hán và mã chuẩn); 21 điểm minh họa 2D; truy cập bản đồ 3D của dự án nguồn mở thông qua iframe chỉ tải khi chọn.

## Dữ liệu và giấy phép

- \`lib/triad/iching.ts\`: lập bản từ bảng Văn Vương và quy tắc gieo ba đồng xu; tham khảo MIT \`Ann1949/iching-kit\`, nội dung mô tả ngắn do dự án biên soạn.
- \`lib/triad/qimen.ts\`: chỉ **địa bàn** và bản vị của sao/cửa, dựa trên bảng dữ liệu và quy tắc Tam Kỳ Lục Nghi của \`qilaidev/metaphysics-engine\` (MIT). **Không** khẳng định là thời gia bàn đầy đủ; cần tính phù đầu, giao tiết đến phút, thiên bàn, trực phù/trực sử, chuyển bát môn/bát thần theo giờ, trường phái rõ ràng.
- \`lib/triad/fengshui.ts\`: 24 sơn và cung phi Bát Trạch, đối chiếu với \`aec-platform/phong-thuy-corpus\` (code MIT, corpus CC BY 4.0). Không dùng kết quả cho thiết kế, thẩm định xây dựng.
- \`lib/triad/acupoint-catalog.json\`: chuyển đổi 361 tên/14 kinh mạch từ \`aicuc/3d-acupoint-atlas\`, MIT, bản gốc https://github.com/aicuc/3d-acupoint-atlas. Cột tên gốc tiếng Trung, mã quốc tế, không xác nhận vị trí giải phẫu cho toàn bộ 361 điểm.
- \`lib/triad/renji.ts\`: nội dung tổng thuật biên soạn riêng. Không trích hoặc tái bản dữ liệu \`docs/tianji-ziwei\` (CC BY-NC-SA) hoặc \`nihai-renji-corpus\` vì ràng buộc phi thương mại.
- Công cụ Kỳ Môn đầy đủ của \`idavailable/qimen\` được dẫn link/iframe ngoài, không nhập mã nguồn do giấy phép chưa được xác minh. Bản đồ huyệt đạo 3D của \`aicuc\` là iframe ngoài, tải khi người dùng cho phép.

Giữ nguyên LICENSE MIT và ghi nguồn ở UI; các điều khoản dữ liệu bên ngoài phải kiểm tra riêng khi sử dụng thương mại.

## Kiểm thử và phát hành

- Kiểm thử nghiệp vụ bằng \`npx tsx scripts/test-triad.ts\`.
- Build Cloudflare Pages riêng nhánh \`cloudflare-demo\`: \`node scripts/prepare-cloudflare-demo.mjs && NEXT_PUBLIC_SITE_URL=https://lichvannien-9sv.pages.dev npm run build\`.
- Mục tiêu: xuất tĩnh, không đòi hỏi AI API, không sử dụng khóa API tại trình duyệt.
- Nhánh \`main\` của người dùng không thay đổi, tự động build đã tắt sau khi deploy.

## Việc cần phát triển tiếp để đạt mức chuyên sâu

1. Thuật toán thời gia Kỳ Môn hoàn chỉnh và bộ kiểm thử đối chiếu nhiều trường phái/tiết khí, thay iframe ngoài bằng engine kiểm chứng.
2. Dữ liệu 64 quẻ gồm hào từ & bản dịch có quyền sử dụng hợp lệ và chú giải chuyên sâu được kiểm duyệt.
3. Huyền Không Phi Tinh, mô-đun sơ đồ nhà, dữ liệu GIS thực tế (cần dữ liệu bản đồ và quy chuẩn kỹ thuật).
4. Kiểm duyệt y thư tiếng Việt có dẫn bản gốc/ấn bản, kiểm tra thuật ngữ, bản đồ vị trí huyệt được chuyên gia xác nhận, không cung cấp tự chẩn đoán/điều trị.
5. Trình duyệt mobile: thử cảm biến với iOS Safari thực, người dùng có thể dùng nhập độ bằng tay nếu từ chối quyền.
