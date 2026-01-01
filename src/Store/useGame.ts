import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  initEmptyBoard,
  placeMines,
  propagateFromTileToTile,
  revealBoard,
} from "../Components/Utils/func";
import type { GameBoard } from "../Components/Utils/types";
import { useTimerStore } from "./useTimer";

const DifficultyLevel = {
  beginner: { rows: 9, cols: 9, totalMines: 10 },
  intermediate: { rows: 16, cols: 16, totalMines: 40 },
  expert: { rows: 16, cols: 30, totalMines: 99 },
  hellish: { rows: 66, cols: 100, totalMines: 666 },
  custom: { rows: 0, cols: 0, totalMines: 0 },
};

export type Difficulty = keyof typeof DifficultyLevel;
export type GameStatus = "playing" | "won" | "lost" | "idle";
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
  status: GameStatus;
  lastTileClicked: { x: number; y: number };
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
  handleTileClick: (row: number, col: number) => void;
  handlePropagation: (row: number, col: number) => void;
  handleZoneReveal: (row: number, col: number) => void;
  handleTips: (row: number, col: number, event: "press" | "release") => void;
  resetBoard: () => void;
  revealBoard: () => void;
  trackLastTileClicked: (x: number, y: number) => void;
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
    lastTileClicked: { x: 0, y: 0 },
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
        if (state.status === "lost" || state.status === "won") return;

        const tile = state.boardState[row][col];
        if (isFlagged !== undefined) {
          if (isFlagged && !tile.isFlagged) {
            if (state.flagsPlaced >= state.gameSpecs.totalMines) return;
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
    handleTileClick: (row, col) =>
      set((state) => {
        if (state.status === "won" || state.status === "lost") return;

        const tile = state.boardState[row]?.[col];
        if (!tile || tile.isFlagged || tile.isRevealed) return;

        // Premier clic - placer les mines dans le board EXISTANT
        if (state.status === "idle") {
          // ✅ Modifier le board existant au lieu de le remplacer
          placeMines(state.boardState, state.gameSpecs.totalMines, {
            x: col,
            y: row,
          });
          state.status = "playing";
          useTimerStore.getState().startTimer();
        }

        // Révéler la tuile (premier clic ou suivants)
        const currentTile = state.boardState[row][col];

        if (currentTile.isRigged) {
          state.status = "lost";
          useTimerStore.getState().stopTimer();
          currentTile.isRevealed = true;
          currentTile.isPressed = true;
          revealBoard(state.boardState);
        } else if (currentTile.neighboringMines === 0) {
          state.revealedTilesCount = propagateFromTileToTile(
            state.boardState,
            state.revealedTilesCount,
            row,
            col
          );
        } else {
          currentTile.isRevealed = true;
          state.revealedTilesCount += 1;
        }

        state.lastTileClicked = { x: col, y: row };

        // Vérifier victoire
        const totalTiles = state.gameSpecs.rows * state.gameSpecs.cols;
        if (
          state.revealedTilesCount ===
          totalTiles - state.gameSpecs.totalMines
        ) {
          state.status = "won";
          useTimerStore.getState().stopTimer();
        }
      }),
    handlePropagation: (row, col) => {
      set((state) => {
        if (state.status === "lost" || state.status === "won") return;
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
        if (state.status === "lost" || state.status === "won") return;

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
        }
      });
    },
    handleTips: (row, col, event) => {
      set((state) => {
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
          if (neighborTile.isRevealed || neighborTile.isFlagged) return;
          if (event === "press") {
            neighborTile.isPressed = true;
          }
          if (event === "release") {
            neighborTile.isPressed = false;
          }
          // if (!neighborTile.isRevealed && !neighborTile.isFlagged) {
          //   neighborTile.isPressed = !neighborTile.isPressed;
          // }
        });
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
    trackLastTileClicked: (x, y) =>
      set((state) => {
        state.lastTileClicked = { x, y };
      }),
  }))
);

export default useGameStore;
