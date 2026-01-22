import { useState } from 'react';
import { musicTracks, transitionSounds } from '@/lib/chakras';
import { ArrowLeft, Check, Play, Pause, Volume2, Bell } from 'lucide-react';

interface MusicScreenProps {
  onBack: () => void;
  onStart: (musicId: string, transitionSoundId: string) => void;
}

export function MusicScreen({ onBack, onStart }: MusicScreenProps) {
  const [selectedMusic, setSelectedMusic] = useState<string>('ambient');
  const [selectedTransition, setSelectedTransition] = useState<string>('tibetan-small');
  const [previewingMusic, setPreviewingMusic] = useState<string | null>(null);
  const [previewingTransition, setPreviewingTransition] = useState<string | null>(null);

  /**
   * Initialize AudioContext on user interaction (required for mobile)
   * iOS and Android require explicit user gesture to enable audio playback
   */
  const initializeAudioOnUserGesture = async () => {
    try {
      // Use standard AudioContext or webkit version for iOS compatibility
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        
        // Resume if suspended (required on iOS/Android after user gesture)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        console.log('AudioContext initialized:', audioContext.state);
      }
    } catch (error) {
      console.warn('AudioContext initialization warning (this is normal on some browsers):', error);
    }
  };

  /**
   * Handle Begin Meditation button click
   * This triggers audio initialization before meditation starts
   */
  const handleBeginMeditation = async () => {
    // Initialize audio on this user interaction before starting meditation
    await initializeAudioOnUserGesture();
    
    // Now proceed with meditation
    onStart(selectedMusic, selectedTransition);
  };

  const handlePreview = (musicId: string) => {
    setPreviewingTransition(null);
    if (previewingMusic === musicId) {
      setPreviewingMusic(null);
    } else {
      // Initialize audio context on preview interaction as well
      initializeAudioOnUserGesture();
      setPreviewingMusic(musicId);
    }
  };

  const handleTransitionPreview = (soundId: string) => {
    setPreviewingMusic(null);
    if (previewingTransition === soundId) {
      setPreviewingTransition(null);
    } else {
      // Initialize audio context on preview interaction as well
      initializeAudioOnUserGesture();
      setPreviewingTransition(soundId);
    }
  };

  const previewTrack = previewingMusic ? musicTracks.find(t => t.id === previewingMusic) : null;
  const previewTransitionSound = previewingTransition ? transitionSounds.find(t => t.id === previewingTransition) : null;

  return (
    <div className="cosmic-bg min-h-screen flex flex-col p-6">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
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
            <button
              key={track.id}
              onClick={() => setSelectedMusic(track.id)}
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
                {track.soundcloudUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(track.id);
                    }}
                    className={`p-2 rounded-full transition-all
                      ${previewingMusic === track.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white/10 hover:bg-white/20'
                      }`}
                  >
                    {previewingMusic === track.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
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

        {/* Transition Sound Options */}
        <div className="space-y-3 mb-8">
          {transitionSounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => setSelectedTransition(sound.id)}
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
                {sound.soundcloudUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTransitionPreview(sound.id);
                    }}
                    className={`p-2 rounded-full transition-all
                      ${previewingTransition === sound.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-white/10 hover:bg-white/20'
                      }`}
                  >
                    {previewingTransition === sound.id ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </button>
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

      {/* Music Preview Player */}
      {previewTrack?.soundcloudUrl && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-white/10 p-3">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Preview: {previewTrack.name}</span>
              <button 
                onClick={() => setPreviewingMusic(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <iframe
              className="w-full rounded-lg"
              width="100%"
              height="80"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={previewTrack.soundcloudUrl}
              title="Music Preview"
            />
          </div>
        </div>
      )}

      {/* Transition Sound Preview Player */}
      {previewTransitionSound?.soundcloudUrl && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-white/10 p-3">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Preview: {previewTransitionSound.name}</span>
              <button 
                onClick={() => setPreviewingTransition(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <iframe
              className="w-full rounded-lg"
              width="100%"
              height="80"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={previewTransitionSound.soundcloudUrl}
              title="Transition Sound Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
