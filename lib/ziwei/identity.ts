/** Stable identities for calculation, independent of translated UI labels.
 * Numeric IDs of the school tables are retained; unknown stars are not guessed.
 * Existing persisted charts lacking IDs are accepted through the compatibility functions.
 */
import {SCHOOL_NAME_TO_ID} from './school-data';
export enum StarId {
 ZiWei=1,TianJi=2,TaiYang=3,WuQu=4,TianTong=5,LianZhen=6,TianFu=7,TaiYin=8,TanLang=9,JuMen=10,TianXiang=11,TianLiang=12,QiSha=13,PoJun=14,
 WenChang=15,WenQu=16,ZuoFu=17,YouBi=18,TianKui=19,TianYue=20,LuCun=21,TianMa=22,HuoXing=23,LingXing=24,QingYang=25,TuoLuo=26,DiKong=27,DiJie=28,
 TianFuBlessing=29,TianGuan=30,TianXing=31,BaZuo=32,SanTai=33,TianCai=34,TianKong=37,TianYao=38,TianKu=39,TianXi=40,TianXu=41,TianGui=42,TianShou=43,TianDe=45,GuChen=48,HongLuan=51,EnGuang=52,PoSui=53,HuaGai=55,JieShen=56,GuaSu=57,FengGe=58,FeiLian=59,LongChi=60,DaHao=62,TianShi=64,TianShang=65,
 JieKong=77,FuXun=78,NianJie=79,YinSha=80,LongDe=81,XianChi=82
}
export enum PalaceId {Life=0,Siblings=1,Spouse=2,Children=3,Wealth=4,Health=5,Travel=6,Friends=7,Career=8,Property=9,Fortune=10,Parents=11,Body=12}
export enum SiHuaId {Lu=1,Quan=2,Ke=3,Ji=4}
export enum BrightnessId {Miao=1,Wang=2,De=3,Li=4,Ping=5,Bu=6,Xian=7,XianLeisure=8,Di=9}
const palaceAliases:Record<string,PalaceId>={'命宫':0,'Mệnh':0,'兄弟':1,'Huynh Đệ':1,'夫妻':2,'Phu Thê':2,'子女':3,'Tử Tức':3,'财帛':4,'Tài Bạch':4,'疾厄':5,'Tật Ách':5,'迁移':6,'Thiên Di':6,'交友':7,'仆役':7,'奴仆':7,'Nô Bộc':7,'Nô Bộc (Giao Hữu)':7,'官禄':8,'事业':8,'Quan Lộc':8,'田宅':9,'Điền Trạch':9,'福德':10,'Phúc Đức':10,'父母':11,'Phụ Mẫu':11,'身宫':12,'Thân':12};
const siHuaAliases:Record<string,SiHuaId>={'禄':1,'Lộc':1,'权':2,'Quyền':2,'科':3,'Khoa':3,'忌':4,'Kỵ':4};
const brightnessAliases:Record<string,BrightnessId>={'庙':1,'Miếu':1,'旺':2,'Vượng':2,'得':3,'Đắc':3,'Đắc Địa':3,'利':4,'Lợi':4,'平':5,'Bình':5,'Bình Hòa':5,'不':6,'Bất':6,'陷':7,'Hãm':7,'Hãm Địa':7,'闲':8,'Nhàn':8,'地':9,'Địa':9};
export function starId(name:string):StarId|undefined{return SCHOOL_NAME_TO_ID[name] as StarId|undefined;}
export function palaceId(name:string):PalaceId|undefined{return palaceAliases[name];}
export function siHuaId(name:string|undefined):SiHuaId|undefined{return name===undefined?undefined:siHuaAliases[name];}
export function brightnessId(name:string|undefined):BrightnessId|undefined{return name===undefined?undefined:brightnessAliases[name];}
