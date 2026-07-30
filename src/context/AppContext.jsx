import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { soundFx } from '../utils/audio';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'history', 'about', 'settings'
  const [activeWorkspace, setActiveWorkspace] = useState('live'); // 'live', 'image', 'video', 'mystery'
  const [showIntro, setShowIntro] = useState(true);
  
  // Detection Results State
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [processingTime, setProcessingTime] = useState(0);
  const [activeDetectionSource, setActiveDetectionSource] = useState('live'); // 'live', 'image', 'video'
  const [isDetecting, setIsDetecting] = useState(false);
  
  // History items
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('visionai_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'hist-1',
        thumbnail: '/sample_night_traffic.png',
        date: '2026-07-30',
        time: '19:42:10',
        type: 'Image Detection',
        objects: ['car', 'traffic light', 'person'],
        count: 3,
        avgConfidence: 91,
        processingTime: 42
      },
      {
        id: 'hist-2',
        thumbnail: '/sample_studio_desk.png',
        date: '2026-07-30',
        time: '18:15:04',
        type: 'Image Detection',
        objects: ['laptop', 'cup', 'cell phone'],
        count: 3,
        avgConfidence: 95,
        processingTime: 38
      }
    ];
  });

  // Backend & Settings Config
  const [useBackend, setUseBackend] = useState(false);
  const [backendEndpoint, setBackendEndpoint] = useState('http://localhost:5000/api/detect');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('cinematic-dark'); // 'cinematic-dark', 'midnight', 'oled'

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('visionai_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    apiService.setBackendConfig(useBackend, backendEndpoint, confidenceThreshold);
  }, [useBackend, backendEndpoint, confidenceThreshold]);

  useEffect(() => {
    soundFx.muted = !soundEnabled;
  }, [soundEnabled]);

  const addToast = (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const saveToHistory = (item) => {
    const newItem = {
      id: `hist-${Date.now()}`,
      thumbnail: item.thumbnail || '/sample_night_traffic.png',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      type: item.type || 'Live Detection',
      objects: item.objects || detectedObjects.map(o => o.class),
      count: item.count || detectedObjects.length,
      avgConfidence: item.avgConfidence || (detectedObjects.length > 0 ? Math.round(detectedObjects.reduce((acc, o) => acc + o.confidence, 0) / detectedObjects.length) : 90),
      processingTime: item.processingTime || processingTime
    };

    setHistory(prev => [newItem, ...prev]);
    addToast('Detection saved to history!', 'success');
  };

  const clearHistory = () => {
    setHistory([]);
    addToast('History cleared', 'info');
  };

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      activeWorkspace, setActiveWorkspace,
      showIntro, setShowIntro,
      detectedObjects, setDetectedObjects,
      processingTime, setProcessingTime,
      activeDetectionSource, setActiveDetectionSource,
      isDetecting, setIsDetecting,
      history, saveToHistory, clearHistory,
      useBackend, setUseBackend,
      backendEndpoint, setBackendEndpoint,
      confidenceThreshold, setConfidenceThreshold,
      soundEnabled, setSoundEnabled,
      theme, setTheme,
      toasts, addToast, removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
