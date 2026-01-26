import { useState, useRef } from 'react';
import { musicTracks, transitionSounds } from '@/lib/chakras';
import { ArrowLeft, Check, Play, Pause, Volume2, Bell } from 'lucide-react';
import { useAudioContext } from '@/hooks/useAudioContext';

interface MusicScreenProps {
  onBack: () => void;
  onStart: (musicId: string, transitionSoundId: string) => void;
}

export function MusicScreen({ onBack, onStart }: MusicScreenProps) {
  const [selectedMusic, setSelectedMusic] = useState<string>('ambient');
  const [selectedTransition, setSelectedTransition] = useState<string>('tibetan-small');

  const { resumeAudioContext } = useAudioContext();
  
  const musicPreviewRef = useRef<HTMLIFrameElement>(null);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMusicSelect = (musicId: string) => {
    setSelectedMusic(musicId);
  };

  const handleTransitionSelect = (soundId: string) => {
    setSelectedTransition(soundId);
  };

  const handlePreview = async (url: string) => {
    // Unlock audio on mobile inside the same user gesture
    await resumeAudioContext();

    // If already playing this url, stop it
    if (currentPreviewUrl === url && isPlaying) {
      stopPreview();
      return;
    }

    // Stop any current preview
    stopPreview();

    // Start new preview
    setCurrentPreviewUrl(url);
    setIsPlaying(true);

    // Wait for iframe to load, then play
    setTimeout(() => {
      if (musicPreviewRef.current?.contentWindow) {
        musicPreviewRef.current.contentWindow.postMessage('{"method":"play"}', '*');
        setTimeout(() => {
          musicPreviewRef.current?.contentWindow?.postMessage('{"method":"play"}', '*');
        }, 100);
        setTimeout(() => {
          musicPreviewRef.current?.contentWindow?.postMessage('{"method":"play"}', '*');
        }, 300);
      }
    }, 400);
  };

  const stopPreview = () => {
    setIsPlaying(false);
    if (musicPreviewRef.current?.contentWindow) {
      musicPreviewRef.current.contentWindow.postMessage('{"method":"pause"}', '*');
    }
  };

  const handleBeginMeditation = async () => {
    stopPreview();
    // Critical: Resume AudioContext on iOS before starting meditation
    await resumeAudioContext();
    onStart(selectedMusic, selectedTransition);
  };

  return (
    <div className="cosmic-bg min-h-screen flex flex-col p-6">
      {/* Hidden iframe for audio preview */}
      {currentPreviewUrl && (
        <iframe
          ref={musicPreviewRef}
          className="hidden"
          width="100%"
          height="1"
          scrolling="no"
          frameBorder="no"
          allow="autoplay; encrypted-media"
          src={currentPreviewUrl}
          title="Music Preview"
        />
      )}
      
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            stopPreview();
            onBack();
          }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display text-2xl">Choose Music</h1>
      </header>

      <div className="flex-1 max-w-md mx-auto w-full pb-32 overflow-y-auto">
        {/* Music Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center animate-breathe">
            <Volume2 className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h2 className="font-display text-lg mb-4 text-center">Background Music</h2>

        {/* Music Options */}
        <div className="space-y-3 mb-8">
          {musicTracks.map((track) => (
            <div
              key={track.id}
              className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4
                ${selectedMusic === track.id
                  ? 'bg-primary/20 border-primary/30 shadow-[0_0_20px_hsla(var(--primary),0.2)]'
                  : 'bg-card/50 border-white/10 hover:bg-card/70'
                }`}
            >
              <button
                onClick={() => handleMusicSelect(track.id)}
                className="flex items-center gap-4 flex-1"
              >
                <span className="text-2xl">{track.icon}</span>
                
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-sm">{track.name}</h3>
                  <p className="text-xs text-muted-foreground">{track.description}</p>
                </div>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                {track.soundcloudUrl && (
                  <button
                    onClick={() => handlePreview(track.soundcloudUrl)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    title="Preview"
                  >
                    {currentPreviewUrl === track.soundcloudUrl && isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                )}
                
                {selectedMusic === track.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Transition Sound Section */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <Bell className="w-8 h-8 text-accent" />
          </div>
        </div>

        <h2 className="font-display text-lg mb-2 text-center">Chakra Transition Sound</h2>
        <p className="text-xs text-muted-foreground text-center mb-4">
          Звук при смяна на чакра
        </p>

        {/* Transition Sound Options */}
        <div className="space-y-3 mb-8">
          {transitionSounds.map((sound) => (
            <div
              key={sound.id}
              className={`w-full p-3 rounded-xl border transition-all text-left flex items-center gap-3
                ${selectedTransition === sound.id
                  ? 'bg-accent/20 border-accent/30 shadow-[0_0_15px_hsla(var(--accent),0.2)]'
                  : 'bg-card/50 border-white/10 hover:bg-card/70'
                }`}
            >
              <button
                onClick={() => handleTransitionSelect(sound.id)}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-xl">{sound.icon}</span>
                
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-sm">{sound.name}</h3>
                  <p className="text-xs text-muted-foreground">{sound.nameBg}</p>
                </div>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                {sound.soundcloudUrl && (
                  <button
                    onClick={() => handlePreview(sound.soundcloudUrl)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    title="Preview"
                  >
                    {currentPreviewUrl === sound.soundcloudUrl && isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                )}
                
                {selectedTransition === sound.id && (
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <Check className="w-3 h-3 text-accent-foreground" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={handleBeginMeditation}
          className="btn-meditation w-full"
        >
          Begin Meditation
        </button>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          Find a comfortable position and prepare to relax.
        </p>
      </div>
    </div>
  );
}
