import { useState } from 'react';
import { musicTracks } from '@/lib/chakras';
import { ArrowLeft, Check, Play, Volume2 } from 'lucide-react';

interface MusicScreenProps {
  onBack: () => void;
  onStart: (musicId: string) => void;
}

export function MusicScreen({ onBack, onStart }: MusicScreenProps) {
  const [selectedMusic, setSelectedMusic] = useState<string>('ambient');
  const [previewingMusic, setPreviewingMusic] = useState<string | null>(null);

  const handlePreview = (musicId: string) => {
    if (previewingMusic === musicId) {
      setPreviewingMusic(null);
    } else {
      setPreviewingMusic(musicId);
      // In a real app, this would play audio
      setTimeout(() => setPreviewingMusic(null), 3000);
    }
  };

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

      <div className="flex-1 max-w-md mx-auto w-full">
        {/* Music Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-breathe">
            <Volume2 className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Music Options */}
        <div className="space-y-4 mb-8">
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
              <span className="text-3xl">{track.icon}</span>
              
              <div className="flex-1">
                <h3 className="font-medium">{track.name}</h3>
                <p className="text-sm text-muted-foreground">{track.description}</p>
                <p className="text-xs text-muted-foreground/60 italic mt-1">{track.nameBg}</p>
              </div>

              <div className="flex items-center gap-2">
                {track.id !== 'silence' && (
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
                    <Play className="w-4 h-4" />
                  </button>
                )}
                
                {selectedMusic === track.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart(selectedMusic)}
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
