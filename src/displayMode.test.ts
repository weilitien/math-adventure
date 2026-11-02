import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveDisplayMode,displayModeKey} from './displayMode';
test('Compact, reduced motion, or data saving devices start with lightweight maps',()=>{
 for(const compact of [false,true])for(const reduced of [false,true])for(const saveData of [false,true])assert.equal(resolveDisplayMode(null,compact,reduced,saveData),compact||reduced||saveData?'flat':'3d');
});
test('Explicit choice overrides defaults and invalid settings recover safely',()=>{
 for(const compact of [false,true])for(const reduced of [false,true])for(const saveData of [false,true]){assert.equal(resolveDisplayMode('3d',compact,reduced,saveData),'3d');assert.equal(resolveDisplayMode('flat',compact,reduced,saveData),'flat')}
 assert.equal(resolveDisplayMode('broken',true,false,false),'flat');assert.equal(resolveDisplayMode('broken',false,false,false),'3d');assert.equal(displayModeKey,'math-adventure-display-mode-v1');
});
