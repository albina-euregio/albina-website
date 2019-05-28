import React from "react";
import { observer } from "mobx-react";

import Base from "../../base";
import LeafletMap2 from "../leaflet-map2";
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
    if(this.props.item) {
      if(this.props.item.layer.overlay) {
        const mapMinZoom = config.get('map.initOptions.minZoom');
        const mapMaxZoom = config.get('map.initOptions.maxZoom');

        const zoomBounds = this.props.item.overlay.tmsZoomLevel.split('-');
        const minZoom = (Array.isArray(zoomBounds) && zoomBounds.length == 2) ? zoomBounds[0] : mapMinZoom;
        const maxZoom = (Array.isArray(zoomBounds) && zoomBounds.length == 2) ? zoomBounds[1] : mapMaxZoom;

        overlays.push(
          <TileLayer key="background-map"
            className="leaflet-image-layer"
            url={
              config.get("links.meteoViewer.overlays")
              + this.props.item.overlay.tms
              + "/{z}/{x}/{y}.png"
            }
            minNativeZoom={Math.max(minZoom, mapMinZoom)}
            minZoom={mapMinZoom}
            maxNativeZoom={Math.min(maxZoom, mapMaxZoom)}
            maxZoom={mapMaxZoom}
            opacity={Base.checkBlendingSupport() ? 1 : 0.5}
            tms={true} />
        );
      }

      if(this.props.item.layer.grid && this.props.grid) {
        overlays.push(
          <GridOverlay key={"grid"}
            zoom={mapStore.getMapZoom}
            onMarkerSelected={this.props.onMarkerSelected}
            selectedFeature={this.props.selectedFeature}
            item={this.props.item}
            grid={this.props.grid} />
        );
      }

      if(this.props.item.layer.stations && this.props.stations) {
        overlays.push(
          <StationOverlay key={"stations"}
            zoom={mapStore.getMapZoom}
            onMarkerSelected={this.props.onMarkerSelected}
            selectedFeature={this.props.selectedFeature}
            item={this.props.item}
            features={this.props.stations.features} />
        )
      }
    }

    return (
      <LeafletMap2
        loaded={this.props.domain !== false}
        onViewportChanged={this.props.onViewportChanged}
        overlays={overlays}
        controls={[
          <ZamgControl key="zamg" />,
          <LegendControl key="legend" item={this.props.item} />
        ]}
        />
    );
  }
}

export default observer(WeatherMap);
