#!/usr/bin/env python3
"""Rebuild local CJK subsets: uv run --with fonttools --with brotli scripts/build-fonts.py"""
from pathlib import Path
import hashlib, json, urllib.request
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
ROOT = Path(__file__).resolve().parents[1]
REV = '2eb0b48d5f760f62e286216f0859a8c540dbc1bd'
CACHE = Path.home()/'.cache/hi-fonts'/REV
CACHE.mkdir(parents=True, exist_ok=True)
chars = set(chr(i) for i in range(32,127)) | set('，。！？：；“”‘’（）《》〈〉【】、—…·–　')
for file in (ROOT/'src').rglob('*'):
    if file.suffix in {'.astro','.mdx','.ts','.js','.css'}:
        chars.update(c for c in file.read_text() if '\u3400' <= c <= '\u9fff')
records=[]
for family, local, filename in [('notoserifsc','Hi Song','hi-song.woff2'),('notosanssc','Hi Sans','hi-sans.woff2')]:
    upstream = 'NotoSerifSC' if family=='notoserifsc' else 'NotoSansSC'
    url=f'https://raw.githubusercontent.com/google/fonts/{REV}/ofl/{family}/{upstream}%5Bwght%5D.ttf'
    source=CACHE/(upstream+'.ttf')
    if not source.exists(): urllib.request.urlretrieve(url,source)
    license_url=f'https://raw.githubusercontent.com/google/fonts/{REV}/ofl/{family}/OFL.txt'
    license_file=ROOT/'public/fonts'/(family+'-OFL.txt')
    urllib.request.urlretrieve(license_url,license_file)
    license_file.write_text("\n".join(line.rstrip() for line in license_file.read_text().splitlines())+"\n")
    font=TTFont(source)
    missing={ord(c) for c in chars}-set(font.getBestCmap())
    if missing: raise RuntimeError(f'{family} missing {missing}')
    opts=subset.Options();opts.flavor='woff2';opts.layout_features=['*']
    sub=subset.Subsetter(options=opts);sub.populate(text=''.join(sorted(chars)));sub.subset(font)
    instantiateVariableFont(font,{'wght':(400,400,600)},inplace=True)
    # Give modified subsets their own internal family name, retaining upstream copyright/OFL.
    for rec in font['name'].names:
        if rec.nameID in {1,2,3,4,6,16,17}:
            value={1:local,2:'Regular',3:local+' subset '+REV[:8],4:local,6:local.replace(' ','')+'-Regular',16:local,17:'Regular'}[rec.nameID]
            rec.string=value.encode(rec.getEncoding(),errors='replace')
    font.flavor='woff2';output=ROOT/'public/fonts'/filename;font.save(output)
    built=TTFont(output);assert {ord(c) for c in chars}<=set(built.getBestCmap())
    records.append(dict(family=local,upstream=upstream,url=url,license_url=license_url,source_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),file='public/fonts/'+filename,bytes=output.stat().st_size,sha256=hashlib.sha256(output.read_bytes()).hexdigest(),weights=[400,600]))
manifest={'source_revision':REV,'characters':''.join(sorted(chars)),'cjk_count':sum('\u3400'<=c<='\u9fff' for c in chars),'fonts':records}
(ROOT/'scripts/font-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'cjk_count':manifest['cjk_count'],'fonts':records},ensure_ascii=False,indent=2))
