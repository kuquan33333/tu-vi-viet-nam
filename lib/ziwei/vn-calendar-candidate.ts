/**
 * Candidate fixed UTC+7 lunisolar calendar, not yet wired to chart generation.
 * Original numerical results computed from Swiss Ephemeris 2.10.03 Moshier
 * geocentric solar/lunar longitudes (no third-party code in the runtime table).
 * Each 5-hex-digit year code: 13 low bits = month lengths minus 29, high bits =
 * repeated (leap) month number or 0. Data begins with 1899 lunar month 1.
 * See scripts/reference/generate-vn-moshier.py and docs/methodology.md.
 */
export const CANDIDATE_VERSION='utc7-moshier-2.10.03-v1';
const codes='00ad5116d200752006a50b64b0064b00c9b0955a0056a00b690575200b520db2500b2500a4b0b4ab002ad0056d06b6900da90fd9200e9200d250da4d00a56002b6095b5006d400ea905e9200e920cd260052b00a570b4d60035a006d5076c9007491169300a950052b0ca5b00aad0056a09b6500ba400b4905a9500a950f52d0055600ab50b5aa005d200da507d4a00e4a10c9600a97005560cab500ad9006d208ea5007250064b06c970049b0e55b0056b00b690b75200b5200b2509a4b00a4d114ab002ad005ad0cb6a00da900d9209d2500d2500a55054ad004b60e5b5006d500ec90be9200e9200d2606a5600a57115560056a00b550b6c900749006930952b0052b00a5b0555a0056a0eb6500ba500d490ba9500a950052d08aad00ab5135aa005d200da50dd4a00e4a00c960992e0055600ab5055b2006d20cea5007250064b0ac97004ab0055b06ada00b6a1775200b9200b250da4b00a4d004ad0a95b005ad00baa05b5200d920fd2500d2500a550b4ad004b6006b506daa';
const firstYear=1899,firstDay=-25892,DAY=86400000;
export type CandidateMonth={year:number;month:number;leap:boolean;start:number;length:number};
export type CandidateLunar={lunarYear:number;lunarMonth:number;lunarDay:number;isLeapMonth:boolean};
export type CivilDate={year:number;month:number;day:number};
export const candidateMonths:readonly CandidateMonth[]=(()=>{
 const out:CandidateMonth[]=[];let start=firstDay;
 for(let y=firstYear;y<=2050;y++){
  const code=parseInt(codes.slice((y-firstYear)*5,(y-firstYear+1)*5),16),leap=code>>>13;
  let bit=0;
  for(let m=1;m<=12;m++){
   const add=(isLeap:boolean)=>{
    const length=29+((code>>>bit++)&1);
    out.push({year:y,month:m,leap:isLeap,start,length});start+=length;
   };
   add(false);if(m===leap)add(true);
  }
 }
 return out;
})();
export function civilDay(y:number,m:number,d:number):number|null{
 if(![y,m,d].every(Number.isInteger)||y<1899||y>2051||m<1||m>12||d<1||d>31)return null;
 const dt=new Date(Date.UTC(y,m-1,d));
 return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d?dt.getTime()/DAY:null;
}
export function fromCivilDay(n:number):CivilDate{
 const dt=new Date(n*DAY);return {year:dt.getUTCFullYear(),month:dt.getUTCMonth()+1,day:dt.getUTCDate()};
}
export function candidateSolarToLunar(y:number,m:number,d:number):CandidateLunar|null{
 const day=civilDay(y,m,d);if(day===null||y<1900||y>2050)return null;
 let lo=0,hi=candidateMonths.length-1;
 while(lo<=hi){
  const i=(lo+hi)>>>1,r=candidateMonths[i];
  if(day<r.start)hi=i-1;
  else if(day>=r.start+r.length)lo=i+1;
  else return {lunarYear:r.year,lunarMonth:r.month,lunarDay:day-r.start+1,isLeapMonth:r.leap};
 }
 return null;
}
export function candidateLunarToSolar(y:number,m:number,d:number,leap=false):CivilDate|null{
 if(![y,m,d].every(Number.isInteger)||d<1||d>30)return null;
 const r=candidateMonths.find(x=>x.year===y&&x.month===m&&x.leap===leap);
 if(!r||d>r.length)return null;
 const result=fromCivilDay(r.start+d-1);
 return result.year>=1900&&result.year<=2050?result:null;
}
