import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { soundFx } from '../../utils/audio';
import { Image as ImageIcon, Upload, RefreshCw, Trash2, Eye, Sparkles, Check } from 'lucide-react';

export const ImageDetectionWorkspace = () => {
  const { setDetectedObjects, setProcessingTime, setActiveDetectionSource, addToast, saveToHistory } = useApp();

  const [imageSrc, setImageSrc] = useState('/sample_night_traffic.png');
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const sampleImages = [
    { name: 'Night Traffic Road', path: '/sample_night_traffic.png' },
    { name: 'Studio Desk Setup', path: '/sample_studio_desk.png' }
  ];

  useEffect(() => {
    setActiveDetectionSource('Image File');
    // Run initial detection on load
    runDetection();
  }, [imageSrc]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImageSrc(evt.target.result);
        addToast('Custom image uploaded successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImageSrc(evt.target.result);
        addToast('Image dropped successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const runDetection = async () => {
    if (!imgRef.current) return;
    setIsProcessing(true);
    soundFx.playFocusBeep();

    // Ensure image is fully loaded
    const img = imgRef.current;
    if (!img.complete) {
      await new Promise(res => { img.onload = res; });
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 500;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const startTime = performance.now();
    const detections = await apiService.detectObjects(img);
    const processMs = Math.round(performance.now() - startTime);

    setDetectedObjects(detections);
    setProcessingTime(processMs);

    // Draw bounding boxes on canvas
    detections.forEach((item) => {
      const [x, y, w, h] = item.bbox;
      ctx.strokeStyle = item.color || '#2dd4bf';
      ctx.lineWidth = Math.max(3, Math.round(canvas.width / 300));
      ctx.strokeRect(x, y, w, h);

      // Label Header
      ctx.fillStyle = item.color || '#2dd4bf';
      const labelText = `${item.class} (${item.confidence}%)`;
      ctx.font = 'bold 14px Inter, sans-serif';
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillRect(x, y - 28 > 0 ? y - 28 : y, textWidth + 14, 24);

      ctx.fillStyle = '#000000';
      ctx.fillText(labelText, x + 7, y - 28 > 0 ? y - 10 : y + 17);
    });

    setIsProcessing(false);
    addToast(`Detected ${detections.length} objects in ${processMs}ms`, 'success');
  };

  const resetImage = () => {
    setImageSrc('/sample_night_traffic.png');
    setDetectedObjects([]);
    addToast('Image workspace reset', 'info');
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-5 shadow-2xl">
      {/* Top Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Image Analysis Studio</h4>
            <p className="text-xs text-slate-400">High-clarity object detection & bounding box classification</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-amber-500/20 transition-all">
            <Upload className="w-4 h-4" />
            <span>Browse Image</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={runDetection}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs border border-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Detect Objects</span>
          </button>

          <button
            onClick={resetImage}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-all"
          >
            <Trash2 className="w-4 h-4 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Pre-loaded Sample Gallery Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Samples:</span>
        <div className="flex gap-2">
          {sampleImages.map((sample) => (
            <button
              key={sample.name}
              onClick={() => setImageSrc(sample.path)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                imageSrc === sample.path
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Drag-and-Drop Image Canvas Display */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner"
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Analysis Target"
          onLoad={runDetection}
          className="w-full h-full object-contain"
        />

        {/* Bounding Box Overlay Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Processing Indicator Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-dark-900/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
              Analyzing Image Tensor...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
