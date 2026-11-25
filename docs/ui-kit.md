# UI Kit — Thư quán phương Đông (UI-1)

Nguồn chính xác của màu, chữ, spacing và kích thước là UI-BRIEF.md, không tự đổi palette.

## Token
- `--paper #F6F2E9`, `--card #FFFDF8`, `--ink #1C2230`, `--muted #5B6270`, `--dim #6B717D`, `--line #DDD4C2`, `--field #8C8472`, `--accent #9E2F26`. Màu dải tối: ink, on-dark, on-dark-muted.
- Font Noto Serif 700 h1–h3, Be Vietnam Pro 400/500/600 body, dùng `next/font/local` với file TTF ghim trong `app/fonts/`, có giấy phép OFL. Kích cỡ base 16/14px; heading 56/40/32, h2 34/24, h3 22; line-height 1.2/1.6.
- Gutter 64 desktop / 32 tablet / 20 mobile; 72 giữa section; radius card 10, control 6; card 24/32; control 48, touch 44; header 72/56, tab 64 + safe area.
- Tailwind: `bg-paper bg-card text-ink text-muted text-dim border-line border-field bg-accent`; legacy aliases chỉ để tương thích màn hình cũ.

## Primitives
Import từ `@/components/ui`. Dùng component có ngữ nghĩa; không hard-code màu trong JSX. Giữ button type=button mặc định; type=submit khi gửi form.

| Thành phần | API / trạng thái |
|---|---|
| Container | className, HTML div props |
| Card | large, className, div props; border thay shadow |
| Eyebrow | paragraph props |
| Button | variant primary/secondary, disabled, button props |
| ButtonLink | href, variant, className, children; link nội bộ |
| Field | id, label, required, hint, error, input props; aria-invalid/describedby khi lỗi |
| Segmented | label, options {value,label,disabled}, value, onChange, disabled; aria-pressed; lựa chọn được biểu thị bằng chữ và nền |
| Checkbox | id, label, input props; điều khiển native |
| Notice | tone note/error; text thật, role note/alert |
| Icon | name, size, label; SVG stroke 1.6, aria-hidden khi trang trí |

```tsx
import {Container,Card,Eyebrow,Button,Field,Checkbox,Notice,Icon} from '@/components/ui';
<Container>
  <Card large>
    <Eyebrow>Tra cứu</Eyebrow>
    <h2>Thông tin</h2>
    <Field id="name" label="Họ tên" hint="Không bắt buộc" />
    <Field id="example" label="Ví dụ lỗi" required error="Bạn cần nhập giá trị." />
    <Checkbox id="agree" label="Đã đọc hướng dẫn" />
    <Notice>Thông tin dùng để tham khảo.</Notice>
    <Button><Icon name="check" /> Xác nhận</Button>
    <Button variant="secondary" disabled>Chưa sẵn sàng</Button>
  </Card>
</Container>
```

Header, BottomTabBar, Footer nằm tại `components/ui/`; AppChrome chỉ điều phối, không nhân đôi header/footer. Breadcrumb sẵn có giữ JSON-LD. Header desktop theo thứ tự brief; ở tablet/mobile dùng nút menu, Escape đóng và trả focus. BottomTabBar chỉ dưới 640px và có safe-area. Không có nút dark mode ở đợt này.

## Nghiệm thu
Các bộ kiểm thử hiện có vẫn chạy. Browser QA kiểm tra light-only (kể cả localStorage có dark), responsive, điều hướng, contrast, font local, mọi chức năng sinh lá số/hồ sơ/lịch và chuyên sâu. Workflow UI-1 Visual QA chụp baseline cố định và PR head cùng 11 route × 3 viewport. Chưa được xem là đạt trước khi có kết quả.


## Ghi chú contrast và điều hướng
- Các cặp chính (tính theo WCAG): ink/paper 14.23:1; muted/paper 5.49:1; accent/paper 6.51:1; white/accent 7.27:1; chữ phụ dải tối/ink 10.74:1.
- dim/paper 4.39:1 là xung đột trong đặc tả, chưa đổi mã màu. Dùng muted nếu chữ nhỏ trên paper cho tới khi thống nhất UI-4.
- Kiểm tra font thực sự nạp (cả serif và sans), không chỉ có font request. Kiểm kê thêm emoji, class utility màu Tailwind cũ. Mọi kết quả thực tế nằm trong Actions artifacts, không dùng số liệu tự tạo.
- Hồ sơ đã mở khóa chỉ tồn tại trong phiên JS. Hợp bàn phải được mở bằng điều hướng client khi cần chọn hồ sơ đã mở khóa; không tải lại toàn trang.

## Font và kiểm tra nút lịch (bổ sung UI-1)
- Font đầy đủ glyph được ghim trong repository, không còn tải font tại build hoặc client; xem `app/fonts/README.md` và hai bản OFL. Dùng TTF gốc để tránh mất dấu tiếng Việt; tối ưu WOFF2 là việc sau nếu cần, không đánh đổi độ phủ glyph.
- Hai nút Dương lịch/Âm lịch dùng ink trên nền line khi chưa chọn, white trên ink khi chọn, aria-pressed và vùng bấm tối thiểu 44px. QA kiểm tra cả hai trạng thái, không bỏ gate WCAG.
