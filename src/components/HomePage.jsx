import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Image as ImageIcon, Video, Gamepad2, ArrowDown, Sparkles } from 'lucide-react';
import { LiveDetectionWorkspace } from './workspaces/LiveDetectionWorkspace';
import { ImageDetectionWorkspace } from './workspaces/ImageDetectionWorkspace';
import { VideoDetectionWorkspace } from './workspaces/VideoDetectionWorkspace';
import { MysteryChallengeWorkspace } from './workspaces/MysteryChallengeWorkspace';
import { RightPanel } from './RightPanel';

export const HomePage = () => {
  const { activeWorkspace, setActiveWorkspace, addToast } = useApp();
  const workspaceRef = useRef(null);

  const selectWorkspace = (key, name) => {
    setActiveWorkspace(key);
    addToast(`Switched workspace to ${name}`, 'info');
    
    // Smooth scroll down to workspace section
    setTimeout(() => {
      if (workspaceRef.current) {
        workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const cards = [
    {
      key: 'live',
      title: 'Live Object Detection',
      desc: 'Real-time high-speed object detection overlaying live webcam stream with 30+ FPS tracking.',
      icon: Camera,
      badge: 'Webcam Stream',
      gradient: 'from-teal-500 to-emerald-600',
      bgImg: '/sample_night_traffic.png'
    },
    {
      key: 'image',
      title: 'Image Detection',
      desc: 'Upload high-resolution images or select studio samples for deep object classification and bounding box analytics.',
      icon: ImageIcon,
      badge: 'Snapshot & Gallery',
      gradient: 'from-amber-500 to-orange-600',
      bgImg: '/sample_studio_desk.png'
    },
    {
      key: 'video',
      title: 'Video Detection',
      desc: 'Process MP4 video files frame-by-frame with interactive timeline scrubber and object trajectory logging.',
      icon: Video,
      badge: 'Video File',
      gradient: 'from-blue-500 to-indigo-600',
      bgImg: '/sample_night_traffic.png'
    },
    {
      key: 'mystery',
      title: 'Mystery Challenge',
      desc: 'Interactive AI scavenger hunt! Detect prompted target objects in front of your camera before time runs out.',
      icon: Gamepad2,
      badge: 'Gamified AI',
      gradient: 'from-purple-500 to-pink-600',
      bgImg: '/sample_studio_desk.png'
    }
  ];

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto w-full space-y-12">
      {/* Hero Welcome Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/70 text-xs font-medium text-teal-300 shadow-lg backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Cinematic Vision Intelligence & Computer Vision Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          AI Object Detection Studio
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Select a computer vision module below to open its dedicated studio workspace. Real-time inference supported via browser TensorFlow.js or Flask backend.
        </p>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const isActive = activeWorkspace === card.key;

          return (
            <div
              key={card.key}
              onClick={() => selectWorkspace(card.key, card.title)}
              className={`group relative glass-panel-interactive rounded-2xl p-5 cursor-pointer flex flex-col justify-between overflow-hidden border ${
                isActive
                  ? 'border-teal-400/80 shadow-xl shadow-teal-500/20 ring-2 ring-teal-500/30'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Background Thumbnail preview */}
              <div className="absolute inset-0 z-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                <img src={card.bgImg} alt={card.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent" />
              </div>

              {/* Card Header & Badge */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${card.gradient} text-white shadow-md shadow-teal-500/10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700/80">
                    {card.badge}
                  </span>
                </div>

                {/* Card Title & Desc */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-5 border-t border-slate-800/80 flex items-center justify-between mt-4">
                <span className="text-xs font-semibold text-teal-400 group-hover:text-teal-300 flex items-center gap-1">
                  Open Workspace
                  <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
                </span>
                {isActive && (
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dedicated Workspace Section Below Cards (Natural Scroll Layout) */}
      <div ref={workspaceRef} className="pt-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-7 rounded-full bg-teal-500" />
            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                {activeWorkspace === 'live' && 'Live Object Detection Studio'}
                {activeWorkspace === 'image' && 'Image Object Detection Studio'}
                {activeWorkspace === 'video' && 'Video Tracking Studio'}
                {activeWorkspace === 'mystery' && 'Mystery Object Hunt Challenge'}
              </h3>
              <p className="text-xs text-slate-400">Interactive workspace with live telemetry and inspector</p>
            </div>
          </div>
        </div>

        {/* Workspace + Right Inspector Panel Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Active Workspace (8 cols) */}
          <div className="lg:col-span-8 w-full">
            {activeWorkspace === 'live' && <LiveDetectionWorkspace />}
            {activeWorkspace === 'image' && <ImageDetectionWorkspace />}
            {activeWorkspace === 'video' && <VideoDetectionWorkspace />}
            {activeWorkspace === 'mystery' && <MysteryChallengeWorkspace />}
          </div>

          {/* Right Inspector Panel (4 cols) */}
          <div className="lg:col-span-4 w-full">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
