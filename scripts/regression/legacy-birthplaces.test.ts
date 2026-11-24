import assert from 'node:assert/strict';
import {test} from 'node:test';
import {LEGACY_BIRTHPLACES,birthLocationsForProvince,searchBirthplaces,birthRegion} from '../../lib/ziwei/legacy-birthplaces';
import {PROVINCES} from '../../lib/ziwei/cities';
test('C5: 696 former districts, mapped to exactly 34 current provinces',()=>{
 assert.equal(LEGACY_BIRTHPLACES.length,696);
 assert.equal(new Set(LEGACY_BIRTHPLACES.map(x=>x.code)).size,696);
 assert.equal(new Set(LEGACY_BIRTHPLACES.map(x=>x.currentProvince)).size,34);
 for(const x of LEGACY_BIRTHPLACES)assert.ok(PROVINCES.some(p=>p.name===x.currentProvince),x.code);
 for(const [q,target] of [['krong pa','Tỉnh Gia Lai'],['dak glong','Tỉnh Lâm Đồng'],['tu mo rong','Tỉnh Quảng Ngãi'],['quang ninh quang binh','Tỉnh Quảng Trị']]){
  assert.ok(searchBirthplaces(q).some(x=>x.p.name===target),q);
 }
});
test('C5/E7: unknown historic district longitude or north/south must not be guessed',()=>{
 const c=birthLocationsForProvince('Tỉnh Gia Lai').find(x=>x.legacyCode&&x.name.includes('Krông Pa'));assert.ok(c&&c.requiresLongitude);assert.ok(Number.isNaN(c.longitude));
 assert.equal(birthRegion('Tỉnh Quảng Trị','Địa danh khác (nhập kinh độ)'),undefined);
 assert.equal(birthRegion('Tỉnh Quảng Trị','Địa danh khác (nhập kinh độ)','south'),true);
 assert.equal(birthRegion('Tỉnh Quảng Trị','Địa danh khác (nhập kinh độ)','north'),false);
 assert.equal(birthRegion('Tỉnh Quảng Trị','TP. Đông Hà (Nam vĩ tuyến 17)'),true);
 const qb=birthLocationsForProvince('Tỉnh Quảng Trị').find(x=>x.oldProvince==='Tỉnh Quảng Bình');assert.ok(qb);
 assert.equal(birthRegion('Tỉnh Quảng Trị',qb.name),false);
});
