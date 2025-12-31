import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { GameBoard, GameTile } from "./types";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const initEmptyBoard = (
  ord: number,
  abs: number,
  minesPositions?: { x: number; y: number }[]
) => {
  const board: GameBoard = [];
  for (let y = 0; y < ord; y++) {
    const rowArray: GameTile[] = [];
    for (let x = 0; x < abs; x++) {
      //   console.log("y + x", { y, x });

      const isRigged = minesPositions?.find((p) => p.x === x && p.y === y)
        ? true
        : false;
      //   console.log("isRigged", isRigged);
      rowArray.push({
        isRigged: isRigged,
        isRevealed: false,
        isFlagged: false,
        isPressed: false,
        neighboringMines: 0,
      });
    }
    board.push(rowArray);
  }
  return board;
};

const checkProximiyMines = (board: GameBoard, x: number, y: number): number => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],

    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  let mineCount = 0;

  directions.forEach(([dx, dy]) => {
    const newRow = y + dy;
    const newCol = x + dx;
    if (
      newRow < 0 ||
      newRow >= board.length ||
      newCol < 0 ||
      newCol >= board[0].length
    ) {
      return;
    }
    if (board[newRow][newCol].isRigged) {
      mineCount++;
    }
  });
  return mineCount;
};

export const initGameBoard = (
  abs: number,
  ord: number,
  totalMines: number,
  startPos: { x: number; y: number }
): GameBoard => {
  // const board: GameBoard = [];
  const minesPositions: { x: number; y: number }[] = [];
  let minesPlaced = 0;

  while (minesPlaced < totalMines) {
    const x = Math.floor(Math.random() * abs);
    const y = Math.floor(Math.random() * ord);
    const pos = { x, y };
    if (
      !minesPositions.find((p) => p.x === x && p.y === y) &&
      !checkInitialPosition(startPos).find((p) => p.x === x && p.y === y) &&
      countAdjacentMines(minesPositions, x, y) <= 2
    ) {
      minesPositions.push(pos);
      minesPlaced++;
    }
  }

  const board = initEmptyBoard(ord, abs, minesPositions);

  // Now that the board is set up with mines, calculate neighboring mines for each tile
  for (let y = 0; y < ord; y++) {
    for (let x = 0; x < abs; x++) {
      const proximityCount = checkProximiyMines(board, x, y);
      board[y][x].neighboringMines = proximityCount;
    }
    //
  }
  return board;
};

const checkInitialPosition = (
  //   board: GameBoard,
  startPos: { x: number; y: number }
): { x: number; y: number }[] => {
  const safeArea = [];
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],

    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  safeArea.push(startPos);
  directions.forEach(([dx, dy]) => {
    const newRow = startPos.y + dy;
    const newCol = startPos.x + dx;
    // if (
    //   newRow < 0 ||
    //   newRow >= board.length ||
    //   newCol < 0 ||
    //   newCol >= board[0].length
    // ) {
    //   return;
    // }
    safeArea.push({ x: newCol, y: newRow });
  });
  return safeArea;
};

export const propagateFromTileToTile = (
  board: GameBoard,
  revealedTilesCount: number,
  row: number,
  col: number
) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  let count = revealedTilesCount;
  const propagate = (rows: number, cols: number) => {
    if (
      rows < 0 ||
      rows >= board.length ||
      cols < 0 ||
      cols >= board[0].length
    ) {
      return;
    }

    const tile = board[rows][cols];

    if (tile.isRevealed || tile.isFlagged || tile.isRigged) {
      return;
    }

    tile.isRevealed = true;
    count += 1;
    if (tile.neighboringMines === 0) {
      directions.forEach(([dy, dx]) => {
        propagate(rows + dy, cols + dx);
      });
    }
  };
  propagate(row, col);
  return count;
};

export const countAdjacentMines = (
  positions: { x: number; y: number }[],
  x: number,
  y: number
) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  return directions.filter(([dy, dx]) =>
    positions.some((p) => p.x === x + dx && p.y === y + dy)
  ).length;
};

export const revealBoard = (boardState: GameBoard) => {
  return boardState.forEach((row) =>
    row.forEach((tile) => {
      tile.isRevealed = true;
    })
  );
};

export const checkWinCondition = (minesLeft: number, boardState: GameBoard) => {
  const unrevealedTiles = boardState
    .flat()
    .filter((tile) => !tile.isRevealed && !tile.isFlagged);
  return unrevealedTiles.length === minesLeft;
};
