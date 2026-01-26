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
  
  // Check if URL is MP3 file
  const isMP3 = (url: string | null | undefined) => {
    return url?.includes('.mp3') || url?.includes('.wav');
  };

  const isMusicMP3 = isMP3(currentTrack?.soundcloudUrl);
  const isTransitionMP3 = isMP3(transitionSound?.soundcloudUrl);
  
  const musicAudioRef = useRef<HTMLAudioElement>(null);
  const musicIframeRef = useRef<HTMLIFrameElement>(null);
  const transitionAudioRef = useRef<HTMLAudioElement>(null);
  const transitionIframeRef = useRef<HTMLIFrameElement>(null);
  
  const prevChakraIndex = useRef(currentChakraIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioInitialized = useRef(false);
  const startAttempts = useRef(0);

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // Auto-start meditation when component mounts
  useEffect(() => {
    const initAndStart = async () => {
      await resumeAudioContext();
      audioInitialized.current = true;
      start();
    };
    initAndStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Audio loaded detection
  useEffect(() => {
    if (isMusicMP3) {
      const handleCanPlay = () => setAudioLoaded(true);
      const audioEl = musicAudioRef.current;
      if (audioEl) {
        audioEl.addEventListener('canplay', handleCanPlay);
        return () => audioEl.removeEventListener('canplay', handleCanPlay);
      }
    } else {
      // For iframe, use timeout
      const timer = setTimeout(() => setAudioLoaded(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isMusicMP3]);

  // MP3 playback control
  useEffect(() => {
    if (isMusicMP3 && musicAudioRef.current) {
      if (isPaused || isMuted) {
        musicAudioRef.current.pause();
      } else if (isActive) {
        musicAudioRef.current.play().catch(err => console.log('Play failed:', err));
      }
    }
  }, [isPaused, isActive, isMuted, isMusicMP3]);

  // SoundCloud iframe playback control
  useEffect(() => {
    if (!isMusicMP3 && musicIframeRef.current?.contentWindow && currentTrack?.soundcloudUrl && audioLoaded) {
      if (isPaused || isMuted) {
        musicIframeRef.current.contentWindow.postMessage('{"method":"pause"}', '*');
        setTimeout(() => {
          musicIframeRef.current?.contentWindow?.postMessage('{"method":"pause"}', '*');
        }, 50);
      } else if (isActive) {
        musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
        setTimeout(() => {
          musicIframeRef.current?.contentWindow?.postMessage('{"method":"play"}', '*');
        }, 50);
      }
    }
  }, [isPaused, isActive, isMuted, currentTrack, audioLoaded, isMusicMP3]);

  // Aggressive play for mobile (SoundCloud only)
  useEffect(() => {
    if (!isMusicMP3 && audioLoaded && !isPaused && !isMuted && isActive && startAttempts.current < 20) {
      const tryPlay = () => {
        if (musicIframeRef.current?.contentWindow) {
          musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
          startAttempts.current++;
        }
      };
      tryPlay();
      const interval = setInterval(tryPlay, 200);
      setTimeout(() => clearInterval(interval), 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, isMuted, isActive, audioLoaded, isMusicMP3]);

  // Iframe load handler
  const handleIframeLoad = () => {
    setAudioLoaded(true);
    setTimeout(() => {
      if (musicIframeRef.current?.contentWindow && !isMuted) {
        musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
        setTimeout(() => musicIframeRef.current?.contentWindow?.postMessage('{"method":"play"}', '*'), 50);
        setTimeout(() => musicIframeRef.current?.contentWindow?.postMessage('{"method":"play"}', '*'), 150);
      }
    }, 100);
  };

  // Play transition sound when chakra changes
  useEffect(() => {
    if (prevChakraIndex.current !== currentChakraIndex && currentChakraIndex > 0) {
      if (transitionSound?.soundcloudUrl && !isMuted && audioInitialized.current) {
        // Pause background music first
        if (isMusicMP3 && musicAudioRef.current) {
          musicAudioRef.current.pause();
        } else if (musicIframeRef.current?.contentWindow) {
          musicIframeRef.current.contentWindow.postMessage('{"method":"pause"}', '*');
        }
        
        // Play transition sound
        if (isTransitionMP3 && transitionAudioRef.current) {
          transitionAudioRef.current.currentTime = 0;
          transitionAudioRef.current.play().catch(err => console.log('Transition play failed:', err));
          
          // Stop after 4 seconds
          setTimeout(() => {
            if (transitionAudioRef.current) {
              transitionAudioRef.current.pause();
              transitionAudioRef.current.currentTime = 0;
            }
            // Resume music
            if (isMusicMP3 && musicAudioRef.current && !isMuted && isActive && !isPaused) {
              musicAudioRef.current.play().catch(err => console.log('Resume failed:', err));
            } else if (musicIframeRef.current?.contentWindow && !isMuted && isActive && !isPaused) {
              musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
            }
          }, 4000);
        } else if (transitionIframeRef.current?.contentWindow) {
          transitionIframeRef.current.contentWindow.postMessage('{"method":"seekTo","value":0}', '*');
          setTimeout(() => {
            transitionIframeRef.current?.contentWindow?.postMessage('{"method":"play"}', '*');
          }, 50);
          
          // Stop after 4 seconds
          setTimeout(() => {
            if (transitionIframeRef.current?.contentWindow) {
              transitionIframeRef.current.contentWindow.postMessage('{"method":"pause"}', '*');
            }
            // Resume music
            if (isMusicMP3 && musicAudioRef.current && !isMuted && isActive && !isPaused) {
              musicAudioRef.current.play().catch(err => console.log('Resume failed:', err));
            } else if (musicIframeRef.current?.contentWindow && !isMuted && isActive && !isPaused) {
              musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
            }
          }, 4000);
        }
      }
    }
    prevChakraIndex.current = currentChakraIndex;
  }, [currentChakraIndex, transitionSound, isMuted, currentTrack, isActive, isPaused, isMusicMP3, isTransitionMP3]);

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
    await resumeAudioContext();
    resume();
    setTimeout(() => {
      if (isMusicMP3 && musicAudioRef.current && !isMuted) {
        musicAudioRef.current.play().catch(err => console.log('Resume play failed:', err));
      } else if (musicIframeRef.current?.contentWindow && !isMuted) {
        musicIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
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
      {/* Music player - MP3 or iframe */}
      {currentTrack?.soundcloudUrl && (
        isMusicMP3 ? (
          <audio
            ref={musicAudioRef}
            src={currentTrack.soundcloudUrl}
            loop
            preload="auto"
            className="hidden"
          />
        ) : (
          <iframe
            ref={musicIframeRef}
            className="hidden"
            width="100%"
            height="1"
            scrolling="no"
            frameBorder="no"
            allow="autoplay; encrypted-media"
            src={currentTrack.soundcloudUrl}
            title="Meditation Music"
            onLoad={handleIframeLoad}
          />
        )
      )}
      
      {/* Transition sound - MP3 or iframe */}
      {transitionSound?.soundcloudUrl && (
        isTransitionMP3 ? (
          <audio
            ref={transitionAudioRef}
            src={transitionSound.soundcloudUrl}
            preload="auto"
            className="hidden"
          />
        ) : (
          <iframe
            ref={transitionIframeRef}
            className="hidden"
            width="100%"
            height="1"
            scrolling="no"
            frameBorder="no"
            allow="autoplay; encrypted-media"
            src={transitionSound.soundcloudUrl}
            title="Transition Sound"
          />
        )
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
      
      {/* Loading overlay */}
      {!audioLoaded && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Зареждане на аудио...</p>
          </div>
        </div>
      )}
      
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
