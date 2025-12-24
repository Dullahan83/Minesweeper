import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { GameBoard } from "../Components/Utils/types";
type GameState = {
  gameSpecs: {
    rows: number;
    cols: number;
    totalMines: number;
  };
  flagsPlaced: number;
  boardState: GameBoard;
  status: "playing" | "won" | "lost" | "idle";
};
type GameActions = {
  setGameSpecs: (payload: {
    rows: number;
    cols: number;
    totalMines: number;
  }) => void;
  setFlagsPlaced: (flagsPlaced: number) => void;
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
};

const useGameStore = create<GameState & GameActions>()(
  immer((set) => ({
    gameSpecs: { rows: 16, cols: 30, totalMines: 110 },
    flagsPlaced: 0,
    boardState: [],
    status: "playing",
    setGameSpecs: (payload) =>
      set((state) => {
        state.gameSpecs = { ...state.gameSpecs, ...payload };
      }),
    setFlagsPlaced: (flagsPlaced) => set({ flagsPlaced }),
    setBoardState: (boardState) => set({ boardState }),
    setStatus: (status) => set({ status }),
    setTileState: (row, col, isFlagged, isRevealed) => {
      set((state) => {
        state.boardState[row][col] = {
          ...state.boardState[row][col],
          isFlagged: isFlagged ?? state.boardState[row][col].isFlagged,
          isRevealed: isRevealed ?? state.boardState[row][col].isRevealed,
        };
      });
    },
    handlePropagation: (row, col) => {
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

        const propagate = (rows: number, cols: number) => {
          if (
            rows < 0 ||
            rows >= state.boardState.length ||
            cols < 0 ||
            cols >= state.boardState[0].length
          ) {
            return;
          }

          const tile = state.boardState[rows][cols];

          if (tile.isRevealed || tile.isFlagged || tile.isRigged) {
            return;
          }

          tile.isRevealed = true;

          if (tile.neighboringMines === 0) {
            directions.forEach(([dy, dx]) => {
              propagate(rows + dy, cols + dx);
            });
          }
        };
        propagate(row, col);
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
              neighborTile.isRevealed = true;
              if (neighborTile.isRigged) {
                state.status = "lost";
              }
              // Additional logic can be added here to handle further propagation if needed
            }
          });
        }
      });
    },
  }))
);

export default useGameStore;
