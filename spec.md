# Android Object Label Camera App - MVP Spec

## 1. Goal
Build an Android-only MVP camera app with **React Native CLI + TypeScript**. The app shows camera preview and overlays detected object bounding boxes with **Korean labels**.

Priorities:
1. Reliable Android execution
2. Working camera preview
3. On-device object detection
4. Korean text labels as overlay
5. Swappable detection engine architecture

Accuracy is secondary to iteration speed and stability.

## 2. Platform / Stack
### Required
- React Native CLI
- Android only
- TypeScript
- Native Android integration allowed
- On-device detection only
- No backend

### Recommended
- `react-native-vision-camera`
- Google ML Kit Object Detection
- RN overlay rendering
- Kotlin native bridge/module

### Non-goals (MVP)
- iOS support
- auth/accounts
- cloud inference
- paid APIs
- custom training
- capture/gallery/history
- polished design system

## 3. Product Description
- App opens directly to camera screen
- Detect objects in scene and show:
  - bounding box
  - Korean label

If classification is uncertain, allow generic label or `알 수 없음`.

## 4. MVP Requirements
### Core
1. Rear camera live preview
2. Periodic on-device detection
3. Bounding boxes
4. Korean labels
5. Continuous updates while active
6. Camera permission flow
7. Offline after install

### Performance
- Near-real-time acceptable
- Detection interval target: **300-500ms**
- Stability over FPS

## 5. Detection Strategy
### Phase 1 (required)
- Android Google ML Kit Object Detection

### Phase 2 (future)
- Detector replacement/extension 가능하도록 추상화 유지

## 6. Korean Label Policy
UI에는 한국어 라벨만 노출.

Initial mapping examples:
- person -> 사람
- cup -> 컵
- mouse -> 마우스
- bottle -> 병
- book -> 책
- keyboard -> 키보드
- cell phone/phone -> 휴대폰
- laptop -> 노트북
- tv/monitor -> 모니터
- chair -> 의자
- unknown -> 알 수 없음

No safe mapping이면 라벨 숨김 또는 `알 수 없음`.

## 7. App Flow
1. Launch
2. Request camera permission
3. Permission granted: open camera screen
4. Denied: retry/settings guidance

Camera screen:
1. Full-screen rear preview
2. Periodic detection
3. Convert frame coordinates -> screen coordinates
4. Render box + Korean label

## 8. Technical Requirements
- React Native CLI + TypeScript
- Android-first
- portrait mode 허용
- detection results structured and normalized
- coordinate mapping for aspect ratio/rotation handling

## 9. Suggested Architecture
```text
src/
  components/
    CameraOverlay.tsx
    BoundingBox.tsx
    DetectionLabel.tsx
  screens/
    CameraScreen.tsx
  hooks/
    useCameraPermission.ts
    useObjectDetection.ts
  services/
    detection/
      types.ts
      labelMap.ts
      detectorAdapter.ts
  utils/
    coordinateMapping.ts
    throttle.ts
android/
  ... native integration code ...
```

## 10. Detection Abstraction
```ts
type Detection = {
  id?: string;
  label: string; // Korean label
  rawLabel?: string;
  confidence?: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
```

UI는 normalized detections만 사용.

## 11. UI Requirements
- Full-screen preview
- Overlay 박스/라벨
- 가독성 높은 스타일
- 디버그 정보는 optional

## 12. Error Handling
- Permission denied 안내 + 재시도
- Camera unavailable fallback 메시지
- Detection failure 시 crash 방지
- Bridge failure graceful degradation

## 13. Implementation Order
1. RN CLI TS project 생성
2. Android build 확인
3. VisionCamera preview
4. Permission flow
5. Android ML Kit integration
6. JS 전달
7. Box/label overlay
8. README

## 14. Definition of Done
- Android 빌드/실행
- Camera permission 정상
- Rear preview 노출
- 반복 탐지 동작
- 일부 객체 overlay
- Korean label 표시
- Crash 없이 기본 동작
- 코드 구조/README 정리

## 15. README Must Include
- Purpose
- Stack
- ML Kit 선택 이유
- 설치/실행 방법
- native detection code 위치
- 제한사항
- 향후 개선
- label mapping 정책
- detector 교체 가능 구조

## 16. Accepted MVP Limitations
- 부정확한 라벨
- 미검출 객체
- flicker
- 정렬 오차
- Android/portrait/rear only

## 17. Future Improvements
- overlay stabilization
- front camera
- confidence UI
- TTS
- capture/freeze-frame
- better detector / TFLite swap
- richer Korean mapping

## 18. Codex Execution Note
- Android-only, portrait, rear camera defaults
- Keep implementation simple
- Stability > sophistication
