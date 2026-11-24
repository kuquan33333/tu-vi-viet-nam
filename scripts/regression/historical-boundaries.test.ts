import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getVietnamDSTInfo,resolveHistoricalCivilTime} from '../../lib/ziwei/dst-vn';
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

test('E7: giờ lặp và giờ không tồn tại tại ranh đổi giờ IANA',()=>{
 const cases:[number,number,number,number,number,boolean,number[]][]=[
 [1945,3,14,23,30,true,[]],[1945,3,14,23,30,false,[]],
 [1945,9,1,22,30,true,[420,540]],[1945,9,1,22,30,false,[420,540]],
 [1947,4,1,0,30,true,[]],[1947,4,1,0,30,false,[]],
 [1955,7,1,0,30,true,[420,480]],[1955,7,1,0,30,false,[420]],
 [1959,12,31,23,30,true,[]],[1959,12,31,23,30,false,[420]],
 [1975,6,12,23,30,true,[420,480]],[1975,6,12,23,30,false,[420]],
 ];
 for(const [y,m,d,h,min,south,expected] of cases)assert.deepEqual(resolveHistoricalCivilTime(y,m,d,h,min,0,south).offsets,expected,[y,m,d,h,min,south].join('/'));
 assert.equal(resolveHistoricalCivilTime(1954,10,15,12,0,0,false).uncertain,true);
});
