import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TimerState = {
  timer: number;
  timeStamp: number;
  intervalId: number | null;
};

type TimerActions = {
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
};

export const useTimerStore = create<TimerState & TimerActions>()(
  immer((set) => ({
    timer: 0,
    isActive: false,
    timeStamp: 0,
    intervalId: null,
    startTimer: () => {
      const startTime = Date.now();

      const intervalId = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        set((state) => {
          state.timer = elapsedTime;
        });
      }, 500);

      set((state) => {
        state.timeStamp = startTime;
        state.intervalId = intervalId as unknown as number;
      });
    },
    stopTimer: () =>
      set((state) => {
        if (state.intervalId) {
          clearInterval(state.intervalId);
          state.intervalId = null;
          state.timeStamp = 0;
        }
      }),
    resetTimer: () =>
      set((state) => {
        if (state.intervalId) {
          clearInterval(state.intervalId);
          state.intervalId = null;
        }
        state.timer = 0;
        state.timeStamp = 0;
      }),
  }))
);
