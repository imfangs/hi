import { groups, cleanSearch } from '../lib/projects';

const toolbar = document.querySelector<HTMLElement>('.browse-toolbar');
const items = [...document.querySelectorAll<HTMLElement>('.work-item')];
const list = document.querySelector<HTMLElement>('#work-list');
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
const search = document.querySelector<HTMLInputElement>('#work-search');
const clear = document.querySelector<HTMLButtonElement>('.search-clear');
const status = document.querySelector<HTMLElement>('#filter-status');
const empty = document.querySelector<HTMLElement>('.work-empty');
const emptyTitle = document.querySelector<HTMLElement>('[data-empty-title]');
const works = document.querySelector<HTMLElement>('#works');
const allowed: string[] = groups.map(group => group.id);
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
const corpus = new Map(items.map(item => [item, normalize(item.dataset.search ?? '')]));
let composing = false;
let announceTimer: ReturnType<typeof setTimeout>;

function state() {
  const params = new URL(location.href).searchParams;
  const view = params.get('view') ?? 'all';
  return { view: allowed.includes(view) ? view : 'all', query: cleanSearch(params.get('q') ?? '') };
}
function apply(announce = false) {
  const { view, query } = state();
  list?.setAttribute('data-layout', view === 'all' && !query ? 'exhibition' : 'grid');
  const terms = normalize(query).split(' ').filter(Boolean);
  const matches = items.filter(item => terms.every(term => corpus.get(item)?.includes(term)));
  for (const item of items) item.hidden = !matches.includes(item) || (view !== 'all' && item.dataset.group !== view);
  for (const button of buttons) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === view));
  }
  for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-project], [data-preview-project]')) {
    const url = new URL(link.href);
    view === 'all' ? url.searchParams.delete('view') : url.searchParams.set('view', view);
    query ? url.searchParams.set('q', query) : url.searchParams.delete('q');
    link.href = url.pathname + url.search;
  }
  if (search && document.activeElement !== search) search.value = query;
  if (clear) clear.hidden = !query;
  toolbar?.classList.toggle('has-query', Boolean(query));
  const visible = items.filter(item => !item.hidden).length;
  if (empty) empty.hidden = visible > 0;
  if (emptyTitle) emptyTitle.textContent = query ? `没有找到「${query}」` : '这个分类暂时没有作品';
  if (announce && status) {
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => { status.textContent = `${groups.find(group => group.id === view)?.label ?? '全部'}，${visible} 件作品${query ? `，搜索 ${query}` : ''}`; }, 180);
  }
}
function writeState(view: string, query: string, push: boolean) {
  const url = new URL(location.href);
  const cleanQuery = cleanSearch(query);
  view === 'all' ? url.searchParams.delete('view') : url.searchParams.set('view', view);
  cleanQuery ? url.searchParams.set('q', cleanQuery) : url.searchParams.delete('q');
  url.hash = 'works';
  if (url.href !== location.href) history[push ? 'pushState' : 'replaceState'](null, '', url);
  apply(true);
  if (works && works.getBoundingClientRect().top < -32) works.scrollIntoView({ block: 'start', behavior: 'instant' });
}
function restoreCard() {
  if (!location.hash.startsWith('#work-')) return;
  const item = document.getElementById(location.hash.slice(1));
  if (!item?.classList.contains('work-item') || item.hidden) return;
  requestAnimationFrame(() => {
    item.scrollIntoView({ block: 'start', behavior: 'instant' });
    item.querySelector<HTMLAnchorElement>('[data-project]')?.focus({ preventScroll: true });
  });
}
if (toolbar && search && clear) {
  toolbar.hidden = false;
  const measure = () => document.documentElement.style.setProperty('--browse-bar-height', `${Math.ceil(toolbar.getBoundingClientRect().height)}px`);
  measure();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(toolbar);
  const sentinel = document.querySelector('.browse-sentinel');
  if (sentinel && 'IntersectionObserver' in window) new IntersectionObserver(([entry]) => toolbar.classList.toggle('is-stuck', !entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 }).observe(sentinel);
  apply();
  restoreCard();
  buttons.forEach(button => button.addEventListener('click', () => writeState(button.dataset.filter ?? 'all', search.value, true)));
  search.addEventListener('compositionstart', () => { composing = true; });
  search.addEventListener('compositionend', () => { composing = false; writeState(state().view, search.value, false); });
  search.addEventListener('input', event => { if (!composing && !(event instanceof InputEvent && event.isComposing)) writeState(state().view, search.value, false); });
  clear.addEventListener('click', () => { search.value = ''; writeState(state().view, '', false); search.focus(); });
  search.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !event.isComposing && search.value) { event.preventDefault(); search.value = ''; writeState(state().view, '', false); }
  });
  document.querySelector('[data-reset-gallery]')?.addEventListener('click', () => { search.value = ''; writeState('all', '', true); search.focus(); });
  document.addEventListener('keydown', event => {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select'))) return;
    event.preventDefault(); works?.scrollIntoView({ block: 'start', behavior: 'instant' }); search.focus({ preventScroll: true });
  });
  window.addEventListener('popstate', () => { search.value = state().query; apply(true); restoreCard(); });
  window.addEventListener('pageshow', event => { if (event.persisted) { search.value = state().query; apply(); } });
}
