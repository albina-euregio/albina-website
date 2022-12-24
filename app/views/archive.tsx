import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import SmShare from "../components/organisms/sm-share.jsx";
import { getSuccDate, dateToISODateString } from "../util/date.js";
import { BulletinStore, BULLETIN_STORE, Status } from "../stores/bulletinStore";
import ArchiveItem from "../components/archive/archive-item.jsx";
import PageHeadline from "../components/organisms/page-headline.jsx";
import HTMLHeader from "../components/organisms/html-header";
import FilterBar from "../components/organisms/filter-bar.jsx";
import YearFilter from "../components/filters/year-filter.jsx";
import MonthFilter from "../components/filters/month-filter.jsx";
import ProvinceFilter from "../components/filters/province-filter.js";
import { useSearchParams } from "react-router-dom";
import { RegionCodes } from "../util/regions.js";
import { APP_STORE } from "../appStore.js";

function Archive() {
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const [buttongroup] = useState(searchParams.get("buttongroup"));
  const [month, setMonth] = useState(
    +(searchParams.get("month") || new Date().getMonth() + 1)
  );
  const [year, setYear] = useState(
    +searchParams.get("year") || new Date().getFullYear()
  );
  const [bulletinStatus, setBulletinStatus] = useState(
    {} as Record<number, Status | Record<RegionCodes, string | undefined>>
  );
  const [dates, setDates] = useState([] as Date[]);
  const [region, setRegion] = useState("");

  useEffect(() => {
    const dates = [];
    const startDate = new Date(year, month - 1, 1);
    for (
      let date = startDate;
      date.getMonth() === startDate.getMonth();
      date = getSuccDate(date)
    ) {
      dates.push(date);
      const dateString = dateToISODateString(date);
      if (dateString >= "2018-12-01") {
        BulletinStore.getBulletinStatus(dateToISODateString(date)).then(
          status => setBulletinStatus(s => ({ ...s, [date.getTime()]: status }))
        );
      } else {
        getArchiveBulletinStatus(dateString).then(status =>
          setBulletinStatus(s => ({ ...s, [date.getTime()]: status }))
        );
      }
    }
    setDates(dates);
    setSearchParams(
      buttongroup
        ? {
            year: String(year),
            month: String(month),
            buttongroup
          }
        : {
            year: String(year),
            month: String(month)
          },
      { replace: true }
    );
  }, [month, year, setDates, setSearchParams, buttongroup]);

  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "more:archive:headline" })} />
      <PageHeadline
        title={intl.formatMessage({ id: "more:archive:headline" })}
        subtitle={intl.formatMessage({
          id: "more:subpages:subtitle"
        })}
      />
      <FilterBar search={false}>
        <YearFilter
          buttongroup={buttongroup}
          title={intl.formatMessage({
            id: "archive:filter:year"
          })}
          minYear={window.config.archive.minYear}
          handleChange={setYear}
          formatter={y => `${y}/${y + 1}`}
          value={year}
        />
        {year && (
          <MonthFilter
            buttongroup={buttongroup}
            title={intl.formatMessage({
              id: "archive:filter:month"
            })}
            dateFormat={{ year: "2-digit", month: "short" }}
            handleChange={setMonth}
            length={7}
            minMonth={11}
            value={month}
            year={year}
          />
        )}
        <ProvinceFilter
          all={intl.formatMessage({ id: "filter:all" })}
          handleChange={setRegion}
          regionCodes={BULLETIN_STORE.microRegionIds}
          title={intl.formatMessage({
            id: "measurements:table:header:microRegion"
          })}
        />
      </FilterBar>
      <section className="section-padding-height">
        <section className="section-centered">
          <div className="table-container">
            <table className="pure-table pure-table-striped pure-table-small table-archive">
              <thead>
                <tr>
                  <th>
                    {intl.formatMessage({
                      id: "archive:table-header:date"
                    })}
                  </th>
                  <th>
                    {intl.formatMessage({
                      id: "archive:table-header:download"
                    })}
                  </th>
                  <th>
                    {intl.formatMessage({
                      id: "archive:table-header:map"
                    })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dates.map(
                  d =>
                    (bulletinStatus[d.getTime()] === "ok" ||
                      (typeof bulletinStatus[d.getTime()] === "object" &&
                        Object.values(bulletinStatus[d.getTime()]).some(
                          url => !!url
                        ))) && (
                      <ArchiveItem
                        key={d.getTime()}
                        date={d}
                        status={bulletinStatus[d.getTime()]}
                      />
                    )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section className="section-centered section-context">
        <div className="panel">
          <h2 className="subheader">
            {intl.formatMessage({
              id: "archive:former-archives:headline"
            })}
          </h2>
          <ul className="list-inline list-buttongroup-dense">
            <li>
              <a
                className="secondary pure-button"
                href={config.apis.bulletin.archiveTyrol}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage({
                  id: "archive:former-archives:tyrol"
                })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href="http://wetter.provinz.bz.it/archiv-lawinen.asp"
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage({
                  id: "archive:former-archives:south-tyrol"
                })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href="https://www.meteotrentino.it/#!/content?menuItemDesktop=32"
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage({
                  id: "archive:former-archives:trentino"
                })}
              </a>
            </li>
          </ul>
        </div>
      </section>
      <SmShare />
    </>
  );
}

export default observer(Archive);

async function getArchiveBulletinStatus(dateString: string) {
  const [at07, it32bz, it32tn] = await Promise.all([
    fetch(
      `${config.apis.bulletin.archive}tyrol/pdf/${dateString}_0730_lwdtirol_lagebericht.pdf`,
      { method: "head" }
    ),
    fetch(
      `${config.apis.bulletin.archive}south_tyrol/pdf/${dateString}.${
        APP_STORE.language === "it" ? "it" : "de"
      }.pdf`,
      { method: "head" }
    ),
    fetch(
      `${config.apis.bulletin.archive}trentino/pdf/${dateString}_valanghe_it.pdf`,
      { method: "head" }
    )
  ]);
  return {
    "AT-07": at07.ok ? at07.url : undefined,
    "IT-32-BZ": it32bz.ok ? it32bz.url : undefined,
    "IT-32-TN": it32tn.ok ? it32tn.url : undefined
  };
}
