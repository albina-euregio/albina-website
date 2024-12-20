import React, { useEffect, useState, useMemo } from "react";
import { ImageOverlay } from "react-leaflet";
import StationMarker from "../leaflet/station-marker";
import { useMap } from "react-leaflet";
import { useIntl } from "../../i18n";

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
const DataOverlay = ({
  domainId,
  overlay,
  dataOverlays,
  item,
  rgbToValue,
  debug,
  dataOverlaysEnabled,
  playerCB,
  currentTime,
  dataOverlayFilePostFix
}) => {
  const intl = useIntl();

  console.log("dataOverlay->start xxx1", overlay);

  const parentMap = useMap();

  const [dataMarker, setDataMarker] = useState(null);
  //const [showDataLayer, setShowDataLayer] = useState(false);
  const [directionMarkers, setDirectionMarkers] = useState([]);
  const [directionOverlay, setDirectionOverlay] = useState(null);
  const [oCanvases, setOCanvases] = useState({});
  const [lastUpdateOverlays, setLastUpdateOverlays] = useState({});

  useEffect(() => {
    setOCanvases({});
  }, [overlay]);

  const getLayerPixelAtLatLng = (overlay, latlng) => {
    //console.log("getLayerPixelAtLatLng", overlay._map, parentMap);
    //const self = this;
    const map = overlay._map;
    let xY = overlay.getElement().naturalWidth / overlay.getElement().width;
    let yY = overlay.getElement().naturalHeight / overlay.getElement().height;
    let dx =
      map.project(latlng).x - map.project(overlay.getBounds()["_southWest"]).x;
    let dy =
      map.project(latlng).y - map.project(overlay.getBounds()["_northEast"]).y;
    //console.log("getClickedPixel", {"xY": xY, "yY": yY, "SWx": map.project(overlay.getBounds()["_southWest"]).x, "NEy": map.project(overlay.getBounds()["_northEast"]).y});
    return { x: Math.round(xY * dx), y: Math.round(yY * dy) };
  };

  const getColor = value => {
    const v = parseFloat(value);
    const colors = Object.values(item.colors);

    let color = colors[0];
    item.thresholds.forEach((tr, i) => {
      if (v > tr) {
        color = colors[i + 1];
      }
    });

    return color;
  };

  const getPixelData = coordinates => {
    let values = {};
    dataOverlays.forEach(anOverlay => {
      //console.log("getPixelData t01", coordinates, oCanvases[anOverlay.type], anOverlay.type);
      if (oCanvases[anOverlay.type]?.["loaded"]) {
        let p = oCanvases[anOverlay.type].canvas.ctx.getImageData(
          coordinates.x,
          coordinates.y,
          1,
          1,
          { willReadFrequently: true }
        );
        //if(anOverlay.type === "windDirection" && values[anOverlay.type] === null) console.log("getPixelData eee #5", coordinates, values[anOverlay.type], p)

        values[anOverlay.type] = rgbToValue(anOverlay.type, {
          r: p.data[0],
          g: p.data[1],
          b: p.data[2]
        });

        // console.log(
        //   "pixelData #3 p",
        //   p?.data, oCanvases[anOverlay.type].canvas.ctx
        // );

        // console.log(
        //   "pixelData t01",
        //   anOverlay.type,
        //   p.data,
        //   oCanvases[anOverlay.type]
        // );

        // if (debug) {
        //   for (var y = 0; y < p.height; y++) {
        //     for (var x = 0; x < p.width; x++) {
        //       p.data[4 * (y * p.width + x)] = 255;
        //       p.data[4 * (y * p.width + x) + 1] = 0;
        //       p.data[4 * (y * p.width + x) + 2] = 0;
        //       p.data[4 * (y * p.width + x) + 3] = 255;
        //     }
        //   }
        //   // indicate clicked position with red dot
        //   oCanvases[anOverlay.type].canvas.ctx.putImageData(
        //     p,
        //     coordinates.x,
        //     coordinates.y
        //   );
        //   $(".map-data-layer").attr(
        //     "src",
        //     overlayCanvases[anOverlay.type].canvas.toDataURL()
        //   );
        // }
      }
    });

    // console.log(
    //   "pixelData #4", values
    // );

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
    //console.log("dataOverlay->allCanvasesLoaded xxx2", oCanvases);

    return Object.keys(oCanvases).every(key => oCanvases[key].loaded);
  };

  const showDataMarker = e => {
    //console.log('dataOverlay->showDataMarker', {debug, ctrlKey: e.originalEvent.ctrlKey, overlays: document.getElementsByClassName("map-data-layer")} );

    if (debug && e.originalEvent.ctrlKey) {
      [...document.getElementsByClassName("map-data-layer")].forEach(e => {
        e.classList.toggle("hide");
        e.classList.toggle("debug-high-contrast");
      });
    }

    if (dataOverlaysEnabled && e.target._map && allCanvasesLoaded()) {
      const pixelData = getPixelData(getLayerPixelAtLatLng(e.target, e.latlng));
      // console.log(
      //   "dataOverlay->showDataMarker",
      //   e.target,
      //   allCanvasesLoaded(),
      //   dataOverlaysEnabled,
      //   pixelData
      // );
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
    console.log("dataOverlay->setupDataLayer#1 t02");

    const overlayCanvases = oCanvases;
    setDirectionOverlay(null);
    if (dataOverlaysEnabled) {
      dataOverlays.forEach(anOverlay => {
        console.log("setupDataLayer#2 yyy2", {
          overlay: overlay,
          filepaht: anOverlay.filePostfix
        });
        if (!overlayCanvases[anOverlay.type]) {
          overlayCanvases[anOverlay.type] = {
            canvas: document.createElement("canvas"),
            loaded: false
          };
          //console.log("setupDataLayer#3 jjj1", anOverlay.type, overlayCanvases[anOverlay.type].loaded);
          let overlayFile = overlay
            .replaceAll("%%DOMAIN%%", anOverlay?.domain || domainId)
            .replaceAll(
              "%%FILE%%",
              anOverlay.filePostfix.replaceAll(
                "%%DOMAIN%%",
                anOverlay?.domain || domainId
              )
            );
          console.log("setupDataLayer xxxx", {
            overlayFile,
            filepaht: anOverlay.filePostfix,
            domainId
          });

          let img = new Image();
          img.crossOrigin = "anonymous";
          overlayCanvases[anOverlay.type].canvas.ctx =
            overlayCanvases[anOverlay.type]["canvas"].getContext("2d");
          var domPoint = document.getElementsByClassName(
            "leaflet-overlay-pane"
          );

          img.onload = function () {
            //console.log("setupDataLayer->onload jjj", anOverlay.type);

            //domPoint?.[0].appendChild(overlayCanvases[anOverlay.type].canvas);

            // data files have 1/2 the size
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
            //console.log("setupDataLayer#3-1 jjj1 direction loaded", anOverlay.type, overlayCanvases, overlayCanvases.filter(canvas => !canvas.loaded));
            //console.log("dataOverlay->setupDataLayer xxx2", overlayCanvases);

            if (allCanvasesLoaded()) {
              //console.log("setupDataLayer #4 ALL LOADED S06", playerCB);
              if (overlayCanvases["windDirection"]) {
                setDirectionOverlay(e.target);
                addDirectionIndicators();
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
    //console.log("addDirectionIndicators jjj", curZoom, map._layersMinZoom, grids);
    const bounds = config.weathermaps.settings.bbox;
    let markers = [];

    if (dataOverlaysEnabled) {
      const foundOverlays = dataOverlays.filter(element => {
        //console.log("addDirectionIndicators eee element", element.type);
        return ["windDirection"].includes(element.type);
      });
      //console.log("addDirectionIndicators #2 jjj", foundOverlays);
      if (foundOverlays) {
        //foundOverlays.forEach(anOverlay => {
        const WEST = bounds[0][1];
        const SOUTH = bounds[0][0];
        const EAST = bounds[1][1];
        const NORTH = bounds[1][0];
        const DIST_H = (EAST - WEST) / grids;
        const DIST_V = (NORTH - SOUTH) / grids;
        let curH = WEST + DIST_H;

        //console.log("addDirectionIndicators eee #3", WEST, DIST_H, curH + "<" + EAST, NORTH);
        while (curH < EAST - 0.001) {
          let curV = SOUTH + DIST_V;
          //console.log("addDirectionIndicators eee #4", WEST, curH + "<" + EAST, NORTH, DIST_V, curV + "<" + NORTH);
          while (curV < NORTH - 0.001) {
            //console.log("addDirectionIndicators eee #5", WEST, DIST_H, curH + "<" + EAST, NORTH, DIST_V, curV + "<" + NORTH);
            //console.log("addDirectionIndicators eee #2", self, [curV, curH]);
            const pixelPos = getLayerPixelAtLatLng(directionOverlay, {
              lat: curV,
              lng: curH
            });
            const pixelData = getPixelData(pixelPos);
            //console.log("addDirectionIndicators eee #5", curH, curV, pixelPos, pixelData);
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
        //});
      }
    }
    //console.log("addDirectionIndicators eee #6", markers);
    setDirectionMarkers(markers);
  };
  //console.log('dataOverlay->render #1 xxx1');

  const overlays = useMemo(() => {
    //console.log("dataOverlay->useMemo t02", dataMarker);
    let overlays = [];
    if (overlay) {
      //console.log("dataOverlay->render s06", props);
      //const mapMinZoom = config.map.initOptions.minZoom;
      //const mapMaxZoom = config.map.initOptions.maxZoom;

      //console.log("overlay->render xxx1:", debug);
      if (overlay) {
        let usedDataOverlayFilePostFix =
          item?.dataOverlayFilePostFixOverride?.main ||
          dataOverlayFilePostFix.main;
        console.log("dataOverlay->render #1 xxx33", {
          overlay,
          usedDataOverlayFilePostFix
        });
        if (debug) usedDataOverlayFilePostFix = dataOverlayFilePostFix?.debug;
        overlays.push(
          <ImageOverlay
            key="data-image"
            className={["leaflet-image-layer", "map-data-layer", "hide"].join(
              " "
            )}
            url={overlay
              .replaceAll("%%DOMAIN%%", domainId)
              .replaceAll(
                "%%FILE%%",
                usedDataOverlayFilePostFix.replaceAll("%%DOMAIN%%", domainId)
              )}
            opacity={1}
            bounds={config.weathermaps.settings.bbox}
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
            url={overlay
              .replaceAll("%%DOMAIN%%", domainId)
              .replaceAll(
                "%%FILE%%",
                usedDataOverlayFilePostFix.replaceAll("%%DOMAIN%%", domainId)
              )}
            opacity={1}
            bounds={config.weathermaps.settings.bbox}
            interactive={true}
            attribution={
              debug
                ? intl.formatMessage({ id: "weathermap:attribution" })
                : null
            }
            //onClick={()=>console.log('dataOverlay->click')}
            eventHandlers={{
              click: showDataMarker,
              load: e => {
                //console.log("background jjj", "load", e.target._map);
                setDataMarker(null);
                setDirectionMarkers(null);
                //console.log("background yyy2", "load");
                setupDataLayer(e);
                e.target._map.on("zoomend", e => {
                  //console.log("onZoomed eee", e);
                  addDirectionIndicators(e);
                });
                //console.log("dataOverlay background LOADED s07");
                if (!dataMarker && !directionMarkers)
                  playerCB("background", "load");
              },
              error: err => {
                //console.log("dataOverlay background ERROR s06");
                if (!dataMarker && !directionMarkers)
                  playerCB("background", err);
              }
            }}
            bindPopup
          />
        );
        // console.log(
        //   "dataOverlay background s071",
        //   "loading",
        //   dataMarker
        // );
        playerCB("background", "loading");
      }
    }

    return overlays;
  }, [overlay, oCanvases]);

  //console.log('dataOverlay->render xxx1', overlays );

  return (
    <>
      <style>{css}</style>
      {overlays}
      {dataMarker}
      {directionMarkers}
    </>
  );
};

export default DataOverlay;
