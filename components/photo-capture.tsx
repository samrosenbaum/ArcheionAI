"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, X, Upload, RotateCcw, Check, AlertCircle } from "lucide-react"
import { AIDocumentClassifier } from "@/lib/ai-document-classifier"

interface PhotoCaptureProps {
  onClose: () => void
  onCapture: (file: File) => void
}

export function PhotoCapture({ onClose, onCapture }: PhotoCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [classification, setClassification] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCapturing(true)
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions or use file upload instead.")
      console.error("Camera access error:", err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCapturing(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob and create object URL
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob)
          setCapturedImage(imageUrl)
          stopCamera()

          // Create file from blob for processing
          const file = new File([blob], `document-${Date.now()}.jpg`, { type: "image/jpeg" })
          processDocument(file)
        }
      },
      "image/jpeg",
      0.8,
    )
  }, [stopCamera])

  const processDocument = async (file: File) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Classify the document
      const result = await AIDocumentClassifier.classifyDocument(file)
      setClassification(result)

      // Simulate processing delay for demo
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch (err) {
      setError("Failed to process document. Please try again.")
      console.error("Document processing error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create preview URL
      const imageUrl = URL.createObjectURL(file)
      setCapturedImage(imageUrl)
      processDocument(file)
    }
  }

  const handleConfirm = () => {
    if (capturedImage && classification) {
      // Convert the captured image back to a file
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `document-${Date.now()}.jpg`, { type: "image/jpeg" })
          onCapture(file)
        })
    }
  }

  const retakePhoto = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
    }
    setCapturedImage(null)
    setClassification(null)
    setError(null)
    startCamera()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Document Capture</span>
            </CardTitle>
            <CardDescription>Take a photo or upload a document for analysis</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!capturedImage && !isCapturing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={startCamera} className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">Take Photo</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Upload File</span>
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {isCapturing && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover rounded-lg bg-gray-100"
                />
                <div className="absolute inset-0 border-2 border-dashed border-white rounded-lg pointer-events-none" />
              </div>

              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
                <Button onClick={capturePhoto}>
                  <Camera className="w-4 h-4 mr-2" />
                  Capture
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured document"
                  className="w-full h-64 object-cover rounded-lg"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2" />
                      <p className="text-sm">Analyzing document...</p>
                    </div>
                  </div>
                )}
              </div>

              {classification && !isProcessing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Analysis Results</h4>
                    <Badge variant="outline">{Math.round(classification.confidence * 100)}% confident</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium capitalize">{classification.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{classification.subcategory || "General"}</p>
                    </div>
                  </div>

                  {classification.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {classification.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={retakePhoto}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button onClick={handleConfirm} disabled={!classification || isProcessing}>
                  <Check className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  )
}
