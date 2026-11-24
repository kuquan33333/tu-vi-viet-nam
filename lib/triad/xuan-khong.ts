/**
 * Huyền Không Phi Tinh – Hạ quái (下卦): chọn 24 sơn, ba bàn Vận/Sơn/Hướng.
 * Trường phái nguồn: xudaniel/mingli-fengshui MIT (pinned in docs/licenses/flying-star.txt).
 * Không bao gồm Thế quái, kiêm hướng, cục/đoán định thực địa.
 */
import {solarTermsForYear} from '@/lib/ziwei/calendar-events';
import {MOUNTAINS_24,computeFlyingStar,type Mountain} from './flying-star-upstream';
export const XUAN_GRID=['巽','离','坤','震','中','兑','艮','坎','乾'] as const;
export const VN_PALACE:Record<string,string>={'巽':'Tốn · Đông Nam','离':'Ly · Nam','坤':'Khôn · Tây Nam','震':'Chấn · Đông','中':'Trung tâm','兑':'Đoài · Tây','艮':'Cấn · Đông Bắc','坎':'Khảm · Bắc','乾':'Càn · Tây Bắc'};
export const VN_MOUNTAIN:Record<string,string>={'壬':'Nhâm','子':'Tý','癸':'Quý','丑':'Sửu','艮':'Cấn','寅':'Dần','甲':'Giáp','卯':'Mão','乙':'Ất','辰':'Thìn','巽':'Tốn','巳':'Tỵ','丙':'Bính','午':'Ngọ','丁':'Đinh','未':'Mùi','坤':'Khôn','申':'Thân','庚':'Canh','酉':'Dậu','辛':'Tân','戌':'Tuất','乾':'Càn','亥':'Hợi'};
export function mountainFromBearing(bearing:number):Mountain{
 if(!Number.isFinite(bearing)||bearing<0||bearing>=360)throw Error('Góc hướng phải từ 0 đến dưới 360°');
 return MOUNTAINS_24[(Math.floor(((bearing+7.5)%360)/15)+1)%24];
}
export function boundaryDistance(bearing:number):number {
 const b=((bearing%15)+15)%15;
 return Math.abs(b-7.5);
}
export interface HousePeriodChart{
 input:{year:number;month:number;day:number;bearing:number;sitting:Mountain;facing:Mountain};
 period:number;periodLabel:string;liChun:string;palaces:Array<{name:string;periodStar:number;mountainStar:number;waterStar:number;code:string}>;
 isWangShanWangXiang:boolean;isShangShanXiaShui:boolean;boundaryWarning:boolean;
}
export function calculateHouseChart(year:number,month:number,day:number,bearing:number):HousePeriodChart{
 if(!Number.isInteger(year)||year<1901||year>2049||!Number.isInteger(month)||month<1||month>12||!Number.isInteger(day)||day<1||day>31)throw Error('Ngày nhà xây/nhập trạch ngoài 1901–2049');
 const chk=new Date(Date.UTC(year,month-1,day));
 if(chk.getUTCFullYear()!==year||chk.getUTCMonth()!==month-1||chk.getUTCDate()!==day)throw Error('Ngày không hợp lệ');
 const li=solarTermsForYear(year).find(t=>t.name==='Lập xuân');
 if(!li)throw Error('Không tính được Lập xuân');
 const event=Date.UTC(year,month-1,day,12-7);
 const effectiveYear=event<li.utcMs?year-1:year;
 const facing=mountainFromBearing(bearing);
 const sitting=MOUNTAINS_24[(MOUNTAINS_24.indexOf(facing)+12)%24];
 const chart=computeFlyingStar(sitting,effectiveYear);
 return {
 input:{year,month,day,bearing,sitting,facing},period:chart.period,periodLabel:chart.periodLabel,
 liChun:new Date(li.utcMs+7*3600000).toISOString().slice(0,16).replace('T',' '),
 palaces:XUAN_GRID.map(code=>{
  const p=chart.palaces.find(v=>v.palace===code);
  if(!p)throw Error('Thiếu cung Huyền Không '+code);
  return {code,name:VN_PALACE[code],periodStar:p.yunStar,mountainStar:p.shanStar,waterStar:p.xiangStar};
 }),
 isWangShanWangXiang:chart.isWangShanWangXiang,
 isShangShanXiaShui:chart.isShangShanXiaShui,
 boundaryWarning:boundaryDistance(bearing)<1.5
 };
}
