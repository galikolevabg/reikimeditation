import { useState, useEffect, useCallback, useRef } from 'react';
import { chakras } from '@/lib/chakras';

interface MeditationState {
  isActive: boolean;
  isPaused: boolean;
  currentChakraIndex: number;
  chakraTimeRemaining: number;
  totalTimeRemaining: number;
  isComplete: boolean;
}

interface UseMeditationTimerProps {
  totalDuration: number; // in minutes
  chakraDurations: number[]; // in seconds for each chakra
}

export function useMeditationTimer({ totalDuration, chakraDurations }: UseMeditationTimerProps) {
  const [state, setState] = useState<MeditationState>({
    isActive: false,
    isPaused: false,
    currentChakraIndex: 0,
    chakraTimeRemaining: chakraDurations[0],
    totalTimeRemaining: totalDuration * 60,
    isComplete: false,
  });

  const intervalRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.isPaused || !prev.isActive) return prev;

      const newChakraTime = prev.chakraTimeRemaining - 1;
      const newTotalTime = prev.totalTimeRemaining - 1;

      // Session complete
      if (newTotalTime <= 0) {
        return {
          ...prev,
          isActive: false,
          isComplete: true,
          chakraTimeRemaining: 0,
          totalTimeRemaining: 0,
        };
      }

      // Move to next chakra
      if (newChakraTime <= 0 && prev.currentChakraIndex < chakras.length - 1) {
        const nextIndex = prev.currentChakraIndex + 1;
        return {
          ...prev,
          currentChakraIndex: nextIndex,
          chakraTimeRemaining: chakraDurations[nextIndex],
          totalTimeRemaining: newTotalTime,
        };
      }

      return {
        ...prev,
        chakraTimeRemaining: Math.max(0, newChakraTime),
        totalTimeRemaining: newTotalTime,
      };
    });
  }, [chakraDurations]);

  useEffect(() => {
    if (state.isActive && !state.isPaused) {
      intervalRef.current = window.setInterval(tick, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive, state.isPaused, tick]);

  const start = useCallback(() => {
    setState({
      isActive: true,
      isPaused: false,
      currentChakraIndex: 0,
      chakraTimeRemaining: chakraDurations[0],
      totalTimeRemaining: totalDuration * 60,
      isComplete: false,
    });
  }, [chakraDurations, totalDuration]);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  const stop = useCallback(() => {
    setState({
      isActive: false,
      isPaused: false,
      currentChakraIndex: 0,
      chakraTimeRemaining: chakraDurations[0],
      totalTimeRemaining: totalDuration * 60,
      isComplete: false,
    });
  }, [chakraDurations, totalDuration]);

  const reset = useCallback(() => {
    setState({
      isActive: false,
      isPaused: false,
      currentChakraIndex: 0,
      chakraTimeRemaining: chakraDurations[0],
      totalTimeRemaining: totalDuration * 60,
      isComplete: false,
    });
  }, [chakraDurations, totalDuration]);

  return {
    ...state,
    currentChakra: chakras[state.currentChakraIndex],
    chakraProgress: ((chakraDurations[state.currentChakraIndex] - state.chakraTimeRemaining) / chakraDurations[state.currentChakraIndex]) * 100,
    totalProgress: ((totalDuration * 60 - state.totalTimeRemaining) / (totalDuration * 60)) * 100,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
