import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CinematicIntro } from './components/CinematicIntro';
import { MainLayout } from './components/MainLayout';
import { HomePage } from './components/HomePage';
import { HistoryView } from './components/HistoryView';

const AppContent = () => {
  const { showIntro, setShowIntro, activeTab } = useApp();

  if (showIntro) {
    return <CinematicIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <MainLayout>
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'history' && <HistoryView />}
    </MainLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
