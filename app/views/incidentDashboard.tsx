import React from "react";
import { useStore } from "@nanostores/react";
import { useIntl, type MessageId } from "../i18n";
import {
  translateIncidentValue,
  useIncidentReportMessages
} from "../i18n/incident-report";
import { useIncidentData } from "../stores/incidentDataStore";
import { currentSeasonYear } from "../util/date-season";
import { downloadTextFile, toCsv } from "../util/csv";
import IncidentMapLibreMap from "../components/incident/incident-map.tsx";
import IncidentTable from "../components/incident/incident-table";
import IncidentDetailsDialog from "../components/incident/incident-details-dialog";
import HTMLHeader from "../components/organisms/html-header";
import ProvinceFilter from "../components/filters/province-filter";
import YearFilter from "../components/filters/year-filter";
import SearchField from "../components/organisms/search-field";
import ExportMenu, {
  type ExportAction
} from "../components/filters/export-menu";
import { $router, redirectPageQuery } from "../components/router";
import { useHiddenFooter } from "./useHiddenFooter.tsx";
import { useFilterBarOffset } from "./useFilterBarOffset.ts";

const DEFAULT_VIEW_MODE = "map";

function IncidentDashboard() {
  const intl = useIntl();
  const router = useStore($router);
  useHiddenFooter();

  const viewMode =
    router?.search?.view === "table" ? "table" : DEFAULT_VIEW_MODE;
  const setViewMode = (view: "map" | "table") =>
    redirectPageQuery({ view: view === DEFAULT_VIEW_MODE ? "" : view });

  const selectedId = router?.search?.incident || undefined;
  const setSelectedId = (id: string | undefined) =>
    redirectPageQuery({ incident: id ?? "" });
  const { filterRef, offsetStyle, topStyle } = useFilterBarOffset();

  const {
    activeRegion,
    setActiveRegion,
    seasonYear,
    setSeasonYear,
    searchText,
    setSearchText,
    sortValue,
    sortDir,
    sortBy,
    sortedFilteredData
  } = useIncidentData();

  const messages = useIncidentReportMessages();
  const label = (field: string) =>
    (messages.incidentReport?.[field] ?? field).trim();
  const tr = (category: string, value: string | undefined) =>
    translateIncidentValue(messages, category, value) ?? "";
  const trList = (category: string, values: string[] | undefined) =>
    values?.map(value => tr(category, value)).join("; ");
  const regionName = (code: string | undefined) =>
    code ? intl.formatMessage({ id: `region:${code}` as MessageId }) : "";
  const exportFilename = `incidents_${seasonYear}-${seasonYear + 1}`;

  // The visible (filtered + sorted) incidents, one row each, for own statistics.
  const exportCsv = () => {
    const header = [
      intl.formatMessage({ id: "incidents:export:id" }),
      intl.formatMessage({ id: "archive:table-header:date" }),
      label("timeAccuracy"),
      label("location"),
      label("avalancheRegion"),
      intl.formatMessage({ id: "measurements:table:header:microRegion" }),
      intl.formatMessage({ id: "measurements:filter:province" }),
      label("latitude"),
      label("longitude"),
      label("locationAccuracy"),
      label("publicAvalancheWarningService"),
      label("startZoneElevation"),
      label("startZoneElevationAccuracy"),
      label("startZoneAspect"),
      label("startZoneAspectAccuracy"),
      label("startZoneIncline"),
      label("avalancheType"),
      intl.formatMessage({ id: "caaml:avalancheSize.label" }),
      label("avalancheLength"),
      label("slabWidth"),
      label("crownDepthAvg"),
      label("relevantAvalancheProblem"),
      label("dangerPattern"),
      label("trigger"),
      label("remoteTriggering"),
      label("personInvolvement"),
      label("activities"),
      label("terrainTypes"),
      label("numberInvolved"),
      label("caughtOnly"),
      label("partlyBuried"),
      label("fullyBuried"),
      label("uninjuredSurvivors"),
      label("injuredSurvivors"),
      label("fatalities")
    ];
    // ISO-like local date ("2026-02-18 09:44"), parseable by spreadsheets.
    const dateFormat = new Intl.DateTimeFormat("sv-SE", {
      dateStyle: "short",
      timeStyle: "short"
    });
    const rows = sortedFilteredData.map(incident => {
      const d = incident.publicData;
      const counts = d.involvementsFatalitiesBurials;
      return [
        incident.id,
        incident.dateTime ? dateFormat.format(incident.dateTime) : "",
        tr("timeAccuracy", d.timeAccuracy),
        incident.location,
        incident.microRegion,
        regionName(incident.microRegion),
        regionName(incident.region),
        incident.lat,
        incident.lon,
        tr("locationAccuracy", d.locationAccuracy),
        d.publicAvalancheWarningService,
        d.startZoneElevation,
        tr("startZoneElevationAccuracy", d.startZoneElevationAccuracy),
        d.startZoneAspect,
        tr("startZoneAspectAccuracy", d.startZoneAspectAccuracy),
        d.startZoneIncline,
        tr("avalancheType", d.avalancheType),
        tr("avalancheSize", d.avalancheSize),
        d.avalancheLength,
        d.slabWidth,
        d.crownDepthAvg,
        d.relevantAvalancheProblem
          ? intl.formatMessage({
              id: `caaml:avalancheProblem.${d.relevantAvalancheProblem}` as MessageId
            })
          : "",
        d.dangerPattern
          ?.map(dp =>
            intl.formatMessage({ id: `caaml:dangerPattern.${dp}` as MessageId })
          )
          .join("; "),
        tr("trigger", d.trigger),
        tr("remoteTriggering", d.remoteTriggering),
        tr("personInvolvement", d.personInvolvement),
        trList("incidentActivity", counts?.incidentActivity),
        trList("incidentTerrainType", counts?.incidentTerrainType),
        counts?.numberInvolved,
        counts?.caughtOnly,
        counts?.partlyBuried,
        counts?.fullyBuried,
        counts?.uninjuredSurvivors,
        counts?.injuredSurvivors,
        counts?.fatalities
      ];
    });
    downloadTextFile(`${exportFilename}.csv`, toCsv([header, ...rows]));
  };

  // The visible incidents with their full public data as feature properties.
  const exportGeoJson = () => {
    const featureCollection = {
      type: "FeatureCollection",
      features: sortedFilteredData.map(incident => ({
        type: "Feature",
        id: incident.id,
        geometry: incident.hasLocation
          ? { type: "Point", coordinates: [incident.lon, incident.lat] }
          : null,
        properties: {
          ...incident.publicData,
          id: incident.id,
          region: incident.region
        }
      }))
    };
    downloadTextFile(
      `${exportFilename}.geojson`,
      JSON.stringify(featureCollection),
      "application/geo+json"
    );
  };

  const exportActions: ExportAction[] = [
    {
      format: "CSV",
      labelId: "incidents:export:csv",
      descId: "incidents:export:csv:desc",
      run: exportCsv
    },
    {
      format: "JSON",
      labelId: "incidents:export:geojson",
      descId: "incidents:export:geojson:desc",
      run: exportGeoJson
    }
  ];

  const selectedIncident = sortedFilteredData.find(
    incident => incident.id === selectedId
  );

  const minYearByRegion = config.incidents.minYearByRegion as Record<
    string,
    number
  >;
  const minYear = activeRegion
    ? (minYearByRegion[activeRegion] ?? config.incidents.minYear)
    : Math.min(config.incidents.minYear, ...Object.values(minYearByRegion));

  const mapView = (
    <section id="section-incident-map" className="section section-weather-map">
      <div className="section-map">
        <IncidentMapLibreMap
          incidents={sortedFilteredData}
          onIncidentSelected={id => setSelectedId(id)}
        />
      </div>
    </section>
  );

  const tableView = (
    <section id="section-incident-table" className="section">
      <div className="table-container">
        <IncidentTable
          sortedFilteredData={sortedFilteredData}
          sortValue={sortValue}
          sortDir={sortDir}
          handleSort={(id, dir) => sortBy(id, dir)}
          onIncidentSelected={id => setSelectedId(id)}
        />
      </div>
    </section>
  );

  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "menu:incidents" })} />

      <section
        ref={filterRef}
        className={`section controlbar station-dashboard-filter station-dashboard-filter--${viewMode} station-dashboard-filter--incidents`}
        style={topStyle}
      >
        <div className="section-centered station-dashboard-filter__inner">
          <div className="station-dashboard-filter__bar">
            <div className="station-dashboard-filter__season">
              <YearFilter
                title={intl.formatMessage({ id: "archive:filter:year" })}
                minYear={minYear}
                maxYear={currentSeasonYear()}
                formatter={y => `${y}/${y + 1}`}
                handleChange={setSeasonYear}
                value={seasonYear}
              />
            </div>
            <div className="station-dashboard-filter__province">
              <ProvinceFilter
                title={intl.formatMessage({
                  id: "measurements:filter:province"
                })}
                all={intl.formatMessage({ id: "filter:all" })}
                handleChange={val => setActiveRegion(val)}
                regionCodes={config.incidentRegions}
                value={activeRegion}
              />
            </div>

            <div className="station-dashboard-filter__search">
              <SearchField
                title={intl.formatMessage({ id: "filter:search" })}
                handleSearch={setSearchText}
                value={searchText}
              />
            </div>

            {viewMode === "table" && (
              <ExportMenu
                actions={exportActions}
                disabled={sortedFilteredData.length === 0}
              />
            )}
          </div>
        </div>
      </section>

      <div
        className={`station-dashboard-content station-dashboard-content--${viewMode}`}
        style={offsetStyle}
      >
        {viewMode === "map" && mapView}
        {viewMode === "table" && tableView}
      </div>

      <button
        type="button"
        className="station-view-control"
        style={offsetStyle}
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

      <IncidentDetailsDialog
        incident={selectedIncident}
        onClose={() => setSelectedId(undefined)}
      />
    </>
  );
}

export default IncidentDashboard;
