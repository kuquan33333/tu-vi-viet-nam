import sharp from 'sharp';
import {readFileSync} from 'node:fs';
const emblem=readFileSync('public/brand/emblem.webp');
await sharp(emblem).resize(180,180,{fit:'contain',background:'#fff5df'}).png().toFile('public/brand/apple-touch.png');
await sharp(emblem).resize(250,250,{fit:'contain',background:'#faeed8'}).png().toBuffer().then(async logo=>{
 const svg=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#faeed8"/><rect x="23" y="23" width="1154" height="584" rx="18" stroke="#c49a60" fill="none" stroke-width="3"/><rect x="32" y="32" width="1136" height="566" rx="14" stroke="#c49a60" fill="none"/><text x="600" y="360" text-anchor="middle" font-family="DejaVu Serif,serif" font-size="68" font-weight="bold" fill="#8c1717">Tử Vi Việt Nam</text><text x="600" y="420" text-anchor="middle" font-family="DejaVu Serif,serif" font-size="34" font-style="italic" fill="#142b4b">Thư quán phương Đông</text><path d="M260 455H940" stroke="#a56c25" stroke-width="2"/><text x="600" y="505" text-anchor="middle" font-family="DejaVu Sans,sans-serif" font-size="24" fill="#142b4b">Lá số · Lịch Vạn Niên · Cổ thư</text></svg>');
 await sharp(svg).composite([{input:logo,top:67,left:475}]).png().toFile('public/og-default.png');
});
