import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'scripts/font-manifest.json'),'utf8'));
const covered=new Set(manifest.characters);
const missing=new Set();
function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())scan(file);else if(/\.(astro|mdx|ts|js|css)$/.test(file)){for(const c of fs.readFileSync(file,'utf8'))if(c>='\u3400'&&c<='\u9fff'&&!covered.has(c))missing.add(c);}}}
scan(path.join(root,'src'));
for(const font of manifest.fonts){const digest=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,font.file))).digest('hex');if(digest!==font.sha256)throw new Error(`Font/manifest mismatch: ${font.file}`);}
if(missing.size)throw new Error(`CJK subset missing: ${[...missing].join('')}. Run uv run --with fonttools --with brotli scripts/build-fonts.py`);
console.log(`CJK coverage OK: ${manifest.cjk_count} source characters; both font hashes match.`);
