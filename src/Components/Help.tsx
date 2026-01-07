import { useRef } from "react";
import useGameStore from "../Store/useGame";

const Help = () => {
  const findNextMine = useGameStore((state) => state.findNextMine);
  const setHintTile = useGameStore((state) => state.setHintTile);

  const timeoutRef = useRef<number | null>(null);
  const showNextMine = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const nextMine = findNextMine();
    if (nextMine) {
      setHintTile(nextMine.x, nextMine.y, true);
      timeoutRef.current = setTimeout(() => {
        setHintTile(nextMine.x, nextMine.y, false);
      }, 500);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  };

  return <div onClick={showNextMine}>Help</div>;
};

export default Help;
