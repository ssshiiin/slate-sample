import { useContext } from "react";
import { RubyModalContext } from "../provider/RubyModalProvider";

export const useRubyModal = () => {
  const context = useContext(RubyModalContext);
  if (!context)
    throw new Error("useRubyModal must be used within a RubyModalProvider");
  return context;
};
