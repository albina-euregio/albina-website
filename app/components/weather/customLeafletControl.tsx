import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

export const CustomLeafletControl = ({
  config,
  containerElement,
  classNames,
  innerHTML,
  onClick,
  enabled
}) => {
  const [control, setControl] = useState<L.Control | null>(null);
  const parentMap = useMap();
  const classNamesRef = useRef(classNames);

  const createControl = () => {
    if (!control && enabled && parentMap && config?.position) {
      const ctrl = L.control({ ...config });
      ctrl.onAdd = function () {
        //console.log("CustomLeafletControl->onAdd",map);
        const domElement = L.DomUtil.create(containerElement, classNames);
        domElement.innerHTML = innerHTML;
        if (onClick) domElement.addEventListener("click", () => onClick());
        return domElement;
      };

      ctrl.addTo(parentMap);
      setControl(ctrl);
    }
  };

  const removeControl = () => {
    if (control) {
      control.remove();
      setControl(null);
    }
  };

  useEffect(() => {
    return () => {
      removeControl();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (enabled) createControl();
    else removeControl();
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    classNamesRef.current = classNames;
  }, [classNames]);

  useEffect(() => {
    createControl();
  }, [config?.position, classNames, parentMap]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (control) {
      const container = control.getContainer();
      container.className = classNamesRef.current;
    }
  }, [classNames]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (control) {
      const container = control.getContainer();
      container.innerHTML = innerHTML;
    }
  }, [innerHTML]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
