import { groups } from '../lib/projects';
const value = new URL(location.href).searchParams.get('view');
if(value && groups.some(group => group.id !== 'all' && group.id === value)) {
  document.querySelectorAll<HTMLAnchorElement>('[data-return]').forEach(a=>{a.href=`/?view=${value}#works`;});
  const next = document.querySelector<HTMLAnchorElement>('.next-project');
  if(next?.dataset.group === value && next.dataset.filteredHref && next.dataset.filteredHref !== location.pathname && next.dataset.filteredTitle) {
    next.href = `${next.dataset.filteredHref}?view=${value}`;
    const title = next.querySelector('strong');
    if(title) title.textContent = next.dataset.filteredTitle;
  }
}
