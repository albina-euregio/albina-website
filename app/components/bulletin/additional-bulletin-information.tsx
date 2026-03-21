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

interface Props {
  date: Temporal.PlainDate;
  bulletin: Bulletin;
  region: string;
}

function useWeatherStations() {
  const [stationId, setStationId] = useStationId();
  const { data, load } = useStationData("microRegion");
  useEffect(() => void load(), [load]);

  const stationMarkers = useMemo(
    () =>
      data.map(station => (
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
    const snobs = await fetchJSON("https://static.avalanche.report/snobs.json");
    setObservations(
      snobs.map(observation => (
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
          overlays={[...stationMarkers, ...observations]}
        />
      </div>

      <div
        className="bulletin-report-mini-map-legend"
        aria-label="Map legend"
        style={{
          ["--bulletin-mini-map-marker-color" as string]: `rgb(200, 200, 200)`
        }}
      >
        <span className="bulletin-report-mini-map-legend__swatch" />
        <span className="bulletin-report-mini-map-legend__label">
          <a href="/weather/stations">
            <FormattedMessage id="menu:weather:stations" />
          </a>
        </span>
      </div>
    </div>
  );
}
