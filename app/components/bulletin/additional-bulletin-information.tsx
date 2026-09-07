import React, { useEffect, useMemo, useRef, useState } from "react";
import * as v from "valibot";
import {
  GeoJSONSource,
  GeolocateControl,
  type LngLatBoundsLike,
  Map as MlMap,
  NavigationControl,
  Popup,
  ScaleControl
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import WeatherStationDialog, { useStationId } from "../station/station-dialog";
import { useStationData } from "../../stores/stationDataStore";
import { microRegionBounds } from "../../stores/microRegions";
import { FormattedMessage, useIntl } from "../../i18n";
import { MAPLIBRE_STYLE } from "../maplibre/maplibre-style";
import { GeonamesControl } from "../maplibre/maplibre-geonames-control";
import { Bulletin, getMainDate } from "../../stores/bulletin";
import { vObservation, type Observation } from "../../stores/observations";
import { fetchJSON } from "../../util/fetch.ts";
import { escapeHtml } from "../../util/escape-html.ts";
import {
  fetchSnowProfiles,
  type SnowProfileData
} from "../../stores/profileDataStore.ts";
import SnowProfileDetailsDialog, {
  useSnowProfileId
} from "../profile/profile-details-dialog.tsx";
import ObservationDetailsDialog from "./observation-details-dialog.tsx";
import { Tooltip } from "../tooltips/tooltip.tsx";

const STATION_COLOR = "rgb(46, 46, 46)";
const OBSERVATION_COLOR = "rgb(25, 171, 255)";
const SNOW_PROFILE_COLOR = "rgb(140, 82, 255)";

const STATIONS_SOURCE = "stations";
const STATIONS_LAYER = "stations-circles";
const OBSERVATIONS_SOURCE = "observations";
const OBSERVATIONS_LAYER = "observations-circles";
const SNOW_PROFILES_SOURCE = "snow-profiles";
const SNOW_PROFILES_LAYER = "snow-profiles-circles";

/** Days of snow profiles shown before the bulletin's main date. */
const SNOW_PROFILE_DAYS = 7;

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

/** An {@link Observation} known to carry usable coordinates. */
type LocatedObservation = Observation &
  Required<Pick<Observation, "latitude" | "longitude">>;

function isLocatedObservation(value: unknown): value is LocatedObservation {
  return (
    v.is(vObservation, value) &&
    isValidCoordinates(value.latitude, value.longitude)
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

function useObservations(date: string) {
  const [observations, setObservations] = useState<LocatedObservation[]>([]);
  const [observationId, setObservationId] = useState<string>("");

  useEffect(() => {
    const url = config.apis.snobs;
    if (!url) return;
    let ignore = false;
    fetchJSON<unknown>(config.template(url, { date }))
      .then(snobs => {
        if (ignore) return;
        setObservations(
          Array.isArray(snobs) ? snobs.filter(isLocatedObservation) : []
        );
      })
      // Days without published observations have no file at all.
      .catch(() => {
        if (!ignore) setObservations([]);
      });
    return () => {
      ignore = true;
    };
  }, [date]);

  const observationFeatures = useMemo(
    (): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
      type: "FeatureCollection",
      features: observations.map(observation => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [observation.longitude, observation.latitude]
        },
        properties: observation
      }))
    }),
    [observations]
  );

  // MapLibre hands back the feature properties with every nested value
  // JSON-encoded, so the dialog gets the original observation by its id.
  const observation = useMemo(
    () => observations.find(o => o.$id === observationId),
    [observations, observationId]
  );

  return {
    observationFeatures,
    observation,
    setObservationId
  };
}

/**
 * Snow profiles of the seven days leading up to the bulletin's main date, for
 * the whole domain — unlike the stations and observations, they are not
 * restricted to the bulletin's micro-region.
 */
