import useGameStore from "../Store/useGame";

const imgSource = {
  idle: "/Default.webp",
  playing: "/Default.webp",
  won: "/Won.png",
  lost: "/Lose.jpg",
};

type sourceEnumm = keyof typeof imgSource;

const GameState = () => {
  const resetBoard = useGameStore((state) => state.resetBoard);
  const status = useGameStore((state) => state.status);
  return (
    <div
      onClick={resetBoard}
      className="h-12 aspect-square bg-[#d4d4d4] flex items-center justify-center border-2 box-content border-l-[#9c9c9c] border-t-[#9c9c9c] border-r-[#000000] border-b-[#000000] shadow-[1px_1px_#9c9c9c]"
    >
      <div className="border-3 w-full h-full border-r-[#9c9c9c] border-b-[#9c9c9c] border-l-[#ffffff] border-t-[#ffffff]">
        <img
          src={imgSource[status as sourceEnumm]}
          alt="Game State"
          className="aspect-square w-10 object-contain"
        />
      </div>
    </div>
  );
};

export default GameState;
