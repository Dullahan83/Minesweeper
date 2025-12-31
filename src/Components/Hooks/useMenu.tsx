import { useContext } from "react";
import { MenuContext } from "../Menu";

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return ctx;
};

export default useMenu;
