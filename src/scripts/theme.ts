export {};
const control = document.querySelector<HTMLElement>('.theme-control');
const trigger = control?.querySelector<HTMLButtonElement>('.theme-trigger');
const options = control?.querySelector<HTMLElement>('.theme-options');
const buttons = [...(control?.querySelectorAll<HTMLButtonElement>('[data-theme]') ?? [])];
const system = matchMedia('(prefers-color-scheme: dark)');
const labels: Record<string, string> = {system:'跟随系统',light:'浅色',dark:'深色'};
let preference = document.documentElement.dataset.themePreference ?? 'system';
function apply() {
  const dark = preference === 'dark' || (preference === 'system' && system.matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.dataset.themePreference = preference;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if(meta) meta.content = dark ? '#131312' : '#fafaf7';
  trigger?.setAttribute('aria-label',`配色：${labels[preference]}`);
  buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.theme===preference)));
}
function close(returnFocus=false) {
  if(options) options.hidden = true;
  trigger?.setAttribute('aria-expanded','false');
  if(returnFocus) trigger?.focus();
}
if(control && trigger && options) {
  control.hidden = false;
  apply();
  trigger.addEventListener('click',()=>{
    options.hidden = !options.hidden;
    trigger.setAttribute('aria-expanded',String(!options.hidden));
    if(!options.hidden) buttons.find(button=>button.dataset.theme===preference)?.focus();
  });
  buttons.forEach(button=>button.addEventListener('click',()=>{
    preference=button.dataset.theme??'system';
    try{localStorage.setItem('hi-theme',preference);}catch{}
    apply();close(true);
  }));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!options.hidden)close(true);});
  document.addEventListener('click',event=>{if(event.target instanceof Node&&!control.contains(event.target))close();});
  control.addEventListener('focusout',event=>{if(event.relatedTarget instanceof Node&&!control.contains(event.relatedTarget))close();});
  system.addEventListener('change',()=>{if(preference==='system')apply();});
}
