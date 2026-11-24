import type { Metadata } from 'next';
export const metadata: Metadata = {
 title: "Địa Kỷ · La Kinh 24 Sơn và Bát Trạch | Tử Vi Đẩu Số",
 description: "La bàn 24 sơn, cung phi Bát Trạch, các hướng cát và thư viện địa lý hình thế.",
 alternates: {canonical: '/dia-ky'},
 openGraph: {title: "Địa Kỷ · La Kinh 24 Sơn và Bát Trạch | Tử Vi Đẩu Số",description: "La bàn 24 sơn, cung phi Bát Trạch, các hướng cát và thư viện địa lý hình thế.",url: '/dia-ky'},
};
export default function LearningLayout({children}:{children:React.ReactNode}) {return <>{children}</>;}
