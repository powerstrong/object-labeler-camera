# MVP Prototyping TODO

## 완료됨
- [x] detection adapter mock/native 자동 전환
- [x] overlay 파이프라인 mock 검증 경로 확보
- [x] 프레임→뷰 좌표 매핑 유틸 고도화(cover 가정)
- [x] `ObjectDetectionPackage` placeholder 작성
- [x] 저신뢰 detection 필터링 + 짧은 hold-last 안정화
- [x] Native DetectionMapper/DTO 추가
- [x] Native ML Kit detect(imagePath) 호출 코드 추가
- [x] Android dependency/manifest merge 스니펫 추가

## 다음 우선 작업
1. RN CLI 실프로젝트 생성 후 `mlkit-dependencies.gradle` 병합
2. `MainApplication`에 `ObjectDetectionPackage` 등록
3. takePhoto 기반 -> frame processor 기반으로 전환
4. detection interval/queue 튜닝
5. 좌표 회전(orientation) 정밀 처리

## 세부 체크리스트
- [ ] RN Android 프로젝트 실체화
- [ ] VisionCamera 설정(gradle/permission/proguard)
- [ ] MainApplication 패키지 등록
- [ ] frame processor 경로 전환
- [ ] rotation/crop 대응
- [ ] box clipping/label overflow 처리
- [ ] crash-safe fallback/logging 강화
- [ ] smoke 테스트
