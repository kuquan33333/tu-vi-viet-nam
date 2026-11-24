/** Offline Thời gia Kỳ Môn, Chia bổ/Chuyển bàn.
 * MIT engine: perfhelf/bigfishmarquis-qimen@6112b3937d7fcaa2ab0a34aec2a52f74e2effe6c.
 * One school only. Solar-term boundary follows Vietnamese UTC+7 calendar events.
 */
import {Solar} from 'lunar-javascript';
import {solarTermsForYear} from '@/lib/ziwei/calendar-events';
import {TERM_RULES,PALACE_LAYOUT,type Term} from './qimen';
import {shiJiaGenerate} from './qimen-upstream/engines/shijia';

const GAN=[...'甲乙丙丁戊己庚辛壬癸'],CHI=[...'子丑寅卯辰巳午未申酉戌亥'];
const GV=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CV=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const LABEL:Record<string,string>={
 '天蓬':'Thiên Bồng','天芮':'Thiên Nhuế','天冲':'Thiên Xung','天辅':'Thiên Phụ','天禽':'Thiên Cầm',
 '天心':'Thiên Tâm','天柱':'Thiên Trụ','天任':'Thiên Nhậm','天英':'Thiên Anh',
 '休门':'Hưu môn','生门':'Sinh môn','伤门':'Thương môn','杜门':'Đỗ môn','景门':'Cảnh môn',
 '死门':'Tử môn','惊门':'Kinh môn','开门':'Khai môn',
 '值符':'Trực Phù','腾蛇':'Đằng Xà','太阴':'Thái Âm','六合':'Lục Hợp',
 '白虎':'Bạch Hổ','玄武':'Huyền Vũ','九地':'Cửu Địa','九天':'Cửu Thiên',
 '坎':'Khảm','坤':'Khôn','震':'Chấn','巽':'Tốn','中':'Trung cung','乾':'Càn','兑':'Đoài','艮':'Cấn','离':'Ly'
};
const vi=(s:string)=>LABEL[s]||GV[GAN.indexOf(s)]||s;
const gz=(s:string)=>[...s].map(ch=>GV[GAN.indexOf(ch)]||CV[CHI.indexOf(ch)]||ch).join(' ');
export function calculateYuan(gan:string,chi:string):0|1|2{
 const s=GAN.indexOf(gan),b=CHI.indexOf(chi);
 if(s<0||b<0||s%2!==b%2)throw Error('Can Chi không hợp lệ');
 const futou=((b-s%5)%12+12)%12;
 return [0,3,6,9].includes(futou)?0:[2,5,8,11].includes(futou)?1:2;
}
export interface HourPalace {index:number;name:string;dia:string;thien:string;sao:string;mon:string;than:string;hidden:string;marks:string[]}
export interface HourChart {term:string;termTime:string;ju:number;yuan:string;dun:string;day:string;hour:string;zhifu:string;zhishi:string;dutyStarPalace:number;dutyDoorPalace:number;voidBranches:string;palaces:HourPalace[]}
export function calculateHourChart(y:number,m:number,d:number,h:number,minute:number):HourChart{
 if(!Number.isInteger(y)||y<1901||y>2049||!Number.isInteger(m)||m<1||m>12||
 !Number.isInteger(d)||d<1||d>31||!Number.isInteger(h)||h<0||h>23||!Number.isInteger(minute)||minute<0||minute>59)throw Error('Ngày giờ phải thuộc 1901–2049');
 const chk=new Date(Date.UTC(y,m-1,d));
 if(chk.getUTCFullYear()!==y||chk.getUTCMonth()!==m-1||chk.getUTCDate()!==d)throw Error('Ngày dương lịch không hợp lệ');
 const unix=Date.UTC(y,m-1,d,h-7,minute);
 const prev=[...solarTermsForYear(y-1),...solarTermsForYear(y),...solarTermsForYear(y+1)].filter(v=>v.utcMs<=unix).sort((a,b)=>a.utcMs-b.utcMs).at(-1);
 if(!prev||!(prev.name in TERM_RULES))throw Error('Không có tiết khí phù hợp');
 // lunar-javascript evaluates the solar-term pillars in UTC+8; add +1h to local UTC+7 time.
 const n=new Date(Date.UTC(y,m-1,d,h+1,minute));
 const ec=Solar.fromYmdHms(n.getUTCFullYear(),n.getUTCMonth()+1,n.getUTCDate(),n.getUTCHours(),n.getUTCMinutes(),0).getLunar().getEightChar();
 const dayTime=new Date(Date.UTC(y,m-1,d+(h>=23?1:0),12));
 const lunar=Solar.fromYmd(dayTime.getUTCFullYear(),dayTime.getUTCMonth()+1,dayTime.getUTCDate()).getLunar();
 const dg=String(lunar.getDayGan()),dz=String(lunar.getDayZhi()),si=GAN.indexOf(dg);
 if(si<0||CHI.indexOf(dz)<0)throw Error('Không tính được Can Chi ngày');
 const zi=Math.floor(((h+1)%24)/2),hg=GAN[(si%5*2+zi)%10],hz=CHI[zi];
 const term=prev.name as Term,rule=TERM_RULES[term],yuan=calculateYuan(dg,dz),ju=rule.ju[yuan];
 const yp=String(ec.getYear()),mp=String(ec.getMonth());
 const pillars={year:{gan:yp[0],zhi:yp[1]},month:{gan:mp[0],zhi:mp[1]},day:{gan:dg,zhi:dz},hour:{gan:hg,zhi:hz}};
 const plate=shiJiaGenerate(hg,hz,ju,rule.yang?'yang':'yin',pillars,term);
 const palaces=PALACE_LAYOUT.map(index=>{
  const p=plate.palaces.find(x=>x.palaceNumber===index);
  if(!p)throw Error('Thiếu cung Kỳ Môn');
  // upstream shijia documents inverse aliases: skyStem=earth, earthStem=heaven.
  return {index,name:vi(p.palaceName),dia:vi(p.skyStem),thien:vi(p.earthStem),sao:vi(p.star),mon:vi(p.door),than:vi(p.god),hidden:p.hiddenStems.map(vi).join(' · '),marks:p.marks};
 });
 if(new Set(palaces.map(p=>p.dia)).size!==9||palaces.filter(p=>p.mon).length!==8||palaces.filter(p=>p.than).length!==8)throw Error('Phân bố cung Kỳ Môn bất thường');
 return {term,termTime:new Date(prev.utcMs+7*3600000).toISOString().slice(0,16).replace('T',' '),
 ju,yuan:['Thượng','Trung','Hạ'][yuan],dun:rule.yang?'Dương độn':'Âm độn',day:gz(dg+dz),hour:gz(hg+hz),
 zhifu:vi(plate.zhiFuStar),zhishi:vi(plate.zhiShiDoor),dutyStarPalace:plate.zhiFuPalace,dutyDoorPalace:plate.zhiShiPalace,voidBranches:plate.kongWang.map(vi).join(' · '),palaces};
}
