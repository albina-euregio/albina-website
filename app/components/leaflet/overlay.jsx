import React from "react";
import { ImageOverlay } from "react-leaflet";
import StationMarker from "../leaflet/station-marker";
import Base from "../../base";

const css = `
    .debug-almost-invisible {
        opacity: 0.1 !important
    }
    .debug-no-blending {
      mix-blend-mode: unset !important
    }
    .debug-high-contrast {
      filter: contrast(20);
    }
`;
export default class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.overlayCanvases = {};
    this.state = { dataMarker: null, showDataLayer: false };
    this.showDataMarker = this.showDataMarker.bind(this);
  }

  onComponentDidUpdate() {
    this.setDataMarker({});
  }

  getClickedPixel(clickEvent) {
    let map = clickEvent.target._map;
    let overlay = clickEvent.target;

    let xY = overlay.getElement().naturalWidth / overlay.getElement().width;
    let yY = overlay.getElement().naturalHeight / overlay.getElement().height;
    let dx =
      map.project(clickEvent.latlng).x -
      map.project(overlay.getBounds()["_southWest"]).x;
    let dy =
      map.project(clickEvent.latlng).y -
      map.project(overlay.getBounds()["_northEast"]).y;
    //console.log("getClickedPixel", {"xY": xY, "yY": yY, "SWx": map.project(overlay.getBounds()["_southWest"]).x, "NEy": map.project(overlay.getBounds()["_northEast"]).y});
    return { x: Math.round(xY * dx), y: Math.round(yY * dy) };
  }

  getColor(value) {
    const v = parseFloat(value);
    const colors = Object.values(this.props.item.colors);

    let color = colors[0];
    this.props.item.thresholds.forEach((tr, i) => {
      if (v > tr) {
        color = colors[i + 1];
      }
    });

    return color;
  }

  setDataMarker(data) {
    //console.log("setDataMarker jjj", data);
    this.setState({
      dataMarker: (
        <StationMarker
          type="station"
          dataType="forcast"
          key="dataMarker"
          itemId="dataMarker"
          iconAnchor={[12.5, 12.5]}
          data={{}}
          stationId="dataMarker"
          stationName="dataMarker"
          coordinates={data.coordinates}
          color={this.getColor(data.value)}
          value={data.value}
          direction={data.direction}
        />
      )
    });
  }

  getPixelData(e) {
    let self = this;
    let pixel = self.getClickedPixel(e);

    let values = {};
    self.props.dataOverlays.forEach(anOverlay => {
      if (self.overlayCanvases[anOverlay.type]["loaded"]) {
        let p = self.overlayCanvases[anOverlay.type].canvas.ctx.getImageData(
          pixel.x,
          pixel.y,
          1,
          1
        );
        //console.log("getPixelData", self.overlayCanvases[anOverlay.type].canvas, p, pixel.x, pixel.y);
        values[anOverlay.type] = self.props.rgbToValue(anOverlay.type, {
          r: p.data[0],
          g: p.data[1],
          b: p.data[2]
        });
        if (self.props.debug) {
          for (var y = 0; y < p.height; y++) {
            for (var x = 0; x < p.width; x++) {
              p.data[4 * (y * p.width + x)] = 255;
              p.data[4 * (y * p.width + x) + 1] = 0;
              p.data[4 * (y * p.width + x) + 2] = 0;
              p.data[4 * (y * p.width + x) + 3] = 255;
            }
          }
          // indicate clicked position with red dot
          self.overlayCanvases[anOverlay.type].canvas.ctx.putImageData(
            p,
            pixel.x,
            pixel.y
          );
          $(".map-data-layer").attr(
            "src",
            self.overlayCanvases[anOverlay.type].canvas.toDataURL()
          );
        }
      }
    });
    self.setDataMarker({
      coordinates: e.latlng,
      value: values.temperature ?? values.windSpeed ?? values.snowHeight,
      direction: values.windDirection
    });
  }

  showDataMarker(e) {
    let self = this;

    if (self.props.debug && e.originalEvent.ctrlKey) {
      $(".map-data-layer").toggleClass("hide");
      $(".map-data-layer").toggleClass("debug-high-contrast");
    }

    let loadingCanvases = Object.fromEntries(
      Object.entries(self.overlayCanvases).filter(
        ([key, value]) => value.loaded === false
      )
    );
    //console.log("showDataMarker", loadingCanvases);
    if (
      self.props.dataOverlaysEnabled &&
      e.target._map &&
      Object.entries(loadingCanvases).length === 0
    )
      self.getPixelData(e);
  }

  allDataLayersLoaded() {
    return Object.fromEntries(Object.entries(obj).filter(predicate));
  }
  setupDataLayer() {
    let self = this;
    //console.log("setupDataLayer#1", self);
    if (self.props.dataOverlaysEnabled) {
      self.overlayCanvases = [];
      self.props.dataOverlays.forEach(anOverlay => {
        //console.log("setupDataLayer#2", anOverlay.type, self.overlayCanvases[anOverlay.type]);
        if (!self.overlayCanvases[anOverlay.type]) {
          self.overlayCanvases[anOverlay.type] = {
            canvas: document.createElement("canvas"),
            loaded: false
          };
          let img = new Image();
          img.crossOrigin = "anonymous";
          self.overlayCanvases[
            anOverlay.type
          ].canvas.ctx = self.overlayCanvases[anOverlay.type][
            "canvas"
          ].getContext("2d");
          img.onload = function() {
            // data files have 1/2 the size
            self.overlayCanvases[anOverlay.type].canvas.width =
              this.naturalWidth * 2;
            self.overlayCanvases[anOverlay.type].canvas.height =
              this.naturalHeight * 2;

            self.overlayCanvases[anOverlay.type].canvas.ctx.drawImage(
              this,
              0,
              0
            );
            self.overlayCanvases[anOverlay.type].canvas.ctx.drawImage(
              this,
              0,
              0,
              this.width * 2,
              this.height * 2
            );
            self.overlayCanvases[anOverlay.type]["loaded"] = true;
          };
          //console.log("setupDataLayer #3 png", this.props.overlay + ".png");
          img.src = this.props.overlay + ".png";
        }
      });
    }
  }

  render() {
    let overlays = [];
    let self = this;
    if (this.props.overlay) {
      //console.log("this.props.item.layer.overlay", this.props);
      //const mapMinZoom = config.map.initOptions.minZoom;
      //const mapMaxZoom = config.map.initOptions.maxZoom;

      //console.log("wather-map->render xxx1:", this.props.overlay);
      if (this.props.overlay) {
        if (this.props.debug)
          overlays.push(
            <ImageOverlay
              key="data-image"
              className={["leaflet-image-layer", "map-data-layer", "hide"].join(
                " "
              )}
              url={this.props.overlay + ".png"}
              opacity={1}
              bounds={config.weathermaps.settings.bbox}
              attribution="Show datalayer with CTRL+Click"
              onClick={self.showDataMarker}
              interactive={true}
            />
          );
        overlays.push(
          <ImageOverlay
            key="background-map"
            className={["leaflet-image-layer", "map-info-layer"].join(" ")}
            style={
              this.props.dataOverlaysEnabled ? { cursor: "crosshair" } : {}
            }
            url={this.props.overlay + ".gif"}
            opacity={Base.checkBlendingSupport() ? 1 : 0.5}
            bounds={config.weathermaps.settings.bbox}
            interactive={true}
            attribution={
              self.props.debug ? "Show datalayer with CTRL+Click" : null
            }
            onClick={self.showDataMarker}
            //onMouseover={self.showDataMarker}
            onLoad={() => {
              //console.log("background eee", "load");
              this.setupDataLayer();
              this.props.playerCB("background", "load");
            }}
            onError={err => {
              //console.log("background eee", "error");
              this.props.playerCB("background", err);
            }}
            bindPopup
          />
        );
        //console.log("background eeee", "loading");
        this.props.playerCB("background", "loading");
      }
    }
    if (this.state.dataMarker) overlays.push(this.state.dataMarker);

    return (
      <>
        <style>{css}</style>
        {overlays}
      </>
    );
  }
}
