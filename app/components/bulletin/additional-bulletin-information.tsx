import React, { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import WeatherStationDialog, { useStationId } from "../station/station-dialog";
import { useStationData } from "../../stores/stationDataStore";
import { microRegionBounds } from "../../stores/microRegions";
import { FormattedMessage, useIntl } from "../../i18n";
import { MAPLIBRE_STYLE } from "../maplibre/maplibre-style";
import { Bulletin } from "../../stores/bulletin/CAAMLv6";
import { fetchJSON } from "../../util/fetch.ts";
import Modal from "../dialogs/albina-modal.tsx";

const STATION_COLOR = "rgb(100, 100, 100)";
const OBSERVATION_COLOR = "rgb(200, 100, 100)";

const STATIONS_SOURCE = "stations";
const STATIONS_LAYER = "stations-circles";
const OBSERVATIONS_SOURCE = "observations";
const OBSERVATIONS_LAYER = "observations-circles";

/**
 * Validates that coordinates are valid numbers and not NaN
 */
function isValidCoordinates(lat: unknown, lng: unknown): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    isFinite(lat) &&
    isFinite(lng)
  );
}

interface Props {
  date: Temporal.PlainDate;
  bulletin: Bulletin;
  region: string;
}

interface Observation {
  $id: string;
  $externalURL: string;
  latitude: number;
  longitude: number;
  eventDate: string;
  locationName: string;
  authorName: string;
}

function isObservation(value: unknown): value is Observation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const observation = value as Record<string, unknown>;
  return (
    typeof observation.$id === "string" &&
    typeof observation.$externalURL === "string" &&
    typeof observation.latitude === "number" &&
    typeof observation.longitude === "number" &&
    typeof observation.eventDate === "string" &&
    typeof observation.locationName === "string" &&
    typeof observation.authorName === "string"
  );
}

function useWeatherStations() {
  const [stationId, setStationId] = useStationId();
  const { data, loadStationData } = useStationData("microRegion");
  useEffect(() => void loadStationData(), [loadStationData]);

  const stationFeatures = useMemo(
    (): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
      type: "FeatureCollection",
      features: data
        .filter(station =>
          isValidCoordinates(
            station.geometry.coordinates[1],
            station.geometry.coordinates[0]
          )
        )
        .map(station => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              station.geometry.coordinates[0],
              station.geometry.coordinates[1]
            ]
          },
          properties: {
            id: String(station.id),
            tooltip: station.name
          }
        }))
    }),
    [data]
  );

  return { data, stationFeatures, stationId, setStationId };
}

function useObservations() {
  const intl = useIntl();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [observation, setObservation] = useState<string>("");

  async function loadObservations() {
    const snobs = await fetchJSON<unknown>(
      "https://static.avalanche.report/snobs.json"
    );
    const observationsList = Array.isArray(snobs)
      ? snobs.filter(isObservation)
      : [];
    setObservations(
      observationsList.filter(observation =>
        isValidCoordinates(observation.latitude, observation.longitude)
      )
    );
  }

  const observationFeatures = useMemo(
    (): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
      type: "FeatureCollection",
      features: observations.map(observation => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [observation.longitude, observation.latitude]
        },
        properties: {
          url: observation.$externalURL,
          tooltip: [
            intl.formatDate(observation.eventDate),
            observation.locationName,
            observation.authorName
          ].join("<br>")
        }
      }))
    }),
    [observations, intl]
  );

  return {
    observationFeatures,
    observation,
    setObservation,
    loadObservations
  };
}

/**
 * Mini map (MapLibre GL) showing the micro-region's weather stations and
 * observations as colored circle markers over the shared raster basemap
 * (MAPLIBRE_STYLE). Hovering a marker shows a tooltip; clicking a station opens
 * its diagrams, clicking an observation opens its external page. The two layers
 * are toggled via the `showStations`/`showObservations` props.
 */
