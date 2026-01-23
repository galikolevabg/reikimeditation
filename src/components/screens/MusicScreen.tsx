import { useState, useRef } from 'react';
import { musicTracks, transitionSounds } from '@/lib/chakras';
import { ArrowLeft, Check, Play, Pause, Volume2, Bell, Square } from 'lucide-react';

interface MusicScreenProps {
  onBack: () => void;
  onStart: (musicId: string, transitionSoundId: string) => void;
}

export function MusicScreen({ onBack, onStart }: MusicScreenProps) {
  const [selectedMusic, setSelectedMusic] = useState<string>('ambient');
  const [selectedTransition, setSelectedTransition] = useState<string>('tibetan-small');
  const [previewingMusic, setPreviewingMusic] = useState<string | null>(null);
  const [previewingTransition, setPreviewingTransition] = useState<string | null>(null);
  
  const musicPreviewRef = useRef<HTMLIFrameElement>(null);
  const transitionPreviewRef = useRef<HTMLIFrameElement>(null);

  const handleMusicSelect = (musicId: string) => {
    // Stop any current preview
    stopAllPreviews();
    setSelectedMusic(musicId);
    
    // Auto-preview selected music
    const track = musicTracks.find(t => t.id === musicId);
    if (track?.soundcloudUrl) {
      setPreviewingMusic(musicId);
    }
  };

  const handleTransitionSelect = (soundId: string) => {
    // Stop any current preview
    stopAllPreviews();
    setSelectedTransition(soundId);
    
    // Auto-preview selected transition
    const sound = transitionSounds.find(s => s.id === soundId);
    if (sound?.soundcloudUrl) {
      setPreviewingTransition(soundId);
    }
  };

  const stopAllPreviews = () => {
    setPreviewingMusic(null);
    setPreviewingTransition(null);
    // Stop audio via postMessage
    if (musicPreviewRef.current?.contentWindow) {
      musicPreviewRef.current.contentWindow.postMessage('{"method":"pause"}', '*');
    }
    if (transitionPreviewRef.current?.contentWindow) {
      transitionPreviewRef.current.contentWindow.postMessage('{"method":"pause"}', '*');
    }
  };

  const handleBeginMeditation = () => {
    stopAllPreviews();
    onStart(selectedMusic, selectedTransition);
  };

  const previewTrack = previewingMusic ? musicTracks.find(t => t.id === previewingMusic) : null;
  const previewTransitionSound = previewingTransition ? transitionSounds.find(t => t.id === previewingTransition) : null;

  return (
    <div className="cosmic-bg min-h-screen flex flex-col p-6">
      {/* Hidden iframes for audio playback */}
      {previewTrack?.soundcloudUrl && (
        <iframe
          ref={musicPreviewRef}
          className="hidden"
          width="100%"
          height="1"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={previewTrack.soundcloudUrl}
          title="Music Preview"
          onLoad={() => {
            // Auto-play when loaded
            setTimeout(() => {
              if (musicPreviewRef.current?.contentWindow) {
                musicPreviewRef.current.contentWindow.postMessage('{"method":"play"}', '*');
              }
            }, 300);
          }}
        />
      )}
      
      {previewTransitionSound?.soundcloudUrl && (
        <iframe
          ref={transitionPreviewRef}
          className="hidden"
          width="100%"
          height="1"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={previewTransitionSound.soundcloudUrl}
          title="Transition Preview"
          onLoad={() => {
            // Auto-play when loaded
            setTimeout(() => {
              if (transitionPreviewRef.current?.contentWindow) {
                transitionPreviewRef.current.contentWindow.postMessage('{"method":"play"}', '*');
              }
            }, 300);
          }}
        />
      )}
      
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            stopAllPreviews();
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

        {/* Now Playing indicator */}
        {previewingMusic && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-primary animate-pulse">
            <Volume2 className="w-4 h-4" />
            <span>Playing: {musicTracks.find(t => t.id === previewingMusic)?.name}</span>
            <button 
              onClick={stopAllPreviews}
              className="ml-2 p-1 rounded-full bg-white/10 hover:bg-white/20"
            >
              <Square className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Music Options */}
        <div className="space-y-3 mb-8">
          {musicTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => handleMusicSelect(track.id)}
              className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4
                ${selectedMusic === track.id
                  ? 'bg-primary/20 border-primary/30 shadow-[0_0_20px_hsla(var(--primary),0.2)]'
                  : 'bg-card/50 border-white/10 hover:bg-card/70'
                }`}
            >
              <span className="text-2xl">{track.icon}</span>
              
              <div className="flex-1">
                <h3 className="font-medium text-sm">{track.name}</h3>
                <p className="text-xs text-muted-foreground">{track.description}</p>
              </div>

              <div className="flex items-center gap-2">
                {previewingMusic === track.id && (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
                
                {selectedMusic === track.id && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
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

        {/* Now Playing Transition indicator */}
        {previewingTransition && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-accent animate-pulse">
            <Bell className="w-4 h-4" />
            <span>Playing: {transitionSounds.find(t => t.id === previewingTransition)?.name}</span>
            <button 
              onClick={stopAllPreviews}
              className="ml-2 p-1 rounded-full bg-white/10 hover:bg-white/20"
            >
              <Square className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Transition Sound Options */}
        <div className="space-y-3 mb-8">
          {transitionSounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => handleTransitionSelect(sound.id)}
              className={`w-full p-3 rounded-xl border transition-all text-left flex items-center gap-3
                ${selectedTransition === sound.id
                  ? 'bg-accent/20 border-accent/30 shadow-[0_0_15px_hsla(var(--accent),0.2)]'
                  : 'bg-card/50 border-white/10 hover:bg-card/70'
                }`}
            >
              <span className="text-xl">{sound.icon}</span>
              
              <div className="flex-1">
                <h3 className="font-medium text-sm">{sound.name}</h3>
                <p className="text-xs text-muted-foreground">{sound.nameBg}</p>
              </div>

              <div className="flex items-center gap-2">
                {previewingTransition === sound.id && (
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                )}
                
                {selectedTransition === sound.id && (
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Check className="w-3 h-3 text-accent-foreground" />
                  </div>
                )}
              </div>
            </button>
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
