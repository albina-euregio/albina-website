import React from "react";
import loadable from "@loadable/component";
import { observer } from "mobx-react";

import Base from "../../base";
import LeafletMap from "../leaflet/leaflet-map";
import ZamgControl from "./zamg-control";
import Timecontrol from "./time-control";
import LegendControl from "./legend-control";
import GridOverlay from "./grid-overlay";
const StationOverlay = loadable(() =>
  import(/* webpackChunkName: "app-stationOverlay" */ "./station-overlay")
);
import { TileLayer, ImageOverlay } from "react-leaflet";

class WeatherMap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("WeatherMap->render xyz", this.props);
    const overlays = [];
    if (this.props.item) {
      if (this.props.overlay) {
        console.log("this.props.item.layer.overlay", this.props.item);
        const mapMinZoom = config.map.initOptions.minZoom;
        const mapMaxZoom = config.map.initOptions.maxZoom;

        //console.log("wather-map->render xxx1:", this.props.overlay);
        if (this.props.overlay) {
          overlays.push(
            <ImageOverlay
              key="background-map"
              className="leaflet-image-layer"
              url={this.props.overlay + ".gif"}
              opacity={Base.checkBlendingSupport() ? 1 : 0.5}
              bounds={config.weathermaps.settings.bbox}
              interactive={true}
              onClick={e => {
                let map = e.target._map;
                if (map) {
                  let mapWidth = map._container.offsetWidth;
                  let mapHeight = map._container.offsetHeight;
                  let x = (e.containerPoint.x * map._size.x) / mapWidth;
                  let y = (e.containerPoint.y * map._size.y) / mapHeight;
                  console.log("YYYYY GETPIXEL", e, x, y);

                  let canvas = document.createElement("canvas");
                  let ctx = canvas.getContext("2d");

                  let image = new Image();
                  image.crossOrigin = "anonymous";
                  image.onload = function() {
                    console.log("YYYYY GETPIXEL DATA");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                  };
                  image.src = map._url;
                }
              }}
              onLoad={() => {
                this.props.playerCB("background", "load");
              }}
              onError={err => {
                this.props.playerCB("background", err);
              }}
            />
          );
          this.props.playerCB("background", "loading");
        }
      }

      if (this.props.item.layer.grid && this.props.grid) {
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

      if (this.props.item.layer.stations && this.props.stations) {
        overlays.push(
          <StationOverlay
            key={"stations"}
            zoom={mapStore.mapZoom}
            onMarkerSelected={this.props.onMarkerSelected}
            selectedFeature={this.props.selectedFeature}
            item={this.props.item}
            itemId={this.props.domainId}
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

    const controls = [<ZamgControl key="zamg" />];
    if (this.props.item) {
      controls.push(<LegendControl key="legend" item={this.props.item} />);
    }

    //if (this.props.timeArray && this.props.startDate) {
    controls.push(
      <Timecontrol
        key="time"
        startDate={this.props.startDate}
        timeArray={this.props.timeArray}
        eventCallback={this.props.eventCallback}
      />
    );
    //}

    return (
      <LeafletMap
        loaded={this.props.domainId !== false}
        identifier={this.props.domainId + "_" + this.props.itemId}
        onViewportChanged={this.props.onViewportChanged}
        overlays={overlays}
        controls={controls}
        timeArray={this.props.timeArray}
        startDate={this.props.startDate}
        onInit={map => {
          map.on("click", () => {
            this.props.onMarkerSelected(null);
          });
        }}
        timeAwareLayers={["background-map"]}
      />
    );
  }
}

export default observer(WeatherMap);
