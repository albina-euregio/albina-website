import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet-player.css";

import {
  MapContainer,
  MapConsumer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  AttributionControl,
  ScaleControl
} from "react-leaflet";
import { useIntl } from "react-intl";
import { tooltip_init } from "../../js/tooltip";
import { MAP_STORE } from "../../stores/mapStore";

import "leaflet-geonames";
import "leaflet.locatecontrol";
import "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css";
import "../../css/geonames.css";
import { APP_STORE } from "../../appStore";
import { parseSearchParams } from "../../util/searchParams";

const LeafletMap = props => {
  const intl = useIntl();

  let _layers = [];

  const mapStyle = {
    width: "100%",
    height: "100%",
    zIndex: 1,
    opacity: 1
  };

  const _disabledMapProps = {
    dragging: false,
    touchZoom: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    boxZoom: false,
    keyboard: false
  };

  const _enabledMapProps = {
    dragging: true,
    touchZoom: true,
    doubleClickZoom: true,
    scrollWheelZoom: true,
    boxZoom: true,
    keyboard: true
  };

  const didMountRef = useRef(false);
  useEffect(() => {
    didMountRef.current = true;
  });

  const updateMaps = (map, disabled) => {
    //console.log("updateMaps xyy");
    if (disabled) {
      L.Util.setOptions(map, { gestureHandling: false });
    }

    if (didMountRef.current) {
      //console.log("updateMaps xyz", map, disabled);
      if (props.onInit) {
        props.onInit(map);
      }

      if (props.gestureHandling)
        L.Util.setOptions(map, { gestureHandling: true });

      const province = parseSearchParams().get("province");
      this.map.fitBounds(
        config.map[`${province}.bounds`] ?? config.map.euregioBounds
      );

      //console.log("map", map);
      window.setTimeout(() => {
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
          .addTo(map);

        L.control
          .geonames({
            lang: APP_STORE.language,
            title: intl.formatMessage({
              id: "bulletin:map:search"
            }),
            placeholder: intl.formatMessage({
              id: "bulletin:map:search:hover"
            }),
            ...config.map.geonames
          })
          .addTo(map);
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
          .addTo(map);
      }, 50);

      _init_tooltip();
      _init_aria();
    }
  };

  const _init_tooltip = () => {
    window.setTimeout(() => {
      // console.log("leaflet-map ggg1 update tooltip");
      $(".leaflet-control-zoom a").addClass("tooltip");
      $(".leaflet-control-zoom a").addClass("tooltip");
      $(".leaflet-control-locate a").addClass("tooltip");
      tooltip_init();
    }, 100);
  };

  const _init_aria = () => {
    window.setTimeout(() => {
      $(".leaflet-control-zoom a").attr("tabIndex", "-1");
      $(".leaflet-control-zoom a").attr("tabIndex", "-1");
      $(".leaflet-control-locate a").attr("tabIndex", "-1");
      $(".leaflet-geonames-search a").attr("tabIndex", "-1");
      $(".leaflet-touch-zoom").attr("tabIndex", "-1");
    }, 100);
  };

  const _zoomend = () => {
    const map = map;
    const newZoom = Math.round(map.getZoom());
    //console.log("leaflet-map->_zoomend newZoom", newZoom);
    map.setMaxBounds(config.map.maxBounds[newZoom]);
    _init_tooltip();
  };

  const tileLayers = () => {
    const tileLayerConfig = config.map.tileLayers;
    let tileLayers = "";
    if (tileLayerConfig.length == 1) {
      // only a single raster layer -> no layer control
      tileLayers = (
        <TileLayer
          {...Object.assign(
            {},
            tileLayerConfig[0],
            props.tileLayerConfigOverride
          )}
        />
      );
    } else if (tileLayerConfig.length > 1) {
      // add a layer switch zoomControl
      tileLayers = (
        <LayersControl>
          {tileLayerConfig.map((layerProps, i) => (
            <LayersControl.BaseLayer
              name={layerProps.id}
              key={layerProps.id}
              checked={i == 0}
            >
              <TileLayer
                key={layerProps.id}
                {...Object.assign(
                  {},
                  layerProps,
                  props.tileLayerConfigOverride
                )}
              />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>
      );
    }
    return tileLayers;
  };

  const renderDisabledMap = mapOptions => {
    return (
      <MapContainer
        onZoomEnd={_zoomend.bind(this)}
        className="map-disabled"
        gestureHandling={props.gestureHandling}
        style={mapStyle}
        zoomControl={false}
        zoom={MAP_STORE.mapZoom}
        center={MAP_STORE.mapCenter}
        {...mapOptions}
        attributionControl={false}
      >
        <AttributionControl prefix={config.map.attribution} />
        <MapConsumer>
          {map => {
            updateMaps(map, true);
          }}
        </MapConsumer>
        {tileLayers()}
      </MapContainer>
    );
  };

  const renderLoadedMap = mapOptions => {
    return (
      <MapContainer
        onZoomEnd={_zoomend.bind(this)}
        onViewportChanged={props.onViewportChanged}
        useFlyTo
        gestureHandling={props.gestureHandling}
        dragging={L.Browser.mobile}
        style={mapStyle}
        zoomControl={false}
        zoom={MAP_STORE.mapZoom}
        center={MAP_STORE.mapCenter}
        {...mapOptions}
        attributionControl={false}
        whenCreated={map => {
          updateMaps(map, false);
        }}
      >
        <AttributionControl prefix={config.map.attribution} />
        <ScaleControl imperial={false} position="bottomleft" />
        {props.controls}
        {tileLayers()}
        {props.overlays}
      </MapContainer>
    );
  };

  // connectLayers(map) {
  //   //console.log("connectLayers", map);
  //   if (map) {
  //     mapRef = map;
  //   }
  // }

  //console.log("leaflet-map->render", props.overlays);

  const mapProps = config.map.initOptions;
  const mapOptions = Object.assign(
    {},
    props.loaded ? _enabledMapProps : _disabledMapProps,
    mapProps,
    props.mapConfigOverride
  );
  const map = props.loaded
    ? renderLoadedMap(mapOptions)
    : renderDisabledMap(mapOptions);
  //console.log("render->useEffect", map, props.loaded);

  return map;
};
export default LeafletMap;
