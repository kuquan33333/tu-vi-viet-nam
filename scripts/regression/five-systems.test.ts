import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {calculateYuan,calculateHourChart} from '../../lib/triad/qimen-hour';
import {mountainFromBearing,calculateHouseChart} from '../../lib/triad/xuan-khong';
import {hexVietnamese,HEX_VI_JUDGEMENTS,HEX_VI_COMMENTARIES} from '../../lib/triad/iching-vi';
import provenance from '../../lib/triad/acupoint-provenance.generated.json';
import {MEDICAL_SOURCES} from '../../lib/triad/medical-sources';

test('Kỳ Môn – phù đầu: ba nguyên ứng với 60 Can Chi',()=>{
 assert.equal(calculateYuan('甲','子'),0);
 assert.equal(calculateYuan('甲','寅'),1);
 assert.equal(calculateYuan('甲','辰'),2);
 assert.throws(()=>calculateYuan('甲','丑'));
});
test('Kỳ Môn – đủ địa, thiên, sao, 8 môn/thần, trực phù & trực sử',()=>{
 const x=calculateHourChart(2026,11,24,12,0);
 assert.ok(x.term&&x.termTime&&x.zhifu&&x.zhishi);
 assert.ok(x.ju>=1&&x.ju<=9);
 assert.equal(x.palaces.length,9);
 assert.deepEqual([...new Set(x.palaces.map(p=>p.index))].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9]);
 assert.equal(new Set(x.palaces.map(p=>p.dia)).size,9);
 assert.equal(x.palaces.filter(p=>p.mon).length,8);
 assert.equal(x.palaces.filter(p=>p.than).length,8);
 for(const p of x.palaces)assert.ok(p.sao&&p.dia);
});
test('Kỳ Môn – đổi cục theo tiết khí và chống đầu vào giả',()=>{
 const winter=calculateHourChart(2026,1,16,10,0);
 const summer=calculateHourChart(2026,8,16,10,0);
 assert.equal(winter.dun,'Dương độn');
 assert.equal(summer.dun,'Âm độn');
 assert.throws(()=>calculateHourChart(2026,2,30,10,0));
 assert.throws(()=>calculateHourChart(2026,1,1,24,0));
});
test('Huyền Không – định 24 sơn theo góc hướng và ba bàn có chín sao',()=>{
 assert.equal(mountainFromBearing(0),'子');
 assert.equal(mountainFromBearing(180),'午');
 assert.throws(()=>mountainFromBearing(360));
 const a=calculateHouseChart(2015,5,20,180);
 assert.equal(a.period,8);
 assert.equal(a.palaces.length,9);
 for(const key of ['periodStar','mountainStar','waterStar'] as const){
  assert.deepEqual(a.palaces.map(p=>p[key]).sort((x,y)=>x-y),[1,2,3,4,5,6,7,8,9]);
 }
});
test('Huyền Không – vận 8/9 qua Lập Xuân và không nhận ngày sai',()=>{
 const before=calculateHouseChart(2024,2,3,180);
 const after=calculateHouseChart(2024,2,6,180);
 assert.equal(before.period,8);
 assert.equal(after.period,9);
 assert.throws(()=>calculateHouseChart(2024,2,30,180));
});
test('Kinh Dịch – đủ 64 dịch ý và bình giải biên soạn, chưa nhận là hiệu đính chuyên gia',()=>{
 assert.equal(HEX_VI_JUDGEMENTS.length,64);
 assert.equal(HEX_VI_COMMENTARIES.length,64);
 for(let i=1;i<=64;i++){
  const x=hexVietnamese(i);
  assert.ok(x?.judgement.length&&x.commentary.length,i+' missing');
  assert.equal(x?.reviewedByExpert,false);
 }
 assert.equal(hexVietnamese(65),null);
});
test('Huyệt đạo – 361 mã đối chiếu, không tráo thành 361 vị trí lâm sàng',()=>{
 assert.equal(provenance.pointCodeMatch,361);
 assert.equal(provenance.points.length,361);
 assert.equal(new Set(provenance.points.map(p=>p.code)).size,361);
 assert.equal(provenance.clinicallyVerifiedLocations,0);
 assert.equal(provenance.variantReviewCount,277);
 assert.ok(provenance.points.every(p=>p.indexMatched&&!p.anatomicalLocationVerified));
});
test('Y thư – liên kết nguồn, không chép tài liệu WHO có bản quyền',()=>{
 assert.equal(MEDICAL_SOURCES.length,4);
 assert.ok(MEDICAL_SOURCES.every(x=>x.url.startsWith('https://zh.wikisource.org/')));
 const medical=readFileSync('lib/triad/medical-sources.ts','utf8');
 assert.doesNotMatch(medical,/acupuncture depth|needling depth|needle insertion/i);
 const s=readFileSync('app/nhan-ky/page.tsx','utf8');
 assert.match(s,/clinicallyVerifiedLocations/);
 assert.doesNotMatch(s,/\$\{acupointAudit/);
});
