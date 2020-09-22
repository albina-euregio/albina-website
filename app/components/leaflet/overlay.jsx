import React from "react";
import { ImageOverlay } from "react-leaflet";
import StationMarker from "../leaflet/station-marker";
import Base from "../../base";

export default class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.overlayCanvases = {};
    this.state = { dataMarker: null };
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
    console.log("setDataMarker jjj", data);
    this.setState({
      dataMarker: (
        <StationMarker
          type="station"
          dataType="forcast"
          key="dataMarker"
          itemId="dataMarker"
          iconAnchor={[12, 12]}
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

  render() {
    let overlays = [];
    let self = this;
    if (this.props.overlay) {
      //console.log("this.props.item.layer.overlay", this.props);
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
              if (self.props.dataOverlaysEnabled && e.target._map) {
                let map = e.target._map;
                //console.log("YYYYY GETPIXEL", e.containerPoint);
                function getPixelData() {
                  let pixel = self.getClickedPixel(e);

                  let values = {};
                  self.props.dataOverlays.forEach(anOverlay => {
                    if (self.overlayCanvases[anOverlay.type]["loaded"]) {
                      let p = self.overlayCanvases[anOverlay.type][
                        "ctx"
                      ].getImageData(pixel.x, pixel.y, 1, 1).data;
                      values[anOverlay.type] = self.props.rgbToValue(
                        anOverlay.type,
                        {
                          r: p[0],
                          g: p[1],
                          b: p[2]
                        }
                      );
                    }
                  });
                  //console.log("overclick jjj", values);

                  self.setDataMarker({
                    coordinates: e.latlng,
                    value:
                      values.temperature ||
                      values.windSpeed ||
                      values.snowHeight,
                    direction: values.windDirection
                  });
                }

                let allLoaded = true;
                self.props.dataOverlays.forEach(anOverlay => {
                  if (!self.overlayCanvases[anOverlay.type]) {
                    self.overlayCanvases[anOverlay.type] = {
                      canvas: document.createElement("canvas"),
                      loaded: false
                    };
                    let img = new Image();
                    img.crossOrigin = "anonymous";
                    self.overlayCanvases[anOverlay.type][
                      "ctx"
                    ] = self.overlayCanvases[anOverlay.type][
                      "canvas"
                    ].getContext("2d");
                    img.onload = function() {
                      // data files have 1/2 the size
                      self.overlayCanvases[anOverlay.type]["canvas"].width =
                        this.naturalWidth * 2;
                      self.overlayCanvases[anOverlay.type]["canvas"].height =
                        this.naturalHeight * 2;

                      self.overlayCanvases[anOverlay.type]["ctx"].drawImage(
                        this,
                        0,
                        0
                      );
                      self.overlayCanvases[anOverlay.type]["ctx"].drawImage(
                        this,
                        0,
                        0,
                        this.width * 2,
                        this.height * 2
                      );
                      self.overlayCanvases[anOverlay.type]["loaded"] = true;
                      getPixelData(e);
                    };
                    img.src = this.props.overlay + ".png";
                  } else if (!self.overlayCanvases[anOverlay.type]["loaded"])
                    allLoaded = false;
                });

                if (allLoaded) getPixelData(e);
              }
            }}
            onLoad={() => {
              this.props.playerCB("background", "load");
            }}
            onError={err => {
              this.props.playerCB("background", err);
            }}
            bindPopup
          />
        );
        this.props.playerCB("background", "loading");
      }
    }
    if (this.state.dataMarker) overlays.push(this.state.dataMarker);

    return <>{overlays}</>;
  }
}
