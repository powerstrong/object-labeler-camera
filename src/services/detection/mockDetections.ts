import type { Detection } from './types';

let tick = 0;

/**
 * Native detector가 없는 환경에서도 overlay/UI 파이프라인을 확인할 수 있도록
 * 간단한 mock detection을 생성한다.
 */
export const getMockDetections = (): Detection[] => {
  tick += 1;

  const wobble = (tick % 20) * 3;

  return [
    {
      id: 'mock-1',
      label: '사람',
      rawLabel: 'person',
      confidence: 0.74,
      boundingBox: {
        x: 40 + wobble,
        y: 120,
        width: 140,
        height: 220
      },
      frameSize: { width: 360, height: 640 },
      timestamp: Date.now()
    },
    {
      id: 'mock-2',
      label: '컵',
      rawLabel: 'cup',
      confidence: 0.66,
      boundingBox: {
        x: 220,
        y: 280 + Math.round(wobble / 2),
        width: 72,
        height: 96
      },
      frameSize: { width: 360, height: 640 },
      timestamp: Date.now()
    }
  ];
};
