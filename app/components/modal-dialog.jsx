import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactDOM from "react-dom";

const modalRoot = document.body;

const ModalDialog = ({ children, id }) => {
  const modalElementRef = useRef(null);
  const location = useLocation();

  const getModalElement = id => {
    if (!modalElementRef.current) {
      modalElementRef.current = document.createElement("div");
      modalElementRef.current.id = id;
      modalElementRef.current.className = "mfp-hide";
    }
    return modalElementRef.current;
  };

  useEffect(() => {
    modalRoot.appendChild(modalElementRef.current);
    return () => {
      modalElementRef.current.remove();
    };
  }, []);

  useEffect(() => {
    $(".mfp-close").trigger("click");
  }, [location.pathname]);

  //console.log("ModalDialog->render", id, getModalElement(id), children);
  return ReactDOM.createPortal(children, getModalElement(id));
};

export default ModalDialog;
