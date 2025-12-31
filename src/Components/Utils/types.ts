export type GameBoard = GameTile[][];

export type GameTile = {
  isRigged: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isPressed: boolean;
  neighboringMines: number;
};
