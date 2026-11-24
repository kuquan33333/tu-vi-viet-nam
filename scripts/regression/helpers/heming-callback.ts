import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
import {generateChart} from '../../../lib/ziwei/algorithm';
import {formToBirthInfo,birthFormProblem} from '../../../lib/ziwei/share';
import type {BirthFormState} from '../../../components/BirthForm';
import type {ZiweiChart} from '../../../lib/ziwei/types';

// The V2 product deliberately removed the server SSE request.
// Extract and run the actual synchronous page callback, not an invented replacement.
const route=existsSync('app/hop-ban/page.tsx')?'app/hop-ban/page.tsx':'app/heming/page.tsx';
const source=readFileSync(route,'utf8');
const ast=ts.createSourceFile(route,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const find=(name:string):ts.FunctionDeclaration=>{
 let found:ts.FunctionDeclaration|undefined;
 function walk(n:ts.Node){if(ts.isFunctionDeclaration(n)&&n.name?.text===name)found=n;ts.forEachChild(n,walk);}
 walk(ast);assert.ok(found,'Missing callback '+name);return found;
};
const complete=find('complete').getText(ast),run=find('run').getText(ast);
const moduleCode='exports.makeRun = function(ctx){const {formA,formB,generateChart,formToBirthInfo,birthFormProblem,setError,setMessage,setChartA,setChartB,window,fetch} = ctx;\n'+complete+'\n'+run+'\nreturn run;}';
const exp:{makeRun?:(ctx:object)=>()=>void}={};
new Function('exports',ts.transpileModule(moduleCode,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(exp);
assert.ok(exp.makeRun);
export const formAt=(year:string,name:string):BirthFormState=>({year,month:'1',day:'15',clockHour:'8',clockMinute:'0',gender:'male',unknownTime:false,name,province:'Tỉnh Gia Lai',city:'TP. Pleiku',longitude:108});
export function invoke(formA:BirthFormState|null,formB:BirthFormState|null){
 let a:ZiweiChart|null=null,b:ZiweiChart|null=null,error='',networkCalls=0,scrollCalls=0;
 exp.makeRun!({formA,formB,generateChart,formToBirthInfo,birthFormProblem,setError:(v:string)=>{error=v;},setMessage:()=>{},setChartA:(v:ZiweiChart)=>{a=v;},setChartB:(v:ZiweiChart)=>{b=v;},window:{scrollTo:()=>{scrollCalls++;}},fetch:()=>{networkCalls++;throw Error('Unexpected network request');}})();
 return {a:a as ZiweiChart|null,b:b as ZiweiChart|null,error,networkCalls,scrollCalls};
}
