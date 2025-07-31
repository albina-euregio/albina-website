import React, { useContext, useEffect, useMemo, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { useIntl } from "../i18n";
import SmShare from "../components/organisms/sm-share.jsx";
import { currentSeasonYear } from "../util/date-season";
import { BulletinCollection } from "../stores/bulletin";
import ArchiveItem, {
  type BulletinStatus,
  type RegionBulletinStatus,
  type LegacyBulletinStatus
} from "../components/archive/archive-item.jsx";
import PageHeadline from "../components/organisms/page-headline.jsx";
import HTMLHeader from "../components/organisms/html-header";
import FilterBar from "../components/organisms/filter-bar";
import YearFilter from "../components/filters/year-filter.jsx";
import MonthFilter from "../components/filters/month-filter.jsx";
import ProvinceFilter from "../components/filters/province-filter.js";
import { useSearchParams } from "react-router-dom";
import { fetchExists } from "../util/fetch";
import { microRegionIds } from "../stores/microRegions.js";
import { setLanguage } from "../appStore.ts";
import { HeadlessContext } from "../contexts/HeadlessContext.tsx";

function Archive() {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [searchParams, setSearchParams] = useSearchParams();
  const headless = useContext(HeadlessContext);
  const [buttongroup] = useState(searchParams.get("buttongroup"));
  const minMonth = 11;
  const [month, setMonth] = useState(
    +(searchParams.get("month") || Temporal.Now.plainDateISO().month)
  );
  if (month < minMonth) setMonth(m => m + 12);
  const [year, setYear] = useState(
    +searchParams.get("year") || currentSeasonYear()
  );
  const [bulletinStatus, setBulletinStatus] = useState(
    {} as Record<ReturnType<Temporal.PlainDate["toString"]>, BulletinStatus>
  );
  const [dates, setDates] = useState([] as Temporal.PlainDate[]);
  const [region, setRegion] = useState(searchParams.get("region") || "");
  const microRegions = useMemo(
    () => microRegionIds(getDatesInMonth(year, month)[0]),
    [month, year]
  );

  if (["de", "en"].includes(searchParams.get("language") || "")) {
    setLanguage(searchParams.get("language"));
  }

  useEffect(() => {
    const dates = getDatesInMonth(year, month);
    dates.forEach(date => {
      if (date.toString() >= "2018-12-01" && region) {
        getRegionBulletinStatus(date, region).then(status =>
          setBulletinStatus(s => ({ ...s, [date.toString()]: status }))
        );
      } else if (date.toString() >= "2018-12-01") {
        new BulletinCollection(date, lang)
          .loadStatus()
          .then(status =>
            setBulletinStatus(s => ({ ...s, [date.toString()]: status }))
          );
      } else {
        getArchiveBulletinStatus(date).then(status =>
          setBulletinStatus(s => ({ ...s, [date.toString()]: status }))
        );
      }
    });
    setDates(dates);
    setSearchParams(
      buttongroup
        ? {
            year: String(year),
            month: String(month),
            region,
            buttongroup
          }
        : {
            year: String(year),
            month: String(month),
            region
          },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, setDates, setSearchParams, buttongroup, region, lang]);

  function isDateShown(d: Temporal.PlainDate): boolean {
    const status = bulletinStatus[d.toString()];
    return (
      status === "ok" ||
      (typeof status === "object" &&
        status.$type === "RegionBulletinStatus" &&
        status.status === "ok") ||
      (typeof status === "object" &&
        status.$type === "LegacyBulletinStatus" &&
        Object.values(status.status).some(url => !!url))
    );
  }

  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "more:archive:headline" })} />
      <PageHeadline
        title={intl.formatMessage({ id: "more:archive:headline" })}
        subtitle={intl.formatMessage({
          id: "more:subpages:subtitle"
        })}
        backLink={headless && "/headless/bulletin/latest"}
      />
      <FilterBar search={false}>
        <YearFilter
          buttongroup={buttongroup}
          title={intl.formatMessage({
            id: "archive:filter:year"
          })}
          minYear={window.config.archive.minYear}
          maxYear={currentSeasonYear()}
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
            minMonth={minMonth}
            value={month}
            year={year}
          />
        )}
        <ProvinceFilter
          all={intl.formatMessage({ id: "filter:all" })}
          handleChange={setRegion}
          regionCode={region}
          regionCodes={microRegions}
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
                  <th colSpan={99}></th>
                </tr>
              </thead>
              <tbody>
                {dates
                  .filter(d => isDateShown(d))
                  .map(d => (
                    <ArchiveItem
                      key={d.toString()}
                      date={d}
                      status={bulletinStatus[d.toString()]}
                    />
                  ))}
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
                href={`${config.apis.bulletin.archive}tyrol/`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage({
                  id: "region:AT-07"
                })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href={`${config.apis.bulletin.archive}south_tyrol/`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage({
                  id: "region:IT-32-BZ"
                })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href={`${config.apis.bulletin.archive}trentino/`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage({
                  id: "region:IT-32-TN"
                })}
              </a>
            </li>
          </ul>
        </div>
      </section>
      <SmShare />
    </>
  );

  async function getRegionBulletinStatus(
    date: Temporal.PlainDate,
    region: string
  ): Promise<RegionBulletinStatus> {
    const collection = new BulletinCollection(date, lang);
    await collection.load();
    return {
      $type: "RegionBulletinStatus",
      status: collection.status,
      bulletin: collection.getBulletinForBulletinOrRegion(region)
    };
  }

  async function getArchiveBulletinStatus(
    date: Temporal.PlainDate
  ): Promise<LegacyBulletinStatus> {
    const [at07, it32bz, it32tn] = await Promise.all([
      fetchExists(
        `${config.apis.bulletin.archive}tyrol/pdf/${date}_0730_lwdtirol_lagebericht.pdf`
      ),
      fetchExists(
        `${config.apis.bulletin.archive}south_tyrol/pdf/${date}.${
          lang === "it" ? "it" : "de"
        }.pdf`
      ),
      fetchExists(
        `${config.apis.bulletin.archive}trentino/pdf/${date}_valanghe_it.pdf`
      )
    ]);
    return {
      $type: "LegacyBulletinStatus",
      status: {
        "AT-07": at07 ? at07.url : undefined,
        "IT-32-BZ": it32bz ? it32bz.url : undefined,
        "IT-32-TN": it32tn ? it32tn.url : undefined
      }
    };
  }
}

export default Archive;

function getDatesInMonth(year: number, month: number): Temporal.PlainDate[] {
  const startDate =
    month > 12
      ? new Temporal.PlainDate(year + 1, month - 12, 1)
      : new Temporal.PlainDate(year, month, 1);
  return new Array(startDate.daysInMonth)
    .fill(0)
    .map((_, i) => startDate.with({ day: i + 1 }));
}
