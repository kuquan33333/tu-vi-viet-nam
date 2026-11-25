'use client';
import {usePathname} from 'next/navigation';
import Header from './ui/Header';
import BottomTabBar from './ui/BottomTabBar';
import Footer from './ui/Footer';
import Breadcrumb from './Breadcrumb';

const crumbLabels:Record<string,string>={
 '/chart':'Lập lá số','/lich-van-nien':'Lịch Vạn Niên','/thien-ky':'Thiên Kỷ','/dia-ky':'Địa Kỷ','/nhan-ky':'Nhân Kỷ','/hop-ban':'Hợp bàn','/ho-so':'Hồ sơ','/cong-cu':'Công cụ','/knowledge':'Kho kiến thức','/preview':'Xem trước'
};
// Existing library, legal and hexagram pages retain their own server-rendered breadcrumb + JSON-LD.
export default function AppChrome({children}:{children:React.ReactNode}){
 const path=(usePathname()||'/').replace(/\/$/,'')||'/';
 return <>
  <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
  <Header path={path}/>
  <div id="main-content" className={'app-content'+(path==='/'?' ui-home':' ui-subpage')} tabIndex={-1}>
   {crumbLabels[path]&&<Breadcrumb items={[{label:crumbLabels[path],href:path}]}/>}
   {children}
  </div>
  <Footer/>
  <BottomTabBar path={path}/>
 </>;
}
