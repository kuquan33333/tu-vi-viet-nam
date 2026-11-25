import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
const read=(p:string)=>readFileSync(p,'utf8');
test('D5/D8: reusable date and clock fields, SVG icon controls and mobile layout',()=>{
 assert.match(read('components/BirthForm.tsx'),/<BirthDateFields/);
 assert.match(read('components/BirthForm.tsx'),/<BirthClockInput/);
 assert.match(read('components/TermTooltip.tsx'),/<Icon name="info"/);
 assert.match(read('app/chart/page.tsx'),/mobile-palaces/);
 assert.match(read('app/page.tsx'),/generateChart\(/);
 assert.equal((read('app/page.tsx').match(/<ButtonLink href="\/chart" variant="primary"/g)||[]).length,1);
});
test('D10: no remote font or telemetry and static security/cache headers',()=>{
 assert.doesNotMatch(read('app/layout.tsx'),/fonts\.googleapis|<Analytics|<SpeedInsights/);
 const h=read('public/_headers');for(const key of ['Content-Security-Policy','X-Content-Type-Options','Referrer-Policy','frame-ancestors','Cache-Control: public, max-age=31536000, immutable'])assert.ok(h.includes(key),key);
 assert.match(read('app/revamp.css'),/size:A4 landscape/);
});
