import { useContext } from "react";
import { RefModalContext } from "../provider/RefModalProvider";

export const useRefModal = () => {
  const context = useContext(RefModalContext);
  if (!context)
    throw new Error("useRefModal must be used within a RefModalProvider");
  return context;
};
