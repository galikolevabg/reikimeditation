import { useState } from 'react';
import { ChakraOrb } from '../ChakraOrb';
import { chakras } from '@/lib/chakras';
import { ArrowLeft, Clock, Equal, Sliders } from 'lucide-react';

interface SetupScreenProps {
  onBack: () => void;
  onNext: (settings: SessionSettings) => void;
  initialSettings?: SessionSettings;
}

export interface SessionSettings {
  totalDuration: number; // in minutes
  equalTime: boolean;
  chakraDurations: number[]; // in seconds
}

export function SetupScreen({ onBack, onNext, initialSettings }: SetupScreenProps) {
  const [totalDuration, setTotalDuration] = useState(initialSettings?.totalDuration || 21);
  const [equalTime, setEqualTime] = useState(initialSettings?.equalTime ?? true);
  const [chakraDurations, setChakraDurations] = useState<number[]>(
    initialSettings?.chakraDurations || chakras.map(() => Math.floor((21 * 60) / 7))
  );

  const handleTotalDurationChange = (value: number) => {
    setTotalDuration(value);
    if (equalTime) {
      const perChakra = Math.floor((value * 60) / 7);
      setChakraDurations(chakras.map(() => perChakra));
    }
  };

  const handleChakraDurationChange = (index: number, value: number) => {
    const newDurations = [...chakraDurations];
    newDurations[index] = value;
    setChakraDurations(newDurations);
  };

  const handleEqualTimeToggle = () => {
    const newEqualTime = !equalTime;
    setEqualTime(newEqualTime);
    if (newEqualTime) {
      const perChakra = Math.floor((totalDuration * 60) / 7);
      setChakraDurations(chakras.map(() => perChakra));
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
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
        <h1 className="font-display text-2xl">Session Setup</h1>
      </header>

      <div className="flex-1 max-w-md mx-auto w-full space-y-8">
        {/* Total Duration */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl">Total Duration</h2>
          </div>
          
          <div className="text-center mb-4">
            <span className="text-4xl font-display text-primary">
              {formatDuration(totalDuration)}
            </span>
          </div>
          
          <input
            type="range"
            min="10"
            max="120"
            step="1"
            value={totalDuration}
            onChange={(e) => handleTotalDurationChange(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 
                       [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full 
                       [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:shadow-[0_0_10px_hsl(var(--primary))]"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>10 min</span>
            <span>2 hours</span>
          </div>
        </div>

        {/* Chakra Timing */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl">Chakra Timing</h2>
            </div>
            
            <button
              onClick={handleEqualTimeToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all
                ${equalTime 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'bg-white/5 text-muted-foreground border border-white/10'
                }`}
            >
              <Equal className="w-4 h-4" />
              Equal
            </button>
          </div>

          <div className="space-y-4">
            {chakras.map((chakra, index) => (
              <div key={chakra.id} className="flex items-center gap-4">
                <ChakraOrb chakra={chakra} size="sm" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{chakra.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatSeconds(chakraDurations[index])}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="600"
                    step="30"
                    value={chakraDurations[index]}
                    onChange={(e) => handleChakraDurationChange(index, parseInt(e.target.value))}
                    disabled={equalTime}
                    className={`w-full h-1.5 rounded-full appearance-none cursor-pointer
                      ${equalTime ? 'bg-muted/50 cursor-not-allowed' : 'bg-muted'}
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                      [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:cursor-pointer
                      ${equalTime 
                        ? '[&::-webkit-slider-thumb]:bg-muted-foreground' 
                        : '[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_8px_hsl(var(--primary))]'
                      }`}
                    style={{
                      background: equalTime 
                        ? undefined 
                        : `linear-gradient(to right, ${chakra.color} 0%, ${chakra.color} ${(chakraDurations[index] / 600) * 100}%, hsl(var(--muted)) ${(chakraDurations[index] / 600) * 100}%)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => onNext({ totalDuration, equalTime, chakraDurations })}
          className="btn-meditation w-full"
        >
          Choose Music
        </button>
      </div>
    </div>
  );
}
