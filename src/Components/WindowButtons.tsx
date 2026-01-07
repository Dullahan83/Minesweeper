import { cn } from "./Utils/func";

type ButtonType = "minimize" | "maximize" | "close";

type WindowButtonProps = {
  type: ButtonType;
  onClick?: () => void;
  disabled?: boolean;
};

const MinimizeIcon = () => <div className="w-3 h-1 bg-white" />;

const MaximizeIcon = () => (
  <div className="w-4 h-4 border-[1.5px] border-white border-t-4" />
);

const CloseIcon = () => (
  <div className="relative w-6 h-6">
    <div className="absolute top-1/2 left-1/2 w-6 h-0.75 bg-white -translate-x-1/2 -translate-y-1/2 rotate-45 rounded" />
    <div className="absolute top-1/2 left-1/2 w-6 h-0.75 bg-white -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded" />
  </div>
);

const buttonConfig = {
  minimize: {
    bg: "from-[#3b93ff] to-[#0a5ecd]",
    hoverBg: "hover:from-[#4da0ff] hover:to-[#1068d9]",
    icon: <MinimizeIcon />,
  },
  maximize: {
    bg: "from-[#3b93ff] to-[#0a5ecd]",
    hoverBg: "hover:from-[#4da0ff] hover:to-[#1068d9]",
    icon: <MaximizeIcon />,
  },
  close: {
    bg: "from-[#e97458] to-[#c9422c]",
    hoverBg: "hover:from-[#ff8060] hover:to-[#da5540]",
    icon: <CloseIcon />,
  },
};

const WindowButton = ({
  type,
  onClick,
  disabled = false,
}: WindowButtonProps) => {
  const config = buttonConfig[type];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        `
        w-9 h-9 rounded-sm flex items-center justify-center
        bg-linear-to-b ${config.bg}
        shadow-[inset_1px_2px_0_0_#ffffff60,inset_-1px_-2px_0_0_#00000040]
        border border-[#ffffff]
      
           ${config.hoverBg} active:shadow-[inset_-1px_-1px_0_0_#ffffff60,inset_1px_1px_0_0_#00000040] cursor-pointer
       
        transition-all duration-75
      `,
        {
          "opacity-50 cursor-not-allowed": disabled,
        }
      )}
    >
      {config.icon}
    </button>
  );
};

type WindowButtonsProps = {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  disableMaximize?: boolean;
};

const WindowButtons = ({
  onMinimize,
  onMaximize,
  onClose,
  disableMaximize = false,
}: WindowButtonsProps) => {
  return (
    <div className="flex gap-1 ">
      <WindowButton type="minimize" onClick={onMinimize} />
      <WindowButton
        type="maximize"
        onClick={onMaximize}
        disabled={disableMaximize}
      />
      <WindowButton type="close" onClick={onClose} />
    </div>
  );
};

export { WindowButton, WindowButtons };
export default WindowButtons;
