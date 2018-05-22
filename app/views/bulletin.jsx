import React from 'react';
import Base from './../base';
import {BulletinData, BulletinStore} from '../bulletinStore.js';
import BulletinHeader from '../components/organisms/bulletin-header.jsx';
import BulletinMap from '../components/organisms/bulletin-map.jsx';
import BulletinLegend from '../components/organisms/bulletin-legend.jsx';
import BulletinButtonbar from '../components/organisms/bulletin-buttonbar.jsx';
import BulletinReport from '../components/organisms/bulletin-report.jsx';
import BulletinAdditional from '../components/organisms/bulletin-additional.jsx';
import SmShare from '../components/organisms/sm-share.jsx';
import Context from '../components/organisms/context.jsx';
import {computed} from 'mobx';

export default class Bulletin extends React.Component {
  constructor(props) {
    super(props);
    this.store = new BulletinStore();
    if (typeof window.bulletinStore === 'undefined') {
      window.bulletinStore = this.store;
    }
  }

  componentWillReceiveProps(nextProps) {
    return this._fetchData(nextProps);
  }

  componentDidMount() {
    return this._fetchData(this.props);
  }

  _fetchData(props) {
    const startDate = '2018-05-02'; // TODO: should be current date
    return this.store.load(startDate);
  }

  render() {
    return (
      <div>
        <span>{this.date}</span>
        <BulletinHeader store={this.store} settings={this.store.settings} />
        <BulletinMap store={this.store} settings={this.store.settings} />
        <BulletinLegend store={this.store} settings={this.store.settings} />
        <BulletinButtonbar />
        <BulletinReport store={this.store} settings={this.store.settings} />
        <BulletinAdditional />
        <SmShare />
        <Context />
      </div>
    );
  }
}
