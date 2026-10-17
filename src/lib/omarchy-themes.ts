import data from '../data/omarchy-themes.json' with {type:'json'};
export const themeSource = {revision:data.revision,date:data.date};
type Style = {label:string;description:string;use:string;principle:string;font:'sans'|'serif'|'mono';radius:number;space:number;group:string};
const rows: Array<[string,string,string,string,string,Style['font'],number,number,string]> = [
 ['catppuccin','柔雾紫蓝','深蓝灰里融入粉彩，边界柔和，强调色不急着抢占视线。','个人工作台、知识管理、陪伴型产品','用大圆角和从容间距承接粉彩，避免满屏彩色。','sans',16,28,'柔和'],
 ['catppuccin-latte','日光粉彩','冷白底与清晰的蓝色骨架，让柔和色彩保留可读的秩序。','日程、笔记、轻量协作','让白色承担大部分空间，粉彩只给重点。','sans',14,28,'柔和'],
 ['ethereal','深空微光','极深的蓝底中浮起紫色，像从黑暗里渐渐辨认出的轮廓。','创作工具、音乐、沉浸式阅读','大面积深色，少量高亮；减少装饰性分隔。','sans',12,30,'未来'],
 ['everforest','森林低语','蓝灰与低饱和绿相邻，平静里有一点自然的温度。','长期阅读、习惯记录、自然主题','留出呼吸，用柔和层次代替强烈边框。','sans',10,28,'自然'],
 ['flexoki-light','纸上墨色','奶油纸色、近黑文字与克制的蓝色，强调阅读而非发光。','文章、研究笔记、个人出版','标题用衬线、正文保持朴素，把强调色留给动作。','serif',3,32,'纸墨'],
 ['gruvbox','暖灰旧书','煤灰、橄榄绿与暖黄形成旧书和老终端之间的气质。','技术文档、收藏目录、开发者产品','以紧凑但分明的层级组织内容，少用纯白。','serif',4,24,'纸墨'],
 ['hackerman','荧光终端','近黑蓝底托起荧光绿，状态和动作非常醒目。','命令工具、监控、实验界面','等宽文字、方角、细边框；荧光只用于关键状态。','mono',0,22,'终端'],
 ['kanagawa','深海旧墨','带紫的墨色底与淡米色文字，冷静中带有纸本的余温。','写作、长文阅读、艺术档案','宽松行距与衬线标题，比更多颜色更能表达气质。','serif',4,30,'纸墨'],
 ['last-horizon','暮色余晖','近黑底、灰粉强调，色彩像夜色里最后一点余光。','影像作品集、音乐、个人空间','保持轻边界，让一处暖色成为视线停留点。','serif',8,32,'克制'],
 ['lumon','冷静秩序','深蓝与冰蓝建立理性、规整的界面层次。','管理界面、资料整理、内部工具','清晰列线、紧凑表单与统一尺寸，少做情绪装饰。','sans',4,24,'理性'],
 ['lupine','白昼蓝调','洁净白底与鲜明蓝色，轻快、明晰，带一点粉紫的柔软。','学习产品、日历、日常工具','中等圆角、清楚按钮与充足间距，避免过密。','sans',12,30,'柔和'],
 ['matte-black','哑黑琥珀','低反差黑灰里点亮琥珀橙，质感靠克制建立。','作品集、媒体工具、专业面板','让橙色只占少量面积，轮廓保持简洁。','sans',5,26,'克制'],
 ['miasma','苔原余温','炭灰搭配苔绿与泥土色，比纯黑更有自然层次。','户外记录、手作、材料档案','低饱和配色与稍粗的轮廓，避免抛光般的亮面。','serif',6,28,'自然'],
 ['nord','北地蓝灰','一组相邻的冷蓝灰，让界面安静且有秩序。','开发工具、知识库、信息面板','使用适中的密度与稳定的网格，把蓝色留作层级。','sans',8,26,'理性'],
 ['osaka-jade','夜色翡翠','墨绿底与玉绿色高亮，像夜里从门缝透出的微光。','专注工具、植物记录、终端应用','保留大片暗部，青绿与暖色不要同时大面积使用。','mono',3,24,'自然'],
 ['retro-82','复古信号','深海蓝、奶油文字与杏橙强调，带有早期电子设备的温度。','实验产品、音乐器材、复古工具','方正组件、等宽标签，橙色标出可以触碰的地方。','mono',2,24,'复古'],
 ['ristretto','浓缩咖啡','棕黑底与珊瑚橙，让深色界面多一点温暖。','写作、个人知识库、手作品牌','用温暖的强调色配衬线标题，圆角保持小而柔。','serif',8,30,'纸墨'],
 ['rose-pine','晨光玫瑰','这一份是浅色版本：米白、烟紫和灰青，像轻柔的晨光。','日记、阅读、个人出版','用轻边框和充足留白，避免把粉色用成大面积装饰。','serif',12,32,'柔和'],
 ['solitude','独处石墨','蓝黑与石墨灰几乎退到背景，只留安静的层次。','研究工作台、照片档案、专注阅读','降低装饰，把字号、对齐与间距作为主要语言。','sans',2,30,'克制'],
 ['starship','航行仪表','黑灰底上点亮橙色，冷色辅助状态，像一块清晰的仪表。','任务面板、设备界面、数据工具','清楚的数值与动作优先，避免无意义的未来感装饰。','sans',10,24,'未来'],
 ['tokyo-night','都市夜航','蓝紫夜色与明亮的蓝色高光，层次丰富而不刺眼。','开发者工具、创作面板、夜间阅读','保留蓝紫的连贯性，让暖色只做偶尔的提示。','sans',10,26,'未来'],
 ['vantablack','纯黑留白','纯黑、浅灰与白，把颜色降到最低。','摄影、作品展示、极简工具','用空白、字重和细线区分层级，别让灰字失去对比。','sans',0,32,'克制'],
 ['white','白色秩序','纯白与近黑的强对比，表达清楚、直接、安静。','文档、表单、编辑型网站','方角与宽松间距让内容站稳，用字形建立气质。','sans',0,32,'克制']
];
export const styles:Record<string,Style> = Object.fromEntries(rows.map(([id,label,description,use,principle,font,radius,space,group])=>[id,{label,description,use,principle,font,radius,space,group}]));
export const themes=data.themes.map(theme=>({...theme,style:styles[theme.id]}));
const luminance=(hex:string)=>{const rgb=hex.replace('#','').match(/../g)!.map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
export const contrastInk=(hex:string)=>(luminance(hex)+.05)/.05>=1.05/(luminance(hex)+.05)?'#000000':'#ffffff';
export function makeTokens(t:typeof themes[number]){
 const p=t.palette,s=t.style;
 const tokens:Record<string,string>={
  'color-base-100':p.background,'color-base-200':p.dark_background,'color-base-300':p.lighter_background,'color-base-content':p.foreground,
  'color-primary':p.accent,'color-secondary':p.magenta,'color-accent':p.cyan,'color-neutral':p.selection,'color-neutral-content':contrastInk(p.selection),
  'color-info':p.blue,'color-success':p.green,'color-warning':p.yellow,'color-error':p.red,
  'radius-selector':s.radius+'px','radius-field':Math.min(8,s.radius)+'px','radius-box':s.radius+'px',
  'size-selector':s.space<26?'0.22rem':'0.25rem','size-field':s.space<26?'0.22rem':'0.25rem','border':'1px','depth':'0','noise':'0',
  'style-heading-font':s.font==='serif'?"Georgia, 'Noto Serif SC', serif":s.font==='mono'?"ui-monospace, 'SFMono-Regular', monospace":"system-ui, sans-serif",
  'style-body-font':s.font==='mono'?"ui-monospace, 'SFMono-Regular', monospace":"system-ui, sans-serif",'style-space':s.space+'px'
 };
 for(const name of ['primary','secondary','accent','info','success','warning','error'])tokens[`color-${name}-content`]=contrastInk(tokens[`color-${name}`]);
 return tokens;
}
export const presetCss=(t:typeof themes[number])=>`/* Omarchy palette; webpage typography, radius and spacing adapted by fangs. */\n[data-theme="omarchy-${t.id}"] {\n  color-scheme: ${t.mode};\n${Object.entries(makeTokens(t)).map(([k,v])=>`  --${k}: ${v};`).join('\n')}\n}\n`;
