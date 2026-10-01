import type { CollectionEntry } from 'astro:content';
export const groups = [
  { id: 'all', label: '全部' },
  { id: 'apps', label: '应用' },
  { id: 'games', label: '游戏' },
  { id: 'reading', label: '阅读' },
  { id: 'creations', label: '创作' },
] as const;
export const sortProjects = (projects: CollectionEntry<'projects'>[]) =>
  [...projects].sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
