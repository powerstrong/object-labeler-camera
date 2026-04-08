# Object Labeler Camera (Android MVP)

안드로이드 전용 카메라 MVP 프로토타입입니다. 카메라 프리뷰 위에 객체 인식 결과를 바운딩 박스와 한국어 라벨로 표시하는 것을 목표로 합니다.

## 목적
- React Native CLI 기반 Android MVP 구현
- 온디바이스 객체 인식(ML Kit) 연동 구조 확보
- 한국어 라벨 오버레이 렌더링
- 향후 detector 교체 가능한 구조 유지

## 현재 구현 상태
- 카메라 화면/권한 흐름 기본 구현
- detection adapter 추상화 + 한국어 라벨 매핑
- overlay 렌더링 + 프레임→뷰 좌표 매핑
- mock/native 자동 전환
- JS 측 detection 안정화(저신뢰 필터 + hold-last)
- Android native bridge(`ObjectDetectionModule`)에서 **ML Kit Object Detection 호출 코드 추가**
- Native DTO/Mapper(`DetectionDto`, `DetectionMapper`)로 JS 전달 shape 정규화

## ML Kit 연동 방식 (현재 구현)
1. `CameraScreen`에서 주기적으로 `takePhoto()`로 이미지 파일 경로 획득
2. JS adapter가 `ObjectDetectionModule.detect(imagePath)` 호출
3. Android native에서 `InputImage.fromFilePath`로 이미지 로딩
4. ML Kit Object Detection 수행
5. 결과를 `DetectionDto`로 매핑하여 JS로 반환
6. JS에서 한국어 라벨 매핑 후 overlay 렌더링

## Android 설정 파일(추가됨)
- `android/app/mlkit-dependencies.gradle`
  - ML Kit dependency: `com.google.mlkit:object-detection:17.0.2`
- `android/AndroidManifest.camera.xml`
  - 카메라 permission/feature merge용 스니펫

> 현재 저장소에는 RN CLI가 생성하는 완전한 Android Gradle 프로젝트 파일이 없으므로,
> 위 파일을 실제 RN Android 프로젝트(`android/app/build.gradle`, `AndroidManifest.xml`, `MainApplication`)에 병합해야 실제 빌드가 됩니다.

## 설치
```bash
npm install
```

## Android 실행 (실프로젝트 구성 후)
```bash
npx react-native run-android
```

## 주요 코드 위치
- UI: `App.tsx`, `src/screens/CameraScreen.tsx`, `src/components/*`
- Hook: `src/hooks/useCameraPermission.ts`, `src/hooks/useObjectDetection.ts`
- Detection adapter: `src/services/detection/*`
- Coordinate mapping: `src/utils/coordinateMapping.ts`
- Native bridge: `android/app/src/main/java/com/objectlabelercamera/detection/*`
- Android integration snippets: `android/app/mlkit-dependencies.gradle`, `android/AndroidManifest.camera.xml`

## 알려진 한계
- `takePhoto()` 기반이라 frame processor 대비 지연/부하가 큼 (MVP 임시 경로)
- RN Android 실프로젝트 파일(gradle/manifest/MainApplication) 병합 전이라 즉시 빌드는 불가
- 좌표 매핑은 cover 가정 기반
- 정확도/안정화는 추가 튜닝 필요

## main 병합 전 체크
- `MERGE_CHECKLIST.md` 순서대로 Android 프로젝트에 병합/등록 작업 수행
- 해당 체크 완료 후 `run-android`로 스모크 테스트 권장
