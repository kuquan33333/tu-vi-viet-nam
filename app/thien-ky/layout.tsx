import type { Metadata } from 'next';
export const metadata: Metadata = {
 title: "Thiên Kỷ · Chu Dịch và Kỳ Môn | Tử Vi Đẩu Số",
 description: "Gieo quẻ Chu Dịch, tra 64 quẻ, tham khảo địa bàn Kỳ Môn 9 cung theo 24 tiết khí.",
 alternates: {canonical: '/thien-ky'},
 openGraph: {title: "Thiên Kỷ · Chu Dịch và Kỳ Môn | Tử Vi Đẩu Số",description: "Gieo quẻ Chu Dịch, tra 64 quẻ, tham khảo địa bàn Kỳ Môn 9 cung theo 24 tiết khí.",url: '/thien-ky'},
};
export default function LearningLayout({children}:{children:React.ReactNode}) {return <>{children}</>;}
