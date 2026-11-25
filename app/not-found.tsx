import Breadcrumb from '@/components/Breadcrumb';
import {ButtonLink} from '@/components/ui';
export default function NotFound(){return <><Breadcrumb items={[{label:'Không tìm thấy trang',href:'/404'}]}/><main className="site-wrap ui5-page ui5-error"><h1>Không tìm thấy trang</h1><p>Địa chỉ không tồn tại hoặc đã được thay đổi.</p><div className="ui5-error-actions"><ButtonLink href="/">Về trang chủ</ButtonLink><ButtonLink href="/lich-van-nien" variant="secondary">Lịch Vạn Niên</ButtonLink></div></main></>;}
