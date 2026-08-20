import React, { useEffect, useRef, useState } from "react";
import type { Property } from "csstype";

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  width?: Property.Width;
  /**
   * When true, the modal never closes itself: every close gesture (backdrop
   * click, Escape, close button) just calls `onClose`, and the parent is
   * responsible for actually flipping `isOpen`. Lets the parent veto/defer a
   * close (e.g. confirm unsaved changes) before it happens.
   */
  guardClose?: boolean;
}

// https://blog.logrocket.com/creating-reusable-pop-up-modal-react/
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  width,
  guardClose
}) => {
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const requestClose = () => {
    onClose?.();
    if (!guardClose) setModalOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === modalRef.current) {
      requestClose();
    }
  };

  // Native <dialog> closes on Escape and fires `cancel`; block that so the
  // close always flows through requestClose (and can be vetoed when guarded).
  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    requestClose();
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
      onCancel={handleCancel}
      onClick={handleClick}
      className="modal"
      style={{ width }}
    >
      <button className="modal-close-btn" onClick={requestClose}>
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
