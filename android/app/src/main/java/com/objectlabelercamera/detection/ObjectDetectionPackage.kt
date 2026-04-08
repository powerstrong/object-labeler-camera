package com.objectlabelercamera.detection

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * RN bridge package placeholder.
 *
 * 실제 프로젝트에서는 MainApplication#getPackages()에 등록해야
 * `NativeModules.ObjectDetectionModule`에서 접근 가능하다.
 */
class ObjectDetectionPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> {
    return mutableListOf(ObjectDetectionModule(reactContext))
  }

  override fun createViewManagers(
    reactContext: ReactApplicationContext
  ): MutableList<ViewManager<*, *>> {
    return mutableListOf()
  }
}
