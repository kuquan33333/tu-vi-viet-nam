import {PROVINCES,type CityInfo,type ProvinceInfo} from './cities';
import {LEGACY_PROVINCES,LEGACY_DISTRICT_ROWS} from './legacy-birthplaces.generated';
export type BirthLocation=CityInfo&{legacyCode?:string;oldProvince?:string;requiresLongitude?:boolean};
export type BirthRegion='north'|'south';
export const LEGACY_BIRTHPLACES=LEGACY_DISTRICT_ROWS.split('\n').map(row=>{
 const [code,name,provinceCode]=row.split('|'),p=LEGACY_PROVINCES[provinceCode];
 if(!p)throw Error('Missing old province '+provinceCode);
 return {code,name,provinceCode,oldProvince:p.name,currentProvince:p.current};
});
export function normalizeBirthplace(value:string):string{return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[().,/-]/g,' ').replace(/\s+/g,' ').trim();}
export function birthLocationsForProvince(province:string):BirthLocation[]{
 const p=PROVINCES.find(p=>p.name===province);if(!p)return [];
 return [...p.cities,...LEGACY_BIRTHPLACES.filter(x=>x.currentProvince===province).map(x=>({
  name:x.name+' ('+x.oldProvince+' cũ)',
  longitude:NaN,legacyCode:x.code,oldProvince:x.oldProvince,requiresLongitude:true,
  // Old Quảng Bình is north; old Quảng Trị straddles the historical division.
  isSouthOf17thParallel:x.provinceCode==='44'?false:x.provinceCode==='45'?undefined:p.isSouthOf17thParallel,
 }))];
}
export function searchBirthplaces(query:string):{p:ProvinceInfo;c:BirthLocation}[]{
 const words=normalizeBirthplace(query).split(' ').filter(Boolean);if(!words.length)return [];
 const all=PROVINCES.flatMap(p=>birthLocationsForProvince(p.name).map(c=>({p,c})));
 return all.filter(({p,c})=>{const n=normalizeBirthplace(p.name+' '+c.name);return words.every(w=>n.includes(w));})
  .sort((a,b)=>Number(Boolean(a.c.requiresLongitude))-Number(Boolean(b.c.requiresLongitude))).slice(0,30);
}
export function birthRegion(province:string,city:string,chosen?:BirthRegion):boolean|undefined{
 const p=PROVINCES.find(x=>x.name===province);if(!p)return undefined;
 const c=birthLocationsForProvince(province).find(x=>x.name===city);
 if(c?.isSouthOf17thParallel!==undefined)return c.isSouthOf17thParallel;
 // Never assume the north side for a manually selected place in merged Quảng Trị.
 if(province==='Tỉnh Quảng Trị')return chosen===undefined?undefined:chosen==='south';
 return p.isSouthOf17thParallel;
}
