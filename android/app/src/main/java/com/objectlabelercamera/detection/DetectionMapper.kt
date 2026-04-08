package com.objectlabelercamera.detection

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray

object DetectionMapper {
  fun toWritableArray(detections: List<DetectionDto>): WritableArray {
    val array = Arguments.createArray()

    detections.forEach { detection ->
      val item = Arguments.createMap().apply {
        putString("id", detection.id)
        putString("rawLabel", detection.rawLabel)
        putDouble("confidence", detection.confidence)

        putMap("boundingBox", Arguments.createMap().apply {
          putDouble("x", detection.boundingBox.x)
          putDouble("y", detection.boundingBox.y)
          putDouble("width", detection.boundingBox.width)
          putDouble("height", detection.boundingBox.height)
        })

        putMap("frameSize", Arguments.createMap().apply {
          putInt("width", detection.frameSize.width)
          putInt("height", detection.frameSize.height)
        })
      }

      array.pushMap(item)
    }

    return array
  }
}
