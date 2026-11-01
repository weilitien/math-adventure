import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questions,units,prepare,buildRound,validate} from './hanlin3/questions';
import {empty,parseProgress,record,storageKey,summarize} from './hanlin3/progress';
import {key as math3Key} from './progress';
import {storageKey as math5Key} from './grade5/progress';
import {storageKey as socialKey} from './social3/progress';
import {storageKey as scienceKey} from './science3/progress';
import {resolveCourse,courseUrl} from './courseSelection';
const seeded=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
for(const q of questions)test(`Hanlin ${q.id}: answer contract and shuffled presentation`,()=>{
 assert.ok(q.unit>=0&&q.unit<9);assert.ok(q.prompt&&q.topic&&q.steps.length&&q.hints.length===2);
 assert.equal(new Set(q.options).size,q.options.length);assert.equal(new Set(q.answer).size,q.answer.length);assert.ok(q.answer.every(a=>q.options.includes(a)));
 assert.ok(validate(q,q.answer));assert.ok(!validate(q,[]));assert.ok(!validate(q,['不在選項裡的答案']));assert.ok(!validate(q,[...q.answer,q.answer[0]]));
 if(q.kind==='choice'){assert.equal(q.answer.length,1);for(const wrong of q.options.filter(o=>!q.answer.includes(o)))assert.ok(!validate(q,[wrong]))}
 if(q.kind==='multi'){assert.ok(q.answer.length>1);for(let mask=0;mask<2**q.options.length;mask++){const picked=q.options.filter((_,i)=>mask&(1<<i));const correct=picked.length===q.answer.length&&picked.every(o=>q.answer.includes(o));assert.equal(validate(q,picked),correct)}assert.ok(validate(q,[...q.answer].reverse()))}
 if(q.kind==='order'){assert.equal(q.answer.length,q.options.length);assert.ok(!validate(q,[...q.answer].reverse()))}
 const original=JSON.stringify(q);for(let seed=1;seed<=30;seed++){const shuffled=prepare(q,seeded(seed));assert.deepEqual([...shuffled.options].sort(),[...q.options].sort());assert.ok(validate(shuffled,q.answer));if(q.kind==='order')assert.notDeepEqual(shuffled.options,q.answer)}assert.equal(JSON.stringify(q),original);
});

test('Nine units contain 54 unique original questions and five visual types',()=>{
 assert.equal(units.length,9);assert.equal(questions.length,54);assert.equal(new Set(questions.map(q=>q.id)).size,54);assert.equal(new Set(questions.map(q=>q.prompt)).size,54);for(let i=0;i<9;i++){const qs=questions.filter(q=>q.unit===i);assert.equal(qs.length,6);assert.deepEqual(new Set(qs.map(q=>q.kind)),new Set(['choice','multi','order']))}assert.equal(new Set(questions.filter(q=>q.visual).map(q=>q.visual)).size,5);
});
test('All 511 scopes generate balanced, unique rounds limited to selected units',()=>{
 for(let mask=1;mask<512;mask++){const selected=units.map((_,i)=>i).filter(i=>mask&(1<<i));const qs=buildRound(selected,18,undefined,seeded(mask));assert.equal(qs.length,Math.min(18,selected.length*6));assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);assert.ok(qs.every(q=>selected.includes(q.unit)));const counts=selected.map(i=>qs.filter(q=>q.unit===i).length);assert.ok(Math.min(...counts)>0);assert.ok(Math.max(...counts)-Math.min(...counts)<=1)}assert.throws(()=>buildRound([]));assert.throws(()=>buildRound([0],6,['不存在的主題']));assert.ok(buildRound([2],18,['數線']).every(q=>q.topic==='數線'&&q.unit===2));
});
test('Independent arithmetic checks verify place value, operations and conversions',()=>{
 const expected:Record<string,string[]>={'0:place':[String(7*1000)],'0:money':[String(3*1000+4*100+2*10)],'1:add':[String(2685+1478)],'1:subtract':[String(5000-2687)],'1:missing':[String(350-128)],'1:difference':[String(3250-2780)],'2:ruler':[String(37-12)],'2:convert':[String(4*10+6)],'2:lengthadd':[String(35+28)],'3:two':[String(24*7)],'3:three':[String(126*4)],'3:zero':[String(203*3)],'3:estimate':[String(200*4)],'5:group':[String(28/4)],'5:share':[String(36/4)],'5:vertical':[String(84/3)],'5:remainder':[`${Math.floor(29/4)} 盒，剩 ${29%4} 顆`],'6:convert':[String(2*1000+350)],'6:add':[String(2000+750)],'7:picture':['3/8'],'8:total':[String(12+18+15)],'8:number':[String(160+20)]};for(const [id,answer] of Object.entries(expected))assert.deepEqual(questions.find(q=>q.id===`H3:${id}`)!.answer,answer);
});
test('Hanlin storage is separate from original math and persists all nine units',()=>{
 assert.equal(new Set([storageKey,math3Key,math5Key,socialKey,scienceKey]).size,5);const p=empty(),q=questions[53];p.selected=[0,6,8];p.passed=[0,6,8];p.attempts=[record(q,[q.answer],0)];p.mistakes=[q.id];assert.deepEqual(parseProgress(JSON.stringify(p)),p);assert.deepEqual(parseProgress('{bad'),empty());assert.deepEqual(parseProgress(JSON.stringify({...p,selected:[],passed:[9,10,8]})).passed,[8]);assert.deepEqual(parseProgress(JSON.stringify({...p,selected:[]})).selected,[]);assert.deepEqual(summarize([record(q,[q.answer],0),record(q,[q.answer],1),record(q,[['wrong'],q.answer],0)]),{count:3,first:1,hinted:1,corrected:1,stars:18});
});
