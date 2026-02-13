import React, { useEffect, useState } from "react";
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
import FilterBar from "../components/organisms/filter-bar";
import ProvinceFilter from "../components/filters/province-filter";
import HideGroupFilter from "../components/filters/hide-group-filter";
import HideFilter from "../components/filters/hide-filter";
import SmShare from "../components/organisms/sm-share";
import StationTable from "../components/stationTable/stationTable";
import { useStore } from "@nanostores/react";
import { $headless } from "../appStore";

import BeobachterAT from "../stores/Beobachter-AT.json";
import BeobachterIT from "../stores/Beobachter-IT.json";

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

  useEffect(() => {
    const footer = document.getElementById("page-footer");
    if (!footer) return;
    footer.style.display = "none";
    return () => {
      footer.style.display = "";
    };
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const currentParameterConfig =
    AVAILABLE_PARAMETERS.find(p => p.id === selectedParameter) ||
    AVAILABLE_PARAMETERS[0];

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
      features={data}
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
      features={observers}
      showMarkersWithoutValue={showMarkersWithoutValue}
    />
  );

  const overlays = [stationOverlay, observerOverlay];
  const hideFilters: (keyof typeof activeData)[] = ["snow", "temp", "wind"];

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

  const tableView = (
    <>
      <FilterBar
        search={true}
        searchTitle={intl.formatMessage({
          id: "measurements:search"
        })}
        searchOnChange={val => {
          setSearchText(val);
        }}
        searchValue={searchText || ""}
      >
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
      </FilterBar>
      <section className="section">
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

      {viewMode === "map" && mapView}
      {viewMode === "table" && tableView}

      <div
        className={`station-view-toggle${viewMode === "table" ? " is-table" : ""}`}
      >
        <button
          className={viewMode === "map" ? "pure-button secondary" : "pure-button inverse"}
          onClick={() => setViewMode("map")}
        >
          {intl.formatMessage({ id: "stations:view:map" })}
        </button>
        <button
          className={
            viewMode === "table" ? "pure-button secondary" : "pure-button inverse"
          }
          onClick={() => setViewMode("table")}
        >
          {intl.formatMessage({ id: "stations:view:table" })}
        </button>
      </div>
    </>
  );
}

export default StationDashboard;
