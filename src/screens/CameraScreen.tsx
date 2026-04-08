import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { CameraOverlay } from '../components/CameraOverlay';
import { useCameraPermission } from '../hooks/useCameraPermission';
import { useObjectDetection } from '../hooks/useObjectDetection';
import { detectionAdapterMode } from '../services/detection/detectorAdapter';

export const CameraScreen = () => {
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const { hasPermission, isLoading, requestPermission } = useCameraPermission();

  const captureImage = useCallback(async (): Promise<string | null> => {
    if (!cameraRef.current) return null;

    try {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'speed',
        enableShutterSound: false,
        flash: 'off'
      });
      return photo.path;
    } catch {
      return null;
    }
  }, []);

  const detections = useObjectDetection(hasPermission && !!device, captureImage);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>카메라 권한이 필요합니다.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>카메라를 사용할 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        device={device}
        style={StyleSheet.absoluteFill}
        isActive
        photo
        video={false}
      />
      <CameraOverlay detections={detections} />

      <View style={styles.debugBadge}>
        <Text style={styles.debugText}>
          mode: {detectionAdapterMode} / detections: {detections.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 24
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
  debugBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  debugText: {
    color: '#fff',
    fontSize: 12
  }
});
