import { useEffect } from 'react';
import { ChakraOrb } from '../ChakraOrb';
import { ChakraSpine } from '../ChakraSpine';
import { ProgressRing } from '../ProgressRing';
import { SacredGeometry } from '../SacredGeometry';
import { useMeditationTimer } from '@/hooks/useMeditationTimer';
import { SessionSettings } from './SetupScreen';
import { musicTracks } from '@/lib/chakras';
import { Pause, Play, X } from 'lucide-react';

interface MeditationScreenProps {
  settings: SessionSettings;
  selectedMusic: string;
  onComplete: () => void;
  onEnd: () => void;
}

export function MeditationScreen({ settings, selectedMusic, onComplete, onEnd }: MeditationScreenProps) {
  const {
    isActive,
    isPaused,
    currentChakra,
    currentChakraIndex,
    chakraTimeRemaining,
    totalTimeRemaining,
    chakraProgress,
    totalProgress,
    isComplete,
    start,
    pause,
    resume,
    stop,
  } = useMeditationTimer({
    totalDuration: settings.totalDuration,
    chakraDurations: settings.chakraDurations,
  });

  const currentTrack = musicTracks.find(t => t.id === selectedMusic);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    stop();
    onEnd();
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 pb-32 relative overflow-hidden transition-colors duration-1000"
      style={{
        background: `radial-gradient(ellipse at center, ${currentChakra.color}15 0%, hsl(240, 30%, 8%) 70%)`,
      }}
    >
      {/* SoundCloud audio player - visible at bottom */}
      {currentTrack?.soundcloudUrl && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t border-white/10 p-2">
          <iframe
            className="w-full rounded-lg"
            width="100%"
            height="60"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={currentTrack.soundcloudUrl}
            title="Meditation Music"
          />
        </div>
      )}
      
      {/* Sacred geometry background */}
      <SacredGeometry className="absolute w-[800px] h-[800px] text-foreground animate-spin-slow" />
      
      {/* Chakra spine indicator */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block">
        <ChakraSpine activeChakraIndex={currentChakraIndex} />
      </div>
      
      {/* Main visualization */}
      <div className="relative z-10 flex flex-col items-center animate-chakra-transition" key={currentChakra.id}>
        {/* Progress ring with chakra */}
        <ProgressRing
          progress={chakraProgress}
          size={280}
          strokeWidth={6}
          color={currentChakra.color}
        >
          <div className="flex flex-col items-center">
            <ChakraOrb chakra={currentChakra} size="xl" isActive={!isPaused} />
          </div>
        </ProgressRing>
        
        {/* Chakra info */}
        <div className="mt-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-1" style={{ color: currentChakra.color }}>
            {currentChakra.name}
          </h2>
          <p className="text-lg text-muted-foreground italic mb-4">
            {currentChakra.sanskritName}
          </p>
          
          {/* Affirmation */}
          <div className="max-w-sm mx-auto">
            <p className="text-lg text-foreground mb-1">
              "{currentChakra.affirmation}"
            </p>
            <p className="text-sm text-muted-foreground italic">
              „{currentChakra.affirmationBg}"
            </p>
          </div>
        </div>
        
        {/* Time displays */}
        <div className="mt-8 flex gap-8">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Chakra</p>
            <p className="text-2xl font-display" style={{ color: currentChakra.color }}>
              {formatTime(chakraTimeRemaining)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
            <p className="text-2xl font-display text-foreground">
              {formatTime(totalTimeRemaining)}
            </p>
          </div>
        </div>
        
        {/* Total progress bar */}
        <div className="w-64 mt-6">
          <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                width: `${totalProgress}%`,
                background: `linear-gradient(to right, hsl(var(--chakra-root)), ${currentChakra.color})`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Chakra {currentChakraIndex + 1} of 7
          </p>
        </div>
        
        {/* Controls */}
        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={isPaused ? resume : pause}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                       flex items-center justify-center transition-all hover:bg-white/20 hover:scale-105"
          >
            {isPaused ? (
              <Play className="w-8 h-8 ml-1" />
            ) : (
              <Pause className="w-8 h-8" />
            )}
          </button>
          
          <button
            onClick={handleEndSession}
            className="px-6 py-3 rounded-full bg-destructive/20 border border-destructive/30
                       text-destructive-foreground text-sm flex items-center gap-2 
                       transition-all hover:bg-destructive/30"
          >
            <X className="w-4 h-4" />
            End Session
          </button>
        </div>
      </div>
      
      {/* Pause overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center animate-fade-in">
            <p className="font-display text-3xl mb-4">Paused</p>
            <p className="text-muted-foreground mb-6">Take your time. Resume when ready.</p>
            <button
              onClick={resume}
              className="btn-meditation"
            >
              <Play className="w-5 h-5 mr-2 inline" />
              Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
