import {test} from 'node:test';
import assert from 'node:assert/strict';
import {swapCards,toggleAnswer,companions} from './hanlin5/interaction';
import {questions,prepare,validate,units} from './hanlin5/questions';
import {record,summarize} from './hanlin5/progress';
test('Card swaps preserve options and can solve every shuffled order question',()=>{
 for(const q of questions.filter(q=>q.kind==='order')){let selection=prepare(q,()=>.2).options;const original=[...selection];for(let i=0;i<q.answer.length;i++)selection=swapCards(selection,i,selection.indexOf(q.answer[i]));assert.ok(validate(q,selection));assert.deepEqual([...selection].sort(),[...original].sort());assert.deepEqual(swapCards(original,-1,0),original);assert.deepEqual(swapCards(original,0,99),original);assert.deepEqual(swapCards(original,0,0),original)}
});
test('Single choice replaces selection; multi choice toggles without duplication or mutation',()=>{
 const prior=['A'];assert.deepEqual(toggleAnswer(prior,'B',false),['B']);assert.deepEqual(toggleAnswer(prior,'B',true),['A','B']);assert.deepEqual(toggleAnswer(prior,'A',true),[]);assert.deepEqual(prior,['A']);
 for(const q of questions.filter(q=>q.kind!=='order')){let selected:string[]=[];for(const correct of q.answer)selected=toggleAnswer(selected,correct,q.kind==='multi');assert.ok(validate(q,selected))}
});
test('Playful controls preserve scoring and have a companion for every exam unit',()=>{
 assert.equal(companions.length,units.length);assert.ok(companions.every(c=>c.name&&c.icon&&c.tip));const q=questions[0];assert.deepEqual(summarize([record(q,[q.answer],0),record(q,[q.answer],1),record(q,[['wrong'],q.answer],0)]),{count:3,first:1,hinted:1,corrected:1,stars:18});
});
