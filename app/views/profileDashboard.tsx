import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { useIntl } from "../i18n";
import {
  stabilityLabelId,
  useSnowProfileData
} from "../stores/profileDataStore";
import { DATE_TIME_FORMAT_SHORT } from "../util/date";
import { downloadTextFile, downloadUrl, toCsv } from "../util/csv";
import SnowProfileMapLibreMap from "../components/profile/profile-map";
import SnowProfileTable from "../components/profile/profile-table";
import SnowProfileDetailsDialog, {
  useSnowProfileId
} from "../components/profile/profile-details-dialog";
import SnowProfileFormDialog from "../components/profile/profile-form-dialog";
import HTMLHeader from "../components/organisms/html-header";
import ProvinceFilter from "../components/filters/province-filter";
import DateRangeFilter from "../components/filters/date-range-filter";
import SearchField from "../components/organisms/search-field";
import ExportMenu, {
  type ExportAction
} from "../components/filters/export-menu";
import FilterBarToggle from "../components/filters/filter-bar-toggle";
import { $router, redirectPageQuery } from "../components/router";
import { useHiddenFooter } from "./useHiddenFooter";
import { useFilterBarOffset } from "./useFilterBarOffset";

const DEFAULT_VIEW_MODE = "map";

function SnowProfileDashboard() {
  const intl = useIntl();
  const router = useStore($router);
  useHiddenFooter();

  const viewMode =
    router?.search?.view === "table" ? "table" : DEFAULT_VIEW_MODE;
  const setViewMode = (view: "map" | "table") =>
    redirectPageQuery({ view: view === DEFAULT_VIEW_MODE ? "" : view });

  const [profileId, setProfileId] = useSnowProfileId();
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const { filterRef, offsetStyle, topStyle } = useFilterBarOffset();

  const {
    activeRegion,
    setActiveRegion,
    dateFrom,
    dateTo,
    setDateRange,
    searchText,
    setSearchText,
    sortValue,
    sortDir,
    sortBy,
    sortedFilteredData,
    chronologicalData,
    reload
  } = useSnowProfileData();

  // Create + edit open in a modal iframe, keeping the user on the dashboard.
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string>();

  const openNewProfile = () => {
    setEditId(undefined);
    setFormOpen(true);
    redirectPageQuery({ edit: "new", profile: "" });
  };

  // Export the currently visible (filtered + sorted) profiles as CSV, mirroring
  // the table's columns so the download matches what the user sees on screen.
  const exportCsv = () => {
    const header = [
      intl.formatMessage({ id: "profiles:export:id" }),
      intl.formatMessage({ id: "archive:table-header:date" }),
      intl.formatMessage({ id: "incidents:table:header:location" }),
      intl.formatMessage({ id: "measurements:table:header:microRegion" }),
      intl.formatMessage({ id: "measurements:filter:province" }),
      intl.formatMessage({ id: "measurements:table:header:altitude" }),
      intl.formatMessage({ id: "measurements:table:header:aspect" }),
      intl.formatMessage({ id: "caaml:snowpackStability.label" }),
      intl.formatMessage({ id: "profiles:export:ect" }),
      intl.formatMessage({ id: "profiles:export:rb" }),
      intl.formatMessage({ id: "profiles:export:latitude" }),
      intl.formatMessage({ id: "profiles:export:longitude" })
    ];
    const rows = sortedFilteredData.map(profile => [
      profile.id,
      profile.dateTime
        ? intl.formatDate(profile.dateTime, DATE_TIME_FORMAT_SHORT)
        : "",
      profile.location,
      profile.microRegion ?? "",
      profile.region ?? "",
      profile.elevation ?? "",
      profile.aspect ?? "",
      profile.stability
        ? intl.formatMessage({ id: stabilityLabelId(profile.stability) })
        : "",
      profile.ectScore ?? "",
      profile.rbScore ?? "",
      profile.lat ?? "",
      profile.lon ?? ""
    ]);
    downloadTextFile(
      `snow-profiles_${dateFrom}_${dateTo}.csv`,
      toCsv([header, ...rows])
    );
  };

  // Bulk download every profile matching the active region + date range as a
  // ZIP of CAAML XML. The backend filters server-side (region_id prefix + date)
  // and supplies the filename via Content-Disposition. It has no text-search
  // param, so the location search only narrows the on-screen list, not the ZIP.
  const exportZip = () => {
    const params = new URLSearchParams({ format: "zip", dateFrom, dateTo });
    if (activeRegion) params.set("regions", activeRegion);
    downloadUrl(`${config.apis.profiles}/profiles/export?${params}`);
  };

  const exportActions: ExportAction[] = [
    {
      format: "CSV",
      labelId: "profiles:export:csv",
      descId: "profiles:export:csv:desc",
      run: exportCsv
    },
    {
      format: "XML",
      labelId: "profiles:export:zip",
      descId: "profiles:export:zip:desc",
      run: exportZip
    }
  ];

  // Edit needs nothing but the id — the embedded app resolves the edit token
  // itself, and asks the user for it when this browser doesn't have one.
  const openEditProfile = (id: string) => {
    setProfileId(""); // close the detail dialog so modals don't stack
    setEditId(id);
    setFormOpen(true);
    redirectPageQuery({ edit: id });
  };

  // Set once the iframe reports a save, consumed when the modal finally closes.
  const savedId = useRef<string | undefined>(undefined);

  // The detail dialog reopened by closeForm takes the form's place directly,
  // without its opening animation. Reset once it's closed again.
  const [detailFromForm, setDetailFromForm] = useState(false);
  useEffect(() => {
    if (!profileId) setDetailFromForm(false);
  }, [profileId]);

  const closeForm = () => {
    setFormOpen(false);
    setEditId(undefined);
    // One navigation: drop ?edit and open the detail of the saved profile, or —
    // when an edit is left unsaved (e.g. the token prompt was cancelled) — of
    // the profile we came from.
    const returnTo = savedId.current ?? editId ?? "";
    setDetailFromForm(!!returnTo);
    redirectPageQuery({ edit: "", profile: returnTo });
    savedId.current = undefined;
  };

  // Leave the modal open (it's showing the success step with the edit link);
  // update ?edit= and refresh the list. The form closes itself via close-request.
  const handleProfileSaved = (id: string) => {
    savedId.current = id;
    redirectPageQuery({ edit: id });
    reload();
  };

  // Reopen the form from ?edit on load: "new" for a blank form, or a profile
  // id to edit. Runs once the router is ready.
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current || !router) return;
    restored.current = true;
    const edit = router.search?.edit;
    if (!edit) return;
    setEditId(edit === "new" ? undefined : edit);
    setFormOpen(true);
  }, [router]);

  // The dialog flips through the profiles as the current view presents them:
  // chronologically on the map, by the table's sorting in the table.
  const flipperData = useMemo(
    () =>
      viewMode === "map"
        ? chronologicalData.filter(profile => profile.hasLocation)
        : sortedFilteredData,
    [viewMode, chronologicalData, sortedFilteredData]
  );

  const mapView = (
    <section
      id="section-snowprofile-map"
      className="section section-weather-map"
    >
      <div className="section-map">
        <SnowProfileMapLibreMap
          snowProfiles={sortedFilteredData}
          onSnowProfileSelected={id => setProfileId(id)}
        />
      </div>
    </section>
  );

  const tableView = (
    <section id="section-snowprofile-table" className="section">
      <div className="table-container">
        <SnowProfileTable
          sortedFilteredData={sortedFilteredData}
          sortValue={sortValue}
          sortDir={sortDir}
          handleSort={(id, dir) => sortBy(id, dir)}
          onSnowProfileSelected={id => setProfileId(id)}
        />
      </div>
    </section>
  );

  return (
    <>
      <HTMLHeader
        title={intl.formatMessage({ id: "menu:weather:snow-profiles" })}
      />

      <section
        ref={filterRef}
        className={`section controlbar station-dashboard-filter station-dashboard-filter--${viewMode} station-dashboard-filter--grouped station-dashboard-filter--profiles${isFiltersExpanded ? " is-expanded" : ""}`}
        style={topStyle}
      >
        <div className="section-centered station-dashboard-filter__inner">
          <div className="station-dashboard-filter__bar">
            <div className="station-dashboard-filter__group">
              <div className="station-dashboard-filter__province">
                <ProvinceFilter
                  title={intl.formatMessage({
                    id: "measurements:filter:province"
                  })}
                  all={intl.formatMessage({ id: "filter:all" })}
                  handleChange={val => setActiveRegion(val)}
                  regionCodes={config.stationRegions}
                  value={activeRegion}
                />
              </div>
              <div
                id="profile-filter-date"
                className="station-dashboard-filter__date"
              >
                <DateRangeFilter
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onChange={setDateRange}
                />
              </div>
              <div className="station-dashboard-filter__search">
                <SearchField
                  title={intl.formatMessage({ id: "filter:search" })}
                  handleSearch={setSearchText}
                  value={searchText}
                />
              </div>
            </div>

            <ExportMenu
              id="profile-filter-export"
              actions={exportActions}
              disabled={sortedFilteredData.length === 0}
              note={
                searchText &&
                intl.formatMessage({ id: "profiles:export:zip:search-note" })
              }
            />

            <FilterBarToggle
              expanded={isFiltersExpanded}
              onToggle={() => setIsFiltersExpanded(prev => !prev)}
              controls="profile-filter-date profile-filter-export"
            />
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
        className="snowprofile-add-fab"
        onClick={openNewProfile}
        title={intl.formatMessage({ id: "profiles:add" })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 18"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="9" y1="3" x2="9" y2="15" />
          <line x1="3" y1="9" x2="15" y2="9" />
        </svg>
        {intl.formatMessage({ id: "profiles:add" })}
      </button>

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

      <SnowProfileDetailsDialog
        profiles={flipperData}
        profileId={profileId}
        setProfileId={setProfileId}
        onEdit={openEditProfile}
        skipOpenAnimation={detailFromForm}
      />

      <SnowProfileFormDialog
        open={formOpen}
        onClose={closeForm}
        editId={editId}
        onSaved={handleProfileSaved}
      />
    </>
  );
}

export default SnowProfileDashboard;
