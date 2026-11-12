import {contribution,commitment,RELATIONS}from './index.mjs';
export function traceCoverageLedger(contributions,commitments,assessments){
 const fail=()=>{throw new TypeError('Traces invalides / Invalid traces / Trazas inválidas');};
 if(!Array.isArray(contributions)||!Array.isArray(commitments)||!Array.isArray(assessments)||Math.max(contributions.length,commitments.length,assessments.length)>10000)fail();
 const cs=new Map(contributions.map(c=>{const x=contribution(c);return[x.id,x];})),ks=new Map(commitments.map(c=>{const x=commitment(c);return[x.id,x];}));if(cs.size!==contributions.length||ks.size!==commitments.length)fail();const seen=new Set(),by=new Map();
 for(const a of assessments){const c=cs.get(a.contributionId),k=ks.get(a.commitmentId),key=JSON.stringify([a.contributionId,a.commitmentId]);if(!c||!k||c.projectId!==k.projectId||Date.parse(k.date)<=Date.parse(c.date)||!RELATIONS.includes(a.relation)||seen.has(key))fail();seen.add(key);if(!by.has(c.id))by.set(c.id,[]);by.get(c.id).push({commitmentId:k.id,relation:a.relation});}
 return {contributions:[...cs].map(([id])=>({id,assessedPairs:by.get(id)??[],hasAssessment:by.has(id),adoptedInAssessment:(by.get(id)??[]).some(a=>a.relation==='adopted')})),unassessedContributions:[...cs.keys()].filter(id=>!by.has(id)),causalityProven:false,externalHumanUsageProven:false};
}
