import React, { useCallback, useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/styles.css";

import { useMap } from "react-leaflet";
import { useIntl } from "../../i18n";
import { tooltip_init } from "../tooltips/tooltip-dom";

import "leaflet-geonames/L.Control.Geonames.js";
import { LocateControl } from "leaflet.locatecontrol";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.js";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "../../css/geonames.scss";

interface Props {
  loaded: boolean;
  onInit: (map: L.Map) => void;
  enableStationPinsToggle?: boolean;
  showMarkersWithoutValue?: boolean;
  onToggleMarkersWithoutValue?: (nextValue: boolean) => void;
}

const LeafletMapControls = (props: Props) => {
  const intl = useIntl();
  const parentMap = useMap();
  const stationPinsControlRef = useRef<L.Control | null>(null);
  const enableStationPinsToggle = props.enableStationPinsToggle;
  const showMarkersWithoutValue = props.showMarkersWithoutValue;
  const onToggleMarkersWithoutValue = props.onToggleMarkersWithoutValue;

  const _init_tooltip = useCallback(() => {
    parentMap
      .getContainer()
      .querySelectorAll(
        ".leaflet-control-zoom a, .leaflet-control-locate a, .leaflet-control-showhide a"
      )
      .forEach(e => e.classList.add("tooltip"));
    tooltip_init();
  }, [parentMap]);

  const _init_aria = useCallback(() => {
    parentMap
      .getContainer()
      .querySelectorAll(
        ".leaflet-control-zoom a, .leaflet-control-locate a, .leaflet-geonames-search a, .leaflet-touch-zoom, .leaflet-control-showhide a"
      )
      .forEach(e => e.setAttribute("tabIndex", "-1"));
  }, [parentMap]);

  const updateStationPinsControl = useCallback(() => {
    const control = stationPinsControlRef.current;
    if (!control) return;

    const container = control.getContainer();
    const showMarkersWithoutValueValue = showMarkersWithoutValue ?? true;
    const title = intl.formatMessage({
      id: showMarkersWithoutValueValue
        ? "weathermap:hidePins"
        : "weathermap:showPins"
    });
    container.className = showMarkersWithoutValueValue
      ? "leaflet-control-showhide leaflet-control-hide leaflet-bar leaflet-control"
      : "leaflet-control-showhide leaflet-control-show leaflet-bar leaflet-control";
    container.innerHTML = `<a class="leaflet-bar-part leaflet-bar-part-single tooltip" title="${title}"></a>`;
    _init_tooltip();
    _init_aria();
  }, [intl, showMarkersWithoutValue, _init_tooltip, _init_aria]);

  useEffect(() => {
    if (props.onInit) {
      props.onInit(parentMap);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentMap]);

  useEffect(() => {
    // Workaround for https://github.com/elmarquis/Leaflet.GestureHandling/issues/75
    parentMap.gestureHandling?._handleMouseOver?.();
  }, [parentMap]);

  useEffect(() => {
    new L.Control.Zoom({
      position: "topleft",
      zoomInTitle: intl.formatMessage({ id: "bulletin:map:zoom-in:hover" }),
      zoomOutTitle: intl.formatMessage({ id: "bulletin:map:zoom-out:hover" })
    }).addTo(parentMap);

    new L.Control.Geonames({
      lang: intl.locale.slice(0, 2),
      title: intl.formatMessage({ id: "bulletin:map:search" }),
      placeholder: intl.formatMessage({ id: "bulletin:map:search:hover" }),
      ...config.map.geonames
    }).addTo(parentMap);
    new LocateControl({
      ...config.map.locateOptions,
      icon: "icon-geolocate",
      iconLoading: "icon-geolocate",
      strings: {
        title: intl.formatMessage({ id: "bulletin:map:locate:title" }),
        metersUnit: intl.formatMessage({
          id: "bulletin:map:locate:metersUnit"
        }),
        popup: intl.formatMessage(
          { id: "bulletin:map:locate:popup" },
          {
            // keep placeholders for L.control.locate
            distance: "{distance}",
            unit: "{unit}"
          }
        ),
        outsideMapBoundsMsg: intl.formatMessage({
          id: "bulletin:map:locate:outside"
        })
      }
    }).addTo(parentMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!enableStationPinsToggle || !onToggleMarkersWithoutValue) {
      stationPinsControlRef.current?.remove();
      stationPinsControlRef.current = null;
      return undefined;
    }

    if (!stationPinsControlRef.current) {
      const stationPinsControl = new L.Control({ position: "topleft" });
      stationPinsControl.onAdd = () => {
        const showMarkersWithoutValueValue = showMarkersWithoutValue ?? true;
        const title = intl.formatMessage({
          id: showMarkersWithoutValueValue
            ? "weathermap:hidePins"
            : "weathermap:showPins"
        });
        const container = L.DomUtil.create(
          "div",
          showMarkersWithoutValueValue
            ? "leaflet-control-showhide leaflet-control-hide leaflet-bar leaflet-control"
            : "leaflet-control-showhide leaflet-control-show leaflet-bar leaflet-control"
        );
        container.innerHTML = `<a class="leaflet-bar-part leaflet-bar-part-single tooltip" title="${title}"></a>`;
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.addEventListener("click", event => {
          event.preventDefault();
          const nextValue = !(showMarkersWithoutValue ?? true);
          onToggleMarkersWithoutValue?.(nextValue);
        });
        return container;
      };
      stationPinsControl.addTo(parentMap);
      stationPinsControlRef.current = stationPinsControl;
    }

    updateStationPinsControl();

    return () => {
      stationPinsControlRef.current?.remove();
      stationPinsControlRef.current = null;
    };
  }, [
    parentMap,
    enableStationPinsToggle,
    onToggleMarkersWithoutValue,
    showMarkersWithoutValue,
    intl,
    updateStationPinsControl
  ]);

  useEffect(() => {
    _init_tooltip();
    _init_aria();
  }, [_init_aria, _init_tooltip]);

  useEffect(() => {
    if (stationPinsControlRef.current) {
      updateStationPinsControl();
    }
  }, [updateStationPinsControl]);

  return <></>;
};
export default LeafletMapControls;
