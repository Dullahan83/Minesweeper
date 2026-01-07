import { useEffect, useRef, useState } from "react";
import { useSweeperStore } from "../Store/useSweeper";
import useClock from "./Hooks/useClock";
import { cn } from "./Utils/func";

type StartMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const StartMenu = ({ isOpen, onClose }: StartMenuProps) => {
  const openWindow = useSweeperStore((state) => state.openWindow);

  const handleProgramClick = () => {
    openWindow();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute bottom-9 left-0 w-95 bg-linear-to-b from-[#3a8ae8] to-[#1e5bb8]
        rounded-t-lg shadow-[0_-2px_10px_rgba(0,0,0,0.4)] overflow-hidden"
    >
      {/* Header with user */}
      <div className="h-15 bg-linear-to-r from-[#1e4fa8] to-[#3a7ae8] flex items-center px-3 gap-3">
        <div className="w-12 h-12 rounded-sm bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl">
          👤
        </div>
        <span className="text-white font-bold text-lg">Utilisateur</span>
      </div>

      {/* Content */}
      <div className="flex">
        {/* Left panel - Programs */}
        <div className="flex-1 bg-white py-1">
          {/* Pinned section */}
          <div className="px-1">
            <button
              onClick={handleProgramClick}
              className="w-full px-2 py-1.5 flex items-center gap-3 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer"
            >
              <span className="text-2xl">💣</span>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">Minesweeper</span>
                <span className="text-xs text-gray-500">Jeu de démineur</span>
              </div>
            </button>
          </div>

          {/* Separator */}
          <div className="mx-2 my-2 border-t border-gray-300" />

          {/* All programs */}
          <div className="px-2 py-1">
            <span className="text-xs text-gray-600">Tous les programmes</span>
          </div>
        </div>

        {/* Right panel - Places */}
        <div className="w-35 bg-[#d3e5fa] py-2 px-2">
          <div className="text-xs text-gray-700 space-y-2">
            <div className="hover:underline cursor-pointer">Mes documents</div>
            <div className="hover:underline cursor-pointer">Images</div>
            <div className="hover:underline cursor-pointer">Musique</div>
            <div className="border-t border-[#a8c8e8] my-2" />
            <div className="hover:underline cursor-pointer">
              Panneau de config.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-9 bg-linear-to-r from-[#3a8ae8] to-[#1a5aa8] flex items-center justify-end px-2 gap-2">
        <button className="px-3 py-1 text-white text-sm hover:bg-white/20 rounded flex items-center gap-1">
          🔌 Arrêter
        </button>
      </div>
    </div>
  );
};

type StartButtonProps = {
  isMenuOpen: boolean;
  onClick: () => void;
};

const StartButton = ({ isMenuOpen, onClick }: StartButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-full px-3 flex items-center gap-2 bg-gradient-to-b from-[#3b9c3b] via-[#2d8c2d] to-[#1e7a1e]",
        "rounded-r-lg border-r border-r-[#52b152]",
        "shadow-[inset_0_1px_0_0_#5cbf5c,inset_0_-1px_0_0_#1a5c1a]",
        "cursor-pointer select-none italic font-bold text-white text-lg",
        {
          "shadow-[inset_0_2px_4px_0_#1a5c1a]": isMenuOpen,
          "hover:from-[#4aab4a] hover:via-[#3c9c3c] hover:to-[#2d8a2d]":
            !isMenuOpen,
        }
      )}
    >
      <span className="text-2xl not-italic">🪟</span>
      Démarrer
    </button>
  );
};

const Clock = () => {
  const { hours, minutes } = useClock();

  return (
    <div
      className="h-full px-3 flex items-center bg-linear-to-b from-[#1a8ae5] to-[#0c68b8]
        border-l border-l-[#0a4a8a] shadow-[inset_1px_0_0_0_#3aa0f0]"
    >
      <span className="text-white text-sm font-medium">{`${hours}:${minutes}`}</span>
    </div>
  );
};

type TaskbarItemProps = {
  title: string;
  isActive: boolean;
  isMinimized: boolean;
  onClick: () => void;
};

const TaskbarItem = ({
  title,
  isActive,
  isMinimized,
  onClick,
}: TaskbarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 min-w-35 max-w-50 px-2 mx-1 flex items-center gap-2 rounded-sm cursor-pointer select-none transition-all",
        "text-white text-sm font-medium truncate",
        isActive && !isMinimized
          ? "bg-linear-to-b from-[#1a5a9a] to-[#2a7aca] shadow-[inset_0_0_0_1px_#0a3a6a]"
          : "bg-linear-to-b from-[#3c9edc] to-[#2888c8] shadow-[inset_0_1px_0_0_#5cb8ec,inset_0_-1px_0_0_#1a6898] hover:from-[#4cafec] hover:to-[#3898d8]"
      )}
    >
      <span className="text-base">💣</span>
      <span className="truncate">{title}</span>
    </button>
  );
};

const Taskbar = () => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const taskbarRef = useRef<HTMLDivElement>(null);

  const isOpen = useSweeperStore((state) => state.isOpen);
  const isMinimized = useSweeperStore((state) => state.isMinimized);
  const restoreWindow = useSweeperStore((state) => state.restoreWindow);
  const minimizeWindow = useSweeperStore((state) => state.minimizeWindow);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        taskbarRef.current &&
        !taskbarRef.current.contains(e.target as Node)
      ) {
        setIsStartMenuOpen(false);
      }
    };

    if (isStartMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStartMenuOpen]);

  const handleTaskbarClick = () => {
    if (isMinimized) {
      restoreWindow();
    } else {
      minimizeWindow();
    }
  };

  const toggleStartMenu = () => {
    setIsStartMenuOpen((prev) => !prev);
  };

  return (
    <div
      ref={taskbarRef}
      className="fixed bottom-0 left-0 right-0 h-[36px]
        bg-linear-to-b from-[#245edb] via-[#3a7bea] to-[#1842a8]
        shadow-[inset_0_1px_0_0_#5a9af0,0_-1px_3px_0_rgba(0,0,0,0.3)]
        flex items-center z-50"
    >
      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
      />

      {/* Start Button */}
      <StartButton isMenuOpen={isStartMenuOpen} onClick={toggleStartMenu} />

      {/* Quick Launch separator */}
      <div className="w-0.5 h-6 mx-2 bg-linear-to-b from-[#1a4a9a] to-[#3a7ada]" />

      {/* Taskbar Items */}
      <div className="flex-1 flex items-center h-full py-1">
        {isOpen && (
          <TaskbarItem
            title="Minesweeper"
            isActive={isOpen}
            isMinimized={isMinimized}
            onClick={handleTaskbarClick}
          />
        )}
      </div>

      {/* System Tray separator */}
      <div className="w-0.5 h-6 mx-2 bg-linear-to-b from-[#1a4a9a] to-[#3a7ada]" />

      {/* Clock */}
      <Clock />
    </div>
  );
};

export default Taskbar;
