import type { BoundingBox } from '../services/detection/types';

/**
 * Camera preview가 cover 모드로 꽉 차게 렌더링된다고 가정하고,
 * 프레임 좌표계를 화면 좌표계로 변환한다.
 */
export const mapFrameBoxToView = (
  box: BoundingBox,
  frameWidth: number,
  frameHeight: number,
  viewWidth: number,
  viewHeight: number
): BoundingBox => {
  if (frameWidth <= 0 || frameHeight <= 0 || viewWidth <= 0 || viewHeight <= 0) {
    return box;
  }

  const frameAspect = frameWidth / frameHeight;
  const viewAspect = viewWidth / viewHeight;

  const scale = frameAspect > viewAspect ? viewHeight / frameHeight : viewWidth / frameWidth;

  const scaledFrameWidth = frameWidth * scale;
  const scaledFrameHeight = frameHeight * scale;

  const offsetX = (viewWidth - scaledFrameWidth) / 2;
  const offsetY = (viewHeight - scaledFrameHeight) / 2;

  return {
    x: box.x * scale + offsetX,
    y: box.y * scale + offsetY,
    width: box.width * scale,
    height: box.height * scale
  };
};
