export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FrameSize = {
  width: number;
  height: number;
};

export type Detection = {
  id?: string;
  label: string;
  rawLabel?: string;
  confidence?: number;
  boundingBox: BoundingBox;
  frameSize?: FrameSize;
  timestamp?: number;
};

export interface DetectorAdapter {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  detect: (imagePath?: string) => Promise<Detection[]>;
}
