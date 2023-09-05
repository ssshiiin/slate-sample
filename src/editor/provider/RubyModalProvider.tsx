import { FC, ReactNode, createContext, useState } from "react";
import { ModalProps } from "../components/modal/Modal";

export const RubyModalContext = createContext<ModalProps | undefined>(
  undefined,
);

export const RubyModalProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setClose] = useState<boolean>(false);
  return (
    <RubyModalContext.Provider
      value={{
        isOpen: isOpen,
        onClose: () => setClose(false),
        onOpen: () => setClose(true),
      }}
    >
      {children}
    </RubyModalContext.Provider>
  );
};

export default RubyModalProvider;
