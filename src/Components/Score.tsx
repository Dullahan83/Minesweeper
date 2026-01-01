import { useEffect } from "react";
import useGameStore from "../Store/useGame";
import { useTimerStore } from "../Store/useTimer";
import ScreenDisplay from "./ScreenDisplay";

const Score = () => {
  const gameSpecs = useGameStore((state) => state.gameSpecs);
  const totalMines = gameSpecs.totalMines;
  const totalTiles = gameSpecs.rows * gameSpecs.cols;
  const revealedTilesCount = useGameStore((state) => state.revealedTilesCount);
  const boardState = useGameStore((state) => state.boardState);
  const setStatus = useGameStore((state) => state.setStatus);
  const stopTimer = useTimerStore((state) => state.stopTimer);
  const flagsPlaced = useGameStore((state) => state.flagsPlaced);
  const minesLeft = totalMines - flagsPlaced < 0 ? 0 : totalMines - flagsPlaced;
  const minesLeftStringArray = minesLeft.toString().padStart(3, "0").split("");

  useEffect(() => {
    // console.log("Revealed Tiles - MinesLeft - TotalMines", {
    //   revealedTilesCount,
    //   minesLeft,
    //   totalMines,
    // });

    if (totalTiles - revealedTilesCount !== totalMines) return;
    // if (checkWinCondition(minesLeft, boardState)) {
    setStatus("won");
    stopTimer();
    // }
  }, [
    minesLeft,
    totalMines,
    revealedTilesCount,
    totalTiles,
    setStatus,
    boardState,
    stopTimer,
  ]);

  return <ScreenDisplay data={minesLeftStringArray.join("")} />;
};

export default Score;
