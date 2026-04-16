import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "../i18n";
import { useStationData } from "../stores/stationDataStore";
import StationOverlay from "../components/weather/station-overlay";
import { LeafletMapOpenTopo } from "../components/leaflet/leaflet-map";
import HTMLHeader from "../components/organisms/html-header";
import WeatherStationDialog, {
  useStationId
} from "../components/dialogs/weather-station-dialog";
import type { Feature } from "@albina-euregio/linea/listing";
import StationMapCockpit from "../components/weather/station-map-cockpit";
import {
  AVAILABLE_PARAMETERS,
  ParameterType
} from "../components/weather/station-parameter-control";
import ProvinceFilter from "../components/filters/province-filter";
import SearchField from "../components/organisms/search-field";
import StationTable from "../components/stationTable/stationTable";
import { useStore } from "@nanostores/react";
import { $headless } from "../appStore";
import { $router, redirectPageQuery } from "../components/router";

import BeobachterAT from "../stores/Beobachter-AT.json";
import BeobachterIT from "../stores/Beobachter-IT.json";
import { useHiddenFooter } from "./useHiddenFooter.tsx";

const longitudeOffset = /Beobachter (Boden|Obertilliach|Nordkette|Kühtai)/;
const DATE_TIME_INPUT_LENGTH = "2006-01-02T12".length;
const DEFAULT_VIEW_MODE = "map";
const DEFAULT_STATION_PARAMETER: ParameterType = "HS";
const AUSTRIAN_OBSERVER_PROVINCES: Record<string, string> = {
  Boden: "AT-07",
  Dolomitenhuette: "AT-07",
  FelbertauernNord: "AT-07",
  FelbertauernSued: "AT-07",
  Kaunertal: "AT-07",
  Kuehtai: "AT-07",
  Nauders: "AT-07",
  Nordkette: "AT-07",
  Obergurgl: "AT-07",
  Obertilliach: "AT-07",
  Steeg: "AT-07",
  StVeit: "AT-07"
};

function parseDateTimeSearchParam(dateTime?: string) {
  if (!dateTime) {
    return;
  }

  try {
    return Temporal.PlainDateTime.from(dateTime).toZonedDateTime(
      "Europe/Vienna"
    );
  } catch {
    return;
  }
}

function formatDateTimeForInput(dateTime?: Temporal.ZonedDateTime) {
  if (!(dateTime instanceof Temporal.ZonedDateTime)) {
    return "";
  }

  return `${dateTime.toString().slice(0, DATE_TIME_INPUT_LENGTH)}:00`;
}

function getObserverProvince(
  observer: (typeof BeobachterAT)[number] | (typeof BeobachterIT)[number]
) {
  if (BeobachterAT.includes(observer)) {
    return AUSTRIAN_OBSERVER_PROVINCES[observer["plot.id"]];
  }

  if (observer["plot.id"].startsWith("TN_")) {
    return "IT-32-TN";
  }

  if (observer["plot.id"].startsWith("STI_")) {
    return "IT-32-BZ";
  }
}

export const observers: Feature[] = [...BeobachterAT, ...BeobachterIT].map(
  (observer): Feature => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        +observer.longitude + (longitudeOffset.test(observer.name) ? 0.005 : 0),
        +observer.latitude
      ]
    },
    id: "observer-" + observer["plot.id"],
    properties: {
      name: observer.name,
      dataProviderID: "ALBINA",
      dataURLs: BeobachterAT.includes(observer)
        ? [
            `https://api.avalanche.report/lawine/grafiken/smet/all/${observer.number}.smet.gz`,
            `https://api.avalanche.report/lawine/grafiken/smet/all/${observer.number}.smet.gz`,
            `https://api.avalanche.report/lawine/grafiken/smet/all/${observer.number}.smet.gz`
          ]
        : undefined,
      plot: `https://wiski.tirol.gv.at/lawine/grafiken/{width}/beobachter/${observer["plot.id"]}{year}.png?{t}`,
      microRegionID: getObserverProvince(observer)
    }
  })
);

