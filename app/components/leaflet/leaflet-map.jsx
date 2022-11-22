import React, { useMemo, useState, useEffect } from "react";
//import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet-player.css";
import { parseSearchParams } from "../../util/searchParams";
import LeafletMapControls from "./leaflet-map-controls";

import {
  MapContainer,
  useMapEvents,
  //MapConsumer,
  TileLayer,
  LayersControl,
  AttributionControl,
  ScaleControl
} from "react-leaflet";

import { MAP_STORE } from "../../stores/mapStore";

const EventHandler = () => {
  const map = useMapEvents({
    zoomend: () => {
      //console.log("xxx zoomend");
      const newZoom = Math.round(map.getZoom());
      map.setMaxBounds(config.map.maxBounds[newZoom]);
    }
  });
  return null;
};

const LeafletMap = props => {
  //const intl = useIntl();

  const [map, setMap] = useState(null);

  //let _layers = [];

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

  const mapProps = config.map.initOptions;
  const mapOptions = Object.assign(
    {},
    props.loaded ? _enabledMapProps : _disabledMapProps,
    mapProps,
    props.mapConfigOverride
  );

  useEffect(() => {
    if (!map) return;

    const province = parseSearchParams().get("province");
    map.fitBounds(config.map[`${province}.bounds`] ?? config.map.euregioBounds);
    map.zoom = MAP_STORE.mapZoom;
  }, [map]);

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

  //console.log("leaflet-map->render xx02", mapOptions);
  const displayMap = useMemo(
    () => (
      <MapContainer
        className={props.loaded ? "" : "map-disabled"}
        gestureHandling={props.gestureHandling}
        style={mapStyle}
        zoomControl={false}
        center={MAP_STORE.mapCenter}
        {...mapOptions}
        attributionControl={false}
        whenCreated={setMap}
      >
        <EventHandler />
        <AttributionControl prefix={config.map.attribution} />
        {props.loaded && (
          <ScaleControl imperial={false} position="bottomleft" />
        )}
        {props.loaded && props.controls}
        {tileLayers()}
        {props.overlays}
        <LeafletMapControls {...props} />
      </MapContainer>
    ),
    [props.loaded, props.overlays]
  );

  //console.log("leaflet-map->render", props.overlays);

  return displayMap;
};
export default LeafletMap;
