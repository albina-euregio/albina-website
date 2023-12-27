import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import SmShare from "../components/organisms/sm-share.jsx";
import { getSuccDate, dateToISODateString } from "../util/date.js";
import { currentSeasonYear } from "../util/date-season";
import { BulletinCollection } from "../stores/bulletin";
import ArchiveItem, {
  type BulletinStatus,
  type RegionBulletinStatus,
  type LegacyBulletinStatus
} from "../components/archive/archive-item.jsx";
import PageHeadline from "../components/organisms/page-headline.jsx";
import HTMLHeader from "../components/organisms/html-header";
import FilterBar from "../components/organisms/filter-bar.jsx";
import YearFilter from "../components/filters/year-filter.jsx";
import MonthFilter from "../components/filters/month-filter.jsx";
import ProvinceFilter from "../components/filters/province-filter.js";
import { useSearchParams } from "react-router-dom";
import { fetchExists } from "../util/fetch";
import { microRegionIds } from "../stores/microRegions.js";

function Archive() {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [searchParams, setSearchParams] = useSearchParams();
  const [buttongroup] = useState(searchParams.get("buttongroup"));
  const minMonth = 11;
  const [month, setMonth] = useState(
    +(searchParams.get("month") || new Date().getMonth() + 1)
  );
  if (month < minMonth) setMonth(m => m + 12);
  const [year, setYear] = useState(
    +searchParams.get("year") || currentSeasonYear()
  );
  const [bulletinStatus, setBulletinStatus] = useState(
    {} as Record<number, BulletinStatus>
  );
  const [dates, setDates] = useState([] as Date[]);
  const [region, setRegion] = useState(searchParams.get("region") || "");
  const [microRegions] = useState(() => microRegionIds());

  useEffect(() => {
    const dates = getDatesInMonth(year, month);
    dates.forEach(date => {
      const dateString = dateToISODateString(date);
      if (dateString >= "2018-12-01" && region) {
        getRegionBulletinStatus(dateString, region).then(status =>
          setBulletinStatus(s => ({ ...s, [date.getTime()]: status }))
        );
      } else if (dateString >= "2018-12-01") {
        new BulletinCollection(dateString, lang)
          .loadStatus()
          .then(status =>
            setBulletinStatus(s => ({ ...s, [date.getTime()]: status }))
          );
      } else {
        getArchiveBulletinStatus(dateString).then(status =>
          setBulletinStatus(s => ({ ...s, [date.getTime()]: status }))
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
  }, [month, year, setDates, setSearchParams, buttongroup, region, lang]);

  function isDateShown(d: Date): boolean {
    const status = bulletinStatus[d.getTime()];
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
                      key={d.getTime()}
                      date={d}
                      status={bulletinStatus[d.getTime()]}
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

  async function getRegionBulletinStatus(
    dateString: string,
    region: string
  ): Promise<RegionBulletinStatus> {
    const collection = await new BulletinCollection(dateString, lang).load();
    return {
      $type: "RegionBulletinStatus",
      status: collection.status,
      bulletin: collection.getBulletinForBulletinOrRegion(region)
    };
  }

  async function getArchiveBulletinStatus(
    dateString: string
  ): Promise<LegacyBulletinStatus> {
    const [at07, it32bz, it32tn] = await Promise.all([
      fetchExists(
        `${config.apis.bulletin.archive}tyrol/pdf/${dateString}_0730_lwdtirol_lagebericht.pdf`
      ),
      fetchExists(
        `${config.apis.bulletin.archive}south_tyrol/pdf/${dateString}.${
          lang === "it" ? "it" : "de"
        }.pdf`
      ),
      fetchExists(
        `${config.apis.bulletin.archive}trentino/pdf/${dateString}_valanghe_it.pdf`
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

function getDatesInMonth(year: number, month: number): Date[] {
  const dates: Date[] = [];
  const startDate = new Date(year, month - 1, 1);
  for (
    let date = startDate;
    date.getMonth() === startDate.getMonth();
    date = getSuccDate(date)
  ) {
    dates.push(date);
  }
  return dates;
}
