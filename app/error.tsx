'use client';
import {Button,ButtonLink} from '@/components/ui';
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="site-wrap ui5-page ui5-error"><h1>Không thể mở trang</h1><p>Đã xảy ra lỗi khi hiển thị. Bạn có thể thử lại hoặc chuyển trang.</p><div className="ui5-error-actions"><Button onClick={reset}>Thử lại</Button><ButtonLink href="/" variant="secondary">Về trang chủ</ButtonLink><ButtonLink href="/lich-van-nien" variant="secondary">Lịch Vạn Niên</ButtonLink></div></main>;}
