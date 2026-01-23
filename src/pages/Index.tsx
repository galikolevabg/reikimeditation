import { useState, useCallback } from 'react';
import { LandingScreen } from '@/components/screens/LandingScreen';
import { SetupScreen, SessionSettings } from '@/components/screens/SetupScreen';
import { MusicScreen } from '@/components/screens/MusicScreen';
import { MeditationScreen } from '@/components/screens/MeditationScreen';
import { CompleteScreen } from '@/components/screens/CompleteScreen';
import { chakras } from '@/lib/chakras';
import { useAudioContext } from '@/hooks/useAudioContext';

type Screen = 'landing' | 'setup' | 'music' | 'meditation' | 'complete';

const defaultSettings: SessionSettings = {
  totalDuration: 21,
  equalTime: true,
  chakraDurations: chakras.map(() => Math.floor((21 * 60) / 7)),
};

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [sessionSettings, setSessionSettings] = useState<SessionSettings>(defaultSettings);
  const [selectedMusic, setSelectedMusic] = useState<string>('ambient');
  const [selectedTransition, setSelectedTransition] = useState<string>('tibetan-small');
  const { initializeAudioContext } = useAudioContext();

  const handleStartMeditation = useCallback(() => {
    // Quick start with default settings
    setSessionSettings(defaultSettings);
    setCurrentScreen('music');
  }, []);

  const handleCustomize = useCallback(() => {
    setCurrentScreen('setup');
  }, []);

  const handleSetupComplete = useCallback((settings: SessionSettings) => {
    setSessionSettings(settings);
    setCurrentScreen('music');
  }, []);

  const handleMusicSelect = useCallback(async (musicId: string, transitionSoundId: string) => {
    // IMPORTANT (mobile): unlock audio inside the same user gesture (Begin Meditation)
    await initializeAudioContext();

    setSelectedMusic(musicId);
    setSelectedTransition(transitionSoundId);
    setCurrentScreen('meditation');
  }, [initializeAudioContext]);

  const handleMeditationComplete = useCallback(() => {
    setCurrentScreen('complete');
  }, []);

  const handleMeditationEnd = useCallback(() => {
    setCurrentScreen('landing');
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentScreen('setup');
  }, []);

  const handleHome = useCallback(() => {
    setCurrentScreen('landing');
  }, []);

  return (
    <div className="font-body">
      {currentScreen === 'landing' && (
        <LandingScreen
          onStartMeditation={handleStartMeditation}
          onCustomize={handleCustomize}
        />
      )}

      {currentScreen === 'setup' && (
        <SetupScreen
          onBack={handleHome}
          onNext={handleSetupComplete}
          initialSettings={sessionSettings}
        />
      )}

      {currentScreen === 'music' && (
        <MusicScreen
          onBack={() => setCurrentScreen('setup')}
          onStart={handleMusicSelect}
        />
      )}

      {currentScreen === 'meditation' && (
        <MeditationScreen
          settings={sessionSettings}
          selectedMusic={selectedMusic}
          selectedTransition={selectedTransition}
          onComplete={handleMeditationComplete}
          onEnd={handleMeditationEnd}
        />
      )}

      {currentScreen === 'complete' && (
        <CompleteScreen
          onHome={handleHome}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
