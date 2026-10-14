import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, ...props }) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    const el = elRef.current;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === modalRoot && onClose) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    if (modalRoot && el) {
      modalRoot.appendChild(el);
      modalRoot.addEventListener("click", handleBackdropClick);
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      if (modalRoot && el) {
        modalRoot.removeEventListener("click", handleBackdropClick);
        if (modalRoot.contains(el)) {
          modalRoot.removeChild(el);
        }
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div role="dialog" aria-modal="true" {...props}>
      {children}
    </div>,
    elRef.current,
  );
};

export default Modal;
