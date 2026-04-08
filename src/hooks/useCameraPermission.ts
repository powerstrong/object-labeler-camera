import { useEffect, useState } from 'react';
import { Camera } from 'react-native-vision-camera';

export const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const requestPermission = async () => {
    setIsLoading(true);
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'granted');
    setIsLoading(false);
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return { hasPermission, isLoading, requestPermission };
};
