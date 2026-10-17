import fs from 'node:fs/promises';
import {themes,presetCss,makeTokens,themeSource} from '../src/lib/omarchy-themes.ts';
const root=new URL('../public/omarchy/themes/',import.meta.url);
await fs.mkdir(new URL('presets/',root),{recursive:true});
for(const t of themes){
 await fs.writeFile(new URL(`presets/${t.id}.css`,root),presetCss(t));
 await fs.writeFile(new URL(`presets/${t.id}.json`,root),JSON.stringify({name:t.name,id:`omarchy-${t.id}`,source:t.paletteSource,revision:themeSource.revision,originalPalette:t.palette,webAdaptation:t.style,tokens:makeTokens(t)},null,2)+'\n');
}
await fs.writeFile(new URL('daisyui-themes.css',root),themes.map(presetCss).join('\n'));
console.log(`Exported ${themes.length} daisyUI/CSS theme presets.`);
