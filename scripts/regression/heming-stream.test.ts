import assert from 'node:assert/strict';
import {formAt,invoke} from './helpers/heming-callback';
import {compareCharts,getSynastryFacts} from '../../lib/ziwei/client-reading';
// Previous SSE parser belonged to the deleted client request, not this offline V2.
// Keep regression coverage of the replacement: valid/invalid input, 12 rows, no network.
const form=formAt('1990','A'),other=formAt('1995','B');
for(const invalid of [null,{...form,day:'32'},{...form,clockHour:''}]){
 const result=invoke(invalid,other);
 assert.ok(result.error);assert.equal(result.a,null);assert.equal(result.b,null);
 assert.equal(result.networkCalls,0);assert.equal(result.scrollCalls,0);
}
const result=invoke(form,other);
assert.ok(result.a&&result.b);assert.equal(result.error,'');assert.equal(result.networkCalls,0);assert.equal(result.scrollCalls,1);
const rows=compareCharts(result.a,result.b);
assert.equal(rows.length,12);assert.equal(new Set(rows.map(r=>r.name)).size,12);
for(const r of rows){
 assert.deepEqual([...r.shared,...r.uniqueA].sort(),[...r.a].sort());
 assert.deepEqual([...r.shared,...r.uniqueB].sort(),[...r.b].sort());
}
assert.deepEqual(getSynastryFacts(result.a,result.b).rows,rows);
console.log('Hợp bàn offline: kiểm tra đầu vào và phân hoạch 12 cung, không phụ thuộc SSE.');
