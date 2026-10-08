import { groups, cleanSearch } from '../lib/projects';

const params = new URL(location.href).searchParams;
const selectedGroup = groups.find(group => group.id === params.get('view'));
const query = cleanSearch(params.get('q') ?? '');
const detail = document.querySelector<HTMLElement>('[data-work-id]');
const workId = detail?.dataset.workId;

if (workId) {
  const returnParams = new URLSearchParams();
  if (selectedGroup) returnParams.set('view', selectedGroup.id);
  if (query) returnParams.set('q', query);
  const returnUrl = new URL('/', location.origin);
  returnUrl.search = returnParams.toString();
  returnUrl.hash = `work-${workId}`;
  const label = query
    ? '返回搜索结果'
    : selectedGroup && selectedGroup.id !== 'all'
      ? `返回${selectedGroup.label}作品`
      : '回到全部作品';

  document.querySelectorAll<HTMLAnchorElement>('[data-return]').forEach(link => {
    link.href = `${returnUrl.pathname}${returnUrl.search}${returnUrl.hash}`;
    const text = link.querySelector<HTMLElement>('[data-return-label]');
    if (text) text.textContent = label;
    link.setAttribute('aria-label', `${label}，回到《${detail?.dataset.workTitle ?? ''}》`);
  });
}

// Related cards deliberately start a fresh browse of this work's category.
// A search from the previous gallery should not hide the next work on return.
document.querySelectorAll<HTMLAnchorElement>('.detail-related-card').forEach(link => {
  const group = groups.find(item => item.id !== 'all' && item.id === link.dataset.group);
  if (!group || !link.dataset.filteredHref || !link.dataset.filteredTitle) return;
  const target = new URL(link.dataset.filteredHref, location.origin);
  if (target.origin !== location.origin || target.pathname === location.pathname) return;
  target.search = new URLSearchParams({ view: group.id }).toString();
  target.hash = '';
  link.href = `${target.pathname}${target.search}`;
  const title = link.querySelector<HTMLElement>('strong');
  if (title) title.textContent = link.dataset.filteredTitle;
});
