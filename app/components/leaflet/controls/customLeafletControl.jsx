import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

export const CustomLeafletControl = ({
  config,
  containerElement,
  classNames,
  innerHTML,
  onClick
}) => {
  const [control, setControl] = useState(null);
  const parentMap = useMap();
  const classNamesRef = useRef(classNames);

  useEffect(() => {
    return () => {
      if (control) parentMap.removeControl(control);
    };
  }, []);

  useEffect(() => {
    classNamesRef.current = classNames;
  }, [classNames]);

  useEffect(() => {
    if (!control) {
      console.log(
        "CustomLeafletControl->useEffect #1 uu12",
        control,
        parentMap
      );
      const ctrl = L.control({ ...config });

      ctrl.onAdd = function (map) {
        //console.log("CustomLeafletControl->onAdd",map);
        let domElement = L.DomUtil.create(containerElement, classNames);
        domElement.innerHTML = innerHTML;
        if (onClick) domElement.addEventListener("click", () => onClick());
        return domElement;
      };

      ctrl.addTo(parentMap);
      setControl(ctrl);
    }
  }, [config?.position, classNames, parentMap]);
  //console.log("CustomLeafletControl->render", ctrlRef.current);

  useEffect(() => {
    // Update the class of the existing control when dynamicClass changes
    console.log("CustomLeafletControl->useEffect #2 uu12", control);
    if (control) {
      const container = control.getContainer();
      container.className = classNamesRef.current;
    }
  }, [classNames, parentMap]);

  console.log("CustomLeafletControl->render uu12", classNames);
  return <></>;
};
