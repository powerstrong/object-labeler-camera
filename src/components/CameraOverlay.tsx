import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import type { Detection } from '../services/detection/types';
import { mapFrameBoxToView } from '../utils/coordinateMapping';
import { BoundingBox } from './BoundingBox';

type Props = {
  detections: Detection[];
};

export const CameraOverlay = ({ detections }: Props) => {
  const [viewSize, setViewSize] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setViewSize({ width, height });
  };

  const mappedDetections = useMemo(
    () =>
      detections.map((detection) => {
        const frameWidth = detection.frameSize?.width ?? viewSize.width;
        const frameHeight = detection.frameSize?.height ?? viewSize.height;

        return {
          ...detection,
          boundingBox: mapFrameBoxToView(
            detection.boundingBox,
            frameWidth,
            frameHeight,
            viewSize.width,
            viewSize.height
          )
        };
      }),
    [detections, viewSize.height, viewSize.width]
  );

  return (
    <View pointerEvents="none" style={styles.overlay} onLayout={onLayout}>
      {mappedDetections.map((detection, index) => (
        <BoundingBox key={detection.id ?? `${detection.label}-${index}`} detection={detection} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject
  }
});
