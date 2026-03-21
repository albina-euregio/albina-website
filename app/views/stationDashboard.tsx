import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "../i18n";
import { useStationData } from "../stores/stationDataStore";
import StationOverlay from "../components/weather/station-overlay";
import LeafletMap from "../components/leaflet/leaflet-map";
import HTMLHeader from "../components/organisms/html-header";
import WeatherStationDialog, {
  useStationId
} from "../components/dialogs/weather-station-dialog";
import type { ObserverData } from "../components/dialogs/weather-station-diagrams";
import StationMapCockpit from "../components/weather/station-map-cockpit";
import {
  AVAILABLE_PARAMETERS,
  ParameterType
} from "../components/weather/station-parameter-control";
import ProvinceFilter from "../components/filters/province-filter";
import HideGroupFilter from "../components/filters/hide-group-filter";
import HideFilter from "../components/filters/hide-filter";
import SmShare from "../components/organisms/sm-share";
import SearchField from "../components/search-field";
import StationTable from "../components/stationTable/stationTable";
import { useStore } from "@nanostores/react";
import { $headless } from "../appStore";

import BeobachterAT from "../stores/Beobachter-AT.json";
import BeobachterIT from "../stores/Beobachter-IT.json";
import { useHiddenFooter } from "./useHiddenFooter.tsx";

const longitudeOffset = /Beobachter (Boden|Obertilliach|Nordkette|Kühtai)/;

export const observers = [...BeobachterAT, ...BeobachterIT].map(
  (observer): ObserverData => ({
    geometry: {
      coordinates: [
        +observer.longitude + (longitudeOffset.test(observer.name) ? 0.005 : 0),
        +observer.latitude
      ]
    },
    name: observer.name,
    id: "observer-" + observer["plot.id"],
    $smet: BeobachterAT.includes(observer)
      ? `https://api.avalanche.report/lawine/grafiken/smet/all/${observer.number}.smet.gz`
      : "",
    $png: "https://wiski.tirol.gv.at/lawine/grafiken/{width}/beobachter/{name}{year}.png?{t}",
    plot: observer["plot.id"]
  })
);

