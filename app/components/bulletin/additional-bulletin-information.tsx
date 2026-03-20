import React, { useEffect, useMemo } from "react";
import WeatherStationDialog, {
  useStationId
} from "../dialogs/weather-station-dialog.tsx";
import { useStationData } from "../../stores/stationDataStore";
import { AVAILABLE_PARAMETERS } from "../weather/station-parameter-data";
import { microRegionBounds } from "../../stores/microRegions";
import { FormattedMessage } from "../../i18n";
import LeafletMap from "../leaflet/leaflet-map.tsx";
import StationOverlay from "../weather/station-overlay.tsx";
import { Bulletin } from "../../stores/bulletin/CAAMLv6";

interface Props {
  date: Temporal.PlainDate;
  bulletin: Bulletin;
  region: string;
}

export function AdditionalBulletinInformation({
  date,
  bulletin,
  region
}: Props) {
  const [stationId, setStationId] = useStationId();
  const { data: stationData, load: loadStationData } =
    useStationData("microRegion");
  useEffect(() => {
    loadStationData();
  }, [loadStationData]);

  const parameterConfig =
    AVAILABLE_PARAMETERS.find(p => p.id === "HS") || AVAILABLE_PARAMETERS[0];

  const selectedMicroRegionBounds = useMemo(() => {
    const bounds = microRegionBounds(
      date,
      bulletin?.regions?.map(r => r.regionID)
    );
    return bounds.isValid() ? bounds : undefined;
  }, [bulletin?.regions, date]);

  return (
    <div>
      {!!stationData.length && (
        <WeatherStationDialog
          stationData={stationData}
          stationId={stationId}
          setStationId={setStationId}
        />
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
            bounds: selectedMicroRegionBounds,
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
              features={stationData}
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
