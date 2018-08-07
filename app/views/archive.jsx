import React from 'react';
import { observer, inject } from 'mobx-react';
import { reaction } from 'mobx';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import SmShare from '../components/organisms/sm-share.jsx';
import { parseDate, getSuccDate, dateToISODateString } from '../util/date.js';
import ArchiveStore from '../stores/archiveStore.js';
import ArchiveItem from '../components/archive/archive-item.jsx';
import PageHeadline from '../components/organisms/page-headline.jsx';
import FilterBar from '../components/organisms/filter-bar.jsx';
import LanguageFilter from '../components/filters/language-filter.jsx';
import YearFilter from '../components/filters/year-filter.jsx';
import MonthFilter from '../components/filters/month-filter.jsx';
import DayFilter from '../components/filters/day-filter.jsx';
import { tooltip_init } from '../js/tooltip';

class Archive extends React.Component {
  constructor(props) {
    super(props);
    if(!window['archiveStore']) {
      window['archiveStore'] = new ArchiveStore();
    }
    this.store = window['archiveStore'];

    if(!this.store.year) {
      const d = new Date();

      this.store.month = d.getMonth() + 1;
      this.store.year = d.getFullYear();
    }
  }

  componentDidMount() {
    const up = () => { window.setTimeout(tooltip_init, 1000) }

    const onUpdateStatus = reaction(
      () => this.store.loading,
      up
    );
    const onUpdateMonth = reaction(
      () => this.store.month,
      up
    );
    const onUpdateYear = reaction(
      () => this.store.year,
      up
    );
    const onUpdateDay = reaction(
      () => this.store.day,
      up
    );
    up();
  }

  get dates() {
    if(!this.store.loading) {
      // TODO: take filter values from store
      const startDate = this.store.startDate ? this.store.startDate : '';
      const endDate = this.store.endDate ? this.store.endDate : '';

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
            title={this.props.intl.formatMessage({id: 'archive:filter:year'})}
            minYear={window['config'].get('archive.minYear')}
            handleChange={this.handleChangeYear}
            value={this.store.year} />
          { this.store.year &&
            <MonthFilter
              title={this.props.intl.formatMessage({id: 'archive:filter:month'})}
              handleChange={this.handleChangeMonth}
              value={this.store.month} />
          }
          { this.store.month &&
            <DayFilter
              title={this.props.intl.formatMessage({id: 'archive:filter:day'})}
              all={this.props.intl.formatMessage({id: 'filter:all'})}
              handleChange={this.handleChangeDay}
              year={this.store.year}
              month={this.store.month}
              value={this.store.day} />
          }
          <LanguageFilter
            title={this.props.intl.formatMessage({id: 'archive:filter:language'})}
            all={this.props.intl.formatMessage({id: 'filter:all'})} />
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

export default inject('locale')(injectIntl(observer(Archive)));
