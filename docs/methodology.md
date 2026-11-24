# Phương pháp, kiểm chứng và điều kiện nghiệm thu đợt 1–3

## Nguồn và quy ước

- An sao: iztro từ lockfile. Golden tests dùng tiến trình độc lập, đối chiếu Mệnh, Thân, Cục, vị trí 14 chính tinh với cùng quy ước. Không xem giờ sinh danh nhân giả định là dữ liệu lịch sử xác thực.
- E5: identity.ts giữ StarId theo bảng school-data, PalaceId, SiHuaId, BrightnessId; trường ID bổ sung để tương thích dữ liệu cũ. patterns.ts dùng ID khi nhận dạng sao/cung/Tứ Hóa và vẫn hỗ trợ tên legacy. Chưa loại hết so sánh tên hoặc xác minh riêng toàn bộ 38 cách cục, chưa dịch hết lời bình Hán.
- C1–C8: validate ngày Gregorian 1900 đến hôm nay (tối đa 2050), giờ/phút/giây, kinh độ và offset. Không mặc định Hà Nội/08:00; UTC+7 chỉ áp dụng khi có địa điểm Việt Nam xác định. Không rõ giờ: 12 giả định đánh dấu assumedHour, không lưu như hồ sơ xác định; Hợp bàn yêu cầu giờ rõ. Địa danh cũ tìm không dấu, danh mục hiện hữu chưa đủ mọi huyện/xã; nhập tọa độ thủ công không thay cho xác minh tọa độ lịch sử.
- Chân Thái Dương Thời: phút hiệu chỉnh = 4 × kinh độ Đông − offset UTC tính theo phút + phương trình thời gian; ngày thực tế và thời điểm sinh được dùng, có thể tắt. Nguồn công thức NOAA General Solar Position Calculations https://gml.noaa.gov/grad/solcalc/solareqns.PDF . Đây là công thức xấp xỉ. Quy ước Tý muộn mặc định 23h–23h59 thuộc ngày kế tiếp, có lựa chọn ngày hiện tại; Tý sớm 00h–00h59 thuộc ngày hiện tại. Không khẳng định một trường phái là duy nhất.
- E7: IANA tzdb 2025b https://github.com/eggert/tz/blob/2025b/asia và https://github.com/eggert/tz/blob/2025b/backzone (Asia/Ho_Chi_Minh, Asia/Hanoi). Dùng offset chính xác kể cả giây trước 1911; phân biệt giờ lặp/giờ bị bỏ qua khi chuyển offset. IANA ghi thời điểm chuyển miền Bắc tháng 10/1954 không rõ ngày, không đoán. Tzdb là lịch sử vùng đại diện, không bảo đảm mọi địa phương; địa danh gần vĩ tuyến 17 và trường hợp trước 1970 cần đối chiếu hồ sơ gốc. Không đồng nhất địa giới hiện nay với địa giới quá khứ.
- C10–C12: tọa = hướng + 180° modulo 360. 24 sơn mỗi sơn 15°, ranh Quý/Tý 7,5°, Nhâm/Tý 352,5°. Cung phi sử dụng năm nhập 1900–2099 và công thức hiện có được kiểm tra với công thức tổng chữ số tương đương; trung cung 5 nam quy Khôn 2, nữ quy Cấn 8. Phạm vi ngoài này bị từ chối; chưa áp dụng tự động mốc Lập Xuân thay năm âm lịch. Tham khảo truyền thống, không phải dự báo khoa học.

## E6 — điều kiện chặn phát hành

Bộ chuyển đổi lunar-solar.ts hiện chỉ là alias lunar-javascript, chưa phải bộ lịch Việt Nam UTC+7 đã xác minh. Audit độc lập theo ngày từ 01/01/1900 đến 31/12/2050 ở run 45373629949: 55.152 ngày, 1.944 ngày khác nhau, 0 lỗi chuyển đổi ngược trong phạm vi có kiểm tra, 0 sai trong 4 mốc Tết của bộ tham chiếu. Chạy được audit không có nghĩa là thuật toán đã đạt. Kết quả log: https://github.com/kuquan33333/tu-vi-viet-nam/actions/runs/45373629949 .

