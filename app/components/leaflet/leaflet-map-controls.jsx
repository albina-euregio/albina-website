import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useMap } from "react-leaflet";
import { useIntl } from "../../i18n";
import { tooltip_init } from "../tooltips/tooltip-dom";

import "leaflet-geonames";
import "leaflet.locatecontrol";
import "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css";
import "../../css/geonames.css";

const LeafletMapControls = props => {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const parentMap = useMap();

  //const didMountRef = useRef(false);
  useEffect(() => {
    updateControls();
  }, []);

  useEffect(() => {
    if (props.loaded) {
      L.Util.setOptions(parentMap, { gestureHandling: false });
    }

    if (props.gestureHandling)
      L.Util.setOptions(parentMap, { gestureHandling: true });
  });

  const _init_tooltip = () => {
    parentMap
      .getContainer()
      .querySelectorAll(".leaflet-control-zoom a, .leaflet-control-locate a")
      .forEach(e => e.classList.add("tooltip"));
    tooltip_init();
  };

  const _init_aria = () => {
    parentMap
      .getContainer()
      .querySelectorAll(
        ".leaflet-control-zoom a, .leaflet-control-locate a, .leaflet-geonames-search a, .leaflet-touch-zoom"
      )
      .forEach(e => e.setAttribute("tabIndex", "-1"));
  };

  const updateControls = () => {
    //("LeafletMapControls->updateControls xx02", parentMap, props);

    //console.log("updateMaps xyz", map, disabled);
    if (props.onInit) {
      props.onInit(parentMap);
    }

    // Workaround for https://github.com/elmarquis/Leaflet.GestureHandling/issues/75
    parentMap.gestureHandling?._handleMouseOver?.();

    parentMap.fitBounds(config.map.euregioBounds);

    //console.log("map", map);

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
        lang,
        title: intl.formatMessage({
          id: "bulletin:map:search"
        }),
        placeholder: intl.formatMessage({
          id: "bulletin:map:search:hover"
        }),
        ...config.map.geonames
      })
      .addTo(parentMap);
    L.control
      .locate({
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
      })
      .addTo(parentMap);

    _init_tooltip();
    _init_aria();
  };

  return <></>;
};
export default LeafletMapControls;
