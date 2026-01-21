import { ChakraOrb } from '../ChakraOrb';
import { SacredGeometry } from '../SacredGeometry';
import { chakras } from '@/lib/chakras';

interface LandingScreenProps {
  onStartMeditation: () => void;
  onCustomize: () => void;
}

export function LandingScreen({ onStartMeditation, onCustomize }: LandingScreenProps) {
  return (
    <div className="cosmic-bg min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Sacred geometry background */}
      <SacredGeometry className="absolute w-[600px] h-[600px] text-primary" />
      
      {/* Floating chakra orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {chakras.map((chakra, index) => (
          <div
            key={chakra.id}
            className="absolute animate-float"
            style={{
              left: `${15 + (index * 10)}%`,
              top: `${20 + (index % 3) * 25}%`,
              animationDelay: `${index * 0.5}s`,
              opacity: 0.4,
            }}
          >
            <ChakraOrb chakra={chakra} size="sm" />
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Central chakra visualization */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 animate-breathe-slow">
            <SacredGeometry className="w-48 h-48 text-primary opacity-30" />
          </div>
          <div className="relative flex flex-col items-center gap-2 py-4">
            {[...chakras].reverse().map((chakra, index) => (
              <div 
                key={chakra.id}
                className="animate-breathe"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <ChakraOrb chakra={chakra} size="sm" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3 animate-fade-in">
          Reiki Chakra Meditation
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-muted-foreground mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Balance your energy. Restore inner harmony.
        </p>
        <p className="text-sm text-muted-foreground/70 italic mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Балансирай енергията си. Възстанови вътрешната хармония.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-xs animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={onStartMeditation}
            className="btn-meditation"
          >
            Start Meditation
          </button>
          
          <button
            onClick={onCustomize}
            className="btn-meditation-secondary"
          >
            Customize Session
          </button>
        </div>
        
        {/* Spiritual quote */}
        <p className="mt-12 text-sm text-muted-foreground/60 italic max-w-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
          "The chakras are the seven sacred gateways to your soul's journey."
        </p>
      </div>
    </div>
  );
}
