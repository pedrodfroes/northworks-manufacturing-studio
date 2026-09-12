import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ownershipRows,ownershipComplete} from './system-ownership.js';
test('ownership follows scope without accepting old diagram confirmations',()=>{
 const s={scope:'aps-ds',architecture:{nodes:[{name:'Old core',status:'confirmed'}],assignments:{}}};
 assert.deepEqual(ownershipRows(s).map(r=>r.id),['aps']);assert.equal(ownershipComplete(s),false);
 s.architecture.assignments.aps={application:'Planning',owner:'Planning team',plan:'existing',reviewed:true};assert.equal(ownershipComplete(s),true);
 s.businessModules={lims:{enabled:true}};assert.equal(ownershipComplete(s),false);
 s.businessModules.lims.enabled=false;assert.equal(ownershipComplete(s),true);
 s.architecture.assignments.aps.plan='';assert.equal(ownershipComplete(s),false);
});
