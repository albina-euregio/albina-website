import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import SmShare from "../components/organisms/sm-share.jsx";
import { getSuccDate, dateToISODateString } from "../util/date.js";
import { BulletinStore, Status } from "../stores/bulletinStore";
import ArchiveItem from "../components/archive/archive-item.jsx";
import PageHeadline from "../components/organisms/page-headline.jsx";
import HTMLHeader from "../components/organisms/html-header";
import FilterBar from "../components/organisms/filter-bar.jsx";
import YearFilter from "../components/filters/year-filter.jsx";
import MonthFilter from "../components/filters/month-filter.jsx";
import { useSearchParams } from "react-router-dom";

function Archive() {
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const [month, setMonth] = useState(
    +(searchParams.get("month") || new Date().getMonth() + 1)
  );
  const [year, setYear] = useState(
    +searchParams.get("year") || new Date().getFullYear()
  );
  const [bulletinStatus, setBulletinStatus] = useState(
    {} as Record<number, Status>
  );
  const [dates, setDates] = useState([] as Date[]);

  useEffect(() => {
    const dates = [];
    const startDate = new Date(year, month - 1, 1);
    for (
      let date = startDate;
      date.getMonth() === startDate.getMonth();
      date = getSuccDate(date)
    ) {
      dates.push(date);
      BulletinStore.getBulletinStatus(dateToISODateString(date)).then(status =>
        setBulletinStatus(s => ({ ...s, [date.getTime()]: status }))
      );
    }
    setDates(dates);
    setSearchParams(
      { year: String(year), month: String(month) },
      { replace: true }
    );
  }, [month, year, setDates, setSearchParams]);

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
          buttongroup={false}
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
            buttongroup={false}
            title={intl.formatMessage({
              id: "archive:filter:month"
            })}
            dateFormat={{ year: "2-digit", month: "short" }}
            handleChange={setMonth}
            length={7}
            minMonth={+year === 2019 ? 10 : 11}
            value={month}
            year={year}
          />
        )}
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
                    bulletinStatus[d.getTime()] === "ok" && (
                      <ArchiveItem key={d.getTime()} date={d} />
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
