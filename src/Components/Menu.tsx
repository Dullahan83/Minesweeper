import {
  createContext,
  // useContext,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import useCloseOnOutsideClick from "./Hooks/useCloseOnOutsideClick";

type MenuContextProps = {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const MenuContext = createContext<MenuContextProps | null>(null);

// const useMenu = () => {
//   const ctx = useContext(MenuContext);
//   if (!ctx) {
//     throw new Error("useMenu must be used within a MenuProvider");
//   }
//   return ctx;
// };

type MenuProps = {
  title: string;
} & PropsWithChildren;

const Menu = ({ title, children }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  useCloseOnOutsideClick({
    ref: menuRef,
    callback: () => setIsOpen(false),
  });

  return (
    <MenuContext.Provider value={{ isOpen, openMenu, closeMenu }}>
      <div ref={menuRef} className="relative">
        <div
          className="cursor-pointer select-none px-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
        </div>
        {isOpen && children}
      </div>
    </MenuContext.Provider>
  );
};

export { Menu, MenuContext };