function useSnowProfiles(date: string) {
  const [snowProfiles, setSnowProfiles] = useState<SnowProfileData[]>([]);
  const [snowProfileId, setSnowProfileId] = useSnowProfileId();

  useEffect(() => {
    const dateTo = Temporal.PlainDate.from(date);
    const dateFrom = dateTo.subtract({ days: SNOW_PROFILE_DAYS });
    let ignore = false;
    void fetchSnowProfiles(dateFrom.toString(), dateTo.toString()).then(
      profiles => {
        if (!ignore) setSnowProfiles(profiles);
      }
    );
    return () => {
      ignore = true;
    };
  }, [date]);

  const snowProfileFeatures = useMemo(
    (): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
      type: "FeatureCollection",
      features: snowProfiles.flatMap(profile => {
        const { lon, lat } = profile;
        if (lon === undefined || lat === undefined) return [];
        if (!isValidCoordinates(lat, lon)) return [];
        return [
          {
            type: "Feature" as const,
            geometry: { type: "Point" as const, coordinates: [lon, lat] },
            properties: {
              id: profile.id,
              dateTime: profile.dateTime?.toISOString() ?? "",
              location: profile.location
            }
          }
        ];
      })
    }),
    [snowProfiles]
  );

  return {
    snowProfiles,
    snowProfileFeatures,
    snowProfileId,
    setSnowProfileId
  };
}

/**
 * Mini map (MapLibre GL) showing the micro-region's weather stations plus the
 * observations and snow profiles as colored circle markers over the shared
 * raster basemap (MAPLIBRE_STYLE). Hovering a marker shows a tooltip; clicking
 * a station opens its diagrams, clicking an observation or snow profile opens
 * its details dialog. The three layers are toggled via the `show*` props.
 */
