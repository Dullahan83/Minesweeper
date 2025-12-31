import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  initEmptyBoard,
  propagateFromTileToTile,
  revealBoard,
} from "../Components/Utils/func";
import type { GameBoard } from "../Components/Utils/types";
import { useTimerStore } from "./useTimer";

const DifficultyLevel = {
  beginner: { rows: 9, cols: 9, totalMines: 10 },
  intermediate: { rows: 16, cols: 16, totalMines: 40 },
  expert: { rows: 16, cols: 30, totalMines: 99 },
  hellish: { rows: 45, cols: 65, totalMines: 666 },
  custom: { rows: 0, cols: 0, totalMines: 0 },
};

export type Difficulty = keyof typeof DifficultyLevel;

type GameState = {
  gameSpecs: {
    rows: number;
    cols: number;
    totalMines: number;
  };
  flagsPlaced: number;
  boardState: GameBoard;
  minesLeft: number;
  revealedTilesCount: number;
  status: "playing" | "won" | "lost" | "idle";
  // difficultyLevel: Difficulty;
};
type GameActions = {
  setGameSpecs: (
    level: Difficulty,
    payload?: { rows: number; cols: number; totalMines: number }
  ) => void;
  // setFlagsPlaced: (flagsPlaced: number) => void;
  setBoardState: (boardState: GameBoard) => void;
  setStatus: (status: "playing" | "won" | "lost" | "idle") => void;
  setTileState: (
    row: number,
    col: number,
    isFlagged?: boolean,
    isRevealed?: boolean
  ) => void;
  handlePropagation: (row: number, col: number) => void;
  handleZoneReveal: (row: number, col: number) => void;
  resetBoard: () => void;
  revealBoard: () => void;
};

const useGameStore = create<GameState & GameActions>()(
  immer((set) => ({
    // difficultyLevel: "hellish",
    gameSpecs: { rows: 9, cols: 9, totalMines: 10 },
    flagsPlaced: 0,
    boardState: [],
    status: "playing",
    minesLeft: 10,
    revealedTilesCount: 0,
    setGameSpecs: (level, payload) =>
      set((state) => {
        if (level === "custom") {
          state.gameSpecs = {
            rows: payload?.rows ?? 0,
            cols: payload?.cols ?? 0,
            totalMines: payload?.totalMines ?? 0,
          };
          state.revealedTilesCount = 0;
          state.minesLeft = payload?.totalMines ?? 0;
          return;
        }
        const specs = DifficultyLevel[level];

        state.gameSpecs = {
          rows: specs.rows,
          cols: specs.cols,
          totalMines: specs.totalMines,
        };
        state.revealedTilesCount = 0;
        state.minesLeft = specs.totalMines;
      }),
    // setFlagsPlaced: (flagsPlaced) => set({ flagsPlaced }),
    setBoardState: (boardState) => set({ boardState }),
    setStatus: (status) => set({ status }),
    setTileState: (row, col, isFlagged, isRevealed) => {
      set((state) => {
        const tile = state.boardState[row][col];
        if (isFlagged !== undefined) {
          if (isFlagged && !tile.isFlagged) {
            state.flagsPlaced += 1;
            if (tile.isRigged) state.minesLeft -= 1;
          }
          if (!isFlagged && tile.isFlagged) {
            state.flagsPlaced -= 1;
            if (tile.isRigged) state.minesLeft += 1;
          }
          tile.isFlagged = isFlagged;
        }
        if (isRevealed !== undefined) {
          tile.isRevealed = isRevealed;
          state.revealedTilesCount += 1;
        }
      });
    },
    handlePropagation: (row, col) => {
      set((state) => {
        const count = propagateFromTileToTile(
          state.boardState,
          state.revealedTilesCount,
          row,
          col
        );
        state.revealedTilesCount = count;
      });
    },
    handleZoneReveal: (row, col) => {
      set((state) => {
        // To be implemented: reveal neighboring tiles if flags match neighboring mines
        const tile = state.boardState[row][col];
        if (!tile.isRevealed) return;
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
        let flaggedCount = 0;
        directions.forEach(([dy, dx]) => {
          const newRow = row + dy;
          const newCol = col + dx;
          if (
            newRow < 0 ||
            newRow >= state.boardState.length ||
            newCol < 0 ||
            newCol >= state.boardState[0].length
          ) {
            return;
          }
          if (state.boardState[newRow][newCol].isFlagged) {
            flaggedCount++;
          }
        });
        if (flaggedCount === tile.neighboringMines) {
          directions.forEach(([dy, dx]) => {
            const newRow = row + dy;
            const newCol = col + dx;
            if (
              newRow < 0 ||
              newRow >= state.boardState.length ||
              newCol < 0 ||
              newCol >= state.boardState[0].length
            ) {
              return;
            }
            const neighborTile = state.boardState[newRow][newCol];
            if (!neighborTile.isRevealed && !neighborTile.isFlagged) {
              if (neighborTile.isRigged) {
                state.status = "lost";
                useTimerStore.getState().stopTimer();
                neighborTile.isRevealed = true;
                neighborTile.isPressed = true;
                revealBoard(state.boardState);
              } else if (neighborTile.neighboringMines === 0) {
                const count = propagateFromTileToTile(
                  state.boardState,
                  state.revealedTilesCount,
                  newRow,
                  newCol
                );
                state.revealedTilesCount = count;
              } else {
                neighborTile.isRevealed = true;
                state.revealedTilesCount += 1;
              }
            }
          });
        } else {
          directions.forEach(([dy, dx]) => {
            const newRow = row + dy;
            const newCol = col + dx;
            if (
              newRow < 0 ||
              newRow >= state.boardState.length ||
              newCol < 0 ||
              newCol >= state.boardState[0].length
            ) {
              return;
            }
            const neighborTile = state.boardState[newRow][newCol];
            if (!neighborTile.isRevealed && !neighborTile.isFlagged) {
              neighborTile.isPressed = !neighborTile.isPressed;
            }
          });
        }
      });
    },
    resetBoard: () =>
      set((state) => {
        state.boardState = initEmptyBoard(
          state.gameSpecs.rows,
          state.gameSpecs.cols
        );
        state.flagsPlaced = 0;
        state.status = "idle";
        state.minesLeft = state.gameSpecs.totalMines;
        state.revealedTilesCount = 0;
        useTimerStore.getState().resetTimer();
      }),
    revealBoard: () =>
      set((state) => {
        revealBoard(state.boardState);
      }),
  }))
);

export default useGameStore;
