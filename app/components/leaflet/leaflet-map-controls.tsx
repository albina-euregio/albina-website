import React, { useCallback, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useMap } from "react-leaflet";
import { useIntl } from "../../i18n";
import { tooltip_init } from "../tooltips/tooltip-dom";

import "leaflet-geonames";
import { LocateControl } from "leaflet.locatecontrol";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.js";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "../../css/geonames.css";

interface Props {
  loaded: boolean;
  gestureHandling: boolean;
  onInit: (map: L.Map) => void;
}

const LeafletMapControls = (props: Props) => {
  const intl = useIntl();
  const parentMap = useMap();

  useEffect(() => {
    if (props.loaded) {
      L.Util.setOptions(parentMap, { gestureHandling: false });
    }

    if (props.gestureHandling)
      L.Util.setOptions(parentMap, { gestureHandling: true });
  });

  const _init_tooltip = useCallback(() => {
    parentMap
      .getContainer()
      .querySelectorAll(".leaflet-control-zoom a, .leaflet-control-locate a")
      .forEach(e => e.classList.add("tooltip"));
    tooltip_init();
  }, [parentMap]);

  const _init_aria = useCallback(() => {
    parentMap
      .getContainer()
      .querySelectorAll(
        ".leaflet-control-zoom a, .leaflet-control-locate a, .leaflet-geonames-search a, .leaflet-touch-zoom"
      )
      .forEach(e => e.setAttribute("tabIndex", "-1"));
  }, [parentMap]);

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
    L.control
      .zoom({
        position: "topleft",
        zoomInTitle: intl.formatMessage({
          id: "bulletin:map:zoom-in:hover"
        }),
        zoomOutTitle: intl.formatMessage({
          id: "bulletin:map:zoom-out:hover"
        })
      })
      .addTo(parentMap);

    L.control
      .geonames({
        lang: intl.locale.slice(0, 2),
        title: intl.formatMessage({
          id: "bulletin:map:search"
        }),
        placeholder: intl.formatMessage({
          id: "bulletin:map:search:hover"
        }),
        ...config.map.geonames
      })
      .addTo(parentMap);
    new LocateControl({
      ...config.map.locateOptions,
      icon: "icon-geolocate",
      iconLoading: "icon-geolocate",
      strings: {
        title: intl.formatMessage({
          id: "bulletin:map:locate:title"
        }),
        metersUnit: intl.formatMessage({
          id: "bulletin:map:locate:metersUnit"
        }),
        popup: intl.formatMessage(
          {
            id: "bulletin:map:locate:popup"
          },
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
    _init_tooltip();
    _init_aria();
  }, [_init_aria, _init_tooltip]);

  return <></>;
};
export default LeafletMapControls;
