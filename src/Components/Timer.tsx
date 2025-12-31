import { useTimerStore } from "../Store/useTimer";
import ScreenDisplay from "./ScreenDisplay";

const Timer = () => {
  const timer = useTimerStore((state) => state.timer);

  return <ScreenDisplay data={timer.toString().padStart(3, "0")} />;
};

export default Timer;
