import React from "react";
import { observer } from "mobx-react";

import Base from "../../base";
import LeafletMap from "../leaflet/leaflet-map";
import ZamgControl from "./zamg-control";
import LegendControl from "./legend-control";
import GridOverlay from "./grid-overlay";
import StationOverlay from "./station-overlay";
import { TileLayer } from "react-leaflet";

class WeatherMap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const overlays = [];
    if (this.props.itemId && this.props.item) {
      if (this.props.item.layer.overlay) {
        const mapMinZoom = config.get("map.initOptions.minZoom");
        const mapMaxZoom = config.get("map.initOptions.maxZoom");

        const zoomBounds = this.props.item.overlay.tmsZoomLevel.split("-");
        const minZoom =
          Array.isArray(zoomBounds) && zoomBounds.length == 2
            ? zoomBounds[0]
            : mapMinZoom;
        const maxZoom =
          Array.isArray(zoomBounds) && zoomBounds.length == 2
            ? zoomBounds[1]
            : mapMaxZoom;

        overlays.push(
          <TileLayer
            key="background-map"
            className="leaflet-image-layer"
            url={
              config.get("apis.weather.overlays") +
              this.props.item.overlay.tms +
              "/{z}/{x}/{y}.png"
            }
            minNativeZoom={Math.max(minZoom, mapMinZoom)}
            minZoom={mapMinZoom}
            maxNativeZoom={Math.min(maxZoom, mapMaxZoom)}
            maxZoom={mapMaxZoom}
            opacity={Base.checkBlendingSupport() ? 1 : 0.5}
            bounds={this.props.item.bbox}
            tms={true}
            detectRetina={false}
            updateWhenZooming={false}
            updateWhenIdle={true}
            updateInterval={1000}
            keepBuffer={4}
          />
        );
      }

      if (this.props.item.layer.grid && this.props.grid) {
        overlays.push(
          <GridOverlay
            key={"grid"}
            zoom={mapStore.mapZoom}
            onMarkerSelected={this.props.onMarkerSelected}
            selectedFeature={this.props.selectedFeature}
            item={this.props.item}
            grid={this.props.grid}
          />
        );
      }

      if (this.props.item.layer.stations && this.props.stations) {
        overlays.push(
          <StationOverlay
            key={"stations"}
            zoom={mapStore.mapZoom}
            onMarkerSelected={this.props.onMarkerSelected}
            selectedFeature={this.props.selectedFeature}
            item={this.props.item}
            features={this.props.stations.features}
          />
        );
      }
    }

    const controls = [<ZamgControl key="zamg" />];
    if (this.props.itemId && this.props.item) {
      controls.push(<LegendControl key="legend" item={this.props.item} />);
    }

    return (
      <LeafletMap
        loaded={this.props.domainId !== false}
        onViewportChanged={this.props.onViewportChanged}
        overlays={overlays}
        controls={controls}
        onInit={map => {
          map.on("click", e => {
            this.props.onMarkerSelected(null);
          });
        }}
      />
    );
  }
}

export default observer(WeatherMap);
