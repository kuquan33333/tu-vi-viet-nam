import assert from 'node:assert/strict';
import fs from 'node:fs';
const routes=['home','chart','hop-ban','lich-van-nien','library','cong-cu'];
for(const route of routes){const report=JSON.parse(fs.readFileSync('qa-artifacts/lighthouse/'+route+'.json','utf8'));
 const score=report.categories?.seo?.score;
 assert.equal(typeof score,'number',route+' no SEO score');
 console.log(route,Math.round(score*100));
 assert.ok(score>=0.95,route+' SEO below 95');
}

const misses=[];
for(const route of ['home','chart','lich-van-nien']){
 const report=JSON.parse(fs.readFileSync('qa-artifacts/lighthouse/'+route+'.json','utf8'));
 for(const [key,threshold] of [['accessibility',.95],['performance',.85]]){
  const score=report.categories?.[key]?.score;assert.equal(typeof score,'number',route+' '+key);
  console.log(route,key,Math.round(score*100));if(score<threshold)misses.push(route+' '+key+' '+score+' below '+threshold);
 }
}

assert.deepEqual(misses,[],'Accessibility/performance gates');
