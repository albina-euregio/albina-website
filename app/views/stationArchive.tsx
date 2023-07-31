import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import { currentSeasonYear } from "../util/date-season";
import StationDataStore from "../stores/stationDataStore";
import PageHeadline from "../components/organisms/page-headline";
import FilterBar from "../components/organisms/filter-bar";
import ProvinceFilter from "../components/filters/province-filter";
import YearFilter from "../components/filters/year-filter";
import HideGroupFilter from "../components/filters/hide-group-filter";
import HideFilter from "../components/filters/hide-filter";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import StationArchiveTable from "../components/stationTable/stationArchiveTable";

const StationArchive = () => {
  const intl = useIntl();
  const [state] = useState({
    title: "",
    headerText: "",
    content: "",
    sharable: false
  });
  const [store] = useState(() => {
    const store = new StationDataStore(r => r.startsWith("AT-07"));
    store.setActiveYear("");
    return store;
  });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    store.load({ ogd: true });
    store.fromURLSearchParams(searchParams);
  }, [searchParams, store]);

  const updateURL = () => {
    const search = store.toURLSearchParams();
    setSearchParams(search);
  };

  const handleChangeSearch = val => {
    store.setSearchText(val);
    updateURL();
  };

  const handleToggleActive = val => {
    store.toggleActiveData(val);
    updateURL();
  };

  const handleChangeRegion = val => {
    store.activeRegion = val;
    updateURL();
  };

  const handleChangeYear = val => {
    store.setActiveYear(val);
    updateURL();
  };

  const handleSort = (id, dir) => {
    store.sortBy(id, dir);
    updateURL();
  };

  const classChanged = "selectric-changed";
  const hideFilters: (keyof typeof store.activeData)[] = [
    "snow",
    "temp",
    "wind",
    "radiation"
  ];
  return (
    <>
      <HTMLHeader
        title={intl.formatMessage({ id: "measurements-archive:title" })}
      />
      <PageHeadline
        title={intl.formatMessage({ id: "measurements-archive:headline" })}
        marginal={state.headerText}
        subtitle={intl.formatMessage({
          id: "weather:subpages:subtitle"
        })}
      />
      <FilterBar
        search={true}
        searchTitle={intl.formatMessage({
          id: "measurements-archive:search"
        })}
        searchOnChange={handleChangeSearch}
        searchValue={store.searchText}
      >
        <ProvinceFilter
          title={intl.formatMessage({
            id: "measurements-archive:filter:province"
          })}
          all={intl.formatMessage({ id: "filter:all" })}
          handleChange={handleChangeRegion}
          value={store.activeRegion}
          className={store.activeRegion !== "all" ? classChanged : ""}
        />

        <YearFilter
          title={intl.formatMessage({
            id: "measurements-archive:filter:year"
          })}
          all={"latest"}
          minYear={window.config.stationArchive.minYear}
          maxYear={currentSeasonYear()}
          handleChange={handleChangeYear}
          formatter={y => `${y}/${y + 1}`}
          value={store.activeYear}
          className={store.activeYear ? classChanged : ""}
        />

        <HideGroupFilter
          title={intl.formatMessage({
            id: "measurements-archive:filter:hide"
          })}
        >
          {hideFilters.map(e => (
            <HideFilter
              key={e}
              id={e}
              title={intl.formatMessage({
                id: "measurements-archive:filter:hide:" + e
              })}
              tooltip={intl.formatMessage({
                id:
                  "measurements-archive:filter:hide:" +
                  (store.activeData[e] ? "active" : "inactive") +
                  ":hover"
              })}
              active={store.activeData[e]}
              onToggle={handleToggleActive}
            />
          ))}
        </HideGroupFilter>
      </FilterBar>
      <section className="section">
        <div className="table-container">
          <StationArchiveTable
            sortedFilteredData={store.sortedFilteredData}
            activeData={store.activeData}
            activeRegion={store.activeRegion}
            activeYear={store.activeYear}
            sortValue={store.sortValue}
            sortDir={store.sortDir}
            searchText={store.searchText}
            handleSort={handleSort}
          />
        </div>
      </section>
      <section className="section-centered section-context">
        <div className="panel">
          <h2 className="subheader">
            {intl.formatMessage({ id: "button:stations:headline" })}
          </h2>

          <ul className="list-inline list-buttongroup-dense">
            <li>
              <a className="secondary pure-button" href="/weather/measurements">
                {intl.formatMessage({
                  id: "button:stations:measurements:text"
                })}
              </a>
            </li>
            <li>
              <a className="secondary pure-button" href="/weather/stations">
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
export default observer(StationArchive);
