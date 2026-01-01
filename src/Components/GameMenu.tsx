import useGameStore, { type Difficulty } from "../Store/useGame";
import useMenu from "./Hooks/useMenu";
import useModal from "./Hooks/useModal";
import { cn } from "./Utils/func";

const DifficultyLevel = ["beginner", "intermediate", "expert", "hellish"];

const GameMenu = () => {
  const setGameSpecs = useGameStore((state) => state.setGameSpecs);
  const resetBoard = useGameStore((state) => state.resetBoard);
  const { closeMenu } = useMenu();
  const { onOpen } = useModal();
  const handleCustomGame = () => {
    // Logic to open custom game settings modal or interface
    // const payload = { rows: 100, cols: 100, totalMines: 999 };
    // setGameSpecs("custom", payload);
    // console.log("Custom game settings clicked");
    onOpen();
    closeMenu();
  };

  return (
    <div className="pl-6  z-10  absolute bg-gray-100 border border-gray-200 shadow-md">
      <ul className="flex flex-col  top-full text-sm">
        {DifficultyLevel.map((level, index) => (
          <li
            key={level}
            className={cn(
              " px-2 py-1 capitalize hover:underline underline-offset-2 cursor-pointer border border-gray-300 border-b-0 hover:bg-gray-200 border-r-0",
              {
                "border-t-0 ": index === 0,
              }
            )}
            onClick={() => {
              setGameSpecs(level as Difficulty);
              resetBoard();
              closeMenu();
            }}
          >
            {level}
          </li>
        ))}
        <li
          className="px-2 py-1 hover:underline underline-offset-2 cursor-pointer border border-gray-300 border-b-0 hover:bg-gray-200 border-r-0   "
          onClick={() => {
            handleCustomGame();
          }}
        >
          Custom
        </li>
      </ul>
    </div>
  );
};

export default GameMenu;
