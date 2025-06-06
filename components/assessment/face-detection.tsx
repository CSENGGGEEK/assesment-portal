"use client"

import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Camera, CameraOff, AlertTriangle } from "lucide-react"

interface FaceDetectionProps {
  isEnabled: boolean
  onViolation: (type: string, data: any) => void
  studentAssessmentId: number
}

export function FaceDetection({ isEnabled, onViolation, studentAssessmentId }: FaceDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [violations, setViolations] = useState(0)
  const [lastDetection, setLastDetection] = useState<Date | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    if (isEnabled) {
      startFaceDetection()
    } else {
      stopFaceDetection()
    }

    return () => {
      stopFaceDetection()
    }
  }, [isEnabled])

  const startFaceDetection = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
        setIsActive(true)

        // Start detection loop
        detectFace()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      onViolation("camera_access_denied", { error: error.message })
    }
  }

  const stopFaceDetection = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsActive(false)
  }

  const detectFace = () => {
    if (!videoRef.current || !canvasRef.current || !isActive) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Simple face detection simulation (in real implementation, use ML models)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const faceDetected = simulateFaceDetection(imageData)

    const now = new Date()

    if (!faceDetected) {
      // No face detected - potential violation
      if (!lastDetection || now.getTime() - lastDetection.getTime() > 3000) {
        setViolations((prev) => prev + 1)
        onViolation("face_not_detected", {
          timestamp: now.toISOString(),
          duration: lastDetection ? now.getTime() - lastDetection.getTime() : 0,
        })
      }
    } else {
      setLastDetection(now)
    }

    // Continue detection loop
    setTimeout(detectFace, 1000) // Check every second
  }

  const simulateFaceDetection = (imageData: ImageData): boolean => {
    // This is a simplified simulation
    // In a real implementation, you would use libraries like:
    // - face-api.js
    // - MediaPipe
    // - TensorFlow.js with face detection models

    const data = imageData.data
    let brightness = 0

    // Calculate average brightness as a simple proxy for presence
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3
    }

    brightness = brightness / (data.length / 4)

    // If brightness is too low or too high, assume no face
    return brightness > 30 && brightness < 200
  }

  if (!isEnabled) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <CameraOff className="h-4 w-4" />
        <span className="text-sm">Face detection disabled</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          <span className="text-sm font-medium">Face Detection</span>
          <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
        </div>

        {violations > 0 && (
          <div className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{violations} violations</span>
          </div>
        )}
      </div>

      {/* Hidden video and canvas for face detection */}
      <div className="hidden">
        <video ref={videoRef} autoPlay muted />
        <canvas ref={canvasRef} />
      </div>

      {/* Status indicator */}
      <div className="relative">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isActive
                ? lastDetection && new Date().getTime() - lastDetection.getTime() < 5000
                  ? "bg-green-500"
                  : "bg-red-500"
                : "bg-gray-400"
            }`}
            style={{
              width: isActive ? "100%" : "0%",
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">
            {isActive
              ? lastDetection && new Date().getTime() - lastDetection.getTime() < 5000
                ? "Face Detected"
                : "No Face Detected"
              : "Camera Inactive"}
          </span>
        </div>
      </div>

      {violations > 2 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Multiple face detection violations detected. Please ensure you remain visible to the camera.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
