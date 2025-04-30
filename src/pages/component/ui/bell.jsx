import { useState, useEffect } from 'react';
import BellSound from './audio/bell.mp3'


const useBell = () => {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    
    
    
    
    const fallbackAudio = new Audio(BellSound);
    setAudio(fallbackAudio);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const ring = () => {
      audio.currentTime = 0;
      audio.play().catch(e => console.error('Audio playback failed:', e));
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 1500);
  };

  return ring;
};

export default useBell;