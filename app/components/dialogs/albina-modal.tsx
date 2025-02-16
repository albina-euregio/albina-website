import React, { useEffect, useRef, useState } from "react";
import type { Property } from "csstype";

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  width?: Property.Width;
}

// https://blog.logrocket.com/creating-reusable-pop-up-modal-react/
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, width }) => {
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleCloseModal = () => {
    onClose?.();
    setModalOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === modalRef.current) {
      handleCloseModal();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;

    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  return (
    <dialog
      ref={modalRef}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className="modal"
      style={{ width }}
    >
      <button className="modal-close-btn" onClick={handleCloseModal}>
        Close
      </button>
      {children}
    </dialog>
  );
};

export default Modal;

export const ModalImage: React.FC<{ children: React.ReactNode }> = props => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)} style={{ cursor: "zoom-in" }}>
        {props.children}
      </div>
      <Modal isOpen={isOpen} onClose={() => setOpen(false)} width="90vw">
        {props.children}
      </Modal>
    </>
  );
};
