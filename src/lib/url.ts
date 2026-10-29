// 하위 경로 배포(예: GitHub Pages /documentsgiveaway/)를 위해 모든 내부 주소는 여기를 거친다.
const B = import.meta.env.BASE_URL.replace(/\/?$/, '/');
export const u = (p: string) => B + p.replace(/^\//, '');
