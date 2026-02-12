import React, { useMemo, useState } from "react";
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

function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.call(args), wait);
  };
}

const DataOverlay = ({ playerCB }) => {
  const intl = useIntl();

  const parentMap = useMap();

  const [dataMarker, setDataMarker] = useState<React.ReactElement<
    typeof StationMarker
  > | null>();
  const [directionMarkers, setDirectionMarkers] =
    useState<React.ReactElement<typeof StationMarker>[]>();

  const domainId = useStore(store.domainId);
  const currentTime = useStore(store.currentTime);
  const domainConfig = useStore(store.domainConfig);
  const overlayURLs = useStore(store.overlayURLs);
  const dataOverlays = useStore(store.dataOverlays);
  const dataOverlaysEnabled = true;

  const getLayerPixelAtLatLng = (
    overlay: L.ImageOverlay,
    latlng: L.LatLngLiteral
  ): { x: number; y: number } => {
    const map = parentMap;
    const element = overlay.getElement() as HTMLImageElement;
    const bounds = overlay.getBounds();
    const xY = element.naturalWidth / element.width;
    const yY = element.naturalHeight / element.height;
    const dx = map.project(latlng).x - map.project(bounds.getSouthWest()).x;
    const dy = map.project(latlng).y - map.project(bounds.getNorthEast()).y;
    return { x: Math.round(xY * dx), y: Math.round(yY * dy) };
  };

  const getColor = (value: number | null): number[] => {
    const v = parseFloat(value);
    const colors = Object.values(domainConfig.colors);
    const idx = domainConfig.thresholds.findLastIndex(tr => v > tr);
    return colors[idx >= 0 ? idx + 1 : 0];
  };

  const getPixelData = async (coordinates: {
    x: number;
    y: number;
  }): Promise<{ value: number | null; direction: number | null }> => {
    const values = {} as Record<OverlayType, number | null>;
    for (const dataOverlay of dataOverlays) {
      const type = dataOverlay.type as OverlayType;
      values[type] = await dataOverlay.valueForPixel(coordinates);
    }

    return {
      value:
        values.temperature ??
        values.windSpeed ??
        values.snowHeight ??
        values.snowLine,
      direction: values.windDirection
    };
  };

  const showDataMarker = async (e: L.LeafletMouseEvent) => {
    if (store.config.settings.debugModus && e.originalEvent.ctrlKey) {
      [...document.getElementsByClassName("map-data-layer")].forEach(e => {
        e.classList.toggle("hide");
        e.classList.toggle("debug-high-contrast");
      });
    }

    if (dataOverlaysEnabled && parentMap) {
      const coordinates = getLayerPixelAtLatLng(e.target, e.latlng);
      const pixelData = await getPixelData(coordinates);
      setDataMarker(
        <StationMarker
          type="station"
          dataType="forecast"
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
          layerContainer={parentMap}
        />
      );
    }
  };

  const addDirectionIndicators = async (directionOverlay: L.ImageOverlay) => {
    const windDirection = dataOverlays.find(o => o.type === "windDirection");
    if (!windDirection) {
      setDirectionMarkers([]);
      return;
    }
    const map = parentMap;
    const curZoom = map.getZoom();
    const grids = Math.max(4, Math.round((curZoom - map._layersMinZoom) * 8));
    const bounds = store.config.settings.bbox;
    const markers: React.ReactElement<typeof StationMarker>[] = [];
    if (!dataOverlaysEnabled) {
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
        const direction = await windDirection.valueForPixel(pixelPos);
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
            direction={direction}
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
          key={"data-image-" + overlayURLs[0]}
          className="leaflet-image-layer map-data-layer hide"
          url={overlayURLs[0]}
          errorOverlayUrl={overlayURLs[1]}
          opacity={1}
          bounds={store.config.settings.bbox}
          attribution={
            store.config.settings.debugModus
              ? intl.formatMessage({ id: "weathermap:attribution" })
              : null
          }
          eventHandlers={{
            click: e => showDataMarker(e)
          }}
          interactive={true}
        />
      );

      overlays.push(
        <ImageOverlay
          key={"background-map-" + overlayURLs[0]}
          className="leaflet-image-layer map-info-layer"
          style={dataOverlaysEnabled ? { cursor: "crosshair" } : {}}
          url={overlayURLs[0]}
          errorOverlayUrl={overlayURLs[1]}
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
              setDirectionMarkers([]);
              const overlay = e.target as L.ImageOverlay;
              addDirectionIndicators(overlay);
              parentMap.on(
                "zoomend",
                debounce(() => addDirectionIndicators(overlay), 500)
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
  }, [domainId, dataOverlays, overlayURLs]);

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
