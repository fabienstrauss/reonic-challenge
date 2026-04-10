import { useState, useEffect, useCallback } from 'react';

export function usePlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTick, setPlaybackTick] = useState(0);
  const [playSpeed, setPlaybackSpeed] = useState<1 | 4 | 16>(4);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTick((prev) => (prev >= 95 ? 0 : prev + 1));
      }, 1000 / playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  const resetPlayback = useCallback(() => {
    setPlaybackTick(0);
    setIsPlaying(false);
  }, []);

  return { 
    isPlaying, 
    setIsPlaying, 
    playbackTick, 
    setPlaybackTick, 
    playSpeed, 
    setPlaybackSpeed,
    resetPlayback
  };
}
