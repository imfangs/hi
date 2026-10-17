import {effects} from '../../public/omarchy/manifest.json';

export function attachIdleHero(stage) {
  const words=['TASTE','BUILD','SELL'];
  stage.dataset.effectCount=String(effects.length);
  const canvases=[...stage.querySelectorAll('canvas')],button=stage.querySelector('[data-idle-pause]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let engine,recordings=[],effectIndex=0,elapsed=0,last=0,raf=0,frames=[-1,-1,-1],visible=true,paused=false,controller,version=0,loading=false,suspended=false;
  const active=()=>!paused&&!reduced.matches&&visible&&!document.hidden&&!suspended;
  function sync(){
    stage.dataset.paused=String(paused||reduced.matches);button.textContent=paused?'播放':'暂停';button.setAttribute('aria-label',paused?'播放字标动画':'暂停字标动画');
    cancelAnimationFrame(raf);raf=0;last=0;
    if(active()&&recordings.length)raf=requestAnimationFrame(tick);
  }
  function draw(final=false){recordings.forEach((r,i)=>{const n=final?r.frames.length-1:Math.min(Math.floor(elapsed*r.fps),r.frames.length-1);if(n!==frames[i]){engine.drawFrame(canvases[i],r,n);frames[i]=n;}});}
  async function load(){
    const ticket=++version;controller?.abort();controller=new AbortController();loading=true;
    try{
      const playerUrl='/omarchy/player.js';
      engine??=await import(/* @vite-ignore */ playerUrl);
      const next=await Promise.all(words.map(w=>engine.loadRecording(w,effects[effectIndex],controller.signal)));
      if(ticket!==version||suspended)return;
      recordings=next;frames=[-1,-1,-1];elapsed=0;loading=false;
      // Start with a readable word, then replay the complete reveal.
      draw(true);stage.dataset.ready='true';stage.dataset.effect=effects[effectIndex];button.hidden=reduced.matches;
      sync();
    }catch(error){if(error.name!=='AbortError'){stage.dataset.error='load';console.warn('Idle wordmark kept its readable fallback.',error);paused=true;sync();}loading=false;}
  }
  function tick(time){
    const dt=last?Math.min((time-last)/1000,.1):0;last=time;
    if(!loading){elapsed+=dt;draw();const duration=Math.max(...recordings.map(r=>r.frames.length/r.fps));if(elapsed>duration+4){effectIndex=(effectIndex+1)%effects.length;load();}}
    if(active())raf=requestAnimationFrame(tick);
  }
  button.onclick=()=>{paused=!paused;sync();};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(stage);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{button.hidden=reduced.matches;if(reduced.matches)draw(true);sync();});
  addEventListener('pagehide',()=>{suspended=true;controller?.abort();cancelAnimationFrame(raf);});
  addEventListener('pageshow',event=>{if(event.persisted){suspended=false;load();}});
  requestAnimationFrame(()=>requestAnimationFrame(load));
}