function BulletinMiniMap({
  bounds,
  stations,
  observations,
  snowProfiles,
  showStations,
  showObservations,
  showSnowProfiles,
  onStationClick,
  onObservationClick,
  onSnowProfileClick
}: {
  bounds: LngLatBoundsLike | undefined;
  stations: GeoJSON.FeatureCollection<GeoJSON.Point>;
  observations: GeoJSON.FeatureCollection<GeoJSON.Point>;
  snowProfiles: GeoJSON.FeatureCollection<GeoJSON.Point>;
  showStations: boolean;
  showObservations: boolean;
  showSnowProfiles: boolean;
  onStationClick: (id: string) => void;
  onObservationClick: (observationId: string) => void;
  onSnowProfileClick: (snowProfileId: string) => void;
}) {
  const intl = useIntl();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MlMap | null>(null);
  const tooltipRef = useRef<Popup | null>(null);
  // Held in refs so the once-registered map handlers always see the latest
  // callbacks and data, and the load handler can seed the sources/visibility.
  const onStationClickRef = useRef(onStationClick);
  const onObservationClickRef = useRef(onObservationClick);
  const onSnowProfileClickRef = useRef(onSnowProfileClick);
  const intlRef = useRef(intl);
  const stationsRef = useRef(stations);
  const observationsRef = useRef(observations);
  const snowProfilesRef = useRef(snowProfiles);
  const showStationsRef = useRef(showStations);
  const showObservationsRef = useRef(showObservations);
  const showSnowProfilesRef = useRef(showSnowProfiles);

  useEffect(() => {
    onStationClickRef.current = onStationClick;
    onObservationClickRef.current = onObservationClick;
    onSnowProfileClickRef.current = onSnowProfileClick;
    intlRef.current = intl;
  }, [onStationClick, onObservationClick, onSnowProfileClick, intl]);

  // Initialize the map once: basemap, the two marker sources/layers, hover
  // tooltip and a ResizeObserver. Data and visibility are kept in sync below.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MlMap({
      dragRotate: false,
      cooperativeGestures: true,
      container: containerRef.current,
      style: MAPLIBRE_STYLE,
      ...(bounds ? { bounds } : {})
    });

    tooltipRef.current = new Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: "maplibre-station-tooltip"
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-left");
    map.addControl(
      new GeonamesControl({
        ...config.map.geonames,
        lang: intl.locale.slice(0, 2),
        title: intl.formatMessage({ id: "bulletin:map:search" }),
        placeholder: intl.formatMessage({ id: "bulletin:map:search:hover" }),
        noResults: intl.formatMessage({ id: "bulletin:map:search:no-results" })
      }),
      "top-left"
    );
    map.addControl(
      new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
        showAccuracyCircle: true
      }),
      "top-left"
    );
    map.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");

    map.on("load", () => {
      map.addSource(STATIONS_SOURCE, {
        type: "geojson",
        data: stationsRef.current
      });
      map.addSource(OBSERVATIONS_SOURCE, {
        type: "geojson",
        data: observationsRef.current
      });
      map.addSource(SNOW_PROFILES_SOURCE, {
        type: "geojson",
        data: snowProfilesRef.current
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
          // Hollow ring: faint fill + full-opacity stroke (matches the old
          // Leaflet CircleMarker's default fillOpacity of 0.2).
          "circle-opacity": 0.8,
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
          "circle-opacity": 0.8,
          "circle-stroke-color": OBSERVATION_COLOR,
          "circle-stroke-width": 1
        }
      });
      map.addLayer({
        id: SNOW_PROFILES_LAYER,
        type: "circle",
        source: SNOW_PROFILES_SOURCE,
        layout: {
          visibility: showSnowProfilesRef.current ? "visible" : "none"
        },
        paint: {
          "circle-radius": 12,
          "circle-color": SNOW_PROFILE_COLOR,
          "circle-opacity": 0.8,
          "circle-stroke-color": SNOW_PROFILE_COLOR,
          "circle-stroke-width": 1
        }
      });

      // Handle both layers in one click so that when a station and an
      // observation marker overlap, only the topmost feature opens a dialog.
      map.on("click", e => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [STATIONS_LAYER, OBSERVATIONS_LAYER, SNOW_PROFILES_LAYER]
        });
        const feature = features[0];
        if (!feature) return;
        if (feature.layer.id === STATIONS_LAYER) {
          const id = feature.properties?.id;
          if (typeof id === "string") onStationClickRef.current(id);
        } else if (feature.layer.id === OBSERVATIONS_LAYER) {
          const id = feature.properties?.$id;
          if (typeof id === "string") onObservationClickRef.current(id);
        } else if (feature.layer.id === SNOW_PROFILES_LAYER) {
          const id = feature.properties?.id;
          if (typeof id === "string") onSnowProfileClickRef.current(id);
        }
      });

      for (const layer of [
        STATIONS_LAYER,
        OBSERVATIONS_LAYER,
        SNOW_PROFILES_LAYER
      ]) {
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
          // Stations carry a ready-made tooltip, observations and snow profiles
          // the values the tooltip is formatted from.
          const observation = feature.properties as Observation;
          const profile = feature.properties as {
            dateTime?: string;
            location?: string;
          };
          const html =
            layer === OBSERVATIONS_LAYER
              ? [
                  observation.eventDate &&
                    intlRef.current.formatDate(observation.eventDate),
                  observation.locationName,
                  observation.authorName
                ]
                  .filter(Boolean)
                  .join("<br>")
              : layer === SNOW_PROFILES_LAYER
                ? [
                    profile.dateTime &&
                      intlRef.current.formatDate(profile.dateTime),
                    profile.location
                  ]
                    .filter(Boolean)
                    .map(text => escapeHtml(String(text)))
                    .join("<br>")
                : String(feature.properties?.tooltip ?? "");
          tooltipRef.current
            ?.setLngLat(feature.geometry.coordinates as [number, number])
            .setHTML(html)
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
    if (source instanceof GeoJSONSource) source.setData(stations);
  }, [stations]);
  useEffect(() => {
    observationsRef.current = observations;
    const source = mapRef.current?.getSource(OBSERVATIONS_SOURCE);
    if (source instanceof GeoJSONSource) source.setData(observations);
  }, [observations]);
  useEffect(() => {
    snowProfilesRef.current = snowProfiles;
    const source = mapRef.current?.getSource(SNOW_PROFILES_SOURCE);
    if (source instanceof GeoJSONSource) source.setData(snowProfiles);
  }, [snowProfiles]);

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
  useEffect(() => {
    showSnowProfilesRef.current = showSnowProfiles;
    const map = mapRef.current;
    if (!map?.getLayer(SNOW_PROFILES_LAYER)) return;
    map.setLayoutProperty(
      SNOW_PROFILES_LAYER,
      "visibility",
      showSnowProfiles ? "visible" : "none"
    );
  }, [showSnowProfiles]);

  return (
    <div
      ref={containerRef}
      className="bulletin-report-mini-map"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export function AdditionalBulletinInformation({
  date,
  bulletin,
  region
}: Props) {
  const intl = useIntl();
  const stationMarkerColor = STATION_COLOR;
  const observationMarkerColor = OBSERVATION_COLOR;
  const snowProfileMarkerColor = SNOW_PROFILE_COLOR;
  const [showStations, setShowStations] = useState(true);
  const [showObservations, setShowObservations] = useState(true);
  const [showSnowProfiles, setShowSnowProfiles] = useState(true);
  const { data, stationFeatures, stationId, setStationId } =
    useWeatherStations();
  const mainDate = getMainDate(bulletin.customData) ?? date.toString();
  const { observationFeatures, observation, setObservationId } =
    useObservations(mainDate);
  const { snowProfiles, snowProfileFeatures, snowProfileId, setSnowProfileId } =
    useSnowProfiles(mainDate);

  const bounds = useMemo((): LngLatBoundsLike | undefined => {
    const b = microRegionBounds(date, region);
    return b.isEmpty() ? undefined : b;
  }, [region, date]);

  return (
    <div className="bulletin-additional-addmap">
      {!!data.length && (
        <WeatherStationDialog
          stationData={data}
          stationId={stationId}
          setStationId={setStationId}
        />
      )}

      <ObservationDetailsDialog
        observation={observation}
        onClose={() => setObservationId("")}
      />

      <SnowProfileDetailsDialog
        profiles={snowProfiles}
        profileId={snowProfileId}
        setProfileId={setSnowProfileId}
      />

      <h2 className="subheader">
        <FormattedMessage id="bulletin:report:additional:headline" />
        <Tooltip
          html={true}
          label={`<p>${intl.formatMessage({
            id: "bulletin:report:additional:info"
          })}</p>`}
        >
          <span className="tooltip-trigger icon-info"></span>
        </Tooltip>
      </h2>

      <div className="addmap-container">
        <div className="addmap">
          <BulletinMiniMap
            key={`${bulletin.bulletinID}-${region}`}
            bounds={bounds}
            stations={stationFeatures}
            observations={observationFeatures}
            snowProfiles={snowProfileFeatures}
            showStations={showStations}
            showObservations={showObservations}
            showSnowProfiles={showSnowProfiles}
            onStationClick={setStationId}
            onObservationClick={setObservationId}
            onSnowProfileClick={setSnowProfileId}
          />
        </div>

        <div className="addmap-legend">
          <div
            className="addmap-legend-item"
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
              ["--bulletin-additional-addmap-marker-color" as string]:
                stationMarkerColor,
              opacity: showStations ? 1 : 0.55
            }}
          >
            <span className="addmap-legend-swatch" />
            <span className="addmap-label">
              <FormattedMessage id="bulletin:add-on:legend:weather-stations" />
            </span>
          </div>
          <div
            className="addmap-legend-item"
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
              ["--bulletin-additional-addmap-marker-color" as string]:
                observationMarkerColor,
              opacity: showObservations ? 1 : 0.55
            }}
          >
            <span className="addmap-legend-swatch" />
            <span className="addmap-label">
              <FormattedMessage id="bulletin:add-on:legend:observations" />
            </span>
          </div>
          <div
            className="addmap-legend-item"
            aria-label="Map legend"
            role="button"
            tabIndex={0}
            aria-pressed={showSnowProfiles}
            onClick={() => setShowSnowProfiles(value => !value)}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setShowSnowProfiles(value => !value);
              }
            }}
            style={{
              ["--bulletin-additional-addmap-marker-color" as string]:
                snowProfileMarkerColor,
              opacity: showSnowProfiles ? 1 : 0.55
            }}
          >
            <span className="addmap-legend-swatch" />
            <span className="addmap-label">
              <FormattedMessage id="bulletin:add-on:legend:snow-profiles" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
