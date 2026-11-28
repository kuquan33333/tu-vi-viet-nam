import type {ReactNode} from 'react';
import Footer from './ui/Footer';
import RouteChrome from './RouteChrome';

export default function AppChrome({children}:{children:ReactNode}){
 return <RouteChrome footer={<Footer/>}>{children}</RouteChrome>;
}
