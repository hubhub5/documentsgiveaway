// astro sync는 첫 오류에서 멈춘다. 글자 수 상한만 따로 전부 훑어 한꺼번에 보여 준다.
import { loadDocs, strings } from './lib.mjs';

const LIMITS = {
  problem: { title: 40, line: 70, 'says.text': 44, 'signals.body': 24, 'signals.thought': 30, 'signals.action': 30, 'scene.time': 44, 'scene.lines.text': 44,
    'flow.trigger': 44, 'flow.thought': 44, 'flow.feel': 44, 'flow.pattern': 50, 'flow.break': 50, 'flow.residue': 60, causes: 70,
    'triggers.text': 46, 'triggers.when': 20, 'triggers.time': 8, 'solutions.method': 30, 'solutions.basis': 30, 'solutions.time': 10, 'solutions.age': 10,
    'talk.avoid': 44, 'talk.instead': 44, 'small.today': 50, 'small.week': 50, 'small.month': 50, recovery: 56, expert: 50, limits: 90 },
  concept: { title: 40, en: 60, origin: 50, field: 20, line: 80, caveat: 90, 'studies.who': 30, 'studies.result': 70, 'examples.text': 44 },
  method: { title: 40, line: 70, time: 12, tools: 30, ages: 16, steps: 56, mistakes: 56, sheet: 30 },
  myth: { title: 40, claim: 60, evidence: 80, spread: 60, instead: 60 },
};
let bad = 0;
for (const d of loadDocs()) {
  for (const [at, s] of strings(d.data)) {
    const key = at.replace(/\[\d+\]/g, '');
    const max = LIMITS[d.kind][key];
    if (max && [...s].length > max) { console.log(`✗ ${d.data.id} ${at} ${[...s].length}/${max}: ${s}`); bad++; }
  }
}
console.log(bad ? `글자 수 초과 ${bad}건` : '글자 수: 통과');
process.exit(bad ? 1 : 0);
