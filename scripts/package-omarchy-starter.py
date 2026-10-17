from pathlib import Path
import json,shutil,zipfile
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'scripts/omarchy-starter';data=json.loads((ROOT/'src/data/omarchy-themes.json').read_text())
(p/'presets.json').write_text(json.dumps([{'id':t['id'],'name':t['name']} for t in data['themes']],indent=2)+'\n')
shutil.copyfile(ROOT/'public/omarchy/themes/daisyui-themes.css',p/'themes.css')
shutil.copyfile(ROOT/'public/omarchy/themes/LICENSE.txt',p/'OMARCHY-LICENSE.txt')
with zipfile.ZipFile(ROOT/'public/omarchy/themes/starter.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in sorted(p.iterdir()):
  if f.is_file():z.write(f,'omarchy-theme-starter/'+f.name)
print('Packaged portable theme starter.')