| Mốc | Ngày Tết theo legacy | Ngày Tết theo tham chiếu UTC+7 |
|---|---|---|
| 1968 (miền Bắc) | 30/01/1968 | 29/01/1968 |
| 1985 | 21/01 vẫn là 1/12/1984 (chưa chốt ngày Tết legacy) | 21/01/1985 |
| 2007 | 18/02/2007 | 17/02/2007 |
| 2030 | 03/02/2030 | 02/02/2030 |

Nguồn audit: LichTa 2.2.1 commit 6f656383f9eb525373ea6a7ef327fdd3fdc3ac54, blob baff4984d0603db3d2b7ce97eec8c38ad92907f3. Upstream công bố MIT và ghi dựa trên thuật toán Hồ Ngọc Đức/Meeus; chưa xác minh được quyền tái phân phối mã nguồn gốc. Không giữ bản sao bundle trong cây tích hợp, không dùng ở runtime. CI đọc bản tham chiếu ghim hash trong thư mục tạm, không gửi dữ liệu sinh. Bản sao trước đã tồn tại trong lịch sử QA; không rewrite lịch sử. Kết quả chỉ là đối chiếu, không coi mọi sai khác là lỗi legacy. Cần nguồn lịch độc lập có giấy phép phù hợp và kiểm tra năm 1968 theo vùng, tháng nhuận, Can Chi, luồng an sao iztro, nhập/xuất hồ sơ. Chưa thay engine chỉ để làm xanh test.

## Bằng chứng test-first và tích hợp

- 45372991872: test C1,C2,C3,C10,C11 đỏ trước vá. C12 đã pass.
- 45373303297: test offset lịch sử trước 1911 đỏ trước vá.
- 45373395369: hồi quy 21 file, từng file, strict và Triad pass; typecheck còn lỗi optional index. Sửa 9ade549; run 45373722641 typecheck, hồi quy, strict, audit lịch, build thường đã pass tại lúc kiểm tra.
- 45373890445: ID ổn định, typecheck/npm test đã pass lúc kiểm tra.
- 71291aa: merge hai nhánh bằng commit hai parent. PR #4: https://github.com/kuquan33333/tu-vi-viet-nam/pull/4 . 23 tệp regression; typecheck/npm test và static SEO export pass tại thời điểm ghi nhận. Xem run 45374002137 và 45374002173 cho kết luận cuối.
- SEO riêng run 45371855256 thành công; 6 trang đạt 100/100 ở run 45371394331, 39 route và 22 redirect mô phỏng. Không xác nhận HTTP edge hoặc UI tương tác chỉ bằng static HTML.

## Trạng thái phát hành

Chưa nghiệm thu: sai khác lịch Việt Nam, phạm vi xác minh E5 và danh mục địa danh cũ, browser form 360/1280 và preview/HTTP edge. Không merge main/revamp-v2 hoặc bật auto deploy. Các dữ liệu nguồn thiếu không được bịa. Không thay đổi production.

## Đợt 2.1 — lịch UTC+7 ứng viên độc lập (chưa chuyển runtime)

