// Test-only local server for Pages-style clean URLs and the generated _redirects.
// This is NOT proof of HTTP behavior on the Cloudflare edge.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {gzipSync,brotliCompressSync,constants} from 'node:zlib';
const compressed=new Map();
const root=path.resolve('out');
const redirects=new Map(fs.readFileSync(path.join(root,'_redirects'),'utf8').split(/\r?\n/).filter(s=>s.trim()&&!s.startsWith('#')).map(s=>{const [a,b,c]=s.trim().split(/\s+/);return [a,{to:b,status:Number(c)}]}));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.txt':'text/plain; charset=utf-8','.xml':'application/xml','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};
http.createServer((req,res)=>{
 let url;
 try{url=new URL(req.url,'http://127.0.0.1');}catch{res.writeHead(400);return res.end();}
 // URL.pathname retains percent encoding (e.g. %5Bso%5D), while Next.js
 // exports route-specific JS chunks under physical folders named [so].
 // Decode once before mapping to the filesystem; otherwise pages may SSR as 200
 // yet never hydrate because their client chunk responds with 404.
 let decodedPath;
 try{decodedPath=decodeURIComponent(url.pathname);}catch{res.writeHead(400);return res.end('Đường dẫn không hợp lệ');}
 if(decodedPath.includes(String.fromCharCode(0))||decodedPath.includes(String.fromCharCode(92))){res.writeHead(400);return res.end('Đường dẫn không hợp lệ');}
 const pathname=decodedPath.replace(/\/$/,'')||'/';
 const redir=redirects.get(pathname);
 if(redir){res.writeHead(redir.status,{Location:redir.to+url.search});return res.end();}
 const file=path.resolve(root,'.'+decodedPath);
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(400);return res.end();}
 const candidate=[file,file+'.html',path.join(file,'index.html')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
 if(!candidate){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});return res.end(fs.existsSync(path.join(root,'404.html'))?fs.readFileSync(path.join(root,'404.html')):'Không tìm thấy trang');}
 const ext=path.extname(candidate),headers={'Content-Type':mime[ext]||'application/octet-stream','Vary':'Accept-Encoding'};
 // Pages/CDNs deliver compressed text assets when the browser supports it.
 // Local QA reproduces transfer size; still measures uncompressed parse/CPU work.
 if(['.html','.css','.js','.json','.txt','.xml','.svg'].includes(ext)){
  const accept=req.headers['accept-encoding']||'',encoding=/\bbr\b/.test(accept)?'br':/\bgzip\b/.test(accept)?'gzip':'';
  if(encoding){const key=candidate+'|'+encoding;if(!compressed.has(key)){const raw=fs.readFileSync(candidate);compressed.set(key,encoding==='br'?brotliCompressSync(raw,{params:{[constants.BROTLI_PARAM_QUALITY]:5}}):gzipSync(raw));}
   const buf=compressed.get(key);res.writeHead(200,{...headers,'Content-Encoding':encoding,'Content-Length':buf.length});return res.end(buf);
  }
 }
 res.writeHead(200,headers);fs.createReadStream(candidate).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log('Static QA server: http://127.0.0.1:4173'));
