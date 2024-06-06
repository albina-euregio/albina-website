import React, { useEffect, useState } from "react";
import { useSearchParams } from "wouter";

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
import { dateFormat } from "../util/date";

const StationMeasurements = () => {
  const intl = useIntl();
  const [state] = useState({
    title: "",
    headerText: "",
    content: "",
    sharable: false
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    activeData,
    activeRegion,
    dateTime,
    dateTimeMax,
    fromURLSearchParams,
    load,
    searchText,
    setActiveRegion,
    setSearchText,
    sortBy,
    sortDir,
    sortedFilteredData,
    sortValue,
    toggleActiveData,
    toURLSearchParams
  } = useStationData();

  useEffect(() => {
    fromURLSearchParams(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateURL = () => {
    const search = toURLSearchParams();
    setSearchParams(search);
  };

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
          updateURL();
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
            updateURL();
          }}
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
              max={dateFormat(dateTimeMax, "%Y-%m-%dT%H:00", false)}
              value={
                dateTime instanceof Date
                  ? dateFormat(dateTime, "%Y-%m-%dT%H:00", false)
                  : ""
              }
              onChange={e => load({ dateTime: new Date(e.target.value) })}
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
                updateURL();
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
              updateURL();
            }}
          />
        </div>
      </section>
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
      <SmShare />
    </>
  );
};
export default StationMeasurements;
