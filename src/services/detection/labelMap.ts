const LABEL_MAP: Record<string, string> = {
  person: '사람',
  cup: '컵',
  mouse: '마우스',
  bottle: '병',
  book: '책',
  keyboard: '키보드',
  'cell phone': '휴대폰',
  phone: '휴대폰',
  laptop: '노트북',
  tv: '모니터',
  monitor: '모니터',
  chair: '의자',
  unknown: '알 수 없음'
};

export const toKoreanLabel = (rawLabel?: string): string => {
  if (!rawLabel) {
    return '알 수 없음';
  }

  const key = rawLabel.toLowerCase().trim();
  return LABEL_MAP[key] ?? '알 수 없음';
};
