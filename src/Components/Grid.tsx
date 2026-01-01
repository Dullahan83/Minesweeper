import Tile from "./Tile";

type GridProps = {
  boardDimensions: { x: number; y: number };
};

const Grid = ({ boardDimensions }: GridProps) => {
  return (
    <div className="border-4 border-l-[#9c9c9c] border-t-[#9c9c9c] border-r-[#ffffff] border-b-[#ffffff]">
      {Array.from({ length: boardDimensions.y }).map((_, y) => (
        <div key={y} style={{ display: "flex" }}>
          {Array.from({ length: boardDimensions.x }).map((_, x) => (
            <Tile key={x} row={y} col={x} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
