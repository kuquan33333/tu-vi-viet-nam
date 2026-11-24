import type {Metadata} from 'next';
export const metadata:Metadata={title:'Hồ sơ lá số lưu trên máy',robots:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <>{children}</>;}
