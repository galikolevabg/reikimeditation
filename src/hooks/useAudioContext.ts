import { useEffect, useRef, useState } from 'react';

/**
 * Hook to manage AudioContext creation and resumption
 * Required for mobile browsers which require user interaction to enable audio
 */
export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAudioAllowed, setIsAudioAllowed] = useState(false);

  /**
   * Initialize AudioContext on first user interaction
   * Uses webkitAudioContext for iOS compatibility
   */
  const initializeAudioContext = async () => {
    try {
      // Use standard AudioContext or webkit version for iOS
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      if (!AudioContextClass) {
        console.warn('AudioContext not supported in this browser');
        setIsAudioAllowed(false);
        return;
      }

      // Create or reuse AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;

      // Resume if suspended (required on mobile after user gesture)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      setIsInitialized(true);
      setIsAudioAllowed(audioContext.state === 'running');
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
      setIsAudioAllowed(false);
    }
  };

  /**
   * Resume AudioContext if it was suspended
   * Call this on user interactions (button clicks, etc.)
   */
  const resumeAudioContext = async () => {
    if (!audioContextRef.current) {
      await initializeAudioContext();
      return;
    }

    try {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      setIsAudioAllowed(audioContextRef.current.state === 'running');
    } catch (error) {
      console.error('Failed to resume AudioContext:', error);
    }
  };

  /**
   * Get current AudioContext state
   */
  const getAudioContext = () => audioContextRef.current;

  /**
   * Check if audio is allowed and context is ready
   */
  const isAudioReady = () => isInitialized && isAudioAllowed && audioContextRef.current?.state === 'running';

  return {
    initializeAudioContext,
    resumeAudioContext,
    getAudioContext,
    isInitialized,
    isAudioAllowed,
    isAudioReady,
  };
}
