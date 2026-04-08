# Merge Checklist (main 반영 전 필수)

이 저장소는 RN CLI가 만든 완전한 Android 프로젝트가 없기 때문에,
main 병합 전에 아래를 실제 프로젝트에 반영해야 합니다.

## 1) Android dependency 병합
- `android/app/build.gradle`에 아래 중 하나 적용
  - `apply from: "$rootDir/app/mlkit-dependencies.gradle"`
  - 또는 직접 dependency 추가:
    - `implementation "com.google.mlkit:object-detection:17.0.2"`

## 2) Manifest 병합
- `android/AndroidManifest.camera.xml`의 내용을
  `android/app/src/main/AndroidManifest.xml`에 병합
  - CAMERA permission
  - camera feature

## 3) RN package 등록
- `ObjectDetectionPackage`를 `MainApplication`의 패키지 리스트에 등록
- JS에서 `NativeModules.ObjectDetectionModule` 접근 가능한지 확인

## 4) VisionCamera 설정 확인
- camera/photo 권한
- camera device 선택(back)
- `takePhoto()` 동작 확인

## 5) 런타임 점검
- 앱 실행 후 카메라 권한 승인
- mode가 native로 표시되는지
- 객체 비추면 box + 한국어 라벨 표시되는지

## 6) Known caveat
- 현재 구현은 `takePhoto()` 기반 주기 탐지로, frame processor 대비 느릴 수 있음
- MVP 통과 후 frame processor 경로로 전환 권장
