import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Detection } from '../services/detection/types';
import { DetectionLabel } from './DetectionLabel';

type Props = {
  detection: Detection;
};

export const BoundingBox = ({ detection }: Props) => {
  const { x, y, width, height } = detection.boundingBox;

  return (
    <View
      style={[
        styles.box,
        {
          left: x,
          top: y,
          width,
          height
        }
      ]}
    >
      <View style={styles.labelWrap}>
        <DetectionLabel label={detection.label} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00E5FF'
  },
  labelWrap: {
    position: 'absolute',
    top: -30,
    left: 0
  }
});
