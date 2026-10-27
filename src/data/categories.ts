export interface Category { name: string; code: string; line: string; ns: '문제' | '부모' | '개념' | '방법' | '오해' }

export const categories: Category[] = [
  { name: '기억·인출', code: 'MEM', ns: '문제', line: '외웠는데 안 나오고, 알았는데 틀리는 일' },
  { name: '시작·지속', code: 'RUN', ns: '문제', line: '앉기까지, 이어가기까지 걸리는 일' },
  { name: '감정·자기평가', code: 'EMO', ns: '문제', line: '틀린 뒤, 비교한 뒤, 결과 뒤에 생기는 일' },
  { name: '몸', code: 'BDY', ns: '문제', line: '공부 앞에서 몸이 먼저 반응하는 일' },
  { name: '관계', code: 'REL', ns: '문제', line: '엄마, 형제, 선생님 사이에서 생기는 일' },
  { name: '읽기', code: 'RDG', ns: '문제', line: '글의 흐름과 숨은 전제를 놓치는 일' },
  { name: '부모', code: 'PAR', ns: '부모', line: '엄마 쪽에서 먼저 흔들리는 일' },
  { name: '개념', code: 'CPT', ns: '개념', line: '실제 연구에서 나온 이론과 현상' },
  { name: '방법', code: 'MTD', ns: '방법', line: '그 자리에서 따라 할 수 있는 절차' },
  { name: '오해', code: 'MYT', ns: '오해', line: '근거가 약한데 널리 퍼진 말' },
];

export const catUrl = (name: string) => '/분류/' + encodeURIComponent(name) + '/';
