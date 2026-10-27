// 출처의 DOI를 Crossref에 조회해 연도·제목이 맞는지 확인한다. 네트워크가 필요해 빌드에는 넣지 않는다.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { ROOT } from './lib.mjs';

const dir = path.join(ROOT, 'src/content/source');
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
let bad = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.yaml'))) {
  const s = YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (!s.doi) { console.log(`- ${f}: DOI 없음 (${s.type})`); continue; }
  await new Promise((r) => setTimeout(r, 400));
  const res = await fetch('https://api.crossref.org/works/' + encodeURIComponent(s.doi), { headers: { 'User-Agent': 'study-archive-verify/0.1' } });
  if (!res.ok) { console.log(`✗ ${f}: HTTP ${res.status}`); bad++; continue; }
  const m = (await res.json()).message;
  const year = (m['published-print'] || m['published-online'] || m.issued)?.['date-parts']?.[0]?.[0];
  const okTitle = norm(m.title?.[0] ?? '').startsWith(norm(s.title).slice(0, 30));
  if (year !== s.year || !okTitle) { console.log(`✗ ${f}: ${year}/${s.year} · ${m.title?.[0]}`); bad++; }
  else console.log(`✓ ${f}`);
}
console.log(bad ? `불일치 ${bad}건` : '출처 확인: 통과');
process.exit(bad ? 1 : 0);
