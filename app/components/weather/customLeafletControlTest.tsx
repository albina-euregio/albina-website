import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export const CustomLeafletControl = ({
  config,
  containerElement,
  classNames,
  innerHTML,
  onClick
}) => {
  const map = useMap();

  useEffect(() => {
    //console.log("CustomLeafletControl->useEffect", map?.controls);
    // Called after the component has been added to the DOM
    const container = L.DomUtil.create(containerElement, classNames);
    container.innerHTML = innerHTML;

    // Add any additional setup or event listeners here
    container.addEventListener("click", onClick);

    // Add the control to the specified position on the map
    map.controls[config?.position].add(container);

    return () => {
      // Called before the component is removed from the DOM
      container.removeEventListener("click", onClick);
      map.controls[config?.position].remove(container);
    };
  }, [map, config?.position]); // eslint-disable-line react-hooks/exhaustive-deps

  return null; // The actual control is added to the map imperatively in useEffect
};