- Đã tạo bảng 1.880 tháng âm (1899–2050) từ kết quả tính thiên văn tại máy QA bằng Swiss Ephemeris 2.10.03, cờ Moshier. Không sao chép mã thư viện, không thêm phụ thuộc sản phẩm, chỉ lưu kết quả số và script tái lập. Nguồn phương pháp: https://www.astro.com/swisseph/swephinfo_e.htm ; quy tắc ngày sóc, tháng 11 chứa đông chí, tháng nhuận đầu tiên không trung khí trong chu kỳ 13 tháng, quy chiếu ngày dân sự UTC+7. Tham khảo https://phamhungtien.com/guides/am-lich-viet-nam-cach-tinh-can-chi-tiet-khi/ và https://nhatnguyet.org/en/blog/co-so-khoa-hoc-am-lich-tiet-khi . UTC+7 hồi chiếu trước 1968 là quy ước tính toán, không khẳng định lịch hành chính thực tế từng vùng.
- Kết quả máy QA: bốn Tết 1968, 1985, 2007, 2030 đúng các mốc đã chọn; tháng nhuận 2/1985 bắt đầu 21/03, nhuận 6/2025 ngày 25/07, nhuận 11/2033 ngày 22/12; 24/11/2026 = 16/10. Bảng có 152 mã năm và 1880 tháng. Sóc 1944-06-20 và 1967-07-08 rất sát nửa đêm (dưới 1 phút theo mô hình này), phải thẩm định thêm.
- `vn-calendar-candidate.ts` chỉ là ứng viên, chưa thay legacy hoặc iztro. Kiểm thử toàn bộ 55.152 ngày, kiểm tra từng biên tháng và ngày không hợp lệ. Đối chiếu độc lập thứ hai dùng Astronomy Engine 2.1.19 (MIT, https://github.com/cosinekitty/astronomy/blob/master/LICENSE), chỉ cài ở thư mục tạm CI. Audit ghi sai khác với Moshier, LichTa, legacy và các probe iztro. Không coi các mô hình xấp xỉ là chân lý; chờ kết quả CI để phân xử các biên.
- Lockfile thực tế: iztro 2.6.1, lunar-lite 0.2.8, lunar-javascript 1.7.7. Tài liệu iztro https://docs.iztro.com/en_US/quick-start cho biết byLunar dùng lịch âm Trung Quốc; https://docs.iztro.com/en_US/posts/astrolabe cho biết byLunar đổi ngược sang ngày dương rồi gọi bySolar, bỏ cờ nhuận nếu tháng không tồn tại. Không dùng ngày dương giả thay ngày sinh để ép kết quả. Cần adapter lịch ngay tại dependency boundary, đối chiếu toàn bộ an sao và ngày/tháng nhuận không biểu diễn được trong lịch Trung Quốc.
- Trạng thái phát hành vẫn BLOCKED; CI xanh chỉ chứng minh các test đã chạy, không đủ nghiệm thu lịch pháp. Không merge/deploy production.

## C5 — địa danh lịch sử

Chỉ mục 696 huyện/quận/thị xã trước 01/07/2025 (63 tỉnh cũ) lấy từ dữ liệu GSO qua vn-local-divisions, ghim commit 242c54055b852595e19d57c148376819a4e4d319, MIT và NOTICE tại docs/licenses/vn-local-divisions.txt. Ánh xạ sang 34 tỉnh theo NQ 202/2025/QH15, nguồn https://baochinhphu.vn/nghi-quyet-cua-quoc-hoi-ve-sap-xep-don-vi-hanh-chinh-cap-tinh-102250612191145158.htm . Địa danh hiện có giữ kinh độ gốc; mục mới chỉ có mã/tên, bắt buộc người dùng nhập kinh độ, không lấy tâm tỉnh thay thế. Chưa có tọa độ nguồn đủ cho 696 huyện; cần dữ liệu tọa độ đã xác minh nếu muốn tự điền. Địa danh Quảng Trị chưa xác định phía sông Bến Hải phải chọn vùng lịch sử rõ khi sinh 1900–1975; không mặc định miền Bắc. Chưa dùng dữ liệu hiện đại để khẳng định địa giới trước 2025.

## L2/E5 — detector audit

Run 45375709927 tại 34b95ad: 46 fixture Hán/Việt (mỗi fixture có kiểm tra âm/dương) và 2 test bổ sung pass, 46 fixture canonical ID fail. Đây là lỗi thật: Star.id/siHuaId đã có nhưng helper vẫn dùng label. Patch dùng ID ở findStar/hasStar/sanFang/so khớp chính tinh, Tứ Hóa và nhóm độ sáng; fallback tên chỉ cho dữ liệu cũ. Không đổi điều kiện cách cục. Có 41 hàm, 46 biến thể đầu ra; mỗi biến thể có fixture dương/âm ở VI/CN/ID, không đồng nghĩa kiểm chứng học thuật 46 cách. Mô tả mới là tóm tắt điều kiện code bằng tiếng Việt, không khẳng định nguồn cổ thư chưa kiểm chứng; lời bình cũ giữ trong source. Điều kiện phụ còn thiếu bản dịch chính xác được đánh dấu cần đối chiếu, không tự bịa lời giải. Cần hoàn tất kiểm chứng nguồn từng cách cục trước khi tuyên bố đầy đủ.

## Đợt 2.1 — adapter cô lập và kiểm thử trình duyệt

- CI commit 00bffcf hoàn tất xanh: https://github.com/kuquan33333/tu-vi-viet-nam/actions/runs/45376264372 ; SEO https://github.com/kuquan33333/tu-vi-viet-nam/actions/runs/45376264504. Các test 94 fixture nhận diện đạt trên mã đã vá. Không chạy lại commit đỏ cũ.
- Kiểm chứng thiên văn: Swiss Ephemeris Moshier 2.10.03 tại máy QA cho thu phân 23/09/1938 khoảng 16:59:28 UT (23:59:28 UTC+7); nguồn https://janmr.com/posts/equinoxes-and-solstices/ ghi 16:59:09, https://www.worldspaceflight.com/addendum/equinox.php ghi 17:00:08. Sóc 20/06/1944 Moshier 16:59:31 UT, Astronomy Engine 17:00:12 UT; bảng NASA https://eclipse.gsfc.nasa.gov/phase/phases1901.html có độ phân giải phút, không đủ phân xử giây. Sóc 07/07/1967 Moshier khoảng 17:00:06 UT. Cần nguồn ephemeris độ chính xác cao và thẩm định lịch sử cho các biên sát nửa đêm; không tự đổi bảng.
- Thực nghiệm adapter calendar-provider: scripts/reference/vn-iztro-calendar-adapter.cjs và scripts/audit-vn-iztro.ts. Nguồn đối chiếu mã upstream https://github.com/SylarLong/iztro/tree/v2.6.1 và https://github.com/SylarLong/lunar-lite ; iztro MIT (giữ LICENSE ở bản sao tạm), lockfile 2.6.1/0.2.8. Sao chép phần lib đã cài sang thư mục tạm node_modules, chỉ thay import lunar-lite bằng provider, xóa khi kết thúc. Không ghi đè dependency gốc, không thay runtime/lockfile. Provider lấy ngày âm và độ dài tháng UTC+7, năm Can Chi theo năm âm, tháng Can Chi âm theo quy tắc Ngũ Hổ Độn. Giữ nguyên ngày dương, so sánh 4 Tết và tháng nhuận với iztro byLunar độc lập nếu biểu diễn được, kiểm tra trường hợp bình thường không đổi. Giới hạn: giờ/ngày Can Chi và tiết khí exact vẫn là upstream; chính sách quy tháng nhuận ngoài split, vận hạn, lịch trước 1900, hồ sơ cũ và browser bundle chưa chuyển đổi. Không gọi đây là adapter sản phẩm trước khi có log và thử nghiệm đủ.
- Thêm kiểm tra tương tác Playwright trên bản static 360/1280: bỏ mặc định, tìm huyện cũ, giờ không rõ, lập/lưu/mở hồ sơ, Hợp bàn, giờ lịch sử lặp; chỉ dùng dữ liệu tổng hợp, chặn request ngoài localhost. Screenshot và JSON lưu artifact. Chưa ghi nhận kết quả của lượt mới tại lúc commit.

- Run 45379930149 tái hiện TS7022 ở 4 biến local của audit adapter; thêm annotation rõ cho dữ liệu boundary/call của thư viện JS, không thay điều kiện test.

## QA nguồn độ chính xác cao (không phải phụ thuộc sản phẩm)

Workflow source-audit.yml chỉ chạy khi script nguồn thay đổi trên qa/integration-v3 hoặc được kích hoạt thủ công, để tránh tải lặp dữ liệu lớn. JPL DE440s tải từ https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de440s.bsp , dùng Skyfield 1.53 (https://rhodesmill.org/skyfield/api-almanac.html) tính ba mốc sát nửa đêm; dùng UT1 cho thời kỳ trước UTC, cộng +7 theo quy ước hồi chiếu. Ghi SHA256, phiên bản, thời gian và số giây cách nửa đêm; chưa xác nhận chạy thành công. GeoNames dump VN và admin1CodesASCII chỉ tìm ứng viên địa điểm ADM2 trùng tên huyện và tỉnh cũ; nguồn https://www.geonames.org/export/ và https://download.geonames.org/export/dump/ (CC BY). Không ghi tọa độ vào runtime nếu chưa thẩm định; có báo cáo ứng viên/trùng tên/không tìm được. Dữ liệu không chứa thông tin sinh của người dùng. Lỗi tải nguồn phải hiện ra trong workflow nghiên cứu, không được coi là dữ liệu xác minh.
