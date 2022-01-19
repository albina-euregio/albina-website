import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactDOM from "react-dom";

const modalRoot = document.body;

const ModalDialog = ({ children, id }) => {
  const modalElementRef = useRef(null);
  const location = useLocation();
  let lastLocation = useRef(null);

  const didMountRef = useRef(false);

  const getModalElement = id => {
    if (!modalElementRef.current) {
      modalElementRef.current = document.createElement("div");
      modalElementRef.current.id = id;
      modalElementRef.current.className = "mfp-hide";
    }
    return modalElementRef.current;
  };

  useEffect(() => {
    if (didMountRef.current) {
      console.log("ModalDialog->useeffect mount", modalElementRef.current);
      if (location.pathname !== lastLocation.currrent?.pathname) {
        $(".mfp-close").trigger("click");
      }
    } else {
      modalRoot.appendChild(modalElementRef.current);
    }
    lastLocation.current = location;

    return () => {
      modalElementRef.current.remove();
    };
  });

  console.log("ModalDialog->render", getModalElement(id));
  return ReactDOM.createPortal(children, getModalElement(id));
};

export default ModalDialog;
