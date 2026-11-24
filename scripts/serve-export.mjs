// Test-only local server for Pages-style clean URLs and the generated _redirects.
// This is NOT proof of HTTP behavior on the Cloudflare edge.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('out');
const redirects=new Map(fs.readFileSync(path.join(root,'_redirects'),'utf8').split(/\r?\n/).filter(s=>s.trim()&&!s.startsWith('#')).map(s=>{const [a,b,c]=s.trim().split(/\s+/);return [a,{to:b,status:Number(c)}]}));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.txt':'text/plain; charset=utf-8','.xml':'application/xml','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};
http.createServer((req,res)=>{
 let url;
 try{url=new URL(req.url,'http://127.0.0.1');}catch{res.writeHead(400);return res.end();}
 const pathname=url.pathname.replace(/\/$/,'')||'/';
 const redir=redirects.get(pathname);
 if(redir){res.writeHead(redir.status,{Location:redir.to+url.search});return res.end();}
 const file=path.resolve(root,'.'+url.pathname);
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(400);return res.end();}
 const candidate=[file,file+'.html',path.join(file,'index.html')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
 if(!candidate){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});return res.end(fs.existsSync(path.join(root,'404.html'))?fs.readFileSync(path.join(root,'404.html')):'Không tìm thấy trang');}
 res.writeHead(200,{'Content-Type':mime[path.extname(candidate)]||'application/octet-stream'});fs.createReadStream(candidate).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log('Static QA server: http://127.0.0.1:4173'));
