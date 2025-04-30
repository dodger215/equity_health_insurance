import { useState, useEffect } from 'react';
import vibrationSound from './audio/vibration-sound.mp3';


const useVibrate = () => {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // Check if vibration API is supported
    
    
    // Initialize audio fallback
    const fallbackAudio = new Audio(vibrationSound);
    setAudio(fallbackAudio);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const vibrate = () => {
      audio.currentTime = 0;
      audio.play().catch(e => console.error('Audio playback failed:', e));
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 1500);
  };

  return vibrate;
};

export default useVibrate;