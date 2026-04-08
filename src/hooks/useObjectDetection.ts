import { useCallback, useEffect, useRef, useState } from 'react';
import type { Detection } from '../services/detection/types';
import { mlKitDetectorAdapter } from '../services/detection/detectorAdapter';
import { delay } from '../utils/throttle';

const DETECTION_INTERVAL_MS = 450;
const MIN_CONFIDENCE = 0.4;
const HOLD_LAST_FRAMES = 2;

type CaptureImage = () => Promise<string | null>;

const sanitizeDetections = (detections: Detection[]): Detection[] =>
  detections.filter((detection) => {
    if (typeof detection.confidence === 'number' && detection.confidence < MIN_CONFIDENCE) {
      return false;
    }

    return true;
  });

export const useObjectDetection = (enabled: boolean, captureImage: CaptureImage) => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const runningRef = useRef(false);
  const lastStableRef = useRef<Detection[]>([]);
  const emptyFrameCountRef = useRef(0);
  const inFlightRef = useRef(false);

  const loop = useCallback(async () => {
    if (!enabled || runningRef.current) return;

    runningRef.current = true;
    await mlKitDetectorAdapter.start();

    try {
      while (runningRef.current) {
        if (inFlightRef.current) {
          await delay(DETECTION_INTERVAL_MS);
          continue;
        }

        inFlightRef.current = true;

        try {
          const imagePath = await captureImage();
          const next = sanitizeDetections(await mlKitDetectorAdapter.detect(imagePath ?? undefined));

          if (next.length > 0) {
            emptyFrameCountRef.current = 0;
            lastStableRef.current = next;
            setDetections(next);
          } else {
            emptyFrameCountRef.current += 1;

            if (emptyFrameCountRef.current <= HOLD_LAST_FRAMES && lastStableRef.current.length > 0) {
              setDetections(lastStableRef.current);
            } else {
              setDetections([]);
            }
          }
        } catch {
          // keep app usable for MVP; ignore current cycle failures
        } finally {
          inFlightRef.current = false;
        }

        await delay(DETECTION_INTERVAL_MS);
      }
    } finally {
      await mlKitDetectorAdapter.stop();
    }
  }, [captureImage, enabled]);

  useEffect(() => {
    if (enabled) {
      loop();
    }

    return () => {
      runningRef.current = false;
      emptyFrameCountRef.current = 0;
      lastStableRef.current = [];
      inFlightRef.current = false;
    };
  }, [enabled, loop]);

  return detections;
};
