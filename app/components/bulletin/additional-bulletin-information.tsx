import React, { useEffect, useMemo, useState } from "react";
import WeatherStationDialog, {
  useStationId
} from "../dialogs/weather-station-dialog.tsx";
import { useStationData } from "../../stores/stationDataStore";
import { AVAILABLE_PARAMETERS } from "../weather/station-parameter-data";
import { microRegionBounds } from "../../stores/microRegions";
import { FormattedMessage, useIntl } from "../../i18n";
import LeafletMap from "../leaflet/leaflet-map.tsx";
import StationOverlay from "../weather/station-overlay.tsx";
import { Bulletin } from "../../stores/bulletin/CAAMLv6";
import { fetchJSON } from "../../util/fetch.ts";
import Modal from "../dialogs/albina-modal.tsx";
import { CircleMarker, Tooltip } from "react-leaflet";

interface Props {
  date: Temporal.PlainDate;
  bulletin: Bulletin;
  region: string;
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
  const [stationId, setStationId] = useStationId();
  const { data, load } = useStationData("microRegion");
  useEffect(() => void load(), [load]);

  const { observations, observation, setObservation, loadObservations } =
    useObservations();

  useEffect(
    () => void loadObservations(),
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
    []
  );

  const parameterConfig =
    AVAILABLE_PARAMETERS.find(p => p.id === "HS") || AVAILABLE_PARAMETERS[0];

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
          overlays={[
            ...observations,
            <StationOverlay
              key="stations"
              onMarkerSelected={feature => {
                setStationId(feature.id);
              }}
              itemId="any"
              item={{
                id: "name",
                colors: {
                  1: [200, 200, 200] as [number, number, number]
                } as unknown as Record<number, number[]>,
                thresholds: [],
                units: parameterConfig.unit,
                direction: false,
                clusterOperation: "none"
              }}
              features={data}
              showMarkersWithoutValue={true}
              useWeatherStationIcon={true}
            />
          ]}
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
