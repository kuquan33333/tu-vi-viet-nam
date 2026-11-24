import assert from 'node:assert/strict';
import {HEXAGRAMS,castHexagram,changedLines,hexFromLines,TRIGRAMS} from '../lib/triad/iching';
import {buildEarthPlate,TERM_NAMES} from '../lib/triad/qimen';
import {mountainAt,directionAt,kuaFromYear,KUA} from '../lib/triad/fengshui';
import catalog from '../lib/triad/acupoint-catalog.json';
import {CANONS} from '../lib/triad/renji';

assert.equal(HEXAGRAMS.length,64);
assert.equal(new Set(HEXAGRAMS.map(x=>x.number)).size,64);
assert.equal(TRIGRAMS.length,8);
assert.equal(hexFromLines([7,7,7,7,7,7]).number,1,'Thuần Càn');
assert.equal(hexFromLines([8,8,8,8,8,8]).number,2,'Thuần Khôn');
assert.equal(hexFromLines([7,7,7,8,8,8]).number,11,'Địa Thiên Thái');
assert.equal(hexFromLines([8,8,8,7,7,7]).number,12,'Thiên Địa Bĩ');
assert.equal(hexFromLines([9,8,7,8,6,7]).number,hexFromLines([7,8,7,8,8,7]).number,'6/9 must preserve yin-yang before changing');
assert.deepEqual(changedLines([6,7,8,9,6,9]),[7,7,8,8,7,8]);
for(let i=0;i<24;i++)assert.equal(mountainAt(i*15).index,i);
assert.equal(directionAt(0).key,'N');
assert.equal(directionAt(90).key,'E');
assert.equal(directionAt(225).key,'SW');
assert.equal(mountainAt(0).name,'Tý');
assert.equal(mountainAt(180).name,'Ngọ');
assert.equal(mountainAt(359).name,'Tý');
assert.equal(kuaFromYear(1988,'nam').name,'Chấn');
assert.equal(kuaFromYear(1990,'nam').name,'Khảm');
assert.equal(kuaFromYear(2000,'nu').name,'Càn');
assert.equal(Object.keys(KUA).length,8);
for(const k of Object.values(KUA)){
 assert.equal(Object.keys(k.good).length,4);
 assert.equal(new Set(Object.values(k.good)).size,4);
 assert.equal(k.good['Phục Vị'],k.home);
}
assert.equal(TERM_NAMES.length,24);
for(const term of TERM_NAMES){
 for(const yuan of [0,1,2] as const){
  const p=buildEarthPlate(term,yuan);
  assert.equal(p.palaces.length,9);
  assert.equal(new Set(p.palaces.map(x=>x.index)).size,9);
  assert.equal(new Set(p.palaces.map(x=>x.earthStem)).size,9);
  assert.equal(p.palaces.find(x=>x.index===5)?.originalGate,'Không có môn');
 }
}
assert.equal(buildEarthPlate('Đông chí',0).ju,1);
assert.equal(buildEarthPlate('Hạ chí',0).ju,9);
assert.equal(buildEarthPlate('Đông chí',0).palaces.find(p=>p.index===1)?.earthStem,'Mậu');
assert.equal(catalog.channels.length,14);
const points=catalog.channels.reduce((n,ch)=>n+ch.names.length,0);
assert.equal(points,361);
assert.equal(CANONS.length,4);
assert.equal(CANONS.reduce((n,b)=>n+b.topics.length,0),16);
for(let i=0;i<30;i++)assert.equal(castHexagram().length,6);
console.log('✓ Three modules: 64 quẻ, 24 tiết khí, 24 sơn, 8 cung phi, 14 kinh, 361 huyệt, 16 chuyên đề.');
