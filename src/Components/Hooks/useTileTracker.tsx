import { useState } from "react";

const useTileTracker = () => {
  const [lastTileClicked, setLastTileClicked] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  const trackTileClick = (x: number, y: number) => {
    setLastTileClicked({ x, y });
  };
  return { lastTileClicked, trackTileClick };
};

export default useTileTracker;
