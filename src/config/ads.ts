// 애드센스 승인 후 client와 슬롯 ID를 채우고 enabled를 true로 바꾼다.
export const ads = {
  enabled: false,
  client: 'ca-pub-0000000000000000',
  slots: {
    'DOC-RIGHT': { id: '', size: '300×600', minHeight: 600 },
    'DOC-MID': { id: '', size: '반응형 인아티클', minHeight: 280 },
    'DOC-END': { id: '', size: '반응형 디스플레이', minHeight: 250 },
    'GRID': { id: '', size: '인피드 1×1', minHeight: 0 },
    'HOME': { id: '', size: '가로 반응형', minHeight: 120 },
  } as Record<string, { id: string; size: string; minHeight: number }>,
};
