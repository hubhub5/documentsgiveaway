import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 자유 텍스트는 모두 글자 수 상한을 둔다. 긴 문단이 들어갈 자리를 처음부터 없앤다.
const s = (max: number) => z.string().min(1).max(max);
const grade = z.enum(['A', 'B', 'C', 'D']);
const date = z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/);

const meta = {
  id: z.string().regex(/^[PFCMX]-\d{4}$/),
  title: s(40),
  status: z.enum(['초안', '검토됨']).default('초안'),
  history: z.array(z.object({ date, note: s(40) })).min(1),
  sources: z.array(z.string()).default([]),
  books: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
};

export const FACETS = {
  when: ['시작 전', '공부 중', '시험 직전', '시험 중', '결과 후', '잠들기 전'],
  where: ['집 책상', '거실', '학원', '교실', '독서실', '이동 중'],
  with: ['혼자', '엄마 옆', '친구와', '선생님 앞'],
  subject: ['암기', '수리', '독해', '서술', '전 과목'],
  freq: ['가끔', '매주', '거의 매일'],
} as const;

export const FACTORS = [
  '불안·긴장', '수치심·자책', '비교·조바심', '부담·기대', '회피', '완벽주의',
  '무력감', '신체 각성', '주의 분산', '과거 경험',
] as const;

export const AGES = ['초저', '초고', '중등', '고등', '부모'] as const;

const who = z.enum(['아이', '엄마', '아빠', '선생님', '친구']);

const problem = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/problem' }),
  schema: z.object({
    ...meta,
    audience: z.enum(['아이', '부모']).default('아이'),
    category: z.enum(['기억·인출', '시작·지속', '감정·자기평가', '몸', '관계', '읽기', '부모']),
    line: s(70),
    ages: z.array(z.enum(AGES)).min(1),
    grade,
    facets: z.object({
      when: z.array(z.enum(FACETS.when)).min(1),
      where: z.array(z.enum(FACETS.where)).default([]),
      with: z.array(z.enum(FACETS.with)).default([]),
      subject: z.array(z.enum(FACETS.subject)).default([]),
      freq: z.enum(FACETS.freq),
    }),
    factors: z.object({ main: z.enum(FACTORS), sub: z.array(z.enum(FACTORS)).max(3).default([]) }),
    says: z.array(z.object({ who, text: s(44) })).min(1).max(5),
    signals: z.object({
      body: z.array(s(24)).default([]),
      thought: z.array(s(30)).default([]),
      action: z.array(s(30)).default([]),
    }),
    scene: z.array(z.object({ time: s(44), lines: z.array(z.object({ who, text: s(44) })).min(1).max(3) })).max(2).default([]),
    flow: z.object({
      trigger: s(44), thought: s(44), feel: s(44), pattern: s(50), break: s(50), residue: s(60),
    }),
    causes: z.array(s(70)).min(1).max(4),
    triggers: z.array(z.object({
      text: s(46), when: s(20), time: s(8), who: z.enum(['본인', '엄마', '같이']), grade,
    })).min(1).max(6),
    solutions: z.array(z.object({
      method: s(30), basis: s(30), grade, time: s(10), age: s(10),
    })).default([]),
    talk: z.array(z.object({ avoid: s(44), instead: s(44) })).default([]),
    small: z.object({ today: s(50), week: s(50), month: s(50) }),
    recovery: z.array(s(56)).min(1).max(4),
    expert: z.array(s(50)).min(1).max(4),
    limits: s(90),
    leadsTo: z.array(z.string()).default([]),
  }),
});

const concept = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/concept' }),
  schema: z.object({
    ...meta,
    en: s(60),
    origin: s(50),
    field: s(20),
    line: s(80),
    grade,
    replication: z.enum(['반복 확인', '대체로 확인', '엇갈림', '논란']),
    caveat: s(90).optional(),
    studies: z.array(z.object({ source: z.string(), who: s(30), result: s(70) })).min(1).max(5),
    examples: z.array(z.object({ who, text: s(44) })).default([]),
  }),
});

const method = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/method' }),
  schema: z.object({
    ...meta,
    line: s(70),
    time: s(12),
    tools: s(30),
    ages: s(16),
    mode: z.enum(['혼자', '부모와', '둘 다']),
    grade,
    basis: z.array(z.string()).min(1),
    steps: z.array(s(56)).min(2).max(7),
    mistakes: z.array(s(56)).min(1).max(4),
    sheet: z.array(s(30)).optional(),
  }),
});

const myth = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/myth' }),
  schema: z.object({
    ...meta,
    claim: s(60),
    grade,
    evidence: z.array(s(80)).min(1).max(4),
    spread: z.array(s(60)).min(1).max(3),
    instead: z.array(s(60)).min(1).max(3),
  }),
});

const source = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/source' }),
  schema: z.object({
    authors: z.string(),
    year: z.number(),
    title: z.string(),
    venue: z.string(),
    volume: z.string().optional(),
    pages: z.string().optional(),
    doi: z.string().optional(),
    type: z.enum(['메타분석', '체계적 고찰', '종설', '실험', '현장 실험', '종단 연구', '상관 연구', '이론', '단행본']),
    note: s(70),
  }),
});

export const collections = { problem, concept, method, myth, source };
