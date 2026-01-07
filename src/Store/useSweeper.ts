import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import useGameStore from "./useGame";
type SweeperState = {
  isOpen: boolean;
  isMinimized: boolean;
};

type SweeperActions = {
  openWindow: () => void;
  closeWindow: () => void;
  minimizeWindow: () => void;
  restoreWindow: () => void;
};

export const useSweeperStore = create<SweeperState & SweeperActions>()(
  immer((set) => ({
    isOpen: true,
    isMinimized: false,
    openWindow: () =>
      set((state) => {
        state.isOpen = true;
        state.isMinimized = false;
        useGameStore.getState().resetBoard();
      }),
    closeWindow: () =>
      set((state) => {
        state.isOpen = false;
        state.isMinimized = false;
      }),
    minimizeWindow: () =>
      set((state) => {
        state.isMinimized = true;
      }),
    restoreWindow: () =>
      set((state) => {
        state.isMinimized = false;
      }),
  }))
);
