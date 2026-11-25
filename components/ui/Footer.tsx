import Link from 'next/link';
export default function Footer(){return <footer className="global-footer ui-footer">
 <div className="site-wrap ui-footer-inner"><div><p>© 2026 Tử Vi Đẩu Số · Dữ liệu và thuật toán: xem Nguồn và giấy phép</p><p>Không thay thế tư vấn y tế, pháp lý hoặc tài chính.</p></div>
 <nav aria-label="Thông tin website"><Link href="/privacy" prefetch={false}>Quyền riêng tư</Link><Link href="/terms" prefetch={false}>Điều khoản</Link><Link href="/terms#nguon-va-giay-phep" prefetch={false}>Nguồn và giấy phép</Link></nav></div>
 </footer>}
