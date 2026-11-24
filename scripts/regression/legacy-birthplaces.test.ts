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

import {DISTRICT_REFERENCE} from '../../lib/ziwei/district-reference.generated';
import {formToBirthInfo,formToSearchParams,searchParamsToForm} from '../../lib/ziwei/share';
import type {BirthFormState} from '../../components/BirthForm';
test('C5: source-coded district reference inventory and explicit selection',()=>{
 const missing=LEGACY_BIRTHPLACES.filter(x=>!DISTRICT_REFERENCE[x.code]).map(x=>x.code).sort();
 assert.equal(Object.keys(DISTRICT_REFERENCE).length,686);
 assert.deepEqual(missing,['049','224','407','474','475','602','655','682','726','769']);
 for(const [code,r] of Object.entries(DISTRICT_REFERENCE)){
  assert.ok(LEGACY_BIRTHPLACES.some(x=>x.code===code));
  assert.ok(r.longitude>=102&&r.longitude<=117&&Number.isInteger(r.geonamesId)&&r.geonamesId>0);
 }
 assert.deepEqual(DISTRICT_REFERENCE['001'],{longitude:105.8284,geonamesId:1905121});
 const c=birthLocationsForProvince('Tỉnh Gia Lai').find(x=>x.legacyCode&&x.name.includes('Krông Pa'));
 assert.ok(c?.reference);assert.ok(Number.isNaN(c.longitude));
 const f:BirthFormState={name:'',year:'1990',month:'5',day:'6',clockHour:'8',clockMinute:'0',unknownTime:false,province:'Tỉnh Gia Lai',city:c.name,longitude:c.reference.longitude,longitudeReferenceId:c.reference.geonamesId,gender:'male'};
 assert.equal(formToBirthInfo(f).longitudeReferenceId,c.reference.geonamesId);
 assert.equal(searchParamsToForm(formToSearchParams(f))?.longitudeReferenceId,c.reference.geonamesId);
});
