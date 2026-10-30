import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advance,completed,decorate,emptyTown,parseTown,stories} from './social3/townLogic';
import {empty,parseProgress,record} from './social3/progress';
import {questions} from './social3/questions';
test('Every story can be completed sequentially; wrong choices and replay cannot grant extra progress',()=>{
 for(const story of stories){let t=emptyTown();assert.equal(story.steps.length,3);assert.equal(decorate(t,story.id,'sun'),t);
 story.steps.forEach((s,i)=>{assert.equal(s.choices.filter(c=>c.ok).length,1);assert.ok(s.choices.every(c=>c.reply));const correct=s.choices.findIndex(c=>c.ok),wrong=s.choices.findIndex(c=>!c.ok);assert.equal(advance(t,story.id,i,wrong),t);assert.equal(advance(t,story.id,i+1,correct),t);t=advance(t,story.id,i,correct);assert.equal(t.steps[story.id],i+1);assert.equal(advance(t,story.id,i,correct),t)});
 assert.ok(completed(t,story.id));const decorated=decorate(t,story.id,'sun');assert.equal(decorated.decor[story.id],'sun');assert.deepEqual(t.decor,{});assert.equal(decorate(decorated,story.id,'invalid'),decorated);assert.equal(decorate(decorated,story.id,'sea').decor[story.id],'sea');assert.deepEqual(decorate(decorated,story.id,'none').decor,{});assert.deepEqual(parseTown(decorated),decorated);
 }
});
test('Town parsing discards invalid progress and unearned decorations',()=>{
 for(const raw of [null,undefined,{},'bad',42])assert.deepEqual(parseTown(raw),emptyTown());
 assert.deepEqual(parseTown({steps:{library:3,meeting:1,home:99,park:-1,unknown:3},decor:{library:'sea',meeting:'sun',unknown:'sun'}}),{steps:{library:3,meeting:1},decor:{library:'sea'}});
 assert.equal(advance(emptyTown(),'unknown',0,1).steps.unknown,undefined);
});
test('Old social learning records migrate without losing answers, scope, mistakes or stars',()=>{
 const p=empty();p.attempts=[record(questions[0],[questions[0].answer],0)];p.selected=[1];p.mistakes=[questions[0].id];p.passed=[1];const {town,...old}=p;
 assert.deepEqual(parseProgress(JSON.stringify(old)),p);
 const next={...p,town:{steps:{library:3,meeting:1},decor:{library:'sea'}}};assert.deepEqual(parseProgress(JSON.stringify(next)),next);
 assert.deepEqual(parseProgress(JSON.stringify({...p,town:{steps:{library:99}}})),p);
});
