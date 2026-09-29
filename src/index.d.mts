// Purpose: Describe the public domain API.
import type{JevProvider}from"./jev.mjs";export const RELATIONS:readonly string[];export function contribution(input:any):any;export function commitment(input:any):any;export function traceContribution(contribution:any,commitment:any,provider:JevProvider):Promise<any>;
