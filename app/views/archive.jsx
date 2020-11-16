import React from "react";
import { observer, inject } from "mobx-react";
import { reaction } from "mobx";
import { injectIntl } from "react-intl";
import SmShare from "../components/organisms/sm-share.jsx";
import { getSuccDate, dateToISODateString } from "../util/date.js";
import ArchiveStore from "../stores/archiveStore.js";
import ArchiveItem from "../components/archive/archive-item.jsx";
import PageHeadline from "../components/organisms/page-headline.jsx";
import HTMLHeader from "../components/organisms/html-header";
import FilterBar from "../components/organisms/filter-bar.jsx";
import LanguageFilter from "../components/filters/language-filter.jsx";
import YearFilter from "../components/filters/year-filter.jsx";
import MonthFilter from "../components/filters/month-filter.jsx";
import DayFilter from "../components/filters/day-filter.jsx";
import { tooltip_init } from "../js/tooltip";

class Archive extends React.Component {
  constructor(props) {
    super(props);
    if (!window["archiveStore"]) {
      window["archiveStore"] = new ArchiveStore();
    }
    this.store = window["archiveStore"];

    if (!this.store.year) {
      const d = new Date();

      this.store.month = d.getMonth() + 1;
      this.store.year = d.getFullYear();
    }

    this.state = {
      title: "",
      headerText: "",
      content: "",
      sharable: false
    };
  }

  componentDidMount() {
    const up = () => {
      window.setTimeout(tooltip_init, 1000);
    };

    reaction(() => this.store.loading, up);
    reaction(() => this.store.month, up);
    reaction(() => this.store.year, up);
    reaction(() => this.store.day, up);
    up();
  }

  get dates() {
    if (!this.store.loading) {
      // TODO: take filter values from store

      const startDate = this.store.startDate ? this.store.startDate : "";
      const endDate = this.store.endDate ? this.store.endDate : "";

      const test = date => {
        return this.store.getStatus(dateToISODateString(date)) == "ok";
      };

      if (startDate && endDate) {
        var d = startDate;
        const dates = [startDate];
        while (d < endDate) {
          d = getSuccDate(d);
          dates.push(d);
        }

        return dates
          .filter(d => test(d))
          .slice(0, window.config.archive.maxResults);
      }
    }
    return [];
  }

  handleChangeYear = val => {
    this.store.year = val;
  };

  handleChangeMonth = val => {
    this.store.month = val;
  };

  handleChangeDay = val => {
    this.store.day = val;
  };

  render() {
    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({ id: "more:archive:headline" })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({ id: "more:archive:headline" })}
          marginal={this.state.headerText}
        />
        <FilterBar search={false}>
          <YearFilter
            title={this.props.intl.formatMessage({
              id: "archive:filter:year"
            })}
            minYear={window.config.archive.minYear}
            handleChange={this.handleChangeYear}
            value={this.store.year}
          />
          {this.store.year && (
            <MonthFilter
              title={this.props.intl.formatMessage({
                id: "archive:filter:month"
              })}
              handleChange={this.handleChangeMonth}
              value={this.store.month}
            />
          )}

          {/*
              #742 Hide filter parameters in archive
            */
          false && (
            <DayFilter
              title={this.props.intl.formatMessage({
                id: "archive:filter:day"
              })}
              all={this.props.intl.formatMessage({
                id: "filter:all"
              })}
              handleChange={this.handleChangeDay}
              year={this.store.year}
              month={this.store.month}
              value={this.store.day}
            />
          )}

          {false && (
            <LanguageFilter
              title={this.props.intl.formatMessage({
                id: "archive:filter:language"
              })}
              all={this.props.intl.formatMessage({ id: "filter:all" })}
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
                      {this.props.intl.formatMessage({
                        id: "archive:table-header:date"
                      })}
                    </th>
                    <th>
                      {this.props.intl.formatMessage({
                        id: "archive:table-header:download"
                      })}
                    </th>
                    <th>
                      {this.props.intl.formatMessage({
                        id: "archive:table-header:map"
                      })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.dates.map(d => (
                    <ArchiveItem
                      key={d.getTime()}
                      date={d}
                      lang={window["appStore"].language}
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
              {this.props.intl.formatMessage({
                id: "archive:former-archives:headline"
              })}
            </h2>
            <ul className="list-inline list-buttongroup-dense">
              <li>
                <a
                  className="secondary pure-button"
                  href="https://avalanche.report/albina_files/archive/tyrol/"
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "archive:former-archives:tyrol"
                  })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href="http://wetter.provinz.bz.it/archiv-lawinen.asp"
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "archive:former-archives:south-tyrol"
                  })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href="https://www.meteotrentino.it/#!/content?menuItemDesktop=32"
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
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
}

export default inject("locale")(injectIntl(observer(Archive)));
