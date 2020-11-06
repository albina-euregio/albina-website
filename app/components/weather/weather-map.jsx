import React from "react";
import loadable from "@loadable/component";
import { observer } from "mobx-react";

import LeafletMap from "../leaflet/leaflet-map";
import Overlay from "../leaflet/overlay";

import GridOverlay from "./grid-overlay";

const StationOverlay = loadable(() =>
  import(/* webpackChunkName: "app-stationOverlay" */ "./station-overlay")
);

class WeatherMap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log("WeatherMap->render xyz", this.props);
    const overlays = [];
    if (this.props.item) {
      if (this.props.overlay) {
        //console.log("this.props.item.layer.overlay", this.props.item);
        // const mapMinZoom = config.map.initOptions.minZoom;
        // const mapMaxZoom = config.map.initOptions.maxZoom;

        //console.log("wather-map->render xxx1:", this.props.overlay);
        if (this.props.overlay) {
          overlays.push(
            <Overlay
              key="background-map"
              overlay={this.props.overlay}
              currentTime={this.props.currentTime}
              debug={this.props.debug}
              playerCB={this.props.playerCB}
              item={this.props.item}
              dataOverlays={this.props.dataOverlays}
              dataOverlaysEnabled={this.props.dataOverlaysEnabled}
              rgbToValue={this.props.rgbToValue}
            />
          );
        }
      }

      if (
        this.props.item.layer.grid &&
        this.props.grid &&
        this.props.grid.features
      ) {
        overlays.push(
          <GridOverlay
            key={"grid"}
            zoom={mapStore.mapZoom}
            item={this.props.item}
            grid={this.props.grid}
            onLoading={() => {
              this.props.playerCB("grid", "loading");
            }}
            onLoad={() => {
              this.props.playerCB("gird", "load");
            }}
            onTileerror={() => {
              this.props.playerCB("grid", "error");
            }}
          />
        );
      }

      if (
        this.props.item.layer.stations &&
        this.props.stations &&
        this.props.stations.features &&
        !this.props.isPlaying
      ) {
        overlays.push(
          <StationOverlay
            key={"stations"}
            zoom={mapStore.mapZoom}
            onMarkerSelected={this.props.onMarkerSelected}
            selectedFeature={this.props.selectedFeature}
            item={this.props.item}
            itemId={this.props.stationDataId}
            features={this.props.stations.features}
            onLoading={() => {
              this.props.playerCB("stations", "loading");
            }}
            onLoad={() => {
              this.props.playerCB("stations", "load");
            }}
            onTileerror={() => {
              this.props.playerCB("stations", "error");
            }}
          />
        );
      }
    }

    const controls = [];

    return (
      <>
        <LeafletMap
          loaded={this.props.domainId !== false}
          identifier={this.props.domainId + "_" + this.props.itemId}
          onViewportChanged={this.props.onViewportChanged}
          overlays={overlays}
          controls={controls}
          timeArray={this.props.timeArray}
          startDate={this.props.startDate}
          gestureHandling={false}
          onInit={map => {
            map.on("click", () => {
              this.props.onMarkerSelected(null);
            });
          }}
          timeAwareLayers={["background-map"]}
        />
      </>
    );
  }
}

export default observer(WeatherMap);
