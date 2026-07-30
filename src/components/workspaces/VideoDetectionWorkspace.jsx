import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { Video, Play, Pause, Square, RotateCcw, Upload, Film, AlertCircle } from 'lucide-react';

export const VideoDetectionWorkspace = () => {
  const { setDetectedObjects, setProcessingTime, setActiveDetectionSource, addToast } = useApp();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState('/sample_video.mp4'); // Sample video path or uploaded file URL
  const [frameCounter, setFrameCounter] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const animFrameId = useRef(null);

  useEffect(() => {
    setActiveDetectionSource('Video File');
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      addToast('Video loaded successfully!', 'success');
    }
  };

  const startVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      addToast('Video playback & detection started', 'info');
      runDetectionLoop();
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      addToast('Video paused', 'info');
    }
  };

  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      setFrameCounter(0);
      setDetectedObjects([]);
      addToast('Video stopped', 'info');
    }
  };

  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      startVideo();
    }
  };

  const runDetectionLoop = () => {
    const processVideoFrame = async () => {
      if (videoRef.current && canvasRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        setCurrentTime(video.currentTime);
        setDuration(video.duration || 1);
        setFrameCounter(prev => prev + 1);

        const startTime = performance.now();
        const detections = await apiService.detectObjects(video);
        const processMs = Math.round(performance.now() - startTime);

        setDetectedObjects(detections);
        setProcessingTime(processMs);

        // Draw Bounding Boxes
        detections.forEach((item) => {
          const [x, y, w, h] = item.bbox;
          ctx.strokeStyle = item.color || '#3b82f6';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, w, h);

          ctx.fillStyle = item.color || '#3b82f6';
          const labelText = `${item.class} ${item.confidence}%`;
          ctx.font = 'bold 13px Inter, sans-serif';
          const textWidth = ctx.measureText(labelText).width;
          ctx.fillRect(x, y - 24 > 0 ? y - 24 : y, textWidth + 12, 22);

          ctx.fillStyle = '#ffffff';
          ctx.fillText(labelText, x + 6, y - 24 > 0 ? y - 8 : y + 16);
        });

        animFrameId.current = requestAnimationFrame(processVideoFrame);
      }
    };

    animFrameId.current = requestAnimationFrame(processVideoFrame);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-5 shadow-2xl">
      {/* Top Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Video Tracking & Analysis Studio</h4>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>Frame: <strong className="text-blue-400">{frameCounter}</strong></span>
              <span>Time: <strong className="text-slate-200">{currentTime.toFixed(1)}s / {duration.toFixed(1)}s</strong></span>
            </div>
          </div>
        </div>

        {/* Video Operational Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-blue-500/20 transition-all">
            <Upload className="w-4 h-4" />
            <span>Upload Video</span>
            <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
          </label>

          {!isPlaying ? (
            <button
              onClick={startVideo}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium text-xs border border-slate-700 transition-all"
            >
              <Play className="w-4 h-4 text-teal-400 fill-teal-400" />
              <span>Start Detection</span>
            </button>
          ) : (
            <button
              onClick={pauseVideo}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium text-xs border border-slate-700 transition-all"
            >
              <Pause className="w-4 h-4 text-amber-400" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={stopVideo}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-all"
          >
            <Square className="w-4 h-4 text-slate-400" />
            <span>Stop</span>
          </button>

          <button
            onClick={replayVideo}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title="Replay Video"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
        <video
          ref={videoRef}
          src={videoSrc}
          playsInline
          className="w-full h-full object-contain"
          onEnded={() => {
            setIsPlaying(false);
            addToast('Video finished', 'info');
          }}
        />

        {/* Bounding Box Overlay Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />
      </div>

      {/* Progress Timeline Scrubber */}
      <div className="space-y-1">
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-100"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
