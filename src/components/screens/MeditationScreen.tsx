import { useEffect, useRef, useState } from 'react';
import { ChakraOrb } from '../ChakraOrb';
import { ChakraSpine } from '../ChakraSpine';
import { ProgressRing } from '../ProgressRing';
import { SacredGeometry } from '../SacredGeometry';
import { useMeditationTimer } from '@/hooks/useMeditationTimer';
import { SessionSettings } from './SetupScreen';
import { musicTracks, transitionSounds } from '@/lib/chakras';
import { Pause, Play, X, Volume2, VolumeX } from 'lucide-react';
import { useAudioContext } from '@/hooks/useAudioContext';

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
  
  const { resumeAudioContext } = useAudioContext();
  
  const musicIframeRef = useRef<HTMLIFrameElement>(null);
  const transitionIframeRef = useRef<HTMLIFrameElement>(null);
  const prevChakraIndex = useRef(currentChakraIndex);
  const [isMuted, setIsMuted] = useState(false);
  const iframeLoaded = useRef(false);

  const getControlledSoundCloudUrl = (url: string) => {
    // Ensure widget supports postMessage control and doesn't try to autoplay on its own.
    let next = url;
    if (next.includes('auto_play=true')) next = next.replace('auto_play=true', 'auto_play=false');
    if (!next.includes('auto_play=')) next += (next.includes('?') ? '&' : '?') + 'auto_play=false';
    if (!next.includes('enable_api=true')) next += '&enable_api=true';
    return next;
  };

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // Auto-start meditation when component mounts
  useEffect(() => {
    // Critical: Initialize AudioContext immediately for iOS
    resumeAudioContext().then(() => {
      start();
    });
  }, [start, resumeAudioContext]);

  // Start music when iframe is loaded and meditation is active
  const handleIframeLoad = () => {
    iframeLoaded.current = true;
    // Immediately try to play - critical for iOS
    if (musicIframeRef.current?.contentWindow && isActive && !isPaused && !isMuted) {
      musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
    }
    // Multiple aggressive retry attempts for iOS
    const delays = [100, 300, 500, 800, 1200, 1800];
    delays.forEach(delay => {
      setTimeout(() => {
        if (musicIframeRef.current?.contentWindow && isActive && !isPaused && !isMuted) {
          musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
        }
      }, delay);
    });
  };

  // Control music playback based on pause state
  useEffect(() => {
    if (musicIframeRef.current?.contentWindow && currentTrack?.soundcloudUrl && iframeLoaded.current) {
      if (isPaused || isMuted) {
        musicIframeRef.current.contentWindow.postMessage('{"method":"pause"}', '*');
      } else if (isActive) {
        musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
      }
    }
  }, [isPaused, isActive, isMuted, currentTrack]);

  // Also try to play when component becomes active
  useEffect(() => {
    if (isActive && !isPaused && !isMuted && iframeLoaded.current) {
      const tryPlay = () => {
        if (musicIframeRef.current?.contentWindow && currentTrack?.soundcloudUrl) {
          musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
        }
      };
      // Immediate and multiple aggressive attempts for iOS
      tryPlay();
      const delays = [50, 150, 300, 600, 1000, 1500, 2000];
      delays.forEach(delay => {
        setTimeout(tryPlay, delay);
      });
    }
  }, [isActive, isPaused, isMuted, currentTrack]);

  // Play transition sound when chakra changes - 4 seconds duration
  useEffect(() => {
    if (prevChakraIndex.current !== currentChakraIndex && currentChakraIndex > 0) {
      // Play transition sound when chakra changes
      if (transitionIframeRef.current?.contentWindow && transitionSound?.soundcloudUrl && !isMuted) {
        // Seek to start and play
        transitionIframeRef.current.contentWindow.postMessage('{"method":"seekTo","value":0}', '*');
        transitionIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
        
        // Stop transition after 4 seconds and immediately resume music
        setTimeout(() => {
          if (transitionIframeRef.current?.contentWindow) {
            transitionIframeRef.current.contentWindow.postMessage('{"method":"pause"}', '*');
          }
          // Immediately resume music - no pause
          if (musicIframeRef.current?.contentWindow && currentTrack?.soundcloudUrl && !isMuted && isActive && !isPaused) {
            musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
          }
        }, 4000);
      }
    }
    prevChakraIndex.current = currentChakraIndex;
  }, [currentChakraIndex, transitionSound, isMuted, currentTrack, isActive, isPaused]);

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

  const handleResume = async () => {
    // Critical: Resume AudioContext on iOS before resuming
    await resumeAudioContext();
    resume();
    // Force play after resume
    setTimeout(() => {
      if (musicIframeRef.current?.contentWindow && !isMuted) {
        musicIframeRef.current.contentWindow.postMessage('{\"method\":\"play\"}', '*');
      }
    }, 50);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000"
      style={{
        background: `radial-gradient(ellipse at center, ${currentChakra.color}15 0%, hsl(240, 30%, 8%) 70%)`,
      }}
    >
      {/* 
        Hidden SoundCloud players for audio control
        
        MOBILE AUDIO NOTES:
        - These iframes are controlled via postMessage API (not direct autoplay)
        - The allow="autoplay" attribute is set, but audio only plays after:
          1. AudioContext is initialized on user interaction
          2. postMessage("play") is sent to the iframe
        - This respects iOS/Android browser audio restrictions
        - Audio starts only when meditation is active and not paused
      */}
      {currentTrack?.soundcloudUrl && (
        <iframe
          ref={musicIframeRef}
          className="hidden"
          width="100%"
          height="1"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={getControlledSoundCloudUrl(currentTrack.soundcloudUrl)}
          title="Meditation Music"
          onLoad={handleIframeLoad}
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
          src={getControlledSoundCloudUrl(transitionSound.soundcloudUrl)}
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
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-white/10" style={{ color: currentChakra.color }}>
              {currentChakra.number}
            </span>
            <h2 className="font-display text-3xl md:text-4xl" style={{ color: currentChakra.color }}>
              {currentChakra.name}
            </h2>
          </div>
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
            Чакра {currentChakra.number} от 7
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
            onClick={isPaused ? handleResume : pause}
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
              onClick={handleResume}
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
