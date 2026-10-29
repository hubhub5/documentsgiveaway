import { getCollection, type CollectionEntry } from 'astro:content';
import { u } from './url';

export type Kind = 'problem' | 'concept' | 'method' | 'myth';
type Data = CollectionEntry<'problem'>['data'] | CollectionEntry<'concept'>['data']
  | CollectionEntry<'method'>['data'] | CollectionEntry<'myth'>['data'];

export interface Doc {
  kind: Kind;
  ns: '문제' | '부모' | '개념' | '방법' | '오해';
  id: string;
  title: string;
  url: string;
  data: any;
  out: Set<string>;
  sourceIds: Set<string>;
}

export interface Registry {
  docs: Doc[];
  byTitle: Map<string, Doc>;
  back: Map<string, Doc[]>;
  sources: Map<string, CollectionEntry<'source'>['data'] & { id: string }>;
  citedBy: Map<string, Doc[]>;
}

const LINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export const docUrl = (title: string) => u('/w/') + title.split('/').map(encodeURIComponent).join('/') + '/';
export const sourceUrl = (id: string) => u(`/r/${id}/`);

function collectText(v: unknown, acc: string[]) {
  if (typeof v === 'string') acc.push(v);
  else if (Array.isArray(v)) v.forEach((x) => collectText(x, acc));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => collectText(x, acc));
}

export function linksIn(v: unknown): string[] {
  const texts: string[] = [];
  collectText(v, texts);
  const found: string[] = [];
  for (const t of texts) for (const m of t.matchAll(LINK)) found.push(m[1].trim());
  return found;
}

let cache: Promise<Registry> | null = null;

export function registry(): Promise<Registry> {
  cache ??= build();
  return cache;
}

async function build(): Promise<Registry> {
  const [problems, concepts, methods, myths, srcs] = await Promise.all([
    getCollection('problem'), getCollection('concept'), getCollection('method'),
    getCollection('myth'), getCollection('source'),
  ]);

  const docs: Doc[] = [];
  const add = (kind: Kind, ns: Doc['ns'], data: Data) => {
    const d = data as any;
    const out = new Set<string>([...linksIn(d), ...(d.related ?? []), ...(d.leadsTo ?? []), ...(d.basis ?? [])]);
    out.delete(d.title);
    const sourceIds = new Set<string>([...(d.sources ?? []), ...((d.studies ?? []).map((x: any) => x.source))]);
    docs.push({ kind, ns, id: d.id, title: d.title, url: docUrl(d.title), data: d, out, sourceIds });
  };
  problems.forEach((e) => add('problem', e.data.audience === '부모' ? '부모' : '문제', e.data));
  concepts.forEach((e) => add('concept', '개념', e.data));
  methods.forEach((e) => add('method', '방법', e.data));
  myths.forEach((e) => add('myth', '오해', e.data));

  const byTitle = new Map(docs.map((d) => [d.title, d]));
  const back = new Map<string, Doc[]>();
  for (const d of docs) for (const t of d.out) {
    if (!back.has(t)) back.set(t, []);
    back.get(t)!.push(d);
  }

  const sources = new Map(srcs.map((e) => [e.id, { ...e.data, id: e.id }]));
  const citedBy = new Map<string, Doc[]>();
  for (const d of docs) for (const s of d.sourceIds) {
    if (!citedBy.has(s)) citedBy.set(s, []);
    citedBy.get(s)!.push(d);
  }

  docs.sort((a, b) => a.id.localeCompare(b.id));
  return { docs, byTitle, back, sources, citedBy };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** [[문서]] · [[문서|표시]] 를 링크로 바꾼다. 없는 문서는 회색 '미작성' 표시. */
export function wiki(text: string, reg: Registry): string {
  let html = '';
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    html += esc(text.slice(last, m.index));
    const title = m[1].trim();
    const label = esc((m[2] ?? title).trim());
    const doc = reg.byTitle.get(title);
    html += doc
      ? `<a class="wl" href="${doc.url}" data-ns="${doc.ns}">${label}</a>`
      : `<span class="wl-missing" title="미작성 문서">${label}</span>`;
    last = m.index! + m[0].length;
  }
  return html + esc(text.slice(last));
}

export const linkCount = (d: Doc, reg: Registry) => d.out.size + (reg.back.get(d.title)?.length ?? 0);

export const lastDate = (d: Doc) => d.data.history.at(-1).date as string;
