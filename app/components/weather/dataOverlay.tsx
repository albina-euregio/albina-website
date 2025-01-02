import React, { useEffect, useMemo, useState } from "react";
import { ImageOverlay, useMap } from "react-leaflet";
import StationMarker from "../leaflet/station-marker";
import { useIntl } from "../../i18n";
import * as store from "../../stores/weatherMapStore";
import { useStore } from "@nanostores/react";

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

const DataOverlay = ({ playerCB }) => {
  const intl = useIntl();

  const parentMap = useMap();

  const [dataMarker, setDataMarker] = useState(null);
  const [directionMarkers, setDirectionMarkers] = useState([]);
  const [directionOverlay, setDirectionOverlay] = useState(null);
  const [oCanvases, setOCanvases] = useState({});

  const domainId = useStore(store.domainId);
  const currentTime = useStore(store.currentTime);
  const domainConfig = useStore(store.domainConfig);
  const dataOverlays = domainConfig?.dataOverlays;
  const dataOverlaysEnabled =
    !domainConfig.layer.stations || currentTime > store.agl;

  useEffect(() => {
    setOCanvases({});
  }, [domainId, currentTime]);

  useEffect(() => {
    if (directionOverlay) addDirectionIndicators();
  }, [directionOverlay]);

  const getLayerPixelAtLatLng = (overlay, latlng) => {
    const map = overlay._map;
    let xY = overlay.getElement().naturalWidth / overlay.getElement().width;
    let yY = overlay.getElement().naturalHeight / overlay.getElement().height;
    let dx =
      map.project(latlng).x - map.project(overlay.getBounds()["_southWest"]).x;
    let dy =
      map.project(latlng).y - map.project(overlay.getBounds()["_northEast"]).y;
    return { x: Math.round(xY * dx), y: Math.round(yY * dy) };
  };

  const getColor = value => {
    const v = parseFloat(value);
    const colors = Object.values(domainConfig.colors);

    let color = colors[0];
    domainConfig.thresholds.forEach((tr, i) => {
      if (v > tr) {
        color = colors[i + 1];
      }
    });

    return color;
  };

  const getPixelData = coordinates => {
    let values = {};
    dataOverlays.forEach(anOverlay => {
      if (oCanvases[anOverlay.type]?.["loaded"]) {
        let p = oCanvases[anOverlay.type].canvas.ctx.getImageData(
          coordinates.x,
          coordinates.y,
          1,
          1,
          { willReadFrequently: true }
        );

        values[anOverlay.type] = store.valueForPixel(anOverlay.type, {
          r: p.data[0],
          g: p.data[1],
          b: p.data[2]
        });
      }
    });

    return {
      value:
        values.temperature ??
        values.windSpeed ??
        values.snowHeight ??
        values.snowLine,
      direction: values.windDirection
    };
  };

  const allCanvasesLoaded = () => {
    return Object.keys(oCanvases).every(key => oCanvases[key].loaded);
  };

  const showDataMarker = e => {
    if (store.config.settings.debugModus && e.originalEvent.ctrlKey) {
      [...document.getElementsByClassName("map-data-layer")].forEach(e => {
        e.classList.toggle("hide");
        e.classList.toggle("debug-high-contrast");
      });
    }

    if (dataOverlaysEnabled && e.target._map && allCanvasesLoaded()) {
      const pixelData = getPixelData(getLayerPixelAtLatLng(e.target, e.latlng));
      setDataMarker(
        <StationMarker
          type="station"
          dataType="forcast"
          key={"dataMarker" + e.latlng}
          itemId="dataMarker"
          iconAnchor={[12.5, 12.5]}
          data={{}}
          stationId="dataMarker"
          stationName="dataMarker"
          coordinates={e.latlng}
          color={getColor(pixelData.value)}
          value={pixelData.value}
          direction={pixelData.direction}
          layerContainer={e.target._map}
        />
      );
    }
  };

  const setupDataLayer = e => {
    const overlayCanvases = oCanvases;
    setDirectionOverlay(null);
    if (dataOverlaysEnabled) {
      dataOverlays.forEach(anOverlay => {
        if (!overlayCanvases[anOverlay.type]) {
          overlayCanvases[anOverlay.type] = {
            canvas: document.createElement("canvas"),
            loaded: false
          };

          let overlayFile = store.getOverlayFileName(
            anOverlay.filePostfix,
            anOverlay?.domain
          );

          let img = new Image();
          img.crossOrigin = "anonymous";
          overlayCanvases[anOverlay.type].canvas.ctx =
            overlayCanvases[anOverlay.type]["canvas"].getContext("2d");
          var domPoint = document.getElementsByClassName(
            "leaflet-overlay-pane"
          );

          img.onload = function () {
            overlayCanvases[anOverlay.type].canvas.width =
              this.naturalWidth * 2;
            overlayCanvases[anOverlay.type].canvas.height =
              this.naturalHeight * 2;

            overlayCanvases[anOverlay.type].canvas.ctx.drawImage(this, 0, 0);
            overlayCanvases[anOverlay.type].canvas.ctx.drawImage(
              this,
              0,
              0,
              this.width * 2,
              this.height * 2
            );
            overlayCanvases[anOverlay.type]["loaded"] = true;

            if (allCanvasesLoaded()) {
              if (overlayCanvases["windDirection"]) {
                setDirectionOverlay(e.target);
              }
              playerCB("background", "load");
            }
          };

          if (anOverlay.fixPath)
            overlayFile = overlayFile.replace(
              RegExp(anOverlay.fixPath.find, "g"),
              anOverlay.fixPath.replace
            );

          img.src = overlayFile;
        }
      });
    } else playerCB("background", "load");

    setOCanvases(overlayCanvases);
  };

  const addDirectionIndicators = () => {
    if (!directionOverlay) return;
    const map = parentMap;
    const curZoom = map.getZoom();
    let grids = Math.max(4, Math.round((curZoom - map._layersMinZoom) * 8));
    const bounds = store.config.settings.bbox;
    let markers = [];

    if (dataOverlaysEnabled) {
      const foundOverlays = dataOverlays.filter(element => {
        return ["windDirection"].includes(element.type);
      });
      if (foundOverlays) {
        const WEST = bounds[0][1];
        const SOUTH = bounds[0][0];
        const EAST = bounds[1][1];
        const NORTH = bounds[1][0];
        const DIST_H = (EAST - WEST) / grids;
        const DIST_V = (NORTH - SOUTH) / grids;
        let curH = WEST + DIST_H;

        while (curH < EAST - 0.001) {
          let curV = SOUTH + DIST_V;
          while (curV < NORTH - 0.001) {
            const pixelPos = getLayerPixelAtLatLng(directionOverlay, {
              lat: curV,
              lng: curH
            });
            const pixelData = getPixelData(pixelPos);
            markers.push(
              <StationMarker
                type="grid"
                dataType="noCircle"
                key={
                  "pos-" + curV + "_" + curH + "_" + currentTime + "_" + curZoom
                }
                itemId="directionMarker"
                iconAnchor={[12, 12]}
                data={{}}
                stationId="directionMarker"
                stationName="directionMarker"
                coordinates={[curV, curH]}
                color={[255, 0, 0]}
                value={null}
                direction={pixelData.direction}
              />
            );
            curV += DIST_V;
          }
          curH += DIST_H;
        }
      }
    }
    setDirectionMarkers(markers);
  };

  const overlays = useMemo(() => {
    let overlays = [];
    if (domainId) {
      overlays.push(
        <ImageOverlay
          key="data-image"
          className={["leaflet-image-layer", "map-data-layer", "hide"].join(
            " "
          )}
          url={store.getOverlayFileName()}
          opacity={1}
          bounds={store.config.settings.bbox}
          attribution={intl.formatMessage({
            id: "weathermap:attribution"
          })}
          eventHandlers={{
            click: showDataMarker.bind(this)
          }}
          interactive={true}
        />
      );

      overlays.push(
        <ImageOverlay
          key="background-map"
          className={["leaflet-image-layer", "map-info-layer"].join(" ")}
          style={dataOverlaysEnabled ? { cursor: "crosshair" } : {}}
          url={store.getOverlayFileName()}
          opacity={1}
          bounds={store.config.settings.bbox}
          interactive={true}
          attribution={
            store.config.settings.debugModus
              ? intl.formatMessage({ id: "weathermap:attribution" })
              : null
          }
          eventHandlers={{
            click: showDataMarker,
            load: e => {
              setDataMarker(null);
              setDirectionMarkers(null);
              setupDataLayer(e);
              e.target._map.on("zoomend", e => {
                addDirectionIndicators(e);
              });
              if (!dataMarker && !directionMarkers)
                playerCB("background", "load");
            },
            error: err => {
              if (!dataMarker && !directionMarkers) playerCB("background", err);
            }
          }}
          bindPopup
        />
      );
      playerCB("background", "loading");
    }

    return overlays;
  }, [domainId, oCanvases]);

  return (
    <>
      {store.config.settings.debugModus && <style>{css}</style>}
      {overlays}
      {dataMarker}
      {directionMarkers}
    </>
  );
};

export default DataOverlay;
