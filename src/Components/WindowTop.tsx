import WindowButtons from "./WindowButtons";

const WindowTop = () => {
  return (
    <div className="w-full h-12 rounded-t-xl bg-linear-to-b from-[#0a7aff] to-[#0055ee] shadow-[inset_0_4px_3px_0_#ffffff60,inset_0_-5px_5px_0_#00000030] flex items-center justify-between px-2">
      {/* <div className="w-full h-1/4 bg-[#ffffff4a]"></div> */}
      <div>
        <h1 className="text-xl  text-white text-shadow-xl text-shadow-black">
          Minesweeper
        </h1>
      </div>
      <WindowButtons disableMaximize={true} />
    </div>
  );
};

export default WindowTop;

// inset-shadow-[0_5px_15px_0px_#FFFFFF,0_-2px_10px_0_#000000]
