import { createContext, useState, type PropsWithChildren } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  type: "custom" | "info";
};

const ModalContext = createContext<ModalProps | null>(null);

const ModalProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return (
    <ModalContext.Provider value={{ isOpen, onClose, onOpen, type: "custom" }}>
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
