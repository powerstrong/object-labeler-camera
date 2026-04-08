import { NativeModules } from 'react-native';
import type { Detection, DetectorAdapter, FrameSize } from './types';
import { toKoreanLabel } from './labelMap';
import { getMockDetections } from './mockDetections';

type NativeResult = {
  id?: string;
  rawLabel?: string;
  confidence?: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  frameSize?: FrameSize;
};

type NativeDetectorModule = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  detect: (imagePath: string) => Promise<NativeResult[]>;
};

const nativeModule = NativeModules.ObjectDetectionModule as NativeDetectorModule | undefined;
const USE_MOCK_DETECTIONS = !nativeModule;

export const mlKitDetectorAdapter: DetectorAdapter = {
  start: async () => {
    if (USE_MOCK_DETECTIONS) return;
    await nativeModule!.start();
  },
  stop: async () => {
    if (USE_MOCK_DETECTIONS) return;
    await nativeModule!.stop();
  },
  detect: async (imagePath?: string): Promise<Detection[]> => {
    if (USE_MOCK_DETECTIONS || !imagePath) {
      return getMockDetections();
    }

    const results = await nativeModule!.detect(imagePath);
    return results.map((result) => ({
      id: result.id,
      rawLabel: result.rawLabel,
      label: toKoreanLabel(result.rawLabel),
      confidence: result.confidence,
      boundingBox: result.boundingBox,
      frameSize: result.frameSize,
      timestamp: Date.now()
    }));
  }
};

export const detectionAdapterMode = USE_MOCK_DETECTIONS ? 'mock' : 'native';
