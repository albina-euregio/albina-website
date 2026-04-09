import React, { useEffect, useMemo, useState } from "react";
import WeatherStationDialog, {
  useStationId
} from "../dialogs/weather-station-dialog.tsx";
import { useStationData } from "../../stores/stationDataStore";
import { microRegionBounds } from "../../stores/microRegions";
import { FormattedMessage, useIntl } from "../../i18n";
import LeafletMap from "../leaflet/leaflet-map.tsx";
import { Bulletin } from "../../stores/bulletin/CAAMLv6";
import { fetchJSON } from "../../util/fetch.ts";
import Modal from "../dialogs/albina-modal.tsx";
import { CircleMarker, Tooltip } from "react-leaflet";

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
  const { data, load } = useStationData("microRegion");
  useEffect(() => void load(), [load]);

  const stationMarkers = useMemo(
    () =>
      data
        .filter(station =>
          isValidCoordinates(
            station.geometry.coordinates[1],
            station.geometry.coordinates[0]
          )
        )
        .map(station => (
          <CircleMarker
            key={station.id}
            center={[
              station.geometry.coordinates[1],
              station.geometry.coordinates[0]
            ]}
            radius={10}
            weight={1}
            color="rgb(100, 100, 100)"
            fill={true}
            fillColor="rgb(100, 100, 100)"
            eventHandlers={{
              click: () => setStationId(station.id)
            }}
          >
            <Tooltip>{station.name}</Tooltip>
          </CircleMarker>
        )),
    [data, setStationId]
  );
  return { data, stationId, setStationId, stationMarkers };
}

function useObservations() {
  const intl = useIntl();
  const [observations, setObservations] = useState<
    ReturnType<typeof CircleMarker>[]
  >([]);
  const [observation, setObservation] = useState<string>("");

  async function loadObservations() {
    const snobs = await fetchJSON<unknown>(
      "https://static.avalanche.report/snobs.json"
    );
    const observationsList = Array.isArray(snobs)
      ? snobs.filter(isObservation)
      : [];
    setObservations(
      observationsList
        .filter(observation =>
          isValidCoordinates(observation.latitude, observation.longitude)
        )
        .map(observation => (
          <CircleMarker
            key={observation.$id}
            center={[observation.latitude, observation.longitude]}
            radius={12}
            color="rgb(200, 100, 100)"
            fill={true}
            fillColor="rgb(200, 100, 100)"
            eventHandlers={{
              click: () => setObservation(observation.$externalURL)
            }}
          >
            <Tooltip>
              {intl.formatDate(observation.eventDate)}
              <br />
              {observation.locationName}
              <br />
              {observation.authorName}
            </Tooltip>
          </CircleMarker>
        ))
    );
  }

  return { observations, observation, setObservation, loadObservations };
}

export function AdditionalBulletinInformation({
  date,
  bulletin,
  region
}: Props) {
  const stationMarkerColor = "rgb(100, 100, 100)";
  const observationMarkerColor = "rgb(200, 100, 100)";
  const [showStations, setShowStations] = useState(true);
  const [showObservations, setShowObservations] = useState(true);
  const { data, stationId, setStationId, stationMarkers } =
    useWeatherStations();
  const { observations, observation, setObservation, loadObservations } =
    useObservations();

  useEffect(
    () => void loadObservations(),
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
    []
  );

  const bounds = useMemo(() => {
    const bounds = microRegionBounds(
      date,
      bulletin?.regions?.map(r => r.regionID)
    );
    return bounds.isValid() ? bounds : undefined;
  }, [bulletin?.regions, date]);

  const overlays = useMemo(() => {
    const visibleStationMarkers = showStations ? stationMarkers : [];
    const visibleObservations = showObservations ? observations : [];
    return [...visibleStationMarkers, ...visibleObservations];
  }, [showStations, stationMarkers, showObservations, observations]);

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
        <LeafletMap
          key={`${bulletin.bulletinID}-${region}`}
          loaded={true}
          gestureHandling={false}
          controls={null}
          onInit={() => {}}
          mapConfigOverride={{
            bounds,
            maxZoom: 14
          }}
          tileLayerConfigOverride={{
            maxNativeZoom: 10,
            maxZoom: 10
          }}
          secondaryTileLayerConfigOverride={{
            url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            attribution:
              "Map data: OpenStreetMap contributors, SRTM | Map style: OpenTopoMap (CC-BY-SA)",
            maxNativeZoom: 17,
            minZoom: 10.25,
            maxZoom: 14
          }}
          overlays={overlays}
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
