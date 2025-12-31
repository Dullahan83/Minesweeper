import { useEffect } from "react";
import useGameStore from "../Store/useGame";
import { useTimerStore } from "../Store/useTimer";
import GameMenu from "./GameMenu";
import GameState from "./GameState";
import Grid from "./Grid";
import useModal from "./Hooks/useModal";
import { Menu } from "./Menu";
import ModalCustomGame from "./ModalCustomGame";
import Score from "./Score";
import Timer from "./Timer";
import { initEmptyBoard } from "./Utils/func";

const Window = () => {
  const gameSpecs = useGameStore((state) => state.gameSpecs);
  const boardDimensions = {
    x: gameSpecs.cols,
    y: gameSpecs.rows,
  };
  const totalMines = gameSpecs.totalMines;
  const resetTimer = useTimerStore((state) => state.resetTimer);

  const setBoardStateFromStore = useGameStore((state) => state.setBoardState);
  const setStatus = useGameStore((state) => state.setStatus);
  const { isOpen } = useModal();

  useEffect(() => {
    // setGameSpecs("beginner");
    const initialBoard = initEmptyBoard(
      boardDimensions.y,
      boardDimensions.x,
      []
    );
    setStatus("idle");
    resetTimer();
    setBoardStateFromStore(initialBoard);
  }, [boardDimensions, totalMines, setBoardStateFromStore]);

  return (
    <div className=" flex flex-col  bg-gray-300 border border-t-34 rounded-t border-[#000080] relative">
      <div className="flex gap-4 bg-gray-100 ">
        <Menu title="Game">
          <GameMenu />
        </Menu>
        <div>Help</div>
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
