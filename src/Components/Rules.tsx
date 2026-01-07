import { useRef, useState } from "react";
import useCloseOnOutsideClick from "./Hooks/useCloseOnOutsideClick";

const Rules = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => setIsOpen(false);

  useCloseOnOutsideClick({ ref: modalRef, callback: handleClose });

  return (
    <>
      <div
        className="cursor-pointer select-none px-2 hover:underline hover:underline-offset-2"
        onClick={() => setIsOpen(true)}
      >
        Rules
      </div>

      {isOpen && (
        <dialog
          open
          className="absolute z-20 w-full h-full bg-black/15 flex justify-center items-center"
        >
          <div
            ref={modalRef}
            className="w-fit min-w-md max-w-md px-4 py-3 bg-gray-100 shadow-md rounded flex flex-col gap-3
              border-4 border-r-[#9c9c9c] border-b-[#9c9c9c] border-l-[#ffffff] border-t-[#ffffff]"
          >
            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <h3 className="font-bold text-lg">How to Play</h3>
              <button
                className="w-6 h-6 flex items-center justify-center text-sm font-bold
                  border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#9c9c9c] border-r-[#9c9c9c]
                  bg-gray-200 hover:bg-gray-300 active:border-t-[#9c9c9c] active:border-l-[#9c9c9c] active:border-b-[#ffffff] active:border-r-[#ffffff]"
                onClick={handleClose}
              >
                X
              </button>
            </div>

            <div className="text-sm space-y-3">
              <section>
                <h4 className="font-bold mb-1">Objective</h4>
                <p>
                  Uncover all tiles without hitting a mine. Numbers indicate how
                  many mines are adjacent to that tile.
                </p>
              </section>

              <section>
                <h4 className="font-bold mb-1">Controls</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Left click</strong> - Reveal a tile
                  </li>
                  <li>
                    <strong>Right click</strong> - Place/remove a flag
                  </li>
                  <li>
                    <strong>Both clicks</strong> - Chord (reveal adjacent tiles
                    if flags match the number)
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="font-bold mb-1">Tips</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Start by clicking near the center</li>
                  <li>Use flags to mark suspected mines</li>
                  <li>
                    A "1" next to a single hidden tile means that tile is a mine
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="font-bold mb-1">Difficulty Levels</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Beginner</strong> - 9x9, 10 mines
                  </li>
                  <li>
                    <strong>Intermediate</strong> - 16x16, 40 mines
                  </li>
                  <li>
                    <strong>Expert</strong> - 30x16, 99 mines
                  </li>
                  <li>
                    <strong>Hellish</strong> - 66x66, 666 mines
                  </li>
                </ul>
              </section>
            </div>

            <div className="flex justify-center pt-2">
              <button
                className="px-6 py-1 shadow-lg
                  border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#9c9c9c] border-r-[#9c9c9c]
                  bg-gray-200 hover:bg-gray-300 active:border-t-[#9c9c9c] active:border-l-[#9c9c9c] active:border-b-[#ffffff] active:border-r-[#ffffff]"
                onClick={handleClose}
              >
                OK
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default Rules;
