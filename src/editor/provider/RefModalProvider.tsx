import { FC, ReactNode, createContext, useState } from "react";
import { ModalProps } from "../components/modal/Modal";

export const RefModalContext = createContext<ModalProps | undefined>(undefined);

export const RefModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setClose] = useState<boolean>(false);
  return (
    <RefModalContext.Provider
      value={{
        isOpen: isOpen,
        onClose: () => setClose(false),
        onOpen: () => setClose(true),
      }}
    >
      {children}
    </RefModalContext.Provider>
  );
};

export default RefModalProvider;
