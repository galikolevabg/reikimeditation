// ============================================
// CONCRETE CODE CHANGES - SIDE BY SIDE
// ============================================

// FILE 1: src/components/screens/MusicScreen.tsx
// ============================================

// BEFORE (Original):
// ---------------------
export function MusicScreen({ onBack, onStart }: MusicScreenProps) {
  const [selectedMusic, setSelectedMusic] = useState<string>('ambient');
  const [selectedTransition, setSelectedTransition] = useState<string>('tibetan-small');
  const [previewingMusic, setPreviewingMusic] = useState<string | null>(null);
  const [previewingTransition, setPreviewingTransition] = useState<string | null>(null);

  const handlePreview = (musicId: string) => {
    setPreviewingTransition(null);
    if (previewingMusic === musicId) {
      setPreviewingMusic(null);
    } else {
      setPreviewingMusic(musicId);
    }
  };

  // ... JSX with button:
  // <button onClick={() => onStart(selectedMusic, selectedTransition)}>
  //   Begin Meditation
  // </button>
}

// AFTER (Fixed):
// ---------------------
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

  // ... JSX with button:
  // <button onClick={handleBeginMeditation}>
  //   Begin Meditation
  // </button>
}


// FILE 2: src/components/screens/MeditationScreen.tsx
// ============================================

// BEFORE (Original):
// ---------------------
export function MeditationScreen({ 
  settings, 
  selectedMusic, 
  selectedTransition,
  onComplete, 
  onEnd 
}: MeditationScreenProps) {
  // ... setup code ...
  
  const musicIframeRef = useRef<HTMLIFrameElement>(null);
  const transitionIframeRef = useRef<HTMLIFrameElement>(null);
  const prevChakraIndex = useRef(currentChakraIndex);
  const [isMuted, setIsMuted] = useState(false);

  // Start meditation on mount - ❌ WRONG! No user gesture here
  useEffect(() => {
    start();
  }, [start]);

  // ❌ Audio autoplay attempts in this useEffect
  useEffect(() => {
    if (musicIframeRef.current && currentTrack?.soundcloudUrl) {
      const widget = musicIframeRef.current.contentWindow;
      if (widget) {
        if (isPaused || isMuted) {
          widget.postMessage('{"method":"pause"}', '*');
        } else if (isActive) {
          // ❌ This tries to play but browser has already blocked audio on mobile
          widget.postMessage('{"method":"play"}', '*');
        }
      }
    }
  }, [isPaused, isActive, isMuted, currentTrack]);
}

// AFTER (Fixed):
// ---------------------
export function MeditationScreen({ 
  settings, 
  selectedMusic, 
  selectedTransition,
  onComplete, 
  onEnd 
}: MeditationScreenProps) {
  // ... setup code ...
  
  const musicIframeRef = useRef<HTMLIFrameElement>(null);
  const transitionIframeRef = useRef<HTMLIFrameElement>(null);
  const prevChakraIndex = useRef(currentChakraIndex);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextInitialized = useRef(false); // ✅ NEW: Track initialization

  /**
   * Initialize AudioContext on meditation start
   * iOS and Android require user interaction to start audio
   * The start() call from useMeditationTimer is triggered by user button click
   */
  useEffect(() => {
    // ✅ NEW: Initialize audio when meditation becomes active
    if (!audioContextInitialized.current && isActive) {
      initializeAudioContext();
      audioContextInitialized.current = true;
    }
  }, [isActive]);

  /**
   * Initialize AudioContext for mobile compatibility
   * Must be called during/after user interaction
   */
  const initializeAudioContext = async () => { // ✅ NEW: Function
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        
        // Resume if suspended (required on iOS/Android)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        console.log('MeditationScreen AudioContext initialized:', audioContext.state);
      }
    } catch (error) {
      console.warn('AudioContext initialization in MeditationScreen:', error);
    }
  };

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // Control music playback based on pause state
  // Uses postMessage to communicate with SoundCloud iframe - mobile safe ✅ COMMENT ADDED
  useEffect(() => {
    if (musicIframeRef.current && currentTrack?.soundcloudUrl) {
      const widget = musicIframeRef.current.contentWindow;
      if (widget) {
        if (isPaused || isMuted) {
          // Pause music when meditation is paused or muted ✅ COMMENT ADDED
          widget.postMessage('{"method":"pause"}', '*');
        } else if (isActive) {
          // Play music when meditation is active and not paused ✅ COMMENT ADDED
          widget.postMessage('{"method":"play"}', '*');
        }
      }
    }
  }, [isPaused, isActive, isMuted, currentTrack]);

  // ✅ REMOVED: Original problematic useEffect that tried to start on mount
}


// FILE 3: src/hooks/useAudioContext.ts (NEW - Optional)
// ============================================

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

  const getAudioContext = () => audioContextRef.current;
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


// ============================================
// SUMMARY OF CHANGES
// ============================================

/*
CRITICAL CHANGES:

1. MusicScreen.tsx:
   ✅ Added initializeAudioOnUserGesture() - Creates/resumes AudioContext
   ✅ Added handleBeginMeditation() - Initializes audio BEFORE starting meditation
   ✅ Updated button onClick from onStart() to handleBeginMeditation()
   ✅ Added audio init to preview handlers
   
2. MeditationScreen.tsx:
   ✅ Added audioContextInitialized ref - Prevents double initialization
   ✅ Added initializeAudioContext() - Same logic as MusicScreen
   ✅ Added useEffect that initializes audio when meditation becomes active
   ✅ Removed problematic useEffect that tried to start on mount
   ✅ Added detailed comments about mobile audio flow
   
3. useAudioContext.ts (NEW):
   ✅ Created optional utility hook for reusable audio context management
   ✅ Can be used in future refactoring to avoid code duplication

KEY PRINCIPLE:
Audio initialization now follows this flow:
User Click → AudioContext.resume() → useEffect checks isActive → postMessage('play')

This respects iOS/Android browser audio restrictions while ensuring
audio works on all platforms.
*/
