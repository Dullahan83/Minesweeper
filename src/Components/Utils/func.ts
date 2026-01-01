import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { GameBoard, GameTile } from "./types";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const initEmptyBoard = (ord: number, abs: number) => {
  const board: GameBoard = [];
  for (let y = 0; y < ord; y++) {
    const rowArray: GameTile[] = [];
    for (let x = 0; x < abs; x++) {
      //   console.log("y + x", { y, x });

      //   console.log("isRigged", isRigged);
      rowArray.push({
        isRigged: false,
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

export const placeMines = (
  board: GameBoard,
  totalMines: number,
  safeZone: { x: number; y: number }
) => {
  const rows = board.length;
  const cols = board[0].length;

  // Générer positions des mines (en évitant la zone de sécurité)
  const minePositions = new Set<string>();
  while (minePositions.size < totalMines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    // Éviter la zone autour du premier clic
    const isSafeZone =
      Math.abs(row - safeZone.y) <= 1 && Math.abs(col - safeZone.x) <= 1;

    if (!isSafeZone) {
      minePositions.add(`${row},${col}`);
    }
  }

  // Placer les mines
  minePositions.forEach((pos) => {
    const [row, col] = pos.split(",").map(Number);
    board[row][col].isRigged = true;
  });

  // Calculer les mines voisines
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

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].isRigged) continue;

      let count = 0;
      directions.forEach(([dy, dx]) => {
        const newRow = row + dy;
        const newCol = col + dx;
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          board[newRow][newCol].isRigged
        ) {
          count++;
        }
      });
      board[row][col].neighboringMines = count;
    }
  }
};
