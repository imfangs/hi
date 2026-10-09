import { createShader } from 'shaders/js';
import './style.css';
const $=s=>document.querySelector(s);
const stage=$('#stage'),canvas=$('#effect'),status=$('#status');
const media=matchMedia('(prefers-reduced-motion: reduce)');
let mode='taste',instance=null,generation=0,paused=media.matches,visible=true,pulseTimer;
const copy={taste:['品味，留下自己的痕迹。','在字上慢慢划过，让一缕朱砂融入墨色。','最接近现有首页：保留纸白与墨色，互动时才显露一点温度。'],build:['想法，一点一点成形。','拖动进度，把粗糙的颗粒磨成清晰的字。','适合作品的开场：从未完成到清晰，只演一次，然后让作品说话。'],sell:['让作品，得到回响。','点击任意位置，让一圈回响穿过文字。也可以按 Enter。','适合独立互动页：Sell 是把作品交到人手里，回应由对方触发。']};
function syncPlayback(){if(!instance)return;if(paused||!visible||document.hidden)instance.pause();else instance.resume();document.body.classList.toggle('paused',paused);$('#pause').textContent=paused?'继续动态':'暂停动态';$('#pause').setAttribute('aria-pressed',String(paused));}
async function texture(){await document.fonts.load('italic 146px Display');const c=document.createElement('canvas');c.width=1600;c.height=Math.round(1600*stage.clientHeight/stage.clientWidth);const x=c.getContext('2d');x.font='italic 195px Display';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#28221e';x.fillText('Taste. Build. Sell.',800,c.height/2+10);return c.toDataURL();}
function pixels(){const n=Number($('#progress').value);$('#amount').textContent=n+'%';return 24+Math.pow(n/100,2)*1376;}
async function mount(){const ticket=++generation;instance?.destroy();instance=null;stage.classList.remove('ready');stage.dataset.mode=mode;status.textContent='正在准备画布…';const url=await texture();if(ticket!==generation)return;stage.style.setProperty('--text-mask',`url("${url}")`);
clearTimeout(pulseTimer);let components;
if(mode==='taste')components=[{type:'SolidColor',props:{color:'#26211d'}},{type:'InkFlow',props:{colorMode:'single',color:'#bc542f',radius:1.2,force:.45,curl:6,decay:.45,momentum:.75}}];
if(mode==='build')components=[{type:'Pixelate',id:'pixels',props:{scale:pixels(),gap:(100-Number($('#progress').value))/400},children:[{type:'ImageTexture',props:{url,objectFit:'fill'}}]}];
if(mode==='sell')components=[{type:'Ripples',id:'ripple',props:{colorA:'#b8451f',colorB:'#29231e',speed:0,frequency:7,softness:.8,thickness:.22,center:{x:.5,y:.5}}}];
try{let failed=false;const next=await createShader(canvas,{components},{disableTelemetry:true,colorSpace:'srgb',onReady(){if(ticket===generation&&!failed){stage.classList.add('ready');status.textContent='互动已就绪';}},onError(reason){failed=true;if(ticket===generation){stage.classList.remove('ready');status.textContent='当前设备暂不支持此效果，保留静态口号。';console.warn('Shader unavailable:',reason);}}});if(ticket!==generation){next.destroy();return;}instance=next;syncPlayback();}catch(error){if(ticket===generation){status.textContent='效果未能加载，保留静态口号。';stage.classList.remove('ready');}console.error(error);}}
function select(next){mode=next;const [title,description,note]=copy[mode];$('#title').textContent=title;$('#description').textContent=description;$('#judgment').textContent=note;$('#progress-label').hidden=mode!=='build';document.querySelectorAll('[data-mode]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.mode===mode));});$('#rings').replaceChildren();mount();}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>select(b.dataset.mode));
$('#progress').oninput=()=>{instance?.update('pixels',{scale:pixels(),gap:(100-Number($('#progress').value))/400});};
$('#pause').onclick=()=>{paused=!paused;syncPlayback();};
$('#replay').onclick=()=>{if(mode==='build'){$('#progress').value='0';pixels();}mount();};
function echo(x,y){if(mode!=='sell'||paused)return;const box=stage.getBoundingClientRect();instance?.update('ripple',{center:{x:x/box.width,y:y/box.height},speed:.35});clearTimeout(pulseTimer);pulseTimer=setTimeout(()=>{if(mode==='sell')instance?.update('ripple',{speed:0});},2400);const ring=document.createElement('span');ring.className='ring';ring.style.left=x+'px';ring.style.top=y+'px';$('#rings').append(ring);ring.addEventListener('animationend',()=>ring.remove());}
stage.addEventListener('pointerdown',e=>{const b=stage.getBoundingClientRect();echo(e.clientX-b.left,e.clientY-b.top);});stage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();echo(stage.clientWidth/2,stage.clientHeight/2);}});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncPlayback();}).observe(stage);document.addEventListener('visibilitychange',syncPlayback);media.addEventListener('change',e=>{paused=e.matches;syncPlayback();});let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(mount,250);});window.addEventListener('pagehide',()=>{generation++;instance?.destroy();});mount();
