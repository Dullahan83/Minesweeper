import { useEffect, useRef, useState } from "react";

const useClock = () => {
  const [time, setTime] = useState(new Date());
  const intervalRef = useRef<number | null>(null);

  const [hours, minutes, seconds] = [
    time.getHours().toString().padStart(2, "0"),
    time.getMinutes().toString().padStart(2, "0"),
    time.getSeconds().toString().padStart(2, "0"),
  ];

  const startClock = () => {
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setTime(new Date());
      }, 60000 - Number(seconds) * 1000); // Update every minute
    }
  };
  const stopClock = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startClock();
    return () => {
      stopClock();
    };
  }, []);

  return { hours, minutes, seconds };
};

export default useClock;
