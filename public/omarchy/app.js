import {loadRecording, drawFrame} from './player.js';
const names={beams:'光束扫描',binarypath:'二进制路径',blackhole:'黑洞',bouncyballs:'弹跳小球',bubbles:'气泡',burn:'燃烧',colorshift:'色彩流动',crumble:'坍塌',decrypt:'解码',errorcorrect:'纠错',expand:'展开',fireworks:'烟火',highlight:'高光',laseretch:'激光刻字',matrix:'字符雨',middleout:'中央展开',orbittingvolley:'环绕齐射',overflow:'溢出',pour:'倾注',print:'打印',rain:'落雨',randomsequence:'随机显影',rings:'圆环',scattered:'散落重聚',slice:'切片',slide:'滑入',smoke:'烟雾',spotlights:'聚光灯',spray:'喷射',swarm:'蜂群',sweep:'扫掠',synthgrid:'合成网格',thunderstorm:'雷暴',unstable:'不稳定',vhstape:'录像带',waves:'波浪',wipe:'擦拭'};
const order=['beams','decrypt','matrix','laseretch','scattered','waves','swarm','blackhole','rain','burn','vhstape','synthgrid',...Object.keys(names)].filter((x,i,a)=>a.indexOf(x)===i);
const $=s=>document.querySelector(s), canvas=$('#screen'), ctx=canvas.getContext('2d',{alpha:false});
const initial=new URLSearchParams(location.search);
let word=['TASTE','BUILD','SELL'].includes(initial.get('word'))?initial.get('word'):'TASTE';
let effect=order.includes(initial.get('effect'))?initial.get('effect'):'beams', recording=null, frameIndex=-1,elapsed=0,lastTime=0,loading=false,serial=0;
let playing=!matchMedia('(prefers-reduced-motion: reduce)').matches, speed=1;

function updateUI(){
 document.querySelectorAll('[data-word]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.word===word)));
 $('#effect-name').textContent=names[effect];$('#english').textContent=effect.toUpperCase();$('#counter').textContent=`${String(order.indexOf(effect)+1).padStart(2,'0')} / ${order.length}`;
 $('#play').textContent=playing?'暂停':'播放';$('#play').setAttribute('aria-label',playing?'暂停':'播放');
 canvas.setAttribute('aria-label',`${word} 字标，${names[effect]}效果`);
 document.querySelectorAll('[data-effect]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.effect===effect)));
 const url=new URL(location.href);url.searchParams.set('word',word);url.searchParams.set('effect',effect);history.replaceState(null,'',url);
}
async function load(next=effect,nextWord=word){
 effect=next;word=nextWord;updateUI();loading=true;const ticket=++serial;
 $('#message').textContent=`正在准备${names[effect]}…`;
 try{
  const data=await loadRecording(word,effect);
  if(ticket!==serial)return;
  recording=data;elapsed=0;frameIndex=-1;loading=false;$('#message').textContent='';
  if(!playing)elapsed=(data.frames.length-1)/data.fps;
  render(Math.floor(elapsed*data.fps));
 }catch(err){if(ticket!==serial)return;loading=false;recording=null;ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);$('#message').textContent='动画未能载入，请切换效果或刷新重试。';console.error(err);}
}
function render(index){
 if(!recording)return;index=Math.min(index,recording.frames.length-1);if(index===frameIndex)return;frameIndex=index;
 drawFrame(canvas,recording,index);
}
function step(direction=1){load(order[(order.indexOf(effect)+direction+order.length)%order.length]);}
function toggle(){playing=!playing;if(playing&&recording&&elapsed>=(recording.frames.length-1)/recording.fps)elapsed=0;updateUI();}
function tick(t){const dt=lastTime?Math.min((t-lastTime)/1000,.1):0;lastTime=t;
 if(recording&&!loading&&!document.hidden){if(playing)elapsed+=dt*speed;const length=recording.frames.length/recording.fps;render(Math.floor(elapsed*recording.fps));$('#progress').style.width=`${Math.min(elapsed/length,1)*100}%`;if(playing&&elapsed>length+2.4)step();}
 requestAnimationFrame(tick);
}
const library=$('#library');
for(const [i,id] of order.entries()){const button=document.createElement('button');button.dataset.effect=id;button.innerHTML=`<span class="number">${String(i+1).padStart(2,'0')}</span><span class="cn">${names[id]}</span><span class="en">${id.toUpperCase()}</span>`;button.addEventListener('click',()=>{library.close();load(id);});$('#effects').append(button);}
$('#browse').onclick=()=>library.showModal();$('#close').onclick=()=>library.close();library.addEventListener('click',e=>{if(e.target===library){const r=library.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)library.close();}});
document.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>load(effect,b.dataset.word));
$('#next').onclick=()=>step();$('#previous').onclick=()=>step(-1);$('#play').onclick=toggle;
$('#random').onclick=()=>{const others=order.filter(x=>x!==effect);load(others[Math.floor(Math.random()*others.length)]);};
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.fullscreenEnabled)await document.documentElement.requestFullscreen();else document.body.classList.toggle('immersive');}catch{document.body.classList.toggle('immersive');}}
if(!document.fullscreenEnabled){$('#fullscreen').innerHTML='沉浸 <span>↗</span>';$('#fullscreen').setAttribute('aria-label','沉浸观看');$('#fullscreen').title='沉浸观看 · F';}
$('#fullscreen').onclick=fullscreen;
let hideTimer;function wake(){document.body.classList.remove('immersive');clearTimeout(hideTimer);if(document.fullscreenElement&&!library.open)hideTimer=setTimeout(()=>document.body.classList.add('immersive'),3000);}
document.addEventListener('pointermove',wake);document.addEventListener('pointerdown',wake);document.addEventListener('fullscreenchange',()=>{wake();$('#fullscreen').setAttribute('aria-label',document.fullscreenElement?'退出全屏':'切换全屏');});
document.addEventListener('keydown',e=>{wake();if(library.open||e.altKey||e.ctrlKey||e.metaKey)return;if(e.target.closest('button,a')&&[' ','Enter'].includes(e.key))return;const k=e.key.toLowerCase();if(k===' '){e.preventDefault();toggle();}else if(k==='arrowright')step();else if(k==='arrowleft')step(-1);else if(k==='f')fullscreen();else if(k==='r')$('#random').click();else if(k==='escape')document.body.classList.remove('immersive');});
document.addEventListener('visibilitychange',()=>{lastTime=0;});
load();requestAnimationFrame(tick);
