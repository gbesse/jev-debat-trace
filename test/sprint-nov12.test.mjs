import test from 'node:test';import assert from 'node:assert/strict';
import {traceCoverageLedger}from '../src/index.mjs';const c=id=>({id,projectId:'p',text:'fixture',date:'2026-11-01',sourceUrl:'https://example.invalid'}),k={...c('k'),date:'2026-11-02'};
test('unassessed contribution not unaddressed by default',()=>{const x=traceCoverageLedger([c('a'),c('b')],[k],[{contributionId:'a',commitmentId:'k',relation:'adopted'}]);assert.deepEqual(x.unassessedContributions,['b']);assert.equal(x.contributions[1].hasAssessment,false);assert.equal(x.causalityProven,false);});
test('unknown reference rejected',()=>assert.throws(()=>traceCoverageLedger([c('a')],[k],[{contributionId:'unknown',commitmentId:'k',relation:'adopted'}])));
test('reversed chronology cannot be evaluated',()=>assert.throws(()=>traceCoverageLedger([c('a')],[{...k,date:'2026-10-31'}],[{contributionId:'a',commitmentId:'k',relation:'adopted'}])));
