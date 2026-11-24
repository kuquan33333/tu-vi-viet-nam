import assert from 'node:assert/strict';
import {test} from 'node:test';
import {generateChart} from '../../lib/ziwei/algorithm';
import {StarId,PalaceId,SiHuaId,BrightnessId,starId,palaceId,siHuaId,brightnessId} from '../../lib/ziwei/identity';
test('E5: independent IDs match Chinese and Vietnamese labels',()=>{
 assert.equal(starId('七杀'),StarId.QiSha);assert.equal(starId('Thất Sát'),StarId.QiSha);
 assert.equal(palaceId('财帛'),PalaceId.Wealth);assert.equal(palaceId('Tài Bạch'),PalaceId.Wealth);
 assert.equal(siHuaId('权'),SiHuaId.Quan);assert.equal(siHuaId('Quyền'),SiHuaId.Quan);
 assert.equal(brightnessId('庙'),BrightnessId.Miao);assert.equal(brightnessId('Miếu'),BrightnessId.Miao);
 assert.equal(starId('not-a-star'),undefined);
});
test('E5: chart carries IDs for 12 palaces, 14 major stars and transformations',()=>{
 for(const gender of ['male','female'] as const){
  const chart=generateChart({year:1990,month:5,day:6,hour:4,gender});
  assert.deepEqual(chart.palaces.map(p=>p.id).sort((a,b)=>Number(a)-Number(b)),Array.from({length:12},(_,i)=>i));
  const major=chart.palaces.flatMap(p=>p.stars.filter(s=>s.type==='major'));
  assert.deepEqual(major.map(s=>s.id).sort((a,b)=>Number(a)-Number(b)),Array.from({length:14},(_,i)=>i+1));
  for(const p of chart.palaces)for(const s of p.stars){
   if(s.siHua)assert.equal(s.siHuaId,siHuaId(s.siHua));
   if(s.brightnessRaw)assert.equal(s.brightnessId,brightnessId(s.brightnessRaw));
  }
 }
});
