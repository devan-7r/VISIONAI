import React from 'react';
import { Camera, Eye, Cpu, Shield, Sparkles, X } from 'lucide-react';

export const AboutModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-amber-500 p-0.5">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <Camera className="w-4 h-4 text-teal-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">About VisionAI Studio</h2>
              <p className="text-xs text-slate-400">Next-Generation Computer Vision Desktop Interface</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong className="text-teal-300">VisionAI Studio</strong> is a state-of-the-art web application engineered for real-time computer vision, object classification, and interactive visual intelligence.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-[11px]">
                <Cpu className="w-4 h-4" />
                <span>3D Optical Intro</span>
              </div>
              <p className="text-[11px] text-slate-400">Realistic Three.js DSLR camera simulation with night road environment.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px]">
                <Eye className="w-4 h-4" />
                <span>Dual AI Pipeline</span>
              </div>
              <p className="text-[11px] text-slate-400">Support for TF.js client-side COCO-SSD and external Flask + YOLO API.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-teal-200">Version 2.4.0 Studio Edition</div>
              <div className="text-[11px] text-teal-400/80">Built with React, Vite, Three.js & Tailwind CSS</div>
            </div>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
