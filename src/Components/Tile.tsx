import React from "react";
import useGameStore from "../Store/useGame";
import { cn } from "./Utils/func";
type TileProps = {
  row: number;
  col: number;
};

const colorsMap: { [key: number]: string } = {
  1: "text-blue-600",
  2: "text-green-600",
  3: "text-red-600",
  4: "text-navy-800",
  5: "text-brown-800",
  6: "text-cyan-800",
  7: "text-black",
  8: "text-gray-800",
};

const Tile = React.memo((props: TileProps) => {
  const { row: y, col: x } = props;

  // const gameSpecs = useGameStore((state) => state.gameSpecs);
  // const flagsPlaced = useGameStore((state) => state.flagsPlaced);
  // const setBoardStateFromStore = useGameStore((state) => state.setBoardState);
  // const tileData = useGameStore((state) => state.boardState?.[y]?.[x]);
  // const setTileState = useGameStore((state) => state.setTileState);
  // const handlePropagation = useGameStore((state) => state.handlePropagation);
  // const status = useGameStore((state) => state.status);
  // const setStatus = useGameStore((state) => state.setStatus);
  // const handleZoneReveal = useGameStore((state) => state.handleZoneReveal);
  // const revealBoard = useGameStore((state) => state.revealBoard);
  // const handletips = useGameStore((state) => state.handleTips);
  const isRevealed = useGameStore(
    (state) => state.boardState?.[y]?.[x]?.isRevealed ?? false
  );
  const isFlagged = useGameStore(
    (state) => state.boardState?.[y]?.[x]?.isFlagged ?? false
  );
  const isRigged = useGameStore(
    (state) => state.boardState?.[y]?.[x]?.isRigged ?? false
  );
  const isPressed = useGameStore(
    (state) => state.boardState?.[y]?.[x]?.isPressed ?? false
  );
  const neighboringMines = useGameStore(
    (state) => state.boardState?.[y]?.[x]?.neighboringMines ?? 0
  );
  // const status = useGameStore((state) => state.status);
  // const flagsPlaced = useGameStore((state) => state.flagsPlaced);

  // console.log("je suis rendu", x, y, tileData);

  const handleTileClick = useGameStore((state) => state.handleTileClick);
  const setTileState = useGameStore((state) => state.setTileState);
  const handleZoneReveal = useGameStore((state) => state.handleZoneReveal);
  const handleTips = useGameStore((state) => state.handleTips);

  const isLastTimeClicked = useGameStore(
    (state) => state.lastTileClicked.x === x && state.lastTileClicked.y === y
  );

  const handleLeftClick = () => {
    // console.log("tile data", tileData);

    if (isFlagged || isRevealed) return;
    // console.log("Tile clicked at:", { x, y });
    // console.log("Tile Data", tileData);
    handleTileClick(y, x);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRevealed) return;
    // console.log("Tile right-clicked at:", { x, y });
    setTileState(y, x, !isFlagged, undefined);
  };

  const handleSimultaneousClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // To be implemented: reveal neighboring tiles if flags match neighboring mines
    const buttons = e.buttons;
    // console.log("buttons", e.buttons);

    if (buttons === 3) {
      // console.log("Simultaneous click at:", { x, y });
      // setKeysPressed(true);
      handleZoneReveal(y, x);
      handleTips(y, x, "press");
    }
  };
  const handleSimultaneousClickRelease = (e: React.MouseEvent) => {
    e.preventDefault();
    // const buttons = e.buttons;

    // setKeysPressed(false);
    // handleZoneReveal(y, x);
    handleTips(y, x, "release");
  };
  return (
    <div
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      onMouseDown={handleSimultaneousClick}
      onMouseUp={handleSimultaneousClickRelease}
      onMouseEnter={handleSimultaneousClick}
      onMouseLeave={handleSimultaneousClickRelease}
      className={cn(
        `w-7.5 aspect-square   align-center flex justify-center items-center font-bold text-xl ${colorsMap[neighboringMines]} relative`,

        {
          "bg-[#d4d4d4] inset-shadow-[2px_2px_0_0_#fff,-2px_-2px_0_0_#000]":
            !isRevealed || (isFlagged && isRevealed),
          "bg-[rgb(163,163,163)] scale-95": isPressed && !isRevealed,
          "bg-[#e4e4e4] border border-dotted border-[#8d8d8d]":
            isRevealed && !isFlagged,

          " border-[#fd0000] border-solid":
            isPressed && isFlagged && isRevealed,
          "bg-red-500 border-2 border-[#780000]":
            (isRigged && isLastTimeClicked) ||
            (isPressed && isRigged && isRevealed),
        }
      )}
    >
      {isFlagged ? "🚩" : ""}
      {isRigged && isRevealed && !isFlagged ? "💣" : ""}
      {!isRigged && isRevealed && !isFlagged && neighboringMines > 0
        ? neighboringMines
        : ""}
    </div>
  );
});

export default Tile;
