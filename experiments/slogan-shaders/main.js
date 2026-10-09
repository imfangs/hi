import {attachSlogan, effects, names} from '../../src/scripts/slogan-effects.js';
import './style.css';
const $=s=>document.querySelector(s),stage=$('#stage');
const copy={taste:['品味，留下自己的痕迹。','在字上慢慢划过，让朱砂融入墨色。','InkFlow · 会留下痕迹的字'],build:['想法，一点一点成形。','颗粒不定时散开、聚拢，也可以拖动进度。','Pixelate · 0 → 100 → 0，随机停留'],sell:['让作品，得到回响。','点击文字或按 Enter，让波纹穿过整句话。','Ripples · 由你的触碰引发回响'],aurora:['把一点奇想，放进字里。','青绿、紫色与蓝色的光幕慢慢穿过文字。','Aurora · 字形里的极光'],silk:['让想法，自由流动。','紫、朱砂与青蓝，像液体一样交融。','FlowingGradient · 流动的色彩'],prism:['从一个念头，看见更多可能。','点击不同的位置，改变光线分开的地方。','Prism · 在字里折射出光谱']};
let control,token=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
async function select(mode){const ticket=++token;control?.destroy();control=null;stage.dataset.gpu='loading';const [title,description,note]=copy[mode];$('#title').textContent=title;$('#description').textContent=description;$('#judgment').textContent=note;$('#progress-label').hidden=mode!=='build';document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));const next=await attachSlogan(stage,{mode,onProgress(value){if(ticket!==token)return;$('#progress').value=String(value);$('#amount').textContent=Math.round(value)+'%';},onState(state){if(ticket===token)$('#status').textContent=state==='ready'?'互动已就绪':'静态口号 · 当前设备或动态偏好';}});if(ticket!==token){next.destroy();return;}control=next;control.pause(paused);}
$('nav').innerHTML=effects.map((effect,i)=>`<button data-mode="${effect}" aria-pressed="false"><i>0${i+1}</i> ${names[effect]}</button>`).join('');
$('nav').addEventListener('click',e=>{const button=e.target.closest('button');if(button)select(button.dataset.mode);});
$('#progress').oninput=()=>control?.progress(Number($('#progress').value));
$('#pause').onclick=()=>{paused=!paused;control?.pause(paused);$('#pause').textContent=paused?'继续动态':'暂停动态';};
$('#replay').onclick=()=>select(control?.mode??'taste');
const initial=effects[Math.floor(Math.random()*effects.length)];select(initial);
window.addEventListener('pagehide',()=>control?.destroy());
