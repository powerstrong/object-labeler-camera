package com.objectlabelercamera.detection

import android.net.Uri
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.objects.ObjectDetection
import com.google.mlkit.vision.objects.ObjectDetector
import com.google.mlkit.vision.objects.defaults.ObjectDetectorOptions

class ObjectDetectionModule(private val appContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(appContext) {

  private var detector: ObjectDetector? = null

  private fun ensureDetector(): ObjectDetector {
    detector?.let { return it }

    val options = ObjectDetectorOptions.Builder()
      .setDetectorMode(ObjectDetectorOptions.SINGLE_IMAGE_MODE)
      .enableMultipleObjects()
      .enableClassification()
      .build()

    return ObjectDetection.getClient(options).also {
      detector = it
    }
  }

  override fun getName(): String = "ObjectDetectionModule"

  @ReactMethod
  fun start(promise: Promise) {
    ensureDetector()
    promise.resolve(null)
  }

  @ReactMethod
  fun stop(promise: Promise) {
    detector?.close()
    detector = null
    promise.resolve(null)
  }

  @ReactMethod
  fun detect(imagePath: String, promise: Promise) {
    if (imagePath.isBlank()) {
      promise.resolve(DetectionMapper.toWritableArray(emptyList()))
      return
    }

    try {
      val normalizedPath = if (imagePath.startsWith("file://")) imagePath else "file://$imagePath"
      val uri = Uri.parse(normalizedPath)
      val image = InputImage.fromFilePath(appContext, uri)
      val mlkit = ensureDetector()

      mlkit.process(image)
        .addOnSuccessListener { objects ->
          val detections = objects.mapIndexed { index, obj ->
            val label = obj.labels.maxByOrNull { it.confidence }

            DetectionDto(
              id = "obj-$index",
              rawLabel = label?.text ?: "unknown",
              confidence = label?.confidence?.toDouble() ?: 0.0,
              boundingBox = BoundingBoxDto(
                x = obj.boundingBox.left.toDouble(),
                y = obj.boundingBox.top.toDouble(),
                width = obj.boundingBox.width().toDouble(),
                height = obj.boundingBox.height().toDouble()
              ),
              frameSize = FrameSizeDto(
                width = image.width,
                height = image.height
              )
            )
          }

          promise.resolve(DetectionMapper.toWritableArray(detections))
        }
        .addOnFailureListener { error ->
          promise.reject("DETECT_FAILED", error)
        }
    } catch (error: Exception) {
      promise.reject("IMAGE_LOAD_FAILED", error)
    }
  }
}
