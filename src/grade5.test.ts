import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildRound,decimal,generate,rational,topicNames,units,validate,type Question} from './grade5/questions';
import {empty,parseProgress,record,storageKey,summarize} from './grade5/progress';
import {key as grade3Key} from './progress';
const seeded=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const divisor=(a:number,b:number)=>Array.from({length:Math.min(a,b)},(_,i)=>i+1).filter(n=>a%n===0&&b%n===0).at(-1)!;
const commonMultiple=(a:number,b:number)=>{for(let n=Math.max(a,b);n<=a*b;n++)if(n%a===0&&n%b===0)return n;throw new Error('no multiple')};
function independentlyVerify(q:Question){
 const [a,b,c,d,e]=q.data;let answer:string|undefined;
 switch(q.topic){
 case 'place':answer=String(Math.floor(a/Math.pow(10,3-b))%10);break;
 case 'decimalCompare':answer=a>b?'>':a<b?'<':'=';break;
 case 'decimalAdd':case 'decimalSubtract':case 'decimalStory':answer=((c?a+b:a-b)/1000).toFixed(3);break;
 case 'round':{const digits=String(a).padStart(4,'0'),keep=digits.slice(0,-(3-b)),next=Number(digits[digits.length-(3-b)]);answer=String((Number(keep)+(next>=5?1:0))/10**b);break}
 case 'factors':answer=Array.from({length:a},(_,i)=>i+1).filter(n=>a%n===0).join('、');break;
 case 'gcd':case 'packing':answer=String(divisor(a,b));break;
 case 'multiple':answer=String(a*b);break;
 case 'divisibility':answer=Number.isInteger(a/b)?'是':'不是';break;
 case 'lcm':case 'meeting':answer=String(commonMultiple(a,b));break;
 case 'expand':answer=String(a*c);break;
 case 'reduce':{const div=divisor(a,b);answer=`${a/div}/${b/div}`;break}
 case 'fractionCompare':answer=a/b>c/d?'>':a/b<c/d?'<':'=';break;
 case 'quotient':answer=`${a}/${b}`;break;
 case 'commonDenominator':assert.equal(e,commonMultiple(b,d));answer=String(a*e/b);break;
 case 'polygon':answer=String(a);break;
 case 'triangle':{const sorted=[a,b,c].sort((a,b)=>a-b);answer=sorted[0]+sorted[1]>sorted[2]?'可以':'不可以';break}
 case 'triangleAngle':answer=String(180-a-b);assert.ok(+answer>0&&+answer<180);break;
 case 'quadAngle':answer=String(360-a-b-c);assert.ok(+answer>0&&+answer<180);break;
 case 'sector':answer=String(360*a/b);assert.ok(+answer>0&&+answer<360);break;
 default:assert.fail(q.topic);
 }
 assert.ok(validate(q,answer!),`${q.topic}: expected ${answer}, generated ${q.answer}`);
 assert.ok(validate(q,q.answer));assert.ok(!validate(q,''));assert.ok(!validate(q,'NaN'));assert.ok(!validate(q,'Infinity'));
 assert.equal(q.unit,units.findIndex(u=>u.topics.includes(q.topic)));assert.equal(q.hints.length,2);assert.ok(q.steps.length>0);
 if(q.kind==='number'){assert.ok(!validate(q,String(Number(q.answer)+.00001)));const full=q.answer.replace(/[0-9.]/g,d=>d==='.'?'．':String.fromCharCode(d.charCodeAt(0)+65248));assert.ok(validate(q,` ${full} `))}
}
for(const topic of Object.keys(topicNames)){
 for(const seed of [19,153,218])test(`Grade 5 ${topic}: fixed seed ${seed}`,()=>independentlyVerify(generate(topic,seeded(seed))));
 test(`Grade 5 ${topic}: 100 randomized independently verified answers`,()=>{const rng=seeded(9876);for(let i=0;i<100;i++)independentlyVerify(generate(topic,rng))});
 test(`Grade 5 ${topic}: 20 unique questions in one-topic review`,()=>{const questions=buildRound([],20,[topic],seeded(9817));assert.equal(new Set(questions.map(q=>q.id)).size,20)})
}
test('Decimal validation is exact, accepts trailing zeros and rejects partial inputs',()=>{const q={...generate('decimalAdd'),answer:'0.300'};for(const s of ['0.3','０．３０',' 0.3000 '])assert.ok(validate(q,s));for(const s of ['0.3000000001','0.3abc','3e-1','0.3 元','1/0'])assert.ok(!validate(q,s));assert.deepEqual(rational('0.125'),[125n,1000n]);assert.equal(rational('1/0'),null)});
test('Half-up rounding crosses whole-number boundary',()=>{const q=generate('round',()=>0);assert.ok(validate({...q,answer:'10.000'},'10'));const desired=9995;let call=0;const q2=generate('round',()=>call++===0?(desired-1001+.1)/(999999-1001+1):.9);assert.equal(q2.data[0],9995);assert.equal(q2.answer,'10.000')});
test('Factor answers are unordered sets, require completeness and reject duplicates',()=>{const q={...generate('factors'),answer:'1、2、3、6'};for(const raw of ['6,3,2,1','１、２、３、６','1 2 3 6','1，2，3，6'])assert.ok(validate(q,raw));for(const raw of ['1、2','1、2、3、6、6','1、2、3、4、6','1、2、3、6、'])assert.ok(!validate(q,raw))});
test('Equivalent fractions work, simplest-fraction questions enforce reduction',()=>{const q={...generate('quotient'),answer:'3/4'};assert.ok(validate(q,'６／８'));assert.ok(validate(q,' 3 / 4 '));assert.ok(!validate(q,'0.75'));assert.ok(!validate(q,'3/0'));assert.ok(!validate({...q,reduced:true},'6/8'));assert.ok(validate({...q,reduced:true},'3/4'))});
test('All nonempty scope combinations only generate selected units',()=>{for(let mask=1;mask<32;mask++){const selected=units.map((_,i)=>i).filter(i=>mask&(1<<i));const qs=buildRound(selected,20,undefined,seeded(mask));assert.equal(qs.length,20);assert.equal(new Set(qs.map(q=>q.id)).size,20);assert.ok(qs.every(q=>selected.includes(q.unit)));assert.ok(selected.every(u=>qs.some(q=>q.unit===u)))}});
test('Empty scope cannot start, default scope excludes optional geometry',()=>{assert.throws(()=>buildRound([],20));const p=empty();assert.deepEqual(p.selected,[0,1,2,3]);assert.ok(buildRound(p.selected).every(q=>q.unit!==4))});
test('Progress preserves grades separately, round trips and resets safely',()=>{assert.notEqual(storageKey,grade3Key);const p=empty(),q=generate('reduce');p.attempts=[record(q,[q.answer],0),record(q,[q.answer],1),record(q,['wrong',q.answer],0)];p.mistakes=[q];p.passed=[0];assert.deepEqual(summarize(p.attempts),{count:3,first:1,hinted:1,corrected:1,stars:18});assert.deepEqual(parseProgress(JSON.stringify(p)),JSON.parse(JSON.stringify(p)));for(const raw of [null,'bad','{}',JSON.stringify({...p,mistakes:[{id:'bad'}]}),JSON.stringify({...p,attempts:[{}]})])assert.deepEqual(parseProgress(raw),empty());p.selected=[];assert.deepEqual(parseProgress(JSON.stringify(p)).selected,[])});
