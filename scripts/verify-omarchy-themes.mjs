import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {themes,makeTokens,presetCss} from '../src/lib/omarchy-themes.ts';
assert.equal(themes.length,23);assert.equal(themes.filter(t=>t.mode==='light').length,5);
const hex=x=>/^#[\da-f]{6}$/i.test(x);
let assets=0;
for(const t of themes){
 assert(t.style&&t.style.description&&t.style.use);
 for(const color of Object.values(t.palette).filter(v=>v.startsWith('#')))assert(hex(color));
 const tokens=makeTokens(t);assert(Object.values(tokens).every(x=>typeof x==='string'&&!x.includes('undefined')));
 const saved=await fs.readFile(new URL(`../public/omarchy/themes/presets/${t.id}.css`,import.meta.url),'utf8');assert.equal(saved,presetCss(t));
 for(const a of [t.preview,t.thumb,t.unlock,...t.backgrounds].filter(Boolean)){
  const bytes=await fs.readFile(new URL('../public'+a.src,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);assets++;
 }
}
console.log(`PASS: 23 palettes, design mappings and exported CSS; ${assets} image hashes.`);
