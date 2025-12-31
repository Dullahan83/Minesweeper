import { cn } from "./Utils/func";

const ScreenDisplay = ({ data }: { data: string }) => {
  const dataArray = data.split("");
  return (
    <div className="bg-black border-2 box-content border-l-[#9c9c9c] border-t-[#9c9c9c] border-r-[#ffffff] border-b-[#ffffff] h-12 w-22 flex justify-center items-center relative">
      <div className="absolute top-0 right-0 -translate-y-1.25 translate-x-0.5">
        <span className=" font-display opacity-40 text-6xl  text-red-600 text-center leading-none tracking-wide ">
          888
        </span>
      </div>
      <div className="absolute top-0 right-0 -translate-y-1.25 translate-x-0.5">
        {dataArray.map((digit, index) => (
          <span
            key={index}
            className={cn(
              "font-display text-6xl absolute text-red-600 text-center leading-none tracking-widest top-0   ",
              {
                "-translate-x-22.5": index === 0,
                "rotate-180 -translate-x-19.25": digit === "1" && index === 0,

                "-translate-x-15": index === 1,
                "rotate-180 -translate-x-11.75": digit === "1" && index === 1,
                "-translate-x-7.5": index === 2,
                "rotate-180 -translate-x-4.25": digit === "1" && index === 2,
              }
            )}
          >
            {digit}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScreenDisplay;
