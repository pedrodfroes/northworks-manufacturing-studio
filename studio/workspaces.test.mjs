import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sequence} from './navigation.js';
import {workspaceId,workspaceSteps} from './workspaces.js';
test('legacy entry points resolve to a single existing workspace',()=>{
 const modern=workspaceSteps(sequence);
 assert.equal(new Set(modern).size,modern.length);
 for(const id of sequence){assert.ok(sequence.includes(workspaceId(id)));assert.equal(workspaceId(workspaceId(id)),workspaceId(id));}
 assert.deepEqual(workspaceSteps(['tank-intro','volume-storage','tank-preview']),['volume-storage']);
 assert.deepEqual(workspaceSteps(['qms-design','qms']),['qms-design']);
 assert.ok(modern.length<sequence.length-10);
});
