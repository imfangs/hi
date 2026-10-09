/** Shared WebGPU treatment for the portfolio and its isolated comparison page. */
export const effects = ['taste', 'build', 'sell', 'aurora', 'silk', 'prism'];
export const names = {taste:'墨色', build:'成形', sell:'回响', aurora:'极光', silk:'熔彩', prism:'棱镜'};
let runtime;
const loadRuntime = () => runtime ??= import('shaders/js');

export async function attachSlogan(stage, {mode, onProgress = () => {}, onState = () => {}} = {}) {
  const heading = stage.querySelector('h1');
  const canvas = stage.querySelector('canvas');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let shader, disposed = false, visible = true, manualPause = false, version = 0;
  let frame = 0, resizeTimer, progress = 100, direction = -1, wait = 2500 + Math.random()*3500;
  let last = 0, echoRemaining = 0, cycles = 0;
  const chosen = effects.includes(mode) ? mode : effects[Math.floor(Math.random()*effects.length)];
  stage.dataset.effect = chosen;
  const active = () => !disposed && visible && !document.hidden && !manualPause && !reduced.matches;
  const showStatic = () => stage.classList.remove('shader-ready');
  function sync() {
    if (active()) { shader?.resume(); if (!frame) {last=0;frame=requestAnimationFrame(tick);} }
    else {shader?.pause();cancelAnimationFrame(frame);frame=0;}
    if (reduced.matches) showStatic();
    else if (shader && stage.dataset.gpu === 'ready') stage.classList.add('shader-ready');
    stage.dataset.paused = String(manualPause || reduced.matches);
  }
  function setProgress(value) {
    progress = Math.max(0,Math.min(100,value));
    shader?.update('pixels',{scale:24+(progress/100)**2*1376,gap:(100-progress)/400});
    onProgress(progress);
    stage.dataset.progress = progress.toFixed(1);
  }
  function tick(now) {
    const dt = Math.min(80,now-(last||now)); last=now;
    if (active() && shader) {
      if (chosen === 'build') {
        wait -= dt;
        if (wait <= 0) {
          setProgress(progress + direction*dt/24);
          if (progress<=0) {direction=1;wait=250;stage.dataset.reachedZero='true';}
          if (progress>=100) {direction=-1;wait=4500+Math.random()*5500;stage.dataset.cycles=String(++cycles);}
        }
      }
      if (chosen === 'sell') {
        if(echoRemaining>0){echoRemaining-=dt;if(echoRemaining<=0)shader.update('ripple',{speed:0});}
      }
    }
    frame=active()?requestAnimationFrame(tick):0;
  }
  async function raster() {
    await document.fonts.ready;
    const box=heading.getBoundingClientRect();
    const scale=Math.min(2,2000/box.width);
    const surface=document.createElement('canvas');
    surface.width=Math.max(1,Math.round(box.width*scale));
    surface.height=Math.max(1,Math.round(box.height*scale));
    const ctx=surface.getContext('2d'); ctx.scale(scale,scale);
    const spans=heading.querySelectorAll('.slogan-word');
    const nodes=spans.length?[...spans]:[heading];
    for(const node of nodes) {
      const style=getComputedStyle(node), rect=node.getBoundingClientRect();
      ctx.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ctx.letterSpacing=style.letterSpacing;
      ctx.fillStyle=getComputedStyle(heading).color;
      const text=node.textContent;
      const m=ctx.measureText(text);
      const ascent=m.fontBoundingBoxAscent??m.actualBoundingBoxAscent;
      const descent=m.fontBoundingBoxDescent??m.actualBoundingBoxDescent;
      const x=spans.length?rect.left-box.left:(box.width-m.width)/2;
      ctx.fillText(text,x,rect.top-box.top+(rect.height-ascent-descent)/2+ascent);
    }
    return surface.toDataURL();
  }
  async function mount() {
    const ticket=++version;
    shader?.destroy(); shader=null; showStatic();
    stage.dataset.gpu='loading';delete stage.dataset.gpuFailure;
    if(disposed||reduced.matches||!navigator.gpu){stage.dataset.gpuFailure=disposed?'disposed':reduced.matches?'reduced-motion':'unsupported';stage.dataset.gpu='static';onState('static');return;}
    try {
      const [{createShader},url]=await Promise.all([loadRuntime(),raster()]);
      if(disposed||ticket!==version)return;
      const dark=document.documentElement.classList.contains('dark');
      const ink=dark?'#e8e7e2':'#28221e';
      stage.style.setProperty('--slogan-mask',`url("${url}")`);
      let components;
      if(chosen==='taste')components=[{type:'SolidColor',props:{color:ink}},{type:'InkFlow',props:{colorMode:'single',color:dark?'#ff8e55':'#c6532c',radius:1.1,force:.55,curl:9,decay:.5,momentum:.75}}];
      if(chosen==='build')components=[{type:'Pixelate',id:'pixels',props:{scale:24+(progress/100)**2*1376,gap:(100-progress)/400},children:[{type:'ImageTexture',props:{url,objectFit:'fill'}}]}];
      if(chosen==='sell')components=[{type:'Ripples',id:'ripple',props:{colorA:dark?'#ff945f':'#b8451f',colorB:ink,speed:0,frequency:9,softness:.6,thickness:.24}}];
      if(chosen==='aurora')components=[{type:'SolidColor',props:{color:dark?'#367f99':'#142b3f'}},{type:'Aurora',props:{colorA:'#ae3ade',colorB:dark?'#44f0ba':'#127c68',colorC:'#2874da',speed:.65,intensity:65,center:{x:.5,y:.55}}}];
      if(chosen==='silk')components=[{type:'FlowingGradient',props:{colorA:dark?'#9250ba':'#291748',colorB:dark?'#f0b759':'#ad3b44',colorC:dark?'#53dcc1':'#126e7e',colorD:dark?'#ed6aaa':'#8152ad',speed:.55,distortion:1.3}}];
      if(chosen==='prism')components=[{type:'SolidColor',props:{color:dark?'#b6bfd8':'#292237'}},{type:'Prism',id:'prism',props:{position:{x:0,y:.8},splitPosition:{x:.25,y:.5},spread:1.5,beamWidth:.09,intensity:1.1,speed:.45,endFalloff:1.7}}];
      let failed=false;
      const next=await createShader(canvas,{components},{disableTelemetry:true,colorSpace:'srgb',onReady(){if(ticket===version&&!disposed&&!failed){stage.dataset.gpu='ready';if(!reduced.matches)stage.classList.add('shader-ready');onState('ready');}},onError(reason){failed=true;stage.dataset.gpuFailure=reason;if(ticket===version){showStatic();stage.dataset.gpu='static';onState('static');}}});
      if(disposed||ticket!==version){next.destroy();return;}
      shader=next;sync();
    } catch (error) {if(ticket===version){stage.dataset.gpuFailure=String(error);showStatic();stage.dataset.gpu='static';onState('static');}}
  }
  function echo(event) {
    if(!active())return;
    const box=canvas.getBoundingClientRect();
    const x='clientX' in event?(event.clientX-box.left)/box.width:.5;
    const y='clientY' in event?(event.clientY-box.top)/box.height:.5;
    if(chosen==='sell'){shader?.update('ripple',{center:{x,y},speed:.65});echoRemaining=2600;}
    if(chosen==='prism')shader?.update('prism',{splitPosition:{x,y}});
  }
  const key = event => {if(event.key==='Enter'||event.key===' '){event.preventDefault();echo(event);}};
  stage.addEventListener('pointerdown',echo);stage.addEventListener('keydown',key);
  const visibility=()=>sync();document.addEventListener('visibilitychange',visibility);
  const motion=()=>{if(reduced.matches)sync();else mount();};reduced.addEventListener('change',motion);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});observer.observe(stage);
  let lastSize='';
  const resize=new ResizeObserver(()=>{const size=`${heading.clientWidth}:${heading.clientHeight}`;if(size===lastSize)return;lastSize=size;clearTimeout(resizeTimer);resizeTimer=setTimeout(mount,180);});resize.observe(heading);
  const theme=new MutationObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(mount,80);});theme.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  // ResizeObserver owns the initial mount; animation time only advances while visible.
  sync();
  return {mode:chosen,pause(value){manualPause=value;sync();},progress(value){setProgress(value);direction=progress>=100?-1:1;wait=4000;},destroy(){disposed=true;version++;clearTimeout(resizeTimer);cancelAnimationFrame(frame);shader?.destroy();observer.disconnect();resize.disconnect();theme.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',motion);stage.removeEventListener('pointerdown',echo);stage.removeEventListener('keydown',key);showStatic();}};
}
