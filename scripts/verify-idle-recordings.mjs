import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {loadRecording} from '../public/omarchy/player.js';
const root=new URL('../public/omarchy/',import.meta.url);
const manifest=JSON.parse(await fs.readFile(new URL('manifest.json',root),'utf8'));
assert.equal(manifest.renders.length,111);assert.equal(manifest.effects.length,37);
for(const r of manifest.renders){
 const bytes=await fs.readFile(new URL(`animations/${r.word.toLowerCase()}-${r.id}.json.gz`,root));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),r.sha256);
 const data=JSON.parse(gunzipSync(bytes));assert.equal(data.frames.length,r.frames);assert.equal(data.word,r.word);
}
const originalFetch=globalThis.fetch;
try{
 for(const [word,alreadyDecoded] of [['TASTE',false],['BUILD',true]]){
  const bytes=await fs.readFile(new URL(`animations/${word.toLowerCase()}-beams.json.gz`,root));
  globalThis.fetch=async()=>new Response(alreadyDecoded?gunzipSync(bytes):bytes);
  const data=await loadRecording(word,'beams');assert.equal(data.word,word);assert(data.frames.length>0);
 }
}finally{globalThis.fetch=originalFetch;}
console.log('PASS: 111 recording hashes and frames; original gzip and fetch-decoded responses both play.');
