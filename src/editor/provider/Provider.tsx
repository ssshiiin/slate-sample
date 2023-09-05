import { FC, ReactNode } from "react";
import RubyModalProvider from "./RubyModalProvider";
import RefModalProvider from "./RefModalProvider";

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RubyModalProvider>
      <RefModalProvider>{children}</RefModalProvider>
    </RubyModalProvider>
  );
};
