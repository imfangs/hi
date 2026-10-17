"""Import versioned Omarchy theme previews and palettes; never execute theme code."""
import hashlib,json,subprocess,tomllib
from pathlib import Path
from urllib.parse import quote
from PIL import Image,ImageOps,ImageCms
SOURCE=Path('/Users/fangs/workspace/study/omarchy')
ROOT=Path(__file__).resolve().parents[1]
REV=subprocess.check_output(['git','-C',str(SOURCE),'rev-parse','HEAD'],text=True).strip()
OUT=ROOT/'public/omarchy/themes';OUT.mkdir(parents=True,exist_ok=True)
records=[]
def image(source,destination,width):
 im=ImageOps.exif_transpose(Image.open(source)).convert('RGB')
 if im.info.get('icc_profile'):
  import io
  im=ImageCms.profileToProfile(im,ImageCms.ImageCmsProfile(io.BytesIO(im.info['icc_profile'])),ImageCms.createProfile('sRGB'),outputMode='RGB')
 im.thumbnail((width,width),Image.Resampling.LANCZOS);im.save(destination,'WEBP',quality=86,method=6)
 return {'src':'/omarchy/themes/'+str(destination.relative_to(OUT)),'width':im.width,'height':im.height,'sha256':hashlib.sha256(destination.read_bytes()).hexdigest(),'source':str(source.relative_to(SOURCE)),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'original':f'https://raw.githubusercontent.com/omacom/omarchy/{REV}/'+quote(str(source.relative_to(SOURCE)))}
for f in sorted((SOURCE/'themes').glob('*/colors.toml')):
 d=f.parent;target=OUT/d.name;target.mkdir(exist_ok=True)
 palette=tomllib.loads(f.read_text());title={'catppuccin-latte':'Catppuccin Latte','flexoki-light':'Flexoki Light','matte-black':'Matte Black','osaka-jade':'Osaka Jade','retro-82':'Retro 82','rose-pine':'Rosé Pine','tokyo-night':'Tokyo Night','last-horizon':'Last Horizon'}.get(d.name,d.name.title())
 r={'id':d.name,'name':title,'mode':palette['mode'],'palette':palette,'source':f'https://github.com/omacom/omarchy/tree/{REV}/themes/{d.name}','paletteSource':f'https://github.com/omacom/omarchy/blob/{REV}/themes/{d.name}/colors.toml'}
 r['preview']=image(d/'preview.png',target/'preview.webp',1600);r['thumb']=image(d/'preview.png',target/'thumb.webp',800)
 if (d/'preview-unlock.png').exists():r['unlock']=image(d/'preview-unlock.png',target/'unlock.webp',1280)
 r['backgrounds']=[]
 for n,b in enumerate(sorted((d/'backgrounds').glob('*'))):
  if not b.is_file() or b.suffix.lower() not in ['.webp','.png','.jpg','.jpeg']:continue
  r['backgrounds'].append({'name':b.stem,**image(b,target/f'wallpaper-{n+1}.webp',1440)})
 records.append(r)
data={'revision':REV,'date':'2026-10-17','themes':records}
(ROOT/'src/data/omarchy-themes.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
(OUT/'LICENSE.txt').write_text((SOURCE/'LICENSE').read_text())
print(json.dumps({'themes':len(records),'light':sum(r['mode']=='light' for r in records),'wallpapers':sum(len(r['backgrounds']) for r in records),'bytes':sum(p.stat().st_size for p in OUT.rglob('*') if p.is_file())}))
