import data from './iching-text.generated.json';
export const HEX_TEXT_SOURCE='https://github.com/qingshano/yijing-data/blob/85479622197efde01d98199ded59a91871e12660/source/gua_data.json';
export function hexText(number:number){return data.find(x=>x.id===number);}
