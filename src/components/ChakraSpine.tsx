import { chakras } from '@/lib/chakras';
import { ChakraOrb } from './ChakraOrb';

interface ChakraSpineProps {
  activeChakraIndex?: number;
}

export function ChakraSpine({ activeChakraIndex = -1 }: ChakraSpineProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-4">
      {/* Reverse the order for visual display (crown on top) */}
      {[...chakras].reverse().map((chakra, reversedIndex) => {
        const actualIndex = chakras.length - 1 - reversedIndex;
        const isActive = actualIndex === activeChakraIndex;
        const isPast = actualIndex < activeChakraIndex;
        
        return (
          <div 
            key={chakra.id} 
            className={`transition-all duration-500 ${
              isActive ? 'scale-125' : isPast ? 'opacity-40' : 'opacity-70'
            }`}
          >
            <ChakraOrb chakra={chakra} size="sm" isActive={isActive} />
          </div>
        );
      })}
    </div>
  );
}
