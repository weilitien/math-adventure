import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questions,units,prepare,buildRound,validate} from './social3/questions';
import {empty,parseProgress,record,storageKey,summarize} from './social3/progress';
import {key as math3Key} from './progress';
import {storageKey as math5Key} from './grade5/progress';
import {storageKey as scienceKey} from './science3/progress';
import {tallyVote,resourceTasks,lifeTasks} from './social3/activityLogic';
import {resolveCourse,courseUrl} from './courseSelection';
const seeded=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
for(const q of questions)test(`Social ${q.id}: answer contract and shuffled presentation`,()=>{
 assert.ok(q.unit>=0&&q.unit<4);assert.ok(q.prompt&&q.topic&&q.steps.length&&q.hints.length===2);
 assert.equal(new Set(q.options).size,q.options.length);assert.equal(new Set(q.answer).size,q.answer.length);assert.ok(q.answer.every(a=>q.options.includes(a)));
 assert.ok(validate(q,q.answer));assert.ok(!validate(q,[]));assert.ok(!validate(q,['不在選項裡的答案']));assert.ok(!validate(q,[...q.answer,q.answer[0]]));
 if(q.kind==='choice'){assert.equal(q.answer.length,1);for(const wrong of q.options.filter(o=>!q.answer.includes(o)))assert.ok(!validate(q,[wrong]))}
 if(q.kind==='multi'){assert.ok(q.answer.length>1);for(let mask=0;mask<2**q.options.length;mask++){const picked=q.options.filter((_,i)=>mask&(1<<i));const correct=picked.length===q.answer.length&&picked.every(o=>q.answer.includes(o));assert.equal(validate(q,picked),correct)}assert.ok(validate(q,[...q.answer].reverse()))}
 if(q.kind==='order'){assert.equal(q.answer.length,q.options.length);assert.ok(!validate(q,[...q.answer].reverse()))}
 const original=JSON.stringify(q);for(let seed=1;seed<=30;seed++){const shuffled=prepare(q,seeded(seed));assert.deepEqual([...shuffled.options].sort(),[...q.options].sort());assert.ok(validate(shuffled,q.answer));if(q.kind==='order')assert.notDeepEqual(shuffled.options,q.answer)}assert.equal(JSON.stringify(q),original);
});
test('Social bank has 48 unique authored questions, 12 per unit and three interaction types',()=>{assert.equal(questions.length,48);assert.equal(new Set(questions.map(q=>q.id)).size,48);assert.equal(new Set(questions.map(q=>q.prompt)).size,48);for(let i=0;i<4;i++){const qs=questions.filter(q=>q.unit===i);assert.equal(qs.length,12);assert.deepEqual(new Set(qs.map(q=>q.kind)),new Set(['choice','multi','order']))}});
for(let mask=1;mask<16;mask++)test(`Social scope ${mask}: balanced, bounded, no duplicate questions`,()=>{const selected=units.map((_,i)=>i).filter(i=>mask&(1<<i));for(let seed=0;seed<20;seed++){const round=buildRound(selected,20,undefined,seeded(seed));assert.equal(round.length,Math.min(20,selected.length*12));assert.equal(new Set(round.map(q=>q.id)).size,round.length);assert.ok(round.every(q=>selected.includes(q.unit)));assert.ok(selected.every(i=>round.some(q=>q.unit===i)));const counts=selected.map(i=>round.filter(q=>q.unit===i).length);assert.ok(Math.max(...counts)-Math.min(...counts)<=1)}});
test('Review respects both unit selection and requested concepts; short pools do not duplicate',()=>{const qs=buildRound([0],20,['學習方法'],seeded(12));assert.ok(qs.every(q=>q.unit===0&&q.topic==='學習方法'));assert.equal(qs.length,questions.filter(q=>q.unit===0&&q.topic==='學習方法').length);assert.throws(()=>buildRound([],20));assert.throws(()=>buildRound([0],20,['班級自治']));assert.deepEqual(empty().selected,[0,1])});
test('Social records scoring accurately and snapshots submitted answers',()=>{const q=questions[0],answers=[[...q.answer]],first=record(q,answers,0),hinted=record(q,answers,1),corrected=record(q,[['wrong'],q.answer],0);answers[0].push('changed');assert.deepEqual(first.answers,[q.answer]);assert.deepEqual(summarize([first,hinted,corrected]),{count:3,first:1,corrected:1,hinted:1,stars:18})});
test('Social storage is separate, round trips, preserves empty scope and recovers corrupt records',()=>{assert.equal(new Set([storageKey,scienceKey,math3Key,math5Key]).size,4);const p=empty(),q=questions[0];p.attempts=[record(q,[q.answer],0)];p.mistakes=[q.id];p.passed=[0];p.selected=[];assert.deepEqual(parseProgress(JSON.stringify(p)),p);for(const raw of [null,'invalid','{}',JSON.stringify({...p,attempts:[{}]}),JSON.stringify({...p,attempts:[{...p.attempts[0],questionId:'missing'}]})])assert.deepEqual(parseProgress(raw),empty());assert.deepEqual(parseProgress(JSON.stringify({...p,mistakes:[q.id,q.id,'missing']})).mistakes,[q.id])});
test('Course routing preserves existing math links and explicit links override saved subject',()=>{assert.equal(resolveCourse('?grade=5','science3',null),'math5');assert.equal(resolveCourse('?grade=3','science3',null),'math3');assert.equal(resolveCourse('?grade=3&subject=science','math5','5'),'science3');assert.equal(resolveCourse('','science3','5'),'science3');assert.equal(resolveCourse('',null,'5'),'math5');assert.equal(resolveCourse('',null,null),'math3');assert.equal(resolveCourse('','invalid',null),'math3');const url=courseUrl('https://example.test/math-adventure/?grade=3&subject=science','math5');assert.equal(url.pathname,'/math-adventure/');assert.equal(url.searchParams.get('subject'),'math');assert.equal(url.searchParams.get('grade'),'5');assert.equal(resolveCourse(url.search,'science3',null),'math5')});

