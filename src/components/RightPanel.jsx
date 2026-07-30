import React from 'react';
import { useApp } from '../context/AppContext';
import { Layers, Clock, ShieldCheck, Box, Bookmark, Download, Sparkles } from 'lucide-react';

export const RightPanel = () => {
  const {
    detectedObjects,
    processingTime,
    activeDetectionSource,
    saveToHistory,
    addToast
  } = useApp();

  const handleExportJSON = () => {
    if (detectedObjects.length === 0) {
      addToast('No detected objects to export', 'warning');
      return;
    }

    const jsonStr = JSON.stringify({
      timestamp: new Date().toISOString(),
      source: activeDetectionSource,
      processingTimeMs: processingTime,
      totalCount: detectedObjects.length,
      detections: detectedObjects
    }, null, 2);

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visionai-detection-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Detection telemetry JSON exported!', 'success');
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-6 shadow-2xl sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-teal-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Detection Telemetry</h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-teal-400 border border-slate-700">
          Inspector
        </span>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Objects</div>
          <div className="text-lg font-mono font-bold text-teal-400">{detectedObjects.length}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Latency</div>
          <div className="text-lg font-mono font-bold text-amber-400">{processingTime}ms</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Avg Conf.</div>
          <div className="text-lg font-mono font-bold text-teal-300">
            {detectedObjects.length > 0
              ? Math.round(detectedObjects.reduce((a, b) => a + b.confidence, 0) / detectedObjects.length) + '%'
              : 'N/A'}
          </div>
        </div>
      </div>

      {/* Detected Object Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <span>Detected Classes & Bounds</span>
          <span className="text-[10px] text-slate-400">Class (Confidence)</span>
        </div>

        {detectedObjects.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-slate-500 space-y-2">
            <Box className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
            <p className="text-xs">No objects detected yet</p>
            <p className="text-[11px] text-slate-600">Start live camera or upload an image to see detection telemetry</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {detectedObjects.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: item.color || '#2dd4bf' }}
                    />
                    <span className="text-xs font-bold text-white capitalize">{item.class}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-teal-400">
                    {item.confidence}%
                  </span>
                </div>

                {/* Coordinates & Bounding Box */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded-lg">
                  <div>
                    <span className="text-slate-500">BBox: </span>
                    [{item.bbox ? item.bbox.join(', ') : 'N/A'}]
                  </div>
                  <div>
                    <span className="text-slate-500">Est. 3D: </span>
                    <span className="text-amber-300">
                      {item.dimensions || 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2.5">
        <button
          onClick={() => saveToHistory({ type: activeDetectionSource })}
          disabled={detectedObjects.length === 0}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-teal-500/20 transition-all"
        >
          <Bookmark className="w-4 h-4" />
          <span>Save History</span>
        </button>

        <button
          onClick={handleExportJSON}
          disabled={detectedObjects.length === 0}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-medium text-xs border border-slate-700 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export JSON</span>
        </button>
      </div>
    </div>
  );
};
