import { Chakra } from '@/lib/chakras';

interface ChakraOrbProps {
  chakra: Chakra;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-24 h-24',
  xl: 'w-40 h-40',
};

export function ChakraOrb({ chakra, size = 'md', isActive = false, showLabel = false }: ChakraOrbProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full relative ${isActive ? 'animate-pulse-glow' : ''}`}
        style={{
          backgroundColor: chakra.color,
          boxShadow: isActive 
            ? `0 0 30px ${chakra.color}, 0 0 60px ${chakra.color}, 0 0 90px ${chakra.color}`
            : `0 0 15px ${chakra.color}`,
        }}
      >
        {/* Inner glow */}
        <div 
          className="absolute inset-2 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, white 0%, ${chakra.color} 70%)`,
          }}
        />
        
        {/* Sacred geometry symbol */}
        {size !== 'sm' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              viewBox="0 0 100 100" 
              className={`${size === 'xl' ? 'w-20 h-20' : size === 'lg' ? 'w-12 h-12' : 'w-6 h-6'} opacity-40`}
            >
              <polygon 
                points="50,10 90,90 10,90" 
                fill="none" 
                stroke="white" 
                strokeWidth="1"
              />
              <polygon 
                points="50,90 10,10 90,10" 
                fill="none" 
                stroke="white" 
                strokeWidth="1"
              />
              <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>
      
      {showLabel && (
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{chakra.name}</p>
          <p className="text-xs text-muted-foreground italic">{chakra.sanskritName}</p>
        </div>
      )}
    </div>
  );
}
