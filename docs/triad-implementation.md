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

## Bản build thử nghiệm

- Đã đưa các thành phần vào nhánh demo. Build Cloudflare chạy kiểm thử hồi quy trước khi xuất trang tĩnh.


# Năm phân hệ chuyên sâu – audit và phương pháp triển khai (24/11/2026)

Trạng thái: **mã nguồn đang nằm trên nhánh QA, chưa phát hành Cloudflare**. Chỉ coi hoàn tất chức năng sau CI, E2E, kiểm tra bản export và cấp quyền triển khai.

## 1. Thời gia Kỳ Môn (Thiên Kỷ)
- Hỗ trợ một phương pháp **Chia bổ / Chuyển bàn**: nhập ngày, giờ UTC+7, tự tính tiết khí và nguyên phù đầu, địa bàn, thiên bàn, Cửu tinh, Bát môn, Bát thần, Trực Phù/Trực Sử/Không vong.
- Engine từ MIT `perfhelf/bigfishmarquis-qimen` @ `6112b3937d7fcaa2ab0a34aec2a52f74e2effe6c`; giấy phép lưu `docs/licenses/qimen-upstream.txt`, mã ghim trong `lib/triad/qimen-upstream`.
- Giới hạn: chưa có đầy đủ Trí nhuận, Phi bàn và mọi trường phái. Trụ ngày có quy ước giờ Tý 23h, tiết khí tính theo thư viện hiện có, sai biệt khi gần biên giờ cần đối chiếu độc lập.

## 2. Huyền Không/GIS (Địa Kỷ)
- Cửu cung 3 lớp Vận/Sơn/Hướng với 24 sơn, kỳ theo Lập Xuân UTC+7 theo **Hạ quái** một trường phái.
- Engine MIT `xudaniel/mingli-fengshui` @ `aa7802d04ab71af84406d7488e2a36b8b212eae1`, LICENSE `docs/licenses/flying-star.txt`.
- GIS: nhập tay tọa độ, OpenStreetMap chỉ tải iframe khi đồng ý, ghi công © OSM contributors/ODbL; sơ đồ nhà chọn từ file cục bộ với lưới 9 cung giả định ảnh đã đặt Bắc ở trên.
- Chưa có bản đồ địa chính, bình đồ xoay theo hướng thực, GIS ranh thửa, kiêm hướng/thế quái, đo đạc kỹ thuật. Không sử dụng như chứng cứ quy hoạch/xây dựng.

## 3. Thư viện y thư (Nhân Kỷ)
- Giữ 16 chuyên đề biên soạn gốc. Bổ sung danh mục link đến các bản Hán cổ trên Wikisource, trình bày theo nguồn và giới hạn quyền.
- Không sao chép bản dịch hiện đại có bản quyền hoặc các hướng dẫn chữa bệnh; thư mục nguồn chỉ tạo link ngoài.

## 4. Catalog 361 huyệt
- Tất cả **361/361 MÃ HUYỆT** match catalog đối chiếu SciCrunch TARA Ontology `curated-data/acupoints/acupoints.csv` theo các trường Code/Label.
- **277 trường hợp** nhãn Hán tự có khác biệt ký tự/dị thể cần hiệu khảo; không tuyên bố là sai.
- **0/361** vị trí giải phẫu được chuyên gia kiểm tra độc lập. Dataset không chứa mô tả chuyên môn trích sách WHO; WHO *Standard Acupuncture Point Locations 2008* có bản quyền.
- Không cung cấp thông tin tự châm kim, kỹ thuật hoặc điều trị.

## 5. 64 quẻ Kinh Dịch
- Có 64/64 dịch ý **Quái từ** tiếng Việt mới biên soạn và 64/64 bình giải bối cảnh, dựa trên Hán văn nguồn `qingshano/yijing-data` MIT.
- 384 hào từ vẫn có nguyên văn Hán; CHƯA có bản dịch Việt đầy đủ 384 hào và bình giải từng hào có hiệu đính chuyên gia Hán Nôm.
- Mọi lời bình được gắn nhãn biên soạn mới, không tự nhận là trích dẫn Nghê Hải Hạ/học giả hiện đại.

## QA và phát hành
- Chạy `npm run typecheck`, `npm test`, kiểm tra từng file regression, `npx tsx scripts/test-triad.ts`, `npm run build` cả Next server và static Cloudflare.
- Mở rộng E2E theo route /thien-ky, /dia-ky, /nhan-ky, /thien-ky/que/1, /thien-ky/que/64, 360px và 1280px; không rò dữ liệu người dùng.
- Không merge/deploy nếu CI hoặc kết quả chuyên ngành chưa đủ căn cứ; Cloudflare auto-deploy tiếp tục tắt.