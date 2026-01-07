import { useEffect, useReducer, useRef } from "react";

type UseTransitionProps = {
  isOpen: boolean;
  isMinimized?: boolean;
  duration?: number;
};

type TransitionState = {
  shouldRender: boolean;
  isVisible: boolean;
  animationState: "open" | "closed" | "minimized";
};

type Action =
  | { type: "OPEN_START" }
  | { type: "OPEN_COMPLETE" }
  | { type: "MINIMIZE" }
  | { type: "CLOSE_START" }
  | { type: "CLOSE_COMPLETE" };

const reducer = (state: TransitionState, action: Action): TransitionState => {
  switch (action.type) {
    case "OPEN_START":
      return { ...state, shouldRender: true };
    case "OPEN_COMPLETE":
      return { ...state, isVisible: true, animationState: "open" };
    case "MINIMIZE":
      return { ...state, isVisible: false, animationState: "minimized" };
    case "CLOSE_START":
      return { ...state, isVisible: false, animationState: "closed" };
    case "CLOSE_COMPLETE":
      return { ...state, shouldRender: false };
    default:
      return state;
  }
};

const useTransition = ({
  isOpen,
  isMinimized = false,
  duration = 300,
}: UseTransitionProps) => {
  const [state, dispatch] = useReducer(reducer, {
    shouldRender: isOpen,
    isVisible: false,
    animationState: "closed",
  });

  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Cleanup
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (isOpen && !isMinimized) {
      dispatch({ type: "OPEN_START" });
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          dispatch({ type: "OPEN_COMPLETE" });
        });
      });
    } else if (isOpen && isMinimized) {
      dispatch({ type: "MINIMIZE" });
    } else {
      dispatch({ type: "CLOSE_START" });
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: "CLOSE_COMPLETE" });
      }, duration);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen, isMinimized, duration]);

  return state;
};

export default useTransition;
