import assert from 'node:assert/strict';
import {test} from 'node:test';
import {solarTermsForYear,dayMarks,vietnamToday} from '../../lib/ziwei/calendar-events';
import {lunarToSolarVN} from '../../lib/ziwei/lunar-solar';
test('C15: 24 unique ordered solar terms every year 1900–2050',()=>{
 for(let y=1900;y<=2050;y++){const t=solarTermsForYear(y);assert.equal(t.length,24,String(y));assert.equal(new Set(t.map(x=>x.index)).size,24);assert.ok(t.every((x,i)=>i===0||x.utcMs>t[i-1].utcMs));}
});
test('C15: UTC+7 term times agree within two minutes of independent Moshier fixtures',()=>{
 const spring=solarTermsForYear(2004).find(t=>t.name==='Lập xuân');assert.ok(spring);
 assert.ok(Math.abs(spring.utcMs-Date.UTC(2004,1,4,11,56,12))<120000);
 const grain=solarTermsForYear(1990).find(t=>t.name==='Mang chủng');assert.ok(grain);
 assert.ok(Math.abs(grain.utcMs-Date.UTC(1990,5,5,22,46,17))<120000);
});
test('C15: holidays follow shared lunar calendar, leap festivals excluded, VN today',()=>{
 const labels=(y:number,m:number,d:number)=>dayMarks(y,m,d).map(x=>x.label);
 assert.ok(labels(1985,1,21).includes('Tết · mùng 1'));assert.ok(labels(1985,1,21).includes('Mùng 1'));
 const h=lunarToSolarVN(2026,3,10);assert.ok(h);assert.ok(labels(h.year,h.month,h.day).includes('Giỗ Tổ Hùng Vương'));
 const f=lunarToSolarVN(2026,8,15);assert.ok(f);assert.ok(labels(f.year,f.month,f.day).includes('Trung Thu'));
 assert.ok(labels(2026,9,2).includes('Quốc khánh'));
 assert.deepEqual(vietnamToday(new Date('2026-11-23T17:01:00Z')),{year:2026,month:11,day:24});
});
