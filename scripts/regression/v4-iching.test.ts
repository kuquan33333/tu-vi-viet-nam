import assert from 'node:assert/strict';
import {test} from 'node:test';
import {HEXAGRAMS,hexFromLines,changedLines,type LineValue} from '../../lib/triad/iching';
import {hexText} from '../../lib/triad/iching-text';
test('C13: 64 sourced entries with six line texts, 64 unique diagrams',()=>{
 assert.equal(HEXAGRAMS.length,64);
 for(const h of HEXAGRAMS){const t=hexText(h.number);assert.ok(t);assert.equal(t.bits,h.lower.bits+h.upper.bits,h.name);assert.equal(t.lines.length,6);assert.ok(t.guaCi&&t.tuan&&t.xiang);assert.ok(t.lines.every(l=>l.content));}
});
test('C13: all 4096 possible line casts, transformed result and reversibility',()=>{
 for(let k=0;k<4096;k++){const lines=Array.from({length:6},(_,i)=>(6+((k>>(2*i))&3)) as LineValue);const a=hexFromLines(lines),b=hexFromLines(changedLines(lines));assert.ok(a&&b);const bits=lines.map(v=>v===6||v===7?'1':'0').join('');assert.equal(b.lower.bits+b.upper.bits,bits);}
 assert.throws(()=>hexFromLines([1,2,3,4,5,6]));
});