test('Social deep links and saved selection survive every subject switch',()=>{
 for(const course of ['math3','math5','science3','social3'] as const){const u=courseUrl('https://example.test/math-adventure/?grade=5&subject=social&keep=yes#map',course);assert.equal(resolveCourse(u.search,'social3','5'),course);assert.equal(u.searchParams.get('keep'),'yes');assert.equal(u.hash,'#map');assert.equal(resolveCourse('',course,null),course)}
 assert.equal(resolveCourse('?grade=3&subject=social','science3','5'),'social3');
 assert.equal(resolveCourse('?grade=3','social3',null),'math3');
});
test('Mock vote counts exactly one ballot, preserves ties and does not mutate starting votes',()=>{
 assert.deepEqual(tallyVote(null),{counts:[4,4,3],total:11,leaders:[0,1]});
 assert.deepEqual(tallyVote(0),{counts:[5,4,3],total:12,leaders:[0]});
 assert.deepEqual(tallyVote(1),{counts:[4,5,3],total:12,leaders:[1]});
 assert.deepEqual(tallyVote(2),{counts:[4,4,4],total:12,leaders:[0,1,2]});
 for(const invalid of [-1,3,1.5,NaN])assert.deepEqual(tallyVote(invalid),tallyVote(null));
});
test('Social activities and selected key concepts have unambiguous answers',()=>{
 for(const q of [...resourceTasks,...lifeTasks]){assert.ok(q.choices.includes(q.answer));assert.ok(q.why)}
 const expected:Record<string,string[]>={count:['閱讀角'],tie:['討論並確認公平的處理方式'],family:['家庭組成可以不同，都值得尊重'],secret:['向信任的老師或家人求助'],diary:['尊重隱私，不未經同意翻閱'],roles:['同一個人在不同情境有不同角色']};
 for(const [id,answer] of Object.entries(expected))assert.deepEqual(questions.find(q=>q.id===`SOC3:${id}`)!.answer,answer);
});
