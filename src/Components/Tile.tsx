import useGameStore from "../Store/useGame";
import { cn, initGameBoard } from "./Utils/func";

type TileProps = {
  tileCoords: { x: number; y: number };
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

const Tile = ({ tileCoords: { x, y } }: TileProps) => {
  const gameSpecs = useGameStore((state) => state.gameSpecs);
  const setBoardStateFromStore = useGameStore((state) => state.setBoardState);
  const tileData = useGameStore((state) => state.boardState?.[y]?.[x]);
  const setTileState = useGameStore((state) => state.setTileState);
  const handlePropagation = useGameStore((state) => state.handlePropagation);
  const status = useGameStore((state) => state.status);
  const setStatus = useGameStore((state) => state.setStatus);
  const handleZoneReveal = useGameStore((state) => state.handleZoneReveal);
  const isRevealed = tileData?.isRevealed || false;
  const isFlagged = tileData?.isFlagged || false;

  const handleLeftClick = () => {
    if (isFlagged || isRevealed || status === "won" || status === "lost")
      return;
    console.log("Tile clicked at:", { x, y });
    console.log("Tile Data", tileData);
    if (status === "idle") {
      const board = initGameBoard(
        gameSpecs.cols,
        gameSpecs.rows,
        gameSpecs.totalMines,
        {
          x,
          y,
        }
      );
      setBoardStateFromStore(board);
      setStatus("playing");
    }
    if (!tileData?.isRigged && tileData?.neighboringMines === 0) {
      handlePropagation(y, x);
    } else {
      if (tileData?.isRigged) {
        setStatus("lost");
      }
      setTileState(y, x, undefined, true);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRevealed || status === "won" || status === "lost") return;
    console.log("Tile right-clicked at:", { x, y });
    setTileState(y, x, !tileData?.isFlagged, undefined);
  };

  const handleSimultaneousClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // To be implemented: reveal neighboring tiles if flags match neighboring mines
    const buttons = e.buttons;
    if (buttons === 3) {
      console.log("Simultaneous click at:", { x, y });
      handleZoneReveal(y, x);
    }
  };

  return (
    <div
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      onMouseDown={handleSimultaneousClick}
      className={cn(
        `w-7.5 aspect-square  align-center flex justify-center items-center font-bold text-xl ${
          colorsMap[tileData?.neighboringMines]
        }`,

        {
          "bg-[#d4d4d4] inset-shadow-[2px_2px_0_0_#fff,-2px_-2px_0_0_#000]":
            !isRevealed,
          "bg-[#e4e4e4] border border-[#8d8d8d]": isRevealed,
          "bg-red-500 border-2 border-[#780000]":
            isRevealed && tileData?.isRigged,
        }
      )}
    >
      {/* {tileData?.isRevealed
        ? tileData?.isRigged
          ? "💣"
          : tileData?.neighboringMines
        : tileData?.neighboringMines} */}
      {tileData?.isRevealed
        ? tileData?.isRigged
          ? "💣"
          : tileData?.neighboringMines > 0
          ? tileData?.neighboringMines
          : ""
        : tileData?.isFlagged
        ? "🚩"
        : ""}
      {/* <br /> */}
      {
        // `${y},${x}` /* Temporary display of tile coordinates for testing purposes */
      }
    </div>
  );
};

export default Tile;
