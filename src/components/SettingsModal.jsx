import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Server, Cpu, Sliders, Volume2, ShieldCheck, X } from 'lucide-react';

export const SettingsModal = ({ onClose }) => {
  const {
    useBackend,
    setUseBackend,
    backendEndpoint,
    setBackendEndpoint,
    confidenceThreshold,
    setConfidenceThreshold,
    soundEnabled,
    setSoundEnabled,
    theme,
    setTheme,
    addToast
  } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Studio Settings & Inference Engine</h2>
              <p className="text-xs text-slate-400">Configure AI model source, Flask API, and audio feedback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-5 space-y-6">
          {/* AI Inference Mode Toggle */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>Inference Engine Mode</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setUseBackend(false);
                  addToast('Switched to Client-side TensorFlow.js (COCO-SSD)', 'info');
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  !useBackend
                    ? 'bg-teal-950/60 border-teal-500 text-slate-100 shadow-lg shadow-teal-500/10'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300">Client COCO-SSD</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono">In-Browser</span>
                </div>
                <p className="text-[11px] text-slate-400">Runs locally in-browser via TensorFlow.js. Zero setup required.</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUseBackend(true);
                  addToast('Switched to Flask + YOLO API Backend', 'info');
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  useBackend
                    ? 'bg-amber-950/60 border-amber-500 text-slate-100 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">Flask + YOLO API</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">Backend</span>
                </div>
                <p className="text-[11px] text-slate-400">Connect to Python Flask server with YOLO v8/v11 weights.</p>
              </button>
            </div>
          </div>

          {/* Flask Endpoint Input */}
          {useBackend && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                <span>Flask Server URL Endpoint</span>
              </label>
              <input
                type="text"
                value={backendEndpoint}
                onChange={(e) => setBackendEndpoint(e.target.value)}
                placeholder="http://localhost:5000/api/detect"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Confidence Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>Minimum Confidence Score Threshold</span>
              </label>
              <span className="text-xs font-mono text-teal-400 font-bold">{Math.round(confidenceThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.9"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>

          {/* Audio FX */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-slate-300" />
              <div>
                <div className="text-xs font-medium text-slate-200">Camera Shutter & Sound Effects</div>
                <p className="text-[11px] text-slate-400">Play realistic DSLR click sound and challenge alerts</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-medium text-xs shadow-lg shadow-teal-500/20 hover:opacity-95 transition-all"
          >
            Save Settings & Close
          </button>
        </div>
      </div>
    </div>
  );
};
