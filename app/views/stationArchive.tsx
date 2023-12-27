import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useIntl } from "react-intl";
import { currentSeasonYear } from "../util/date-season";
import { useStationData } from "../stores/stationDataStore";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    activeData,
    activeRegion,
    activeYear,
    fromURLSearchParams,
    load,
    searchText,
    setActiveRegion,
    setActiveYear,
    setSearchText,
    sortBy,
    minYear,
    sortDir,
    sortedFilteredData,
    sortValue,
    toggleActiveData,
    toURLSearchParams
  } = useStationData("name", r => r.startsWith("AT-07"), "", true);

  useEffect(() => {
    fromURLSearchParams(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load({ ogd: true });
  }, [load]);

  const updateURL = () => {
    const search = toURLSearchParams();
    setSearchParams(search);
  };

  const classChanged = "selectric-changed";
  const hideFilters: (keyof typeof activeData)[] = [
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
      <section className="section section-centered section-padding-height">
        {intl.formatMessage(
          {
            id: "measurements-archive:license"
          },
          {
            a: msg => (
              <a href="https://creativecommons.org/licenses/by/4.0/deed.de">
                {msg}
              </a>
            )
          }
        )}
      </section>
      <FilterBar
        search={true}
        searchTitle={intl.formatMessage({
          id: "measurements-archive:search"
        })}
        searchOnChange={val => {
          setSearchText(val);
          updateURL();
        }}
        searchValue={searchText}
      >
        <ProvinceFilter
          title={intl.formatMessage({
            id: "measurements-archive:filter:province"
          })}
          all={intl.formatMessage({ id: "filter:all" })}
          handleChange={val => {
            setActiveRegion(val);
            updateURL();
          }}
          value={activeRegion}
          className={activeRegion !== "all" ? classChanged : ""}
        />

        <YearFilter
          title={intl.formatMessage({
            id: "measurements-archive:filter:year"
          })}
          all={"latest"}
          minYear={minYear}
          maxYear={currentSeasonYear()}
          handleChange={val => {
            setActiveYear(val);
            updateURL();
          }}
          formatter={y => `${y}/${y + 1}`}
          value={activeYear}
          className={activeYear ? classChanged : ""}
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
          <StationArchiveTable
            sortedFilteredData={sortedFilteredData}
            activeData={activeData}
            activeRegion={activeRegion}
            activeYear={activeYear}
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
export default StationArchive;
