import { useEffect, useState } from "react";
import useGameStore from "../Store/useGame";
import GameState from "./GameState";
import Grid from "./Grid";
import Score from "./Score";
import Timer from "./Timer";
import { initEmptyBoard } from "./Utils/func";

// const checkProximiyMines = (board: GameBoard, x: number, y: number): number => {
//   const directions = [
//     [-1, -1],
//     [-1, 0],
//     [-1, 1],
//     [0, -1],

//     [0, 1],
//     [1, -1],
//     [1, 0],
//     [1, 1],
//   ];
//   let mineCount = 0;

//   directions.forEach(([dx, dy]) => {
//     const newRow = y + dy;
//     const newCol = x + dx;
//     if (
//       newRow < 0 ||
//       newRow >= board.length ||
//       newCol < 0 ||
//       newCol >= board[0].length
//     ) {
//       return;
//     }
//     if (board[newRow][newCol].isRigged) {
//       mineCount++;
//     }
//   });
//   return mineCount;
// };

// const initBoard = (abs: number, ord: number, totalMines: number): GameBoard => {
//   // const board: GameBoard = [];
//   const minesPositions: { x: number; y: number }[] = [];
//   let minesPlaced = 0;

//   while (minesPlaced < totalMines) {
//     const x = Math.floor(Math.random() * abs);
//     const y = Math.floor(Math.random() * ord);
//     const pos = { x, y };
//     if (!minesPositions.find((p) => p.x === x && p.y === y)) {
//       minesPositions.push(pos);
//       minesPlaced++;
//     }
//   }

//   const board = initEmptyBoard(ord, abs, minesPositions);

//   // Now that the board is set up with mines, calculate neighboring mines for each tile
//   for (let y = 0; y < ord; y++) {
//     for (let x = 0; x < abs; x++) {
//       const proximityCount = checkProximiyMines(board, x, y);
//       board[y][x].neighboringMines = proximityCount;
//     }
//     //
//   }
//   return board;
// };

const Window = () => {
  const gameSpecs = useGameStore((state) => state.gameSpecs);
  const [boardDimensions, setBoardDimensions] = useState({
    x: gameSpecs.cols,
    y: gameSpecs.rows,
  }); // Placeholder values

  const [totalMines, setTotalMines] = useState(gameSpecs.totalMines); // Placeholder values

  const setBoardStateFromStore = useGameStore((state) => state.setBoardState);
  const setStatus = useGameStore((state) => state.setStatus);

  useEffect(() => {
    const initialBoard = initEmptyBoard(
      boardDimensions.y,
      boardDimensions.x,
      []
    );
    setStatus("idle");
    setBoardStateFromStore(initialBoard);
  }, [boardDimensions, totalMines, setBoardStateFromStore]);

  return (
    <div className=" flex flex-col items-end border-8 border-r-[#9c9c9c] border-b-[#9c9c9c] border-l-[#ffffff] border-t-[#ffffff] p-4 gap-3">
      <div className="min-h-20 h-20 w-full flex items-center justify-around border-4 border-l-[#9c9c9c] border-t-[#9c9c9c] border-r-[#ffffff] border-b-[#ffffff] ">
        <Score />
        <GameState />
        <Timer />
      </div>
      <div>
        <Grid boardDimensions={boardDimensions} />
      </div>
    </div>
  );
};

export default Window;
