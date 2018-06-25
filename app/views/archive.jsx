import React from 'react';
import ProvinceFilter from '../components/filters/province-filter.jsx';
import SmShare from '../components/organisms/sm-share.jsx';
import { parseDate, getSuccDate } from '../util/date.js';
import ArchiveStore from '../archiveStore.js';
import ArchiveItem from '../components/organisms/archive-item.jsx';

export default class Archive extends React.Component {
  constructor(props) {
    super(props);
    if(!window['archiveStore']) {
      window['archiveStore'] = new ArchiveStore();
    }
    this.store = window['archiveStore'];
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    return this._fetchData();
  }

  _fetchData() {
    const startDate = '2018-06-07';
    const endDate = '2018-06-10';
    //this.setState({loading: true});
    return this.store.load(startDate, endDate).then(() => {
      this.setState({loading: false});
    });
  }

  get regions() {
    // TODO: filtering
    return ['tyrol', 'southtyrol', 'trentino'];
  }

  get dates() {
    if(!this.state.loading) {
      // TODO: take filter values from store
      const startDate = parseDate('2018-06-07');
      const endDate = parseDate('2018-06-09');

      var d = startDate;
      const dates = [d];

      while(d < endDate) {
        d = getSuccDate(d);
        dates.push(d);
      }

      return dates;
    }
    return [];
  }

  render() {
    return (
      <div>
        <section className="section-padding section-header">
          <header className="section-centered">
            <p className="marginal">Some short text, only optionally, this is max. length</p>
            <h2 className="subheader">More</h2>
            <h1>Archive</h1>
          </header>
        </section>
        <section id className="section controlbar">
          <div className="section-centered">
            <p className="info"><strong>Filter</strong> Archive</p>
            <ul className="list-inline list-controlbar">
              <li><ProvinceFilter /></li>
            </ul>
          </div>
        </section>
        <section className="section-padding-height">
          <section className="section-centered">
            <div className="table-container">
              <table className="pure-table pure-table-striped pure-table-small table-archive">
                <thead>
                  <tr>
                    <th>Date / Time</th>
                    <th>Province</th>
                    <th>Download Bulletin</th>
                    <th>Map</th>
                  </tr>
                </thead>
                <tbody>
                  {this.dates.map((d) =>
                    this.regions.map((r) =>
                      <ArchiveItem date={d} region={r} />
                    )
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
