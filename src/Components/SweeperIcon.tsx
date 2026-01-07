import { useSweeperStore } from "../Store/useSweeper";

const SweeperIcon = () => {
  const openWindow = useSweeperStore((state) => state.openWindow);
  const isOpen = useSweeperStore((state) => state.isOpen);

  const handleDoubleClick = () => {
    if (!isOpen) {
      openWindow();
    }
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="absolute top-4 left-4 flex flex-col items-center gap-1 p-2 rounded cursor-pointer select-none hover:bg-white/20 active:bg-white/30 w-20"
    >
      {/* Icone mine */}
      <div className="w-12 h-12 bg-linear-to-br from-gray-400 to-gray-600 rounded shadow-md flex items-center justify-center text-2xl border-2 border-gray-500">
        💣
      </div>
      {/* Label */}
      <span className="text-white text-xs text-center font-medium drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
        Minesweeper
      </span>
    </div>
  );
};

export default SweeperIcon;
