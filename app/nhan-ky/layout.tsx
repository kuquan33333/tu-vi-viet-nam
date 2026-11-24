import type { Metadata } from 'next';
export const metadata: Metadata = {
 title: "Nhân Kỷ · Đông Y và Atlas 361 Huyệt | Tử Vi Đẩu Số",
 description: "Thư viện Nội Kinh, Thương Hàn, Kim Quỹ, Châm Cứu; danh mục 361 huyệt thuộc 14 kinh mạch.",
 alternates: {canonical: '/nhan-ky'},
 openGraph: {title: "Nhân Kỷ · Đông Y và Atlas 361 Huyệt | Tử Vi Đẩu Số",description: "Thư viện Nội Kinh, Thương Hàn, Kim Quỹ, Châm Cứu; danh mục 361 huyệt thuộc 14 kinh mạch.",url: '/nhan-ky'},
};
export default function LearningLayout({children}:{children:React.ReactNode}) {return <>{children}</>;}
