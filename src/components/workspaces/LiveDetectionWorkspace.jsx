import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { Camera, Play, Pause, Square, Camera as SnapIcon, Maximize, RefreshCw, AlertCircle } from 'lucide-react';

export const LiveDetectionWorkspace = () => {
  const { setDetectedObjects, setProcessingTime, setActiveDetectionSource, addToast, saveToHistory } = useApp();
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [fps, setFps] = useState(0);
  const [cameraError, setCameraError] = useState(null);

  const animFrameId = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  useEffect(() => {
    setActiveDetectionSource('Live Webcam');
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setIsPaused(false);
      addToast('Webcam started successfully', 'success');
      startDetectionLoop();
    } catch (err) {
      console.warn('Webcam access error:', err);
      setCameraError('Unable to access webcam. Please verify camera permissions.');
      addToast('Camera access denied or unattached', 'warning');
    }
  };

  const stopCamera = () => {
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsPaused(false);
    setFps(0);
    setDetectedObjects([]);
    addToast('Camera stopped', 'info');
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    addToast(isPaused ? 'Detection resumed' : 'Detection paused', 'info');
  };

  const startDetectionLoop = () => {
    const processFrame = async () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4 && !isPaused) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Run object detection
        const startTime = performance.now();
        const detections = await apiService.detectObjects(video);
        const processMs = Math.round(performance.now() - startTime);

        setDetectedObjects(detections);
        setProcessingTime(processMs);

        // Draw Bounding Boxes on Canvas
        detections.forEach((item) => {
          const [x, y, w, h] = item.bbox;
          ctx.strokeStyle = item.color || '#2dd4bf';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, w, h);

          // Label Header
          ctx.fillStyle = item.color || '#2dd4bf';
          const labelText = `${item.class} ${item.confidence}%`;
          ctx.font = 'bold 13px Inter, sans-serif';
          const textWidth = ctx.measureText(labelText).width;
          ctx.fillRect(x, y - 24 > 0 ? y - 24 : y, textWidth + 12, 22);

          ctx.fillStyle = '#000000';
          ctx.fillText(labelText, x + 6, y - 24 > 0 ? y - 8 : y + 16);
        });

        // Calculate FPS
        frameCountRef.current += 1;
        const now = performance.now();
        if (now - lastTimeRef.current >= 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastTimeRef.current = now;
        }
      }
      animFrameId.current = requestAnimationFrame(processFrame);
    };

    animFrameId.current = requestAnimationFrame(processFrame);
  };

  const captureSnapshot = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = videoRef.current.videoWidth || 640;
    snapCanvas.height = videoRef.current.videoHeight || 480;
    const ctx = snapCanvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = snapCanvas.toDataURL('image/png');

    saveToHistory({
      thumbnail: dataUrl,
      type: 'Live Camera Capture'
    });
    addToast('Camera snapshot captured and saved to history!', 'success');
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.parentElement.requestFullscreen();
      }
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-5 shadow-2xl">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${isCameraActive ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Live Camera Telemetry Feed</h4>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-teal-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-slate-400">{isCameraActive ? (isPaused ? 'Paused' : 'Streaming') : 'Camera Offline'}</span>
              {isCameraActive && <span className="text-amber-400 font-bold ml-2">{fps} FPS</span>}
            </div>
          </div>
        </div>

        {/* Operational Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold text-xs shadow-lg shadow-teal-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Camera</span>
            </button>
          ) : (
            <>
              <button
                onClick={togglePause}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all"
              >
                {isPaused ? <Play className="w-4 h-4 text-teal-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={captureSnapshot}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all"
              >
                <SnapIcon className="w-4 h-4 text-teal-400" />
                <span>Capture Snapshot</span>
              </button>

              <button
                onClick={stopCamera}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 font-medium text-xs border border-red-800/80 transition-all"
              >
                <Square className="w-4 h-4 fill-red-400" />
                <span>Stop Camera</span>
              </button>
            </>
          )}

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
        {/* Video Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
        />

        {/* Bounding Box Overlay Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Offline Viewport Placeholder */}
        {!isCameraActive && (
          <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-slate-300">Live Camera Feed Inactive</h5>
              <p className="text-xs text-slate-500">Click "Start Camera" above to initiate real-time AI object detection.</p>
            </div>
            {cameraError && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-800/60 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{cameraError}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
