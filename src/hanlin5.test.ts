import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questions,units,prepare,buildRound,validate} from './hanlin5/questions';
import {empty,parseProgress,record,storageKey,summarize} from './hanlin5/progress';
import {key as math3Key} from './progress';
import {storageKey as math5Key} from './grade5/progress';
import {storageKey as socialKey} from './social3/progress';
import {storageKey as scienceKey} from './science3/progress';
import {resolveCourse,courseUrl} from './courseSelection';
const seeded=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
for(const q of questions)test(`Hanlin ${q.id}: answer contract and shuffled presentation`,()=>{
 assert.ok(q.unit>=0&&q.unit<6);assert.ok(q.prompt&&q.topic&&q.steps.length&&q.hints.length===2);
 assert.equal(new Set(q.options).size,q.options.length);assert.equal(new Set(q.answer).size,q.answer.length);assert.ok(q.answer.every(a=>q.options.includes(a)));
 assert.ok(validate(q,q.answer));assert.ok(!validate(q,[]));assert.ok(!validate(q,['不在選項裡的答案']));assert.ok(!validate(q,[...q.answer,q.answer[0]]));
 if(q.kind==='choice'){assert.equal(q.answer.length,1);for(const wrong of q.options.filter(o=>!q.answer.includes(o)))assert.ok(!validate(q,[wrong]))}
 if(q.kind==='multi'){assert.ok(q.answer.length>1);for(let mask=0;mask<2**q.options.length;mask++){const picked=q.options.filter((_,i)=>mask&(1<<i));const correct=picked.length===q.answer.length&&picked.every(o=>q.answer.includes(o));assert.equal(validate(q,picked),correct)}assert.ok(validate(q,[...q.answer].reverse()))}
 if(q.kind==='order'){assert.equal(q.answer.length,q.options.length);assert.ok(!validate(q,[...q.answer].reverse()))}
 const original=JSON.stringify(q);for(let seed=1;seed<=30;seed++){const shuffled=prepare(q,seeded(seed));assert.deepEqual([...shuffled.options].sort(),[...q.options].sort());assert.ok(validate(shuffled,q.answer));if(q.kind==='order')assert.notDeepEqual(shuffled.options,q.answer)}assert.equal(JSON.stringify(q),original);
});


test('Hanlin five follows supplied six-unit scope with 48 unique questions',()=>{
 assert.deepEqual(units.map(u=>u.name),['折線圖','倍數與因數','平面圖形','公倍數與公因數','立體形體','整數四則運算']);assert.equal(questions.length,48);assert.equal(new Set(questions.map(q=>q.id)).size,48);assert.equal(new Set(questions.map(q=>q.prompt)).size,48);for(let i=0;i<6;i++){assert.equal(questions.filter(q=>q.unit===i).length,8);assert.deepEqual(new Set(questions.filter(q=>q.unit===i).map(q=>q.kind)),new Set(['choice','multi','order']))}assert.deepEqual(empty().selected,[0,1,2,3,4,5]);
});
test('All 63 scopes produce balanced nonduplicated rounds',()=>{
 for(let mask=1;mask<64;mask++){const selected=units.map((_,i)=>i).filter(i=>mask&(1<<i));const qs=buildRound(selected,18,undefined,seeded(mask));assert.equal(qs.length,Math.min(18,selected.length*8));assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);assert.ok(qs.every(q=>selected.includes(q.unit)));const counts=selected.map(i=>qs.filter(q=>q.unit===i).length);assert.ok(Math.min(...counts)>0);assert.ok(Math.max(...counts)-Math.min(...counts)<=1)}assert.throws(()=>buildRound([]));assert.throws(()=>buildRound([0],18,['不存在']));
});
test('Independent arithmetic and shape checks cover chart, solids and operation order',()=>{
 const chart=[0,10,30,20,30];const expected:Record<string,string[]>={'0:read':[String(chart[2])],'0:fall':[String(chart[2]-chart[3])],'0:total':[String(chart.slice(0,3).reduce((a,b)=>a+b,0))],'1:multiple':[String(7*6)],'2:angle':[String(180-50-60)+'°'],'2:quad':[String(360-80-90-100)+'°'],'2:isosceles':[String((180-40)/2)+'°'],'3:gcd':['12'],'3:lcm':['24'],'3:contents':[String(20/10)],'4:prism':[String(2+3)],'4:pyramid':[String(4+1)],'4:edges':[String(4*3)],'4:pentagon':[String(5+2)],'5:priority':[String(120-24/6*3)],'5:bracket':[String((120-24)/6)],'5:left':[String(72/8*3)],'5:shopping':[String(200-45*3)],'5:divide':[String(5*12/4)],'5:clever':[String(99*37+37)]};for(const [id,answer] of Object.entries(expected))assert.deepEqual(questions.find(q=>q.id===`H5:${id}`)!.answer,answer);
});
test('New Hanlin five storage preserves all six units and is separate from original Kang Hsuan',()=>{
 assert.notEqual(storageKey,math5Key);assert.notEqual(storageKey,math3Key);const p=empty(),q=questions[47];p.attempts=[record(q,[q.answer],0)];p.mistakes=[q.id];p.passed=[0,5];assert.deepEqual(parseProgress(JSON.stringify(p)),p);assert.deepEqual(parseProgress('{bad'),empty());assert.deepEqual(parseProgress(JSON.stringify({...p,selected:[],passed:[6,5]})).passed,[5]);assert.deepEqual(parseProgress(JSON.stringify({...p,selected:[]})).selected,[]);
});
