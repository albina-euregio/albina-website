import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

interface Props {
  config: L.ControlOptions;
  containerElement: keyof HTMLElementTagNameMap;
  classNames: string;
  innerHTML: string;
  onClick?: () => void;
  enabled: boolean;
}

export const CustomLeafletControl = ({
  config,
  containerElement,
  classNames,
  innerHTML,
  onClick,
  enabled
}: Props) => {
  const [control, setControl] = useState<L.Control | null>(null);
  const parentMap = useMap();
  const classNamesRef = useRef(classNames);

  const createControl = () => {
    if (!control && enabled && parentMap && config?.position) {
      const ctrl = new L.Control({ ...config });
      ctrl.onAdd = () => {
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
  }, []);

  useEffect(() => {
    if (enabled) createControl();
    else removeControl();
  }, [enabled]);

  useEffect(() => {
    classNamesRef.current = classNames;
  }, [classNames]);

  useEffect(() => {
    createControl();
  }, [config?.position, classNames, parentMap]);

  useEffect(() => {
    if (control) {
      const container = control.getContainer();
      if (container) container.className = classNamesRef.current;
    }
  }, [classNames]);

  useEffect(() => {
    if (control) {
      const container = control.getContainer();
      if (container) container.innerHTML = innerHTML;
    }
  }, [innerHTML]);

  return null;
};
