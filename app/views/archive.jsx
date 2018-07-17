import React from 'react';
import { observer } from 'mobx-react';
import SmShare from '../components/organisms/sm-share.jsx';
import { parseDate, getSuccDate, dateToISODateString } from '../util/date.js';
import ArchiveStore from '../archiveStore.js';
import ArchiveItem from '../components/archive/archive-item.jsx';
import PageHeadline from '../components/organisms/page-headline.jsx';
import FilterBar from '../components/organisms/filter-bar.jsx';
import LanguageFilter from '../components/filters/language-filter.jsx';
import YearFilter from '../components/filters/year-filter.jsx';
import MonthFilter from '../components/filters/month-filter.jsx';
import DayFilter from '../components/filters/day-filter.jsx';

@observer class Archive extends React.Component {
  constructor(props) {
    super(props);
    if(!window['archiveStore']) {
      window['archiveStore'] = new ArchiveStore();
    }
    this.store = window['archiveStore'];

    // TODO: set more sensible inital values: e.g. last week
    this.state = {
      startDate: '2018-06-07',
      endDate: '2018-06-09'
    }
  }

  componentWillReceiveProps(nextProps) {
    this._fetchData(nextProps);
  }


  componentDidMount() {
    return this._fetchData();
  }

  _fetchData() {
    return this.store.load(this.state.startDate, this.state.endDate);
  }

  get dates() {
    if(!this.store.loading) {
      // TODO: take filter values from store
      const startDate = this.store.startDate ? this.store.startDate : parseDate(this.state.startDate);
      const endDate = this.store.endDate ? this.store.endDate : parseDate(this.state.endDate);

      const test = (date) => {
        return this.store.getStatus(dateToISODateString(date)) == 'ok';
      };

      var d = startDate;
      const dates = [startDate];
      while(d < endDate) {
        d = getSuccDate(d);
        dates.push(d);
      }

      return dates
        .filter((d) => test(d))
        .slice(0, window['config'].get('archive.maxResults'));
    }
    return [];
  }

  handleChangeYear = (val) => {
    this.store.year = val;
  };

  handleChangeMonth = (val) => {
    this.store.month = val;
  };

  handleChangeDay = (val) => {
    this.store.day = val;
  };

  render() {
    return (
      <div>
        <PageHeadline title="Archive" subtitle="More" marginal="Some short text, only optionally, this is max. length" />
        <FilterBar search={false}>
          <YearFilter
            minYear={window['config'].get('archive.minYear')}
            handleChange={this.handleChangeYear}
            value={this.store.year} />
          { this.store.year &&
            <MonthFilter
              handleChange={this.handleChangeMonth}
              value={this.store.month} />
          }
          { this.store.month &&
            <DayFilter
              handleChange={this.handleChangeDay}
              year={this.store.year}
              month={this.store.month}
              value={this.store.day} />
          }
          <LanguageFilter />
        </FilterBar>
        <section className="section-padding-height">
          <section className="section-centered">
            <div className="table-container">
              <table className="pure-table pure-table-striped pure-table-small table-archive">
                <thead>
                  <tr>
                    <th>Date / Time</th>
                    <th>Download Bulletin</th>
                    <th>Map</th>
                  </tr>
                </thead>
                <tbody>
                  {this.dates.map((d) =>
                    <ArchiveItem key={d.getTime()} date={d} />
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
        <section className="section-centered">
          <div className="panel brand">
            <p>A fava bean collard greens endive tomatillo lotus root okra winter <a href>purslane</a> zucchini parsley spinach artichoke.</p>
            <ul className="list-inline ">
              <li><a href="#" title="The Button" className="pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="pure-button">The Button</a>
              </li>
            </ul>
          </div>
        </section>
        <section id className="section-centered section-context">
          <div className="panel">
            <h2 className="subheader">More</h2>
            <ul className="list-inline ">
              <li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li>
            </ul>
          </div>
        </section>
        <SmShare />
      </div>
    );
  }
}

export default Archive;
