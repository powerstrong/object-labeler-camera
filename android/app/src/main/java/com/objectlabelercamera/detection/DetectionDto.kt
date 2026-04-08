package com.objectlabelercamera.detection

data class BoundingBoxDto(
  val x: Double,
  val y: Double,
  val width: Double,
  val height: Double
)

data class FrameSizeDto(
  val width: Int,
  val height: Int
)

data class DetectionDto(
  val id: String,
  val rawLabel: String,
  val confidence: Double,
  val boundingBox: BoundingBoxDto,
  val frameSize: FrameSizeDto
)
