import { ChakraOrb } from '../ChakraOrb';
import { SacredGeometry } from '../SacredGeometry';
import { chakras } from '@/lib/chakras';
import { Home, RotateCcw, Sparkles } from 'lucide-react';

interface CompleteScreenProps {
  onHome: () => void;
  onRestart: () => void;
}

export function CompleteScreen({ onHome, onRestart }: CompleteScreenProps) {
  return (
    <div className="cosmic-bg min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Sacred geometry background */}
      <SacredGeometry className="absolute w-[600px] h-[600px] text-primary opacity-20" />
      
      {/* Glowing effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-96 h-96 rounded-full animate-breathe-slow"
          style={{
            background: 'radial-gradient(circle, hsla(145, 55%, 45%, 0.2) 0%, transparent 70%)',
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto animate-fade-in">
        {/* Completion icon */}
        <div className="mb-6 relative">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center animate-pulse-glow"
               style={{ color: 'hsl(var(--accent))' }}>
            <Sparkles className="w-12 h-12 text-accent" />
          </div>
        </div>
        
        {/* All chakras aligned */}
        <div className="flex gap-2 mb-8">
          {chakras.map((chakra, index) => (
            <div 
              key={chakra.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ChakraOrb chakra={chakra} size="sm" isActive />
            </div>
          ))}
        </div>
        
        {/* Completion message */}
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
          Meditation Complete
        </h1>
        
        <p className="font-display text-2xl text-accent mb-2">
          Медитацията приключи
        </p>
        
        {/* Grounding message */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 my-8">
          <p className="text-lg text-foreground mb-3">
            Take a moment to ground yourself.
          </p>
          <p className="text-muted-foreground mb-4">
            Feel your connection to the Earth. Wiggle your fingers and toes.
            When you're ready, slowly open your eyes.
          </p>
          <p className="text-sm text-muted-foreground/70 italic">
            Отделете момент, за да се заземите. Почувствайте връзката си със Земята.
            Когато сте готови, бавно отворете очи.
          </p>
        </div>
        
        {/* Spiritual message */}
        <p className="text-muted-foreground mb-8 italic">
          "Your chakras are now aligned and your energy flows freely."
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <button
            onClick={onRestart}
            className="btn-meditation-secondary flex-1 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            New Session
          </button>
          
          <button
            onClick={onHome}
            className="btn-meditation flex-1 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
        
      </div>
    </div>
  );
}