function StationDashboard() {
  const intl = useIntl();
  const headless = useStore($headless);
  const [stationId, setStationId] = useStationId();
  const router = useStore($router);
  const selectedParameter: ParameterType =
    AVAILABLE_PARAMETERS.find(p => p.id === router?.search?.parameter)?.id ??
    DEFAULT_STATION_PARAMETER;
  const setSelectedParameter = (parameter: ParameterType) =>
    redirectPageQuery({
      parameter: parameter === DEFAULT_STATION_PARAMETER ? "" : parameter
    });
  const viewMode =
    router?.search?.view === "table" ? "table" : DEFAULT_VIEW_MODE;
  const setViewMode = (view: "map" | "table") =>
    redirectPageQuery({ view: view === DEFAULT_VIEW_MODE ? "" : view });
  const dateTimeQuery = router?.search?.dateTime;
  const selectedDateTime = parseDateTimeSearchParam(dateTimeQuery);
  const setSelectedDateTime = (nextDateTime: string) =>
    redirectPageQuery({ dateTime: nextDateTime });
  const [showMarkersWithoutValue, setShowMarkersWithoutValue] = useState(true);
  const [filterHeight, setFilterHeight] = useState(0);
  const [filterTop, setFilterTop] = useState(0);
  const filterRef = useRef<HTMLElement | null>(null);

  const {
    activeData,
    activeRegion,
    dateTime,
    dateTimeMax,
    load,
    data,
    searchText,
    setActiveRegion: setStoreActiveRegion,
    setSearchText,
    sortBy,
    sortDir,
    sortedFilteredData,
    sortValue
  } = useStationData();
  const setActiveRegion = (region: string) =>
    setStoreActiveRegion(region === "all" ? "" : region);
  const loadRef = useRef(load);
  useHiddenFooter();

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    loadRef.current({ dateTime: parseDateTimeSearchParam(dateTimeQuery) });
  }, [dateTimeQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const ps = AVAILABLE_PARAMETERS;
      const index = ps.findIndex(p => p.id === selectedParameter);
      if (e.key === "n") {
        setSelectedParameter(ps[(index + 1) % ps.length].id);
      } else if (e.key === "p") {
        setSelectedParameter(ps[(index - 1 + ps.length) % ps.length].id);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    const filterElement = filterRef.current;
    if (!filterElement || typeof ResizeObserver === "undefined") return;

    const updateFilterHeight = () => {
      const rect = filterElement.getBoundingClientRect();
      setFilterHeight(rect.height);
      // Measure actual position at scroll=0 so sticky threshold matches exactly
      if (document.documentElement.scrollTop === 0) {
        setFilterTop(rect.top);
      }
    };

    updateFilterHeight();

    const observer = new ResizeObserver(() => {
      updateFilterHeight();
    });

    observer.observe(filterElement);
    return () => {
      observer.disconnect();
    };
  }, []);

  const currentParameterConfig =
    AVAILABLE_PARAMETERS.find(p => p.id === selectedParameter) ||
    AVAILABLE_PARAMETERS[0];
  const selectedRegion = config.stationRegions.includes(activeRegion)
    ? activeRegion
    : undefined;

  const normalizedSearch = (searchText || "").trim().toLowerCase();
  const filteredObservers =
    normalizedSearch.length > 0
      ? observers.filter(observer =>
          observer.properties.name.toLowerCase().includes(normalizedSearch)
        )
      : observers;
  const regionFilteredObservers = filteredObservers.filter(
    observer =>
      !selectedRegion || observer.properties.microRegionID === selectedRegion
  );

  const stationOverlay = (
    <StationOverlay
      key={`stations-${selectedParameter}-${activeRegion}-${normalizedSearch}`}
      onMarkerSelected={feature => {
        setStationId(feature.id);
      }}
      itemId={selectedParameter}
      item={{
        id: selectedParameter,
        colors: currentParameterConfig.colors,
        thresholds: currentParameterConfig.thresholds,
        units: currentParameterConfig.unit,
        direction: currentParameterConfig.direction || false,
        clusterOperation: "none"
      }}
      features={sortedFilteredData}
      showMarkersWithoutValue={showMarkersWithoutValue}
    />
  );

  const observerOverlay = (
    <StationOverlay
      key={`observers-${activeRegion}-${normalizedSearch}`}
      onMarkerSelected={feature => {
        setStationId(feature.id);
      }}
      itemId="any"
      item={{
        id: "name",
        colors: { 1: [100, 100, 100] },
        thresholds: [],
        clusterOperation: "none"
      }}
      features={regionFilteredObservers}
      showMarkersWithoutValue={showMarkersWithoutValue}
    />
  );

  const overlays = [stationOverlay, observerOverlay];

  const mapView = (
    <section id="section-weather-map" className="section section-weather-map">
      <StationMapCockpit
        selectedParameter={selectedParameter}
        onParameterChange={setSelectedParameter}
      />
      <div className="section-map">
        <LeafletMapOpenTopo
          loaded={true}
          gestureHandling={false}
          controls={null}
          enableStationPinsToggle={true}
          showMarkersWithoutValue={showMarkersWithoutValue}
          onToggleMarkersWithoutValue={nextValue => {
            setShowMarkersWithoutValue(nextValue);
          }}
          onInit={e => {
            e.invalidateSize();
          }}
          overlays={overlays}
        />
      </div>
    </section>
  );

  const sharedFilterBar = (
    <section
      ref={filterRef}
      className={`section controlbar station-dashboard-filter station-dashboard-filter--${viewMode}`}
      style={
        {
          "--station-dashboard-filter-top": `${filterTop}px`
        } as React.CSSProperties
      }
    >
      <div className="section-centered station-dashboard-filter__inner">
        <div className="station-dashboard-filter__bar">
          <ProvinceFilter
            title={intl.formatMessage({
              id: "measurements:filter:province"
            })}
            all={intl.formatMessage({ id: "filter:all" })}
            handleChange={val => {
              setActiveRegion(val);
            }}
            regionCodes={config.stationRegions}
            value={activeRegion}
          />
          <div className="station-dashboard-filter__date">
            <p className="info">
              {intl.formatMessage({ id: "archive:table-header:date" })}
            </p>
            <div className="pure-form">
              <input
                type="datetime-local"
                step={3600}
                max={formatDateTimeForInput(dateTimeMax)}
                value={formatDateTimeForInput(selectedDateTime ?? dateTime)}
                onChange={e => setSelectedDateTime(e.target.value)}
              />
            </div>
          </div>
          <div className="station-dashboard-filter__search">
            <SearchField
              handleSearch={setSearchText}
              value={searchText || ""}
            />
          </div>
        </div>
      </div>
    </section>
  );

  const tableView = (
    <>
      <section id="section-weather-table" className="section">
        <div className="table-container">
          <StationTable
            sortedFilteredData={sortedFilteredData}
            activeData={activeData}
            activeRegion={activeRegion}
            sortValue={sortValue}
            sortDir={sortDir}
            searchText={searchText}
            handleSort={(id, dir) => {
              sortBy(id, dir);
            }}
          />
        </div>
      </section>

      {!headless && (
        <section className="section-centered section-context">
          <div className="panel">
            <h2 className="subheader">
              {intl.formatMessage({ id: "button:snow:headline" })}
            </h2>

            <ul className="list-inline list-buttongroup-dense">
              <li>
                <a
                  className="secondary pure-button"
                  href="/weather/map/new-snow"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {intl.formatMessage({ id: "button:snow:hn:text" })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href="/weather/map/snow-height"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {intl.formatMessage({ id: "button:snow:hs:text" })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href="/weather/map/wind"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {intl.formatMessage({ id: "button:snow:ff:text" })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href="/weather/stations"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {intl.formatMessage({
                    id: "button:stations:stations:text"
                  })}
                </a>
              </li>
            </ul>
          </div>
        </section>
      )}
    </>
  );

  return (
    <>
      {!!data.length && (
        <WeatherStationDialog
          stationData={[...data, ...observers]}
          stationId={stationId}
          setStationId={setStationId}
        />
      )}
      <HTMLHeader title={intl.formatMessage({ id: "menu:weather:stations" })} />

      {sharedFilterBar}

      <div
        className={`station-dashboard-content station-dashboard-content--${viewMode}`}
        style={
          {
            "--station-dashboard-filter-offset": `${filterHeight}px`,
            "--station-dashboard-filter-top": `${filterTop}px`
          } as React.CSSProperties
        }
      >
        {viewMode === "map" && mapView}
        {viewMode === "table" && tableView}
      </div>
      <button
        type="button"
        className="station-view-control"
        style={
          {
            "--station-dashboard-filter-offset": `${filterHeight}px`,
            "--station-dashboard-filter-top": `${filterTop}px`
          } as React.CSSProperties
        }
        onClick={() => setViewMode(viewMode === "map" ? "table" : "map")}
        title={intl.formatMessage({
          id: viewMode === "map" ? "stations:view:table" : "stations:view:map"
        })}
        aria-label={intl.formatMessage({
          id: viewMode === "map" ? "stations:view:table" : "stations:view:map"
        })}
      >
        {viewMode === "map" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="16" height="4" rx="1" />
            <rect x="1" y="7" width="16" height="4" rx="1" />
            <rect x="1" y="13" width="16" height="4" rx="1" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="1,3 6,1 12,3 17,1 17,15 12,17 6,15 1,17" />
            <line x1="6" y1="1" x2="6" y2="15" />
            <line x1="12" y1="3" x2="12" y2="17" />
          </svg>
        )}
      </button>
    </>
  );
}

export default StationDashboard;
