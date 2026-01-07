import { useRef, useState } from "react";

const useTimer = () => {
  const [timer, setTimer] = useState(0);

  const interval = useRef<number | null>(null);

  const handleTimerStart = () => {
    const startTime = Date.now();
    interval.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setTimer(elapsedTime);
    }, 500);
  };

  const handleTimerStop = () => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
  };

  return { timer, handleTimerStart, handleTimerStop };
};

export default useTimer;
