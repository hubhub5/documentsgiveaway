// 서지 정보는 알라딘·리디 검색으로 확인한 것만 둔다 (2026.10.27 확인).
// url이 비어 있으면 쿠팡 검색 링크로 대신한다. 쿠팡파트너스 링크를 받으면 url에 넣는다.
export interface Book {
  title: string;
  author: string;
  publisher: string;
  year: number;
  url?: string;
  own?: boolean;
}

export const books: Record<string, Book> = {
  'unknown': { title: 'Unknown: 언노운 - 알려지지 않은 공부법', author: '노랑검정', publisher: '레버리지', year: 2020, url: 'https://ridibooks.com/books/2848000028', own: true },
  'reasonless-calm': { title: '이유 없는 편안함', author: '노랑검정', publisher: '레버리지', year: 2020, url: 'https://ridibooks.com/books/2848000027', own: true },
  'make-it-stick': { title: '어떻게 공부할 것인가', author: '피터 브라운 · 헨리 뢰디거 · 마크 맥대니얼', publisher: '와이즈베리', year: 2014 },
  'mindset': { title: '마인드셋 (리커버 에디션)', author: '캐롤 드웩', publisher: '스몰빅라이프', year: 2023 },
  'stolen-focus': { title: '도둑맞은 집중력', author: '요한 하리', publisher: '어크로스', year: 2023 },
  'metacognition': { title: '메타인지 학습법', author: '리사 손', publisher: '21세기북스', year: 2019 },
  'between-parent-child': { title: '부모와 아이 사이', author: '하임 G. 기너트 외', publisher: '양철북', year: 2025 },
  'why-we-sleep': { title: '우리는 왜 잠을 자야 할까', author: '매슈 워커', publisher: '사람의집', year: 2019 },
  'body-keeps-score': { title: '몸은 기억한다', author: '베셀 반 데어 콜크', publisher: '을유문화사', year: 2020 },
  'rulebook-arguments': { title: '논증의 기술 (전정판)', author: '앤서니 웨스턴', publisher: '필맥', year: 2019 },
  'love-yourself': { title: '러브 유어셀프', author: '크리스틴 네프', publisher: '이너북스', year: 2019 },
  'thinking-fast-slow': { title: '생각에 관한 생각', author: '대니얼 카너먼', publisher: '김영사', year: 2018 },
  'atomic-habits': { title: '아주 작은 습관의 힘', author: '제임스 클리어', publisher: '비즈니스북스', year: 2019 },
  'emotion-coaching': { title: '내 아이를 위한 감정코칭', author: '존 가트맨 · 최성애 · 조벽', publisher: '한국경제신문사', year: 2011 },
  'reading-brain': { title: '공부머리 독서법', author: '최승필', publisher: '책구루', year: 2018 },
  'optimistic-child': { title: '마틴 셀리그만의 낙관적인 아이', author: '마틴 셀리그만', publisher: '물푸레', year: 2010 },
  'how-emotions': { title: '감정은 어떻게 만들어지는가?', author: '리사 펠드먼 배럿', publisher: '생각연구소', year: 2017 },
};

export const bookUrl = (b: Book) => b.url ?? 'https://www.coupang.com/np/search?q=' + encodeURIComponent(b.title.replace(/\s*\(.*\)$/, ''));
