import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children, ...props }) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    const el = elRef.current;
    if (modalRoot && el) {
      modalRoot.appendChild(el);
      return () => {
        modalRoot.removeChild(el);
      };
    }
  }, []);

  return createPortal(<div {...props}>{children}</div>, elRef.current);
};

export default Modal;
