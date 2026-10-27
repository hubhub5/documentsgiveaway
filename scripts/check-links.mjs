// 위키 링크와 related·leadsTo·basis가 실제 문서를 가리키는지 확인한다.
import { loadDocs, strings } from './lib.mjs';

const docs = loadDocs();
const titles = new Set(docs.map((d) => d.data.title));
const ids = new Map();
const LINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const missing = new Map();
let dupe = 0;

for (const d of docs) {
  if (ids.has(d.data.id)) { console.log(`✗ 중복 ID ${d.data.id}: ${d.file} · ${ids.get(d.data.id)}`); dupe++; }
  ids.set(d.data.id, d.file);
  const refs = [];
  for (const [, s] of strings(d.data)) for (const m of s.matchAll(LINK)) refs.push(m[1].trim());
  refs.push(...(d.data.related ?? []), ...(d.data.leadsTo ?? []), ...(d.data.basis ?? []));
  for (const t of refs) if (!titles.has(t)) {
    if (!missing.has(t)) missing.set(t, []);
    missing.get(t).push(d.data.id);
  }
  if (d.data.title.includes('/')) {
    const parent = d.data.title.split('/').slice(0, -1).join('/');
    if (!titles.has(parent)) console.log(`! 상위 문서 없음: ${d.data.title}`);
  }
}

const back = new Map();
for (const d of docs) for (const [, s] of strings(d.data)) for (const m of s.matchAll(LINK)) back.set(m[1].trim(), true);
for (const d of docs) for (const t of [...(d.data.related ?? []), ...(d.data.leadsTo ?? []), ...(d.data.basis ?? [])]) back.set(t, true);
const orphans = docs.filter((d) => !back.has(d.data.title) && !d.data.title.includes('/'));

console.log(`문서 ${docs.length} · 미작성 링크 ${missing.size} · 고아 문서 ${orphans.length}`);
for (const [t, from] of [...missing].sort((a, b) => b[1].length - a[1].length)) console.log(`  미작성  ${t}  ← ${[...new Set(from)].join(', ')}`);
for (const o of orphans) console.log(`  고아    ${o.data.id} ${o.data.title}`);
if (dupe) process.exit(1);
