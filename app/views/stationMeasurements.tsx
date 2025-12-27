import React, { useEffect, useState } from "react";

import { useIntl } from "../i18n";
import { useStationData } from "../stores/stationDataStore";
import PageHeadline from "../components/organisms/page-headline";
import FilterBar from "../components/organisms/filter-bar";
import ProvinceFilter from "../components/filters/province-filter";
import HideGroupFilter from "../components/filters/hide-group-filter";
import HideFilter from "../components/filters/hide-filter";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import StationTable from "../components/stationTable/stationTable";
import { useStore } from "@nanostores/react";
import { $headless } from "../appStore";

const StationMeasurements = () => {
  const intl = useIntl();
  const headless = useStore($headless);
  const [state] = useState({
    title: "",
    headerText: "",
    content: "",
    sharable: false
  });
  const {
    activeData,
    activeRegion,
    dateTime,
    dateTimeMax,
    load,
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
    load();
  }, [load]);

  const classChanged = "selectric-changed";
  const hideFilters: (keyof typeof activeData)[] = ["snow", "temp", "wind"];
  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "measurements:title" })} />
      <PageHeadline
        title={intl.formatMessage({ id: "measurements:headline" })}
        marginal={state.headerText}
        subtitle={intl.formatMessage({
          id: "weather:subpages:subtitle"
        })}
      />
      <FilterBar
        search={true}
        searchTitle={intl.formatMessage({
          id: "measurements:search"
        })}
        searchOnChange={val => {
          setSearchText(val);
        }}
        searchValue={searchText}
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
          className={activeRegion !== "all" ? classChanged : ""}
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
};
export default StationMeasurements;