function StationDashboard(props) {
  const intl = useIntl();
  const headless = useStore($headless);
  const [stationId, setStationId] = useStationId();
  const [selectedParameter, setSelectedParameter] =
    useState<ParameterType>("HS");
  const [showMarkersWithoutValue, setShowMarkersWithoutValue] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "table">("map");
  const [filterHeight, setFilterHeight] = useState(0);
  const filterRef = useRef<HTMLElement | null>(null);

  const {
    activeData,
    activeRegion,
    dateTime,
    dateTimeMax,
    load,
    data,
    searchText,
    setActiveRegion,
    setSearchText,
    sortBy,
    sortDir,
    sortedFilteredData,
    sortValue,
    toggleActiveData
  } = useStationData();
  useHiddenFooter();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const filterElement = filterRef.current;
    if (!filterElement || typeof ResizeObserver === "undefined") return;

    const updateFilterHeight = () => {
      setFilterHeight(filterElement.getBoundingClientRect().height);
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

  const normalizedSearch = (searchText || "").trim().toLowerCase();
  const filteredObservers =
    normalizedSearch.length > 0
      ? observers.filter(observer =>
          observer.name.toLowerCase().includes(normalizedSearch)
        )
      : observers;

  const stationOverlay = (
    <StationOverlay
      key={"stations"}
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
      key={"observers"}
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
      features={filteredObservers}
      showMarkersWithoutValue={showMarkersWithoutValue}
    />
  );

  const overlays = [stationOverlay, observerOverlay];
  const hideFilters: (keyof typeof activeData)[] = ["snow", "temp", "wind"];
  const isMapView = viewMode === "map";

  const mapView = (
    <section id="section-weather-map" className="section section-weather-map">
      <StationMapCockpit
        selectedParameter={selectedParameter}
        onParameterChange={setSelectedParameter}
      />
      <div className="section-map">
        <LeafletMap
          loaded={props.domainId !== false}
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
          mapConfigOverride={{ maxZoom: 12 }}
          tileLayerConfigOverride={{ maxZoom: 12 }}
          overlays={overlays}
        />
      </div>
    </section>
  );

  const viewModeToggle = (
    <div className="station-view-toggle-panel">
      <ul
        className="station-view-toggle"
        role="tablist"
        aria-label={intl.formatMessage({ id: "menu:weather:stations" })}
      >
        <li>
          <button
            type="button"
            role="tab"
            aria-selected={isMapView}
            aria-controls="section-weather-map"
            tabIndex={isMapView ? 0 : -1}
            className={`station-view-toggle__button ${isMapView ? "is-active" : ""}`}
            onClick={() => setViewMode("map")}
          >
            {intl.formatMessage({ id: "stations:view:map" })}
          </button>
        </li>
        <li>
          <button
            type="button"
            role="tab"
            aria-selected={!isMapView}
            aria-controls="section-weather-table"
            tabIndex={isMapView ? -1 : 0}
            className={`station-view-toggle__button ${!isMapView ? "is-active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            {intl.formatMessage({ id: "stations:view:table" })}
          </button>
        </li>
      </ul>
    </div>
  );

  const sharedFilterBar = (
    <section
      ref={filterRef}
      className={`section controlbar station-dashboard-filter station-dashboard-filter--${viewMode}`}
    >
      <div className="section-centered station-dashboard-filter__inner">
        <div className="station-dashboard-filter__topline">
          <div className="station-dashboard-filter__mainline">
            {viewModeToggle}
            <div className="station-dashboard-filter__search">
              <SearchField
                handleSearch={setSearchText}
                value={searchText || ""}
              />
            </div>
          </div>
        </div>

        <div
          id="station-dashboard-filter-extra"
          className="station-dashboard-filter__extra"
        >
          <ul className="list-inline list-controlbar">
            <li>
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
            </li>

            <li>
              <div>
                <p className="info">
                  {intl.formatMessage({ id: "archive:table-header:date" })}
                </p>
                <div className="pure-form">
                  <input
                    type="datetime-local"
                    step={3600}
                    max={`${dateTimeMax.toString().slice(0, "2006-01-02T12".length)}:00`}
                    value={
                      dateTime instanceof Temporal.ZonedDateTime
                        ? `${dateTime.toString().slice(0, "2006-01-02T12".length)}:00`
                        : ""
                    }
                    onChange={e =>
                      load({
                        dateTime: Temporal.PlainDateTime.from(
                          e.target.value
                        ).toZonedDateTime("Europe/Vienna")
                      })
                    }
                  />
                </div>
              </div>
            </li>

            {viewMode === "table" && (
              <li>
                <HideGroupFilter
                  title={intl.formatMessage({
                    id: "measurements:filter:hide"
                  })}
                >
                  {hideFilters.map(e => (
                    <HideFilter
                      key={e}
                      id={e}
                      title={intl.formatMessage({
                        id: "measurements:filter:hide:" + e
                      })}
                      tooltip={intl.formatMessage({
                        id:
                          "measurements:filter:hide:" +
                          (activeData[e] ? "active" : "inactive") +
                          ":hover"
                      })}
                      active={activeData[e]}
                      onToggle={val => {
                        toggleActiveData(val);
                      }}
                    />
                  ))}
                </HideGroupFilter>
              </li>
            )}
          </ul>
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

      {!headless && <SmShare />}
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
          viewMode === "map"
            ? ({
                "--station-dashboard-filter-offset": `${filterHeight}px`
              } as React.CSSProperties)
            : undefined
        }
      >
        {viewMode === "map" && mapView}
        {viewMode === "table" && tableView}
      </div>
    </>
  );
}

export default StationDashboard;
