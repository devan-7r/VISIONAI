import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Eye,
  History,
  Info,
  Settings,
  Github,
  Play,
  Moon,
  Sun,
  Server,
  Cpu,
  Volume2,
  VolumeX,
  X,
  Sparkles
} from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { AboutModal } from './AboutModal';

export const MainLayout = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    setShowIntro,
    useBackend,
    soundEnabled,
    setSoundEnabled,
    theme,
    setTheme,
    toasts,
    removeToast
  } = useApp();

  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-500 ${
      theme === 'midnight' ? 'bg-slate-950 text-slate-100' :
      theme === 'oled' ? 'bg-black text-slate-100' : 'bg-dark-900 text-slate-100'
    }`}>
      {/* 1. Cinematic Fixed Night Road Background Image with Parallax Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/night_road_cinematic_bg.png')` }}
        />
        {/* Soft Fog & Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/90 via-dark-900/70 to-dark-900/95" />
        <div className="absolute inset-0 bg-radial-gradient from-teal-500/10 via-transparent to-amber-500/10" />

        {/* Ambient Floating Bokeh Particles */}
        <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* 2. Top Navigation Bar (Professional Desktop AI Software) */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between shadow-2xl">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-amber-500 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
              <Eye className="w-5 h-5 text-teal-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                VisionAI
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                STUDIO PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-medium">Object Detection Intelligence</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Home Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Detection History</span>
          </button>

          <button
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </button>
        </nav>

        {/* Right Tools & Status Badges */}
        <div className="flex items-center gap-3">
          {/* Backend Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
            {useBackend ? (
              <>
                <Server className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-amber-300 font-mono text-[11px]">Flask YOLO API</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-teal-300 font-mono text-[11px]">Client COCO-SSD</span>
              </>
            )}
          </div>

          {/* Replay Intro */}
          <button
            onClick={() => setShowIntro(true)}
            title="Replay Cinematic Intro"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-teal-600/30 text-slate-300 hover:text-teal-300 border border-slate-700/60 transition-all"
          >
            <Play className="w-4 h-4" />
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'cinematic-dark' ? 'midnight' : theme === 'midnight' ? 'oled' : 'cinematic-dark')}
            title="Toggle Cinematic Theme"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700/60 transition-all"
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 text-xs font-medium transition-all"
          >
            <Settings className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* 3. Main Content Viewport */}
      <main className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>

      {/* 4. Toast Notifications Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md font-medium text-xs transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success' ? 'bg-teal-950/90 border-teal-500/50 text-teal-200' :
              toast.type === 'warning' ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' :
              'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* About Modal */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};
