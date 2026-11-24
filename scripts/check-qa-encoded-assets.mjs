// Static-export QA must serve dynamic Next.js chunk names containing [so].
// Browser builds encode those characters in requests as %5Bso%5D.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('out');
function walk(dir){
 return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  const p=path.join(dir,e.name);
  return e.isDirectory()?walk(p):[p];
 });
}
const files=walk(path.join(root,'_next','static'));
const chunk=files.find(p=>p.endsWith('.js')&&p.includes(path.sep+'[so]'+path.sep));
assert.ok(chunk,'Next.js exported [so] client chunk was not found');
const encoded='/'+path.relative(root,chunk).split(path.sep).map(encodeURIComponent).join('/');
assert.ok(encoded.includes('%5Bso%5D'),'Expected URL-encoded [so] segment');
const res=await fetch('http://127.0.0.1:4173'+encoded);
assert.equal(res.status,200,'Encoded client chunk must be served');
assert.ok((await res.text()).length>100,'Encoded client chunk was unexpectedly empty');
const page=await fetch('http://127.0.0.1:4173/thien-ky/que/1');
assert.equal(page.status,200,'Quẻ 1 must have an HTML page');
assert.match(await page.text(),/Thuần Càn/);
console.log('✓ Encoded Next.js [so] JavaScript chunk and quẻ page both return HTTP 200');
