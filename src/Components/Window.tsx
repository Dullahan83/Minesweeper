import { useEffect } from "react";
import useGameStore from "../Store/useGame";
import { useSweeperStore } from "../Store/useSweeper";
import { useTimerStore } from "../Store/useTimer";
import GameMenu from "./GameMenu";
import GameState from "./GameState";
import Grid from "./Grid";
import Help from "./Help";
import useModal from "./Hooks/useModal";
import useTransition from "./Hooks/useTransition";
import { Menu } from "./Menu";
import ModalCustomGame from "./ModalCustomGame";
import Rules from "./Rules";
import Score from "./Score";
import Timer from "./Timer";
import { cn } from "./Utils/func";
import WindowTop from "./WindowTop";

const Window = () => {
  const gameSpecs = useGameStore((state) => state.gameSpecs);
  const boardDimensions = {
    x: gameSpecs.cols,
    y: gameSpecs.rows,
  };
  const resetBoard = useGameStore((state) => state.resetBoard);
  const gameStatus = useGameStore((state) => state.status);
  const totalMines = gameSpecs.totalMines;
  // const resetTimer = useTimerStore((state) => state.resetTimer);
  const resumeTimer = useTimerStore((state) => state.resumeTimer);
  const isSweeperOpen = useSweeperStore((s) => s.isOpen);
  const isMinimized = useSweeperStore((s) => s.isMinimized);
  const { shouldRender, animationState } = useTransition({
    isOpen: isSweeperOpen,
    isMinimized,
  });

  const setBoardStateFromStore = useGameStore((state) => state.setBoardState);
  // const setStatus = useGameStore((state) => state.setStatus);
  const { isOpen } = useModal();

  useEffect(() => {
    console.log(gameStatus);

    // setGameSpecs("beginner");
    if (gameStatus === "playing") {
      resumeTimer();
      return;
    }
    if (gameStatus === "won" || gameStatus === "lost") {
      return;
    }
    resetBoard();
  }, [boardDimensions, totalMines, setBoardStateFromStore]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={cn(
        " flex flex-col  bg-gray-300  border-3 border-t border-[#0059fe] relative rounded-t-xl transition-all duration-300",
        {
          "opacity-100 scale-100": animationState === "open",
          "opacity-0 scale-75 translate-y-[100vh]":
            animationState === "minimized",
          "opacity-0 scale-95": animationState === "closed",
        }
      )}
    >
      <WindowTop />
      <div className="flex gap-4 bg-gray-100 ">
        <Menu title="Game">
          <GameMenu />
        </Menu>
        <Help />
        <Rules />
      </div>
      <div className="p-4  border-8 border-r-[#9c9c9c] border-b-[#9c9c9c] border-l-[#ffffff] border-t-[#ffffff]">
        <div className="min-h-20 h-20 w-full flex items-center justify-between px-2 border-4 border-l-[#9c9c9c] border-t-[#9c9c9c] border-r-[#ffffff] border-b-[#ffffff] ">
          <Score />
          <GameState />
          <Timer />
        </div>
        <div>
          <Grid boardDimensions={boardDimensions} />
        </div>
      </div>
      {isOpen ? <ModalCustomGame></ModalCustomGame> : null}
    </div>
  );
};

export default Window;
