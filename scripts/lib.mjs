import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CONTENT = path.join(ROOT, 'src/content');

export function loadDocs() {
  const out = [];
  for (const kind of ['problem', 'concept', 'method', 'myth']) {
    const dir = path.join(CONTENT, kind);
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.yaml'))) {
      const file = path.join(dir, f);
      out.push({ kind, file: path.relative(ROOT, file), data: YAML.parse(fs.readFileSync(file, 'utf8')) });
    }
  }
  return out;
}

export function strings(v, at = '', acc = []) {
  if (typeof v === 'string') acc.push([at, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${at}[${i}]`, acc));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, at ? `${at}.${k}` : k, acc);
  return acc;
}
