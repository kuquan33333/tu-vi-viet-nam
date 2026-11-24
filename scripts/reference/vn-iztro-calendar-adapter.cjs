/**
 * Calendar provider for an isolated copy of iztro 2.6.1 (QA candidate).
 * The original lunar-lite and iztro packages remain untouched.
 * No network requests, no fake Gregorian birthdays.
 * See docs/methodology.md for unresolved UTC+7 boundary days.
 */
const legacy=require('lunar-lite');
const {candidateMonths,candidateSolarToLunar,candidateLunarToSolar}=require('./vn-calendar.cjs');
const stems=[...'甲乙丙丁戊己庚辛壬癸'],branches=[...'子丑寅卯辰巳午未申酉戌亥'];
const mod=(n,k)=>((n%k)+k)%k;
const yearPair=y=>[stems[mod(y-4,10)],branches[mod(y-4,12)]];
let override=null;
function withEffectiveCalendarDate(date,lunar,fn){
 const old=override;override={key:legacy.normalizeDateStr(date).slice(0,3).join('-'),lunar};
 try{return fn();}finally{override=old;}
}
function candidate(date){
 const [y,m,d]=legacy.normalizeDateStr(date);
 if(override&&override.key===[y,m,d].join('-'))return override.lunar;
 if(y<1900||y>2050)return null;
 const result=candidateSolarToLunar(y,m,d);
 if(!result)throw new RangeError('Invalid UTC+7 civil date');
 return result;
}
function cnLabel(l){
 const digits=[...'〇一二三四五六七八九'];
 const months=['','正','二','三','四','五','六','七','八','九','十','冬','腊'];
 const ds=l.lunarDay;
 const day=ds<=10?'初'+(ds===10?'十':digits[ds]):ds<20?'十'+digits[ds-10]:ds===20?'二十':ds<30?'廿'+digits[ds-20]:'三十';
 return String(l.lunarYear).split('').map(n=>digits[Number(n)]).join('')+'年'+(l.isLeapMonth?'闰':'')+months[l.lunarMonth]+'月'+day;
}
function solar2lunar(date){
 const l=candidate(date);if(!l)return legacy.solar2lunar(date);
 return {lunarYear:l.lunarYear,lunarMonth:l.lunarMonth,lunarDay:l.lunarDay,isLeap:l.isLeapMonth,toString(cn){return cn?cnLabel(l):[l.lunarYear,l.lunarMonth,l.lunarDay].join('-')}};
}
function lunar2solar(date,isLeap=false){
 const [y,m,d]=legacy.normalizeDateStr(date);
 if(y<1899||y>2050)return legacy.lunar2solar(date,isLeap);
 const r=candidateLunarToSolar(y,m,d,Boolean(isLeap));
 if(!r)throw new RangeError('UTC+7 lunar date invalid or outside supported civil range');
 return {solarYear:r.year,solarMonth:r.month,solarDay:r.day,toString(){return [r.year,r.month,r.day].join('-')}};
}
function getTotalDaysOfLunarMonth(date){
 const l=candidate(date);if(!l)return legacy.getTotalDaysOfLunarMonth(date);
 const row=candidateMonths.find(r=>r.year===l.lunarYear&&r.month===l.lunarMonth&&r.leap===l.isLeapMonth);
 if(!row)throw Error('Missing lunar month');
 return row.length;
}
function getHeavenlyStemAndEarthlyBranchBySolarDate(date,hour,options){
 const out=legacy.getHeavenlyStemAndEarthlyBranchBySolarDate(date,hour,options);
 const l=candidate(date);if(!l)return out;
 const yearly=options?.year==='normal'?yearPair(l.lunarYear):out.yearly;
 const m=l.lunarMonth+(l.isLeapMonth&&l.lunarDay>15?1:0);
 const monthly=options?.month==='normal'?[stems[mod((stems.indexOf(yearly[0])%5)*2+2+m-1,10)],branches[mod(m+1,12)]]:out.monthly;
 // Exact solar terms, daily and hourly GanZhi still follow upstream.
 // This is a limitation of this QA prototype, not a verified UTC+7 term engine.
 return {...out,yearly,monthly,toString(){return [yearly,monthly,out.daily,out.hourly].map(x=>x.join('')).join(' ')}};
}
function getHeavenlyStemAndEarthlyBranchByLunarDate(date,hour,leap,options={year:'normal',month:'exact'}){
 return getHeavenlyStemAndEarthlyBranchBySolarDate(lunar2solar(date,leap).toString(),hour,options);
}
module.exports={...legacy,withEffectiveCalendarDate,solar2lunar,lunar2solar,getTotalDaysOfLunarMonth,getHeavenlyStemAndEarthlyBranchBySolarDate,getHeavenlyStemAndEarthlyBranchByLunarDate};
