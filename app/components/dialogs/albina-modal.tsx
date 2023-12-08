import React, { useEffect, useRef, useState } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

// https://blog.logrocket.com/creating-reusable-pop-up-modal-react/
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
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
    >
      <button className="modal-close-btn" onClick={handleCloseModal}>
        Close
      </button>
      {children}
    </dialog>
  );
};

export default Modal;
