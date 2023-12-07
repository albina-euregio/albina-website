import React, { useEffect } from "react";
import $ from "jquery";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet-player.css";

import { useMap } from "react-leaflet";
import { useIntl } from "react-intl";
import { tooltip_init } from "../tooltips/tooltip-dom";

import "leaflet-geonames";
import "leaflet.locatecontrol";
import "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css";
import "../../css/geonames.css";
import { APP_STORE } from "../../appStore";

const LeafletMapControls = props => {
  const intl = useIntl();
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
    // console.log("leaflet-map ggg1 update tooltip");
    $(".leaflet-control-zoom a").addClass("tooltip");
    $(".leaflet-control-zoom a").addClass("tooltip");
    $(".leaflet-control-locate a").addClass("tooltip");
    tooltip_init();
  };

  const _init_aria = () => {
    $(".leaflet-control-zoom a").attr("tabIndex", "-1");
    $(".leaflet-control-zoom a").attr("tabIndex", "-1");
    $(".leaflet-control-locate a").attr("tabIndex", "-1");
    $(".leaflet-geonames-search a").attr("tabIndex", "-1");
    $(".leaflet-touch-zoom").attr("tabIndex", "-1");
  };

  const updateControls = () => {
    //("LeafletMapControls->updateControls xx02", parentMap, props);

    //console.log("updateMaps xyz", map, disabled);
    if (props.onInit) {
      props.onInit(parentMap);
    }

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

    // L.control
    //   .geonames({
    //     lang: APP_STORE.language,
    //     title: intl.formatMessage({
    //       id: "bulletin:map:search"
    //     }),
    //     placeholder: intl.formatMessage({
    //       id: "bulletin:map:search:hover"
    //     }),
    //     ...config.map.geonames
    //   })
    //   .addTo(parentMap);
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
