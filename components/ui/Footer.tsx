import Link from 'next/link';
import BrandMark,{Ornament} from './BrandMark';
export default function Footer(){return <footer className="global-footer ui-footer">
 <section className="site-wrap author-contact-wrap" aria-labelledby="author-contact-name"><div className="author-contact">
<p className="author-contact-eyebrow"><span aria-hidden="true">✦</span> NGƯỜI PHÁT TRIỂN <span aria-hidden="true">✦</span></p><h2 id="author-contact-name">Lộc Phát</h2><p className="author-contact-role">Sáng lập &amp; phát triển Tử Vi Việt Nam</p><Ornament/>
<p className="author-contact-description">Gìn giữ tinh hoa cổ học phương Đông, kết nối tri thức truyền thống với công nghệ hiện đại.</p>
<a className="author-contact-telegram" href="https://t.me/locphat88886"><svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true" focusable="false" fill="currentColor"><path d="M21.8 3.4 2.9 10.7c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5L18.7 6.7c.5-.3.9-.1.5.3l-9.1 8.2-.4 4.8c.6 0 .9-.3 1.2-.6l2.3-2.2 4.8 3.5c.9.5 1.5.3 1.7-.8l3.2-15.1c.3-1.3-.5-1.8-1.1-1.4Z"/></svg><span>Liên hệ qua Telegram</span></a><p className="author-contact-handle">@locphat88886</p></div></section>
<div className="site-wrap ui-footer-inner"><div><Link className="brand-footer-mark" href="/" prefetch={false} aria-label="Tử Vi Việt Nam – về trang chủ"><BrandMark/></Link><p>© 2026 Tử Vi Việt Nam · Dữ liệu và thuật toán: xem Nguồn và giấy phép</p><p>Không thay thế tư vấn y tế, pháp lý hoặc tài chính.</p></div>
 <nav aria-label="Thông tin website"><Link href="/privacy" prefetch={false}>Quyền riêng tư</Link><Link href="/terms" prefetch={false}>Điều khoản</Link><Link href="/terms#nguon-va-giay-phep" prefetch={false}>Nguồn và giấy phép</Link></nav></div>
 </footer>}
