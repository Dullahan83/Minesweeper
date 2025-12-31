import { useRef, useState } from "react";
import useGameStore from "../Store/useGame";
import useCloseOnOutsideClick from "./Hooks/useCloseOnOutsideClick";
import useModal from "./Hooks/useModal";

const ModalCustomGame = () => {
  const gameSpecs = useGameStore((state) => state.gameSpecs);
  const setGameSpecs = useGameStore((state) => state.setGameSpecs);
  const { onClose } = useModal();
  const [values, setValues] = useState({
    rows: gameSpecs?.rows ?? 9,
    cols: gameSpecs?.cols ?? 9,
    totalMines: gameSpecs?.totalMines ?? 10,
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleConfirmation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.rows < 1 || values.cols < 1 || values.totalMines < 1) {
      alert("All values must be at least 1.");
      return;
    }
    if (values.totalMines >= values.rows * values.cols * 0.85) {
      alert("Too many mines for the given board size.");
    }

    setGameSpecs("custom", {
      rows: values.rows,
      cols: values.cols,
      totalMines: values.totalMines,
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  useCloseOnOutsideClick({ ref: formRef, callback: onClose });

  return (
    <dialog
      open
      className=" absolute z-20 w-full h-full bg-black/15 flex justify-center items-center  "
    >
      <form
        method="dialog"
        className="w-fit min-w-70 min-h-70 px-4 py-2 bg-gray-100 shadow-md rounded flex flex-col gap-4 justify-between
        border-4 border-r-[#9c9c9c] border-b-[#9c9c9c] border-l-[#ffffff] border-t-[#ffffff]
        "
        onSubmit={handleConfirmation}
        ref={formRef}
      >
        <h3 className="font-bold text-lg">Custom Game Settings</h3>
        <div className="py-4">
          <label className="flex w-full justify-between">
            <span className="">Rows:</span>
            <input
              name="rows"
              type="number"
              min="1"
              max="100"
              className=" w-18"
              placeholder="0"
              value={values.rows}
              onChange={handleFieldChange}
            />
          </label>
          <label className="flex w-full justify-between">
            <span className="">Columns:</span>
            <input
              name="cols"
              type="number"
              min="1"
              max="100"
              className=" w-18"
              value={values.cols}
              onChange={handleFieldChange}
            />
          </label>
          <label className="flex w-full justify-between">
            <span className="">Total Mines:</span>
            <input
              name="totalMines"
              type="number"
              min="1"
              max="999"
              className=" w-18"
              value={values.totalMines}
              onChange={handleFieldChange}
            />
          </label>
        </div>
        <div className="flex justify-between">
          <button className="shadow-lg" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="shadow-lg">
            Start Game
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default ModalCustomGame;
