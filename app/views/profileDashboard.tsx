import React from "react";
import { useStore } from "@nanostores/react";
import { useIntl } from "../i18n";
import { useSnowProfileData } from "../stores/profileDataStore";
import SnowProfileMapLibreMap from "../components/profile/profile-map";
import SnowProfileTable from "../components/profile/profile-table";
import SnowProfileDetailsDialog, {
  useSnowProfileId
} from "../components/profile/profile-details-dialog";
import HTMLHeader from "../components/organisms/html-header";
import ProvinceFilter from "../components/filters/province-filter";
import DateRangeFilter from "../components/filters/date-range-filter";
import SearchField from "../components/organisms/search-field";
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
    sortedFilteredData
  } = useSnowProfileData();

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
        className={`section controlbar station-dashboard-filter station-dashboard-filter--${viewMode} station-dashboard-filter--profiles`}
        style={topStyle}
      >
        <div className="section-centered station-dashboard-filter__inner">
          <div className="station-dashboard-filter__bar">
            <div className="station-dashboard-filter__group">
              <div className="station-dashboard-filter__date">
                <DateRangeFilter
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onChange={setDateRange}
                />
              </div>
              <div className="station-dashboard-filter__province">
                <ProvinceFilter
                  title={intl.formatMessage({
                    id: "measurements:filter:province"
                  })}
                  all={intl.formatMessage({ id: "filter:all" })}
                  handleChange={val => setActiveRegion(val)}
                  regionCodes={config.regionCodes}
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
            </div>

            <div className="station-dashboard-filter__add">
              <a
                href={config.apis.profiles.replace(/\/api$/, "/")}
                target="_blank"
                rel="noopener noreferrer"
                className="pure-button station-dashboard-filter__add-button"
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
              </a>
            </div>
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

      <SnowProfileDetailsDialog
        profileId={profileId}
        setProfileId={setProfileId}
      />
    </>
  );
}

export default SnowProfileDashboard;
