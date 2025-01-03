import React, { useEffect, useMemo, useState } from "react";
import { ImageOverlay, useMap } from "react-leaflet";
import StationMarker from "../leaflet/station-marker";
import { useIntl } from "../../i18n";
import * as store from "../../stores/weatherMapStore";
import { useStore } from "@nanostores/react";
import { OverlayType } from "../../stores/weatherMapStore";

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
  const [oCanvases, setOCanvases] = useState(
    {} as Record<
      OverlayType,
      {
        currentTime: Date | null;
        absTimeSpan: number;
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        loaded: boolean;
      }
    >
  );

  const domainId = useStore(store.domainId);
  const currentTime = useStore(store.currentTime);
  const domainConfig = useStore(store.domainConfig);
  const absTimeSpan = useStore(store.absTimeSpan);
  const overlayFileName = useStore(store.overlayFileName);
  const dataOverlays = useStore(store.dataOverlays);
  const dataOverlaysEnabled =
    !domainConfig.layer.stations || currentTime > store.agl;

  useEffect(() => {
    setOCanvases({});
  }, [domainId, currentTime]);

  useEffect(() => {
    if (directionOverlay) addDirectionIndicators();
  }, [directionOverlay]);

  const getLayerPixelAtLatLng = (
    overlay: L.ImageOverlay,
    latlng: L.LatLngLiteral
  ) => {
    const map = overlay._map as L.Map;
    const element = overlay.getElement()!;
    const bounds = overlay.getBounds();
    const xY = element.naturalWidth / element.width;
    const yY = element.naturalHeight / element.height;
    const dx = map.project(latlng).x - map.project(bounds.getSouthWest()).x;
    const dy = map.project(latlng).y - map.project(bounds.getNorthEast()).y;
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

  const getPixelData = (coordinates: { x: number; y: number }) => {
    const values = {} as Record<OverlayType, number | null | undefined>;
    dataOverlays.forEach(anOverlay => {
      const type = anOverlay.type as OverlayType;
      const oCanvas = oCanvases[type];
      if (oCanvas.loaded) {
        const p = oCanvas.ctx.getImageData(coordinates.x, coordinates.y, 1, 1, {
          willReadFrequently: true
        });

        values[type] = store.valueForPixel(type, {
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

  const showDataMarker = (e: L.LeafletMouseEvent) => {
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

  const setupDataLayer = (e: L.LeafletEvent) => {
    setDirectionOverlay(null);
    if (!dataOverlaysEnabled) {
      playerCB("background", "load");
      return;
    }
    const overlayCanvases = oCanvases;
    dataOverlays.forEach(anOverlay => {
      const type = anOverlay.type as OverlayType;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      overlayCanvases[type] = {
        currentTime,
        absTimeSpan,
        canvas,
        ctx,
        loaded: false
      };
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = img.naturalWidth * 2;
        canvas.height = img.naturalHeight * 2;
        ctx.drawImage(img, 0, 0);
        ctx.drawImage(img, 0, 0, img.width * 2, img.height * 2);
        overlayCanvases[type].loaded = true;

        if (allCanvasesLoaded()) {
          if (overlayCanvases.windDirection) {
            setDirectionOverlay(e.target);
          }
          playerCB("background", "load");
        }
      };
      img.src = anOverlay.overlayFilename;
    });
    setOCanvases(overlayCanvases);
  };

  const addDirectionIndicators = () => {
    if (!directionOverlay) return;
    const map = parentMap;
    const curZoom = map.getZoom();
    const grids = Math.max(4, Math.round((curZoom - map._layersMinZoom) * 8));
    const bounds = store.config.settings.bbox;
    const markers = [];
    if (!dataOverlaysEnabled) {
      return;
    }
    const foundOverlays = dataOverlays.filter(element => {
      return ["windDirection"].includes(element.type);
    });
    if (!foundOverlays) {
      return;
    }
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
            key={"pos-" + curV + "_" + curH + "_" + currentTime + "_" + curZoom}
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
    setDirectionMarkers(markers);
  };

  const overlays = useMemo(() => {
    const overlays = [];
    if (domainId) {
      overlays.push(
        <ImageOverlay
          key="data-image"
          className={["leaflet-image-layer", "map-data-layer", "hide"].join(
            " "
          )}
          url={overlayFileName}
          opacity={1}
          bounds={store.config.settings.bbox}
          attribution={intl.formatMessage({
            id: "weathermap:attribution"
          })}
          eventHandlers={{
            click: e => showDataMarker(e)
          }}
          interactive={true}
        />
      );

      overlays.push(
        <ImageOverlay
          key="background-map"
          className={["leaflet-image-layer", "map-info-layer"].join(" ")}
          style={dataOverlaysEnabled ? { cursor: "crosshair" } : {}}
          url={overlayFileName}
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
              (e.target._map as L.Map).on("zoomend", () =>
                addDirectionIndicators()
              );
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
  }, [domainId, dataOverlays, overlayFileName]);

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
