import { useEffect, useRef, useState } from 'react';
import { ChakraOrb } from '../ChakraOrb';
import { ChakraSpine } from '../ChakraSpine';
import { ProgressRing } from '../ProgressRing';
import { SacredGeometry } from '../SacredGeometry';
import { useMeditationTimer } from '@/hooks/useMeditationTimer';
import { SessionSettings } from './SetupScreen';
import { musicTracks, transitionSounds } from '@/lib/chakras';
import { Pause, Play, X, Volume2, VolumeX } from 'lucide-react';

interface MeditationScreenProps {
  settings: SessionSettings;
  selectedMusic: string;
  selectedTransition: string;
  onComplete: () => void;
  onEnd: () => void;
}

export function MeditationScreen({ 
  settings, 
  selectedMusic, 
  selectedTransition,
  onComplete, 
  onEnd 
}: MeditationScreenProps) {
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
  const transitionSound = transitionSounds.find(t => t.id === selectedTransition);
  
  const musicIframeRef = useRef<HTMLIFrameElement>(null);
  const transitionIframeRef = useRef<HTMLIFrameElement>(null);
  const prevChakraIndex = useRef(currentChakraIndex);
  const [isMuted, setIsMuted] = useState(false);

  // Start meditation on mount
  useEffect(() => {
    start();
  }, [start]);

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // Control music playback based on pause state
  useEffect(() => {
    if (musicIframeRef.current && currentTrack?.soundcloudUrl) {
      const widget = musicIframeRef.current.contentWindow;
      if (widget) {
        if (isPaused || isMuted) {
          widget.postMessage('{"method":"pause"}', '*');
        } else if (isActive) {
          widget.postMessage('{"method":"play"}', '*');
        }
      }
    }
  }, [isPaused, isActive, isMuted, currentTrack]);

  // Play transition sound on chakra change
  useEffect(() => {
    if (prevChakraIndex.current !== currentChakraIndex && currentChakraIndex > 0) {
      if (transitionIframeRef.current && transitionSound?.soundcloudUrl && !isMuted) {
        const widget = transitionIframeRef.current.contentWindow;
        if (widget) {
          widget.postMessage('{"method":"seekTo","value":0}', '*');
          widget.postMessage('{"method":"play"}', '*');
        }
      }
    }
    prevChakraIndex.current = currentChakraIndex;
  }, [currentChakraIndex, transitionSound, isMuted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    stop();
    onEnd();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000"
      style={{
        background: `radial-gradient(ellipse at center, ${currentChakra.color}15 0%, hsl(240, 30%, 8%) 70%)`,
      }}
    >
      {/* Hidden SoundCloud players for audio control */}
      {currentTrack?.soundcloudUrl && (
        <iframe
          ref={musicIframeRef}
          className="hidden"
          width="100%"
          height="1"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={currentTrack.soundcloudUrl}
          title="Meditation Music"
        />
      )}
      
      {transitionSound?.soundcloudUrl && (
        <iframe
          ref={transitionIframeRef}
          className="hidden"
          width="100%"
          height="1"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={transitionSound.soundcloudUrl.replace('auto_play=true', 'auto_play=false')}
          title="Transition Sound"
        />
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
          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                       flex items-center justify-center transition-all hover:bg-white/20"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {/* Play/Pause button */}
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