import React from 'react';
import {BulletinStore} from '../bulletinStore.js';
import BulletinHeader from '../components/organisms/bulletin-header.jsx';
import BulletinMap from '../components/organisms/bulletin-map.jsx';
import BulletinLegend from '../components/organisms/bulletin-legend.jsx';
import BulletinButtonbar from '../components/organisms/bulletin-buttonbar.jsx';
import BulletinReport from '../components/organisms/bulletin-report.jsx';
import SmShare from '../components/organisms/sm-share.jsx';
import Context from '../components/organisms/context.jsx';

export default class Bulletin extends React.Component {
  constructor(props) {
    super(props);
    this.store = new BulletinStore();
    if (typeof window.bulletinStore === 'undefined') {
      window.bulletinStore = this.store;
    }
  }

  componentDidMount() {
    return this._fetchData(this.props);
  }

  _fetchData(props) {
    const startDate = '2018-05-08'; // TODO: should be current date
    return this.store.load(startDate);
  }

  render() {
    return (
      <div>
        <span>{this.date}</span>
        <BulletinHeader store={this.store} />
        <BulletinMap store={this.store} />
        <BulletinLegend problems={this.store.problems} />
        <BulletinButtonbar />
        <BulletinReport store={this.store} />
        <SmShare />
        <Context />
      </div>
    );
  }
}
