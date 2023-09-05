import { FC, ReactNode } from "react";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

const Modal: FC<ModalProps & { children: ReactNode }> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={"modal"} onClick={onClose}>
      <div className={"modal-content"} onClick={(e) => e.stopPropagation()}>
        <button className={"close-button"} onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
