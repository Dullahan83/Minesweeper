import { useRef, useEffect, useState, useCallback } from "react";
import useGameStore from "../Store/useGame";

const TILE_SIZE = 30;

const colorsMap: Record<number, string> = {
  1: "#2563eb",
  2: "#16a34a",
  3: "#dc2626",
  4: "#1e3a8a",
  5: "#78350f",
  6: "#155e75",
  7: "#000000",
  8: "#6b7280",
};

const GridCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);

  const boardState = useGameStore((state) => state.boardState);
  const gameSpecs = useGameStore((state) => state.gameSpecs);
  const lastTileClicked = useGameStore((state) => state.lastTileClicked);
  const status = useGameStore((state) => state.status);
  const handleTileClick = useGameStore((state) => state.handleTileClick);
  const setTileState = useGameStore((state) => state.setTileState);
  const handleZoneReveal = useGameStore((state) => state.handleZoneReveal);
  const handleTips = useGameStore((state) => state.handleTips);

  const getTileFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;

      const x = Math.floor(canvasX / TILE_SIZE);
      const y = Math.floor(canvasY / TILE_SIZE);

      if (x >= 0 && x < gameSpecs.cols && y >= 0 && y < gameSpecs.rows) {
        return { x, y };
      }
      return null;
    },
    [gameSpecs.cols, gameSpecs.rows]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !boardState.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boardState.forEach((row, y) => {
      row.forEach((tile, x) => {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        // Background
        if (tile.isRevealed && !tile.isFlagged) {
          if (
            tile.isRigged &&
            lastTileClicked.x === x &&
            lastTileClicked.y === y
          ) {
            ctx.fillStyle = "#ef4444";
          } else if (tile.isPressed && tile.isRigged) {
            ctx.fillStyle = "#ef4444";
          } else {
            ctx.fillStyle = "#e4e4e4";
          }
        } else if (tile.isPressed && !tile.isRevealed) {
          ctx.fillStyle = "#a3a3a3";
        } else {
          ctx.fillStyle = "#d4d4d4";
        }
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Hover effect
        if (
          hoveredTile &&
          hoveredTile.x === x &&
          hoveredTile.y === y &&
          !tile.isRevealed
        ) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        }

        // Border 3D effect (non révélé)
        if (!tile.isRevealed && !tile.isPressed) {
          ctx.fillStyle = "#fff";
          ctx.fillRect(px, py, TILE_SIZE, 2);
          ctx.fillRect(px, py, 2, TILE_SIZE);
          ctx.fillStyle = "#000";
          ctx.fillRect(px + TILE_SIZE - 2, py, 2, TILE_SIZE);
          ctx.fillRect(px, py + TILE_SIZE - 2, TILE_SIZE, 2);
        } else if (tile.isRevealed) {
          ctx.strokeStyle = "#8d8d8d";
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 0.5, py + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
        }

        // Contenu
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const cx = px + TILE_SIZE / 2;
        const cy = py + TILE_SIZE / 2;

        if (tile.isFlagged) {
          ctx.font = "18px serif";
          ctx.fillText("\u{1F6A9}", cx, cy);
        } else if (tile.isRevealed) {
          if (tile.isRigged) {
            ctx.font = "18px serif";
            ctx.fillText("\u{1F4A3}", cx, cy);
          } else if (tile.neighboringMines > 0) {
            ctx.font = "bold 16px sans-serif";
            ctx.fillStyle = colorsMap[tile.neighboringMines] || "#000";
            ctx.fillText(String(tile.neighboringMines), cx, cy);
          }
        }
      });
    });
  }, [boardState, hoveredTile, lastTileClicked, status]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Gestion du clic gauche
  const handleClick = (e: React.MouseEvent) => {
    const tile = getTileFromEvent(e);
    if (tile) {
      handleTileClick(tile.y, tile.x);
    }
  };

  // Gestion du clic droit (drapeau)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const tile = getTileFromEvent(e);
    if (tile) {
      const tileData = boardState[tile.y]?.[tile.x];
      if (tileData && !tileData.isRevealed) {
        setTileState(tile.y, tile.x, !tileData.isFlagged, undefined);
      }
    }
  };

  // Gestion du clic simultané (chord)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.buttons === 3) {
      const tile = getTileFromEvent(e);
      if (tile) {
        handleZoneReveal(tile.y, tile.x);
        handleTips(tile.y, tile.x, "press");
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.buttons === 0) {
      const tile = getTileFromEvent(e);
      if (tile) {
        handleTips(tile.y, tile.x, "release");
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const tile = getTileFromEvent(e);
    if (tile) {
      if (!hoveredTile || hoveredTile.x !== tile.x || hoveredTile.y !== tile.y) {
        setHoveredTile(tile);
      }

      // Chord hover
      if (e.buttons === 3) {
        handleTips(tile.y, tile.x, "press");
      }
    } else {
      setHoveredTile(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredTile(null);
  };

  const width = gameSpecs.cols * TILE_SIZE;
  const height = gameSpecs.rows * TILE_SIZE;

  return (
    <div className="border-4 border-l-[#9c9c9c] border-t-[#9c9c9c] border-r-[#ffffff] border-b-[#ffffff]">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default GridCanvas;
