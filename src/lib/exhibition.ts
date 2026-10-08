/** Visual arrangement only; project priority and content order stay in their own sources. */
export type ExhibitionPresentation = {
  span: 4 | 5 | 6 | 7 | 12;
  treatment: 'lead' | 'feature' | 'standard';
};

const arrangement = [
  'chenchen-atelier',
  'junxia-comic',
  'yuzu-island',
  'pocket-ged',
  'taste',
  'school-secret-lab',
  'little-pause',
  'lehh',
  'pocofocus',
  'junlugu',
  'snow-duel',
  'qiya-herbarium',
  'hyrule',
  'the-perfect-run',
  'aiedu',
  'wbw',
  'dankoe',
] as const;

const positions = new Map<string, number>(arrangement.map((id, index) => [id, index]));

const presentation: Record<string, ExhibitionPresentation> = {
  'chenchen-atelier': { span: 12, treatment: 'lead' },
  'junxia-comic': { span: 5, treatment: 'standard' },
  'yuzu-island': { span: 7, treatment: 'standard' },
  'pocket-ged': { span: 7, treatment: 'standard' },
  taste: { span: 5, treatment: 'standard' },
  'school-secret-lab': { span: 12, treatment: 'feature' },
  'little-pause': { span: 6, treatment: 'standard' },
  lehh: { span: 6, treatment: 'standard' },
  pocofocus: { span: 5, treatment: 'standard' },
  junlugu: { span: 7, treatment: 'standard' },
  'snow-duel': { span: 7, treatment: 'standard' },
  'qiya-herbarium': { span: 5, treatment: 'standard' },
  hyrule: { span: 6, treatment: 'standard' },
  'the-perfect-run': { span: 6, treatment: 'standard' },
  aiedu: { span: 4, treatment: 'standard' },
  wbw: { span: 4, treatment: 'standard' },
  dankoe: { span: 4, treatment: 'standard' },
};

export function arrangeExhibition<T extends { id: string }>(projects: readonly T[]): T[] {
  return [...projects].sort((left, right) =>
    (positions.get(left.id) ?? arrangement.length) - (positions.get(right.id) ?? arrangement.length));
}

export function presentationFor(projectId: string): ExhibitionPresentation {
  return Object.hasOwn(presentation, projectId)
    ? presentation[projectId]
    : { span: 6, treatment: 'standard' };
}
