import React from "react";

import Base from "../../base";
import LeafletMap2 from "../leaflet-map2";
import ZamgControl from "./zamg-control";
import LegendControl from "./legend-control";
import { TileLayer } from "react-leaflet";

export default class WeatherMap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const overlays = [];
    if(this.props.item) {
      overlays.push(
        <TileLayer key="background-map"
          className="leaflet-image-layer"
          url={
            config.get("links.meteoViewer.overlays")
            + this.props.item.overlay.tms
            + "/{z}/{x}/{y}.png"
          }
          minNativeZoom={8}
          minZoom={config.get('map.initOptions.minZoom')}
          maxNativeZoom={9}
          maxZoom={config.get('map.initOptions.maxZoom')}
          opacity={Base.checkBlendingSupport() ? 1 : 0.5}
          tms={true} />
      );
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
