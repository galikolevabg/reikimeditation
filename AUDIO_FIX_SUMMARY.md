// ============================================
// MOBILE AUDIO FIX - CODE CHANGES SUMMARY
// ============================================

// BEFORE (BROKEN ON MOBILE):
// ============================================
// Audio would try to autoplay in useEffect
// iOS/Android browsers block this
// Result: No audio on mobile devices

useEffect(() => {
  start(); // ❌ Tries to start immediately - blocked by browser
}, [start]);

// AFTER (FIXED - MOBILE SAFE):
// ============================================
// Audio initializes only on user click
// iOS/Android allows this with user gesture
// Result: Audio works on all platforms

const handleBeginMeditation = async () => {
  // ✅ Initialize AudioContext within user gesture handler
  const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
  
  if (AudioContextClass) {
    const audioContext = new AudioContextClass();
    if (audioContext.state === 'suspended') {
      await audioContext.resume(); // Resume is allowed within user gesture
    }
  }
  
  // Now start meditation - audio is ready
  onStart(selectedMusic, selectedTransition);
};

// MeditationScreen also initializes AudioContext when meditation becomes active
useEffect(() => {
  if (!audioContextInitialized.current && isActive) {
    initializeAudioContext(); // ✅ Safe to call - meditation was started by user click
    audioContextInitialized.current = true;
  }
}, [isActive]);

// ============================================
// KEY IMPROVEMENTS
// ============================================

1. ✅ User Gesture Required
   - AudioContext.resume() only works after user tap/click
   - MusicScreen: "Begin Meditation" button triggers initialization
   - MeditationScreen: Initializes when meditation starts (user already clicked)

2. ✅ iOS Compatibility
   - Uses (window as any).webkitAudioContext fallback
   - Works with both standard and webkit AudioContext APIs

3. ✅ SoundCloud Integration
   - Uses postMessage API (not direct autoplay)
   - iframe has allow="autoplay" but respects mobile restrictions
   - Control flow: user gesture → AudioContext → postMessage → iframe plays

4. ✅ Error Handling
   - Graceful fallback if AudioContext not supported
   - Logs to console for debugging
   - Won't crash if initialization fails

// ============================================
// AUDIO FLOW DIAGRAM
// ============================================

DESKTOP:
--------
User Click "Begin Meditation"
        ↓
initializeAudioOnUserGesture()
        ↓
Create AudioContext (already running)
        ↓
onStart() called
        ↓
MeditationScreen mounts, isActive=true
        ↓
initializeAudioContext() called in useEffect
        ↓
postMessage('play') to iframe
        ↓
🎵 AUDIO PLAYS IMMEDIATELY


iOS/ANDROID:
-----------
User Click "Begin Meditation" (REQUIRED)
        ↓
initializeAudioOnUserGesture()
        ↓
Create AudioContext (in suspended state)
        ↓
audioContext.resume() (allowed within user gesture!)
        ↓
onStart() called
        ↓
MeditationScreen mounts, isActive=true
        ↓
initializeAudioContext() called in useEffect
        ↓
postMessage('play') to iframe
        ↓
🎵 AUDIO PLAYS (browser allows it now!)


// ============================================
// TESTING ON REAL DEVICES
// ============================================

iOS Safari:
1. Open app on iPhone
2. Tap "Begin Meditation"
3. Music should start playing
4. Check browser console: "AudioContext initialized: running"

Android Chrome:
1. Open app on Android phone
2. Tap "Begin Meditation"
3. Music should start playing
4. Check DevTools console: "AudioContext initialized: running"

Desktop Chrome:
1. Open app in Chrome
2. Click "Begin Meditation"
3. Music should start playing immediately
4. Console: "AudioContext initialized: running"


// ============================================
// FILES MODIFIED
// ============================================

src/components/screens/MusicScreen.tsx
  • Added initializeAudioOnUserGesture() function
  • Added handleBeginMeditation() handler
  • Updated Begin Meditation button onClick
  • Updated preview button handlers to init audio

src/components/screens/MeditationScreen.tsx
  • Added audioContextInitialized ref
  • Added initializeAudioContext() function
  • Added useEffect to initialize when isActive
  • Added comments explaining mobile audio flow
  • Removed problematic useEffect that starts audio

src/hooks/useAudioContext.ts (optional utility)
  • Created reusable AudioContext hook
  • Not currently used but available for future refactoring
