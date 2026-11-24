import assert from 'node:assert/strict';
import fs from 'node:fs';
const routes=['home','chart','hop-ban','lich-van-nien','library','cong-cu'];
for(const route of routes){const report=JSON.parse(fs.readFileSync('qa-artifacts/lighthouse/'+route+'.json','utf8'));
 const score=report.categories?.seo?.score;
 assert.equal(typeof score,'number',route+' no SEO score');
 console.log(route,Math.round(score*100));
 assert.ok(score>=0.95,route+' SEO below 95');
}
