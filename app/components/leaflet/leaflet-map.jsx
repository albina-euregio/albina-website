import React, { useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet-player.css";
import LeafletMapControls from "./leaflet-map-controls";

import {
  MapContainer,
  MapConsumer,
  TileLayer,
  LayersControl,
  AttributionControl,
  ScaleControl
} from "react-leaflet";

import { MAP_STORE } from "../../stores/mapStore";

const LeafletMap = props => {
  //const intl = useIntl();

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

  console.log("leaflet-map->render xx02", props);
  const displayMap = useMemo(
    () => (
      <MapContainer
        onZoomEnd={_zoomend.bind(this)}
        className={props.loaded ? "" : "map-disabled"}
        gestureHandling={props.gestureHandling}
        style={mapStyle}
        zoomControl={false}
        zoom={MAP_STORE.mapZoom}
        center={MAP_STORE.mapCenter}
        {...mapOptions}
        attributionControl={false}
      >
        <AttributionControl prefix={config.map.attribution} />
        {props.loaded && (
          <ScaleControl imperial={false} position="bottomleft" />
        )}
        {props.loaded && props.controls}
        {tileLayers()}
        {props.loaded && props.overlays}
        <LeafletMapControls {...props} />
      </MapContainer>
    ),
    [props.loaded]
  );

  // const displayActiveMap = useMemo(
  //   () => (
  //     <MapContainer
  //       onZoomEnd={_zoomend.bind(this)}
  //       onViewportChanged={props.onViewportChanged}
  //       useFlyTo
  //       gestureHandling={props.gestureHandling}
  //       dragging={L.Browser.mobile}
  //       style={mapStyle}
  //       zoomControl={false}
  //       zoom={MAP_STORE.mapZoom}
  //       center={MAP_STORE.mapCenter}
  //       {...mapOptions}
  //       attributionControl={false}
  //       whenCreated={map => {
  //         updateMaps(map, false);
  //       }}
  //     >
  //       <AttributionControl prefix={config.map.attribution} />
  //       <ScaleControl imperial={false} position="bottomleft" />

  //       {props.controls}
  //       {tileLayers()}
  //       {props.overlays}

  //     </MapContainer>
  //   ),
  //   [],
  // )

  // const renderDisabledMap = mapOptions => {
  //   return (
  //     <MapContainer
  //       onZoomEnd={_zoomend.bind(this)}
  //       className="map-disabled"
  //       gestureHandling={props.gestureHandling}
  //       style={mapStyle}
  //       zoomControl={false}
  //       zoom={MAP_STORE.mapZoom}
  //       center={MAP_STORE.mapCenter}
  //       {...mapOptions}
  //       attributionControl={false}
  //     >
  //       <Pane name="tooltips" />
  //       <AttributionControl prefix={config.map.attribution} />
  //       <MapConsumer>
  //         {map => {
  //           updateMaps(map, true);
  //         }}
  //       </MapConsumer>
  //       {tileLayers()}
  //     </MapContainer>
  //   );
  // };

  // const renderLoadedMap = mapOptions => {
  //   return (
  //     <MapContainer
  //       onZoomEnd={_zoomend.bind(this)}
  //       onViewportChanged={props.onViewportChanged}
  //       useFlyTo
  //       gestureHandling={props.gestureHandling}
  //       dragging={L.Browser.mobile}
  //       style={mapStyle}
  //       zoomControl={false}
  //       zoom={MAP_STORE.mapZoom}
  //       center={MAP_STORE.mapCenter}
  //       {...mapOptions}
  //       attributionControl={false}
  //       whenCreated={map => {
  //         updateMaps(map, false);
  //       }}
  //     >
  //       <AttributionControl prefix={config.map.attribution} />
  //       <ScaleControl imperial={false} position="bottomleft" />

  //       {props.controls}
  //       {tileLayers()}
  //       {props.overlays}
  //     </MapContainer>
  //   );
  // };

  // connectLayers(map) {
  //   //console.log("connectLayers", map);
  //   if (map) {
  //     mapRef = map;
  //   }
  // }

  //console.log("leaflet-map->render", props.overlays);

  return displayMap;
};
export default LeafletMap;
