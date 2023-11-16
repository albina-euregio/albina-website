import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import StationDataStore from "../stores/stationDataStore";
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
  const [store] = useState(() => new StationDataStore());
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    store.load();
    store.fromURLSearchParams(searchParams);
  }, [searchParams, store]);

  const updateURL = () => {
    const search = store.toURLSearchParams();
    setSearchParams(search);
  };

  const classChanged = "selectric-changed";
  const hideFilters: (keyof typeof store.activeData)[] = [
    "snow",
    "temp",
    "wind"
  ];
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
          store.setSearchText(val);
          updateURL();
        }}
        searchValue={store.searchText}
      >
        <ProvinceFilter
          title={intl.formatMessage({
            id: "measurements:filter:province"
          })}
          all={intl.formatMessage({ id: "filter:all" })}
          handleChange={val => {
            store.activeRegion = val;
            updateURL();
          }}
          value={store.activeRegion}
          className={store.activeRegion !== "all" ? classChanged : ""}
        />

        <div>
          <p className="info">
            {intl.formatMessage({ id: "archive:table-header:date" })}
          </p>
          <div className="pure-form">
            <input
              type="datetime-local"
              step={3600}
              max={dateFormat(store.dateTimeMax, "%Y-%m-%dT%H:00", false)}
              value={
                store.dateTime instanceof Date
                  ? dateFormat(store.dateTime, "%Y-%m-%dT%H:00", false)
                  : ""
              }
              onChange={e => store.load({ dateTime: new Date(e.target.value) })}
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
                  (store.activeData[e] ? "active" : "inactive") +
                  ":hover"
              })}
              active={store.activeData[e]}
              onToggle={val => {
                store.toggleActiveData(val);
                updateURL();
              }}
            />
          ))}
        </HideGroupFilter>
      </FilterBar>
      <section className="section">
        <div className="table-container">
          <StationTable
            sortedFilteredData={store.sortedFilteredData}
            activeData={store.activeData}
            activeRegion={store.activeRegion}
            sortValue={store.sortValue}
            sortDir={store.sortDir}
            searchText={store.searchText}
            handleSort={(id, dir) => {
              store.sortBy(id, dir);
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
export default observer(StationMeasurements);