function BulletinMiniMap({
  bounds,
  stations,
  observations,
  showStations,
  showObservations,
  onStationClick,
  onObservationClick
}: {
  bounds: maplibregl.LngLatBoundsLike | undefined;
  stations: GeoJSON.FeatureCollection<GeoJSON.Point>;
  observations: GeoJSON.FeatureCollection<GeoJSON.Point>;
  showStations: boolean;
  showObservations: boolean;
  onStationClick: (id: string) => void;
  onObservationClick: (url: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const tooltipRef = useRef<maplibregl.Popup | null>(null);
  // Held in refs so the once-registered map handlers always see the latest
  // callbacks and data, and the load handler can seed the sources/visibility.
  const onStationClickRef = useRef(onStationClick);
  const onObservationClickRef = useRef(onObservationClick);
  const stationsRef = useRef(stations);
  const observationsRef = useRef(observations);
  const showStationsRef = useRef(showStations);
  const showObservationsRef = useRef(showObservations);

  useEffect(() => {
    onStationClickRef.current = onStationClick;
    onObservationClickRef.current = onObservationClick;
  }, [onStationClick, onObservationClick]);

  // Initialize the map once: basemap, the two marker sources/layers, hover
  // tooltip and a ResizeObserver. Data and visibility are kept in sync below.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      cooperativeGestures: true,
      container: containerRef.current,
      style: MAPLIBRE_STYLE,
      ...(bounds ? { bounds } : {})
    });

    tooltipRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: "maplibre-station-tooltip"
    });

    map.on("load", () => {
      map.addSource(STATIONS_SOURCE, {
        type: "geojson",
        data: stationsRef.current
      });
      map.addSource(OBSERVATIONS_SOURCE, {
        type: "geojson",
        data: observationsRef.current
      });

      map.addLayer({
        id: STATIONS_LAYER,
        type: "circle",
        source: STATIONS_SOURCE,
        layout: {
          visibility: showStationsRef.current ? "visible" : "none"
        },
        paint: {
          "circle-radius": 10,
          "circle-color": STATION_COLOR,
          "circle-stroke-color": STATION_COLOR,
          "circle-stroke-width": 1
        }
      });
      map.addLayer({
        id: OBSERVATIONS_LAYER,
        type: "circle",
        source: OBSERVATIONS_SOURCE,
        layout: {
          visibility: showObservationsRef.current ? "visible" : "none"
        },
        paint: {
          "circle-radius": 12,
          "circle-color": OBSERVATION_COLOR,
          "circle-stroke-color": OBSERVATION_COLOR,
          "circle-stroke-width": 1
        }
      });

      map.on("click", STATIONS_LAYER, e => {
        const id = e.features?.[0]?.properties?.id;
        if (typeof id === "string") onStationClickRef.current(id);
      });
      map.on("click", OBSERVATIONS_LAYER, e => {
        const url = e.features?.[0]?.properties?.url;
        if (typeof url === "string") onObservationClickRef.current(url);
      });

      for (const layer of [STATIONS_LAYER, OBSERVATIONS_LAYER]) {
        map.on("mouseenter", layer, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layer, () => {
          map.getCanvas().style.cursor = "";
          tooltipRef.current?.remove();
        });
        map.on("mousemove", layer, e => {
          const feature = e.features?.[0];
          if (feature?.geometry.type !== "Point") return;
          tooltipRef.current
            ?.setLngLat(feature.geometry.coordinates as [number, number])
            .setHTML(String(feature.properties?.tooltip ?? ""))
            .addTo(map);
        });
      }
    });

    mapRef.current = map;

    // MapLibre's trackResize only listens to window resize, so it misses
    // container size changes (e.g. the initial layout settling). Observe the
    // container and resize the map accordingly.
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => map.resize())
        : undefined;
    resizeObserver?.observe(containerRef.current);

    return () => {
      resizeObserver?.disconnect();
      tooltipRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push fresh GeoJSON to the sources whenever the markers change.
  useEffect(() => {
    stationsRef.current = stations;
    const source = mapRef.current?.getSource(STATIONS_SOURCE);
    if (source instanceof maplibregl.GeoJSONSource) source.setData(stations);
  }, [stations]);
  useEffect(() => {
    observationsRef.current = observations;
    const source = mapRef.current?.getSource(OBSERVATIONS_SOURCE);
    if (source instanceof maplibregl.GeoJSONSource)
      source.setData(observations);
  }, [observations]);

  // Toggle layer visibility (no-op until the layers exist after load).
  useEffect(() => {
    showStationsRef.current = showStations;
    const map = mapRef.current;
    if (!map?.getLayer(STATIONS_LAYER)) return;
    map.setLayoutProperty(
      STATIONS_LAYER,
      "visibility",
      showStations ? "visible" : "none"
    );
  }, [showStations]);
  useEffect(() => {
    showObservationsRef.current = showObservations;
    const map = mapRef.current;
    if (!map?.getLayer(OBSERVATIONS_LAYER)) return;
    map.setLayoutProperty(
      OBSERVATIONS_LAYER,
      "visibility",
      showObservations ? "visible" : "none"
    );
  }, [showObservations]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

export function AdditionalBulletinInformation({
  date,
  bulletin,
  region
}: Props) {
  const stationMarkerColor = STATION_COLOR;
  const observationMarkerColor = OBSERVATION_COLOR;
  const [showStations, setShowStations] = useState(true);
  const [showObservations, setShowObservations] = useState(true);
  const { data, stationFeatures, stationId, setStationId } =
    useWeatherStations();
  const { observationFeatures, observation, setObservation, loadObservations } =
    useObservations();

  useEffect(
    () => void loadObservations(),
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
    []
  );

  const bounds = useMemo((): maplibregl.LngLatBoundsLike | undefined => {
    const b = microRegionBounds(date, region);
    return b.isValid() ? b.asArray() : undefined;
  }, [region, date]);

  return (
    <div>
      {!!data.length && (
        <WeatherStationDialog
          stationData={data}
          stationId={stationId}
          setStationId={setStationId}
        />
      )}

      {!!observation && (
        <Modal
          isOpen={!!observation}
          onClose={() => setObservation("")}
          width={"90vw"}
        >
          <iframe
            src={observation}
            style={{ width: "100%", height: "80vh", border: "none" }}
          />
        </Modal>
      )}

      <h2 className="subheader">
        <FormattedMessage id="bulletin:report:additional:headline" />
      </h2>

      <div
        style={{
          marginTop: "2rem",
          height: "300px",
          borderRadius: "4px",
          overflow: "hidden"
        }}
      >
        <BulletinMiniMap
          key={`${bulletin.bulletinID}-${region}`}
          bounds={bounds}
          stations={stationFeatures}
          observations={observationFeatures}
          showStations={showStations}
          showObservations={showObservations}
          onStationClick={setStationId}
          onObservationClick={setObservation}
        />
      </div>

      <div
        className="bulletin-report-mini-map-legend"
        aria-label="Map legend"
        role="button"
        tabIndex={0}
        aria-pressed={showStations}
        onClick={() => setShowStations(value => !value)}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setShowStations(value => !value);
          }
        }}
        style={{
          ["--bulletin-mini-map-marker-color" as string]: stationMarkerColor,
          opacity: showStations ? 1 : 0.55,
          cursor: "pointer"
        }}
      >
        <span className="bulletin-report-mini-map-legend__swatch" />
        <span className="bulletin-report-mini-map-legend__label">
          <FormattedMessage id="bulletin:add-on:legend:weather-stations" />
        </span>
      </div>
      <div
        className="bulletin-report-mini-map-legend"
        aria-label="Map legend"
        role="button"
        tabIndex={0}
        aria-pressed={showObservations}
        onClick={() => setShowObservations(value => !value)}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setShowObservations(value => !value);
          }
        }}
        style={{
          ["--bulletin-mini-map-marker-color" as string]:
            observationMarkerColor,
          opacity: showObservations ? 1 : 0.55,
          cursor: "pointer"
        }}
      >
        <span className="bulletin-report-mini-map-legend__swatch" />
        <span className="bulletin-report-mini-map-legend__label">
          <FormattedMessage id="bulletin:add-on:legend:observations" />
        </span>
      </div>
    </div>
  );
}
