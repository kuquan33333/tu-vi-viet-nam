import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getVietnamDSTInfo} from '../../lib/ziwei/dst-vn';
test('E7: offset trước 1911 theo IANA tzdb 2025b',()=>{
 assert.equal(getVietnamDSTInfo(1900,1,1,true)?.actualOffsetMinutes,426.5);
 assert.equal(getVietnamDSTInfo(1900,1,1,false)?.actualOffsetMinutes,423.4);
 assert.equal(getVietnamDSTInfo(1910,1,1,true)?.actualOffsetMinutes,426.5);
});
test('E7: 6 mốc ngày lịch sử tại 12h (IANA Asia/Hanoi và Asia/Ho_Chi_Minh)',()=>{
 for(const [y,m,d,n,s] of [[1945,3,14,480,480],[1945,9,1,540,540],[1947,4,1,480,480],[1955,6,30,420,480],[1959,12,31,420,420],[1975,6,12,420,480]]) {
 assert.equal(getVietnamDSTInfo(y,m,d,false)?.actualOffsetMinutes??420,n);
 assert.equal(getVietnamDSTInfo(y,m,d,true)?.actualOffsetMinutes??420,s);
 }
});
