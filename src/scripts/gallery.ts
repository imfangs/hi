import { groups } from '../lib/projects';
const bar = document.querySelector<HTMLElement>('.filter-bar');
const items = [...document.querySelectorAll<HTMLElement>('.work-item')];
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
const status = document.querySelector<HTMLElement>('#filter-status');
const allowed: string[] = groups.map(group => group.id);
function apply(value:string,announce=false) {
  const filter=allowed.includes(value)?value:'all';
  for(const item of items) item.hidden=filter!=='all'&&item.dataset.group!==filter;
  for(const button of buttons) button.setAttribute('aria-pressed',String(button.dataset.filter===filter));
  for(const link of document.querySelectorAll<HTMLAnchorElement>('[data-project]')) {
    const url=new URL(link.href);filter==='all'?url.searchParams.delete('view'):url.searchParams.set('view',filter);link.href=url.pathname+url.search;
  }
  if(announce&&status){const label=buttons.find(b=>b.dataset.filter===filter)?.childNodes[0].textContent??'全部';status.textContent=`${label}，${items.filter(i=>!i.hidden).length} 件作品`;}
}
if(bar){
  bar.hidden=false;
  apply(new URL(location.href).searchParams.get('view')??'all');
  buttons.forEach(button=>button.addEventListener('click',()=>{
    const value=button.dataset.filter??'all';
    const url=new URL(location.href);value==='all'?url.searchParams.delete('view'):url.searchParams.set('view',value);
    if(url.href!==location.href)history.pushState(null,'',url);
    apply(value,true);
  }));
  window.addEventListener('popstate',()=>apply(new URL(location.href).searchParams.get('view')??'all',true));
}
