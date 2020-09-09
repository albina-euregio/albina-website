import React from "react";
import { ImageOverlay } from "react-leaflet";
import Base from "../../base";

export default class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.dataCanvas;
    this.dataCanvasCtx;
  }

  render() {
    let overlays = [];
    let self = this;
    if (this.props.overlay) {
      console.log("this.props.item.layer.overlay", this.props);
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
              let overlay = e.target;
              if (map) {
                console.log("YYYYY GETPIXEL", e.containerPoint);
                function getPixelData() {
                  if (!self.dataCanvasCtx) return;

                  let xY =
                    overlay.getElement().naturalWidth /
                    overlay.getElement().width;
                  let yY =
                    overlay.getElement().naturalHeight /
                    overlay.getElement().height;
                  let dx =
                    map.project(e.latlng).x -
                    map.project(overlay.getBounds()["_southWest"]).x;
                  let dy =
                    map.project(e.latlng).y -
                    map.project(overlay.getBounds()["_northEast"]).y;
                  let x = Math.round(xY * dx);
                  let y = Math.round(yY * dy);

                  let p = self.dataCanvasCtx.getImageData(x, y, 1, 1).data;
                  map.openPopup(
                    '<div style="background-color:rgb(' +
                      p[0] +
                      "," +
                      p[1] +
                      "," +
                      p[2] +
                      ')">' +
                      "<h3>PIXEL DATA</h3>" +
                      "<p> Image coords: " +
                      x +
                      "/" +
                      y +
                      "<br/> r: " +
                      p[0] +
                      "g: " +
                      p[1] +
                      "b: " +
                      p[2] +
                      // "<br/><br/>ContainerPoint:" +
                      // e.containerPoint +
                      // "<br/>LayerPoint:" +
                      // e.layerPoint +
                      // "<br/>latlng:" +
                      // e.latlng +
                      "<br/>Data–Canvas h/w: " +
                      self.dataCanvas.width +
                      "/" +
                      self.dataCanvas.height +
                      "</p>" +
                      "</div>",
                    e.latlng
                  );
                }
                if (!self.dataCanvas) {
                  self.dataCanvas = document.createElement("canvas");
                  let img = new Image();

                  img.crossOrigin = "anonymous";
                  self.dataCanvasCtx = self.dataCanvas.getContext("2d");
                  img.onload = function() {
                    // data files have 1/2 the size
                    self.dataCanvas.width = this.naturalWidth * 2;
                    self.dataCanvas.height = this.naturalHeight * 2;

                    self.dataCanvasCtx.drawImage(this, 0, 0);
                    self.dataCanvasCtx.drawImage(
                      this,
                      0,
                      0,
                      this.width * 2,
                      this.height * 2
                    );
                    getPixelData();
                  };
                  img.src = this.props.overlay + ".png";
                } else getPixelData();
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

    return <>{overlays}</>;
  }
}
