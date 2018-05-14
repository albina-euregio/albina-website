import React from 'react';
import Base from './../base';
import BulletinStore from '../bulletinStore.js';
import BulletinHeader from '../components/organisms/bulletin-header.jsx';
import BulletinMap from '../components/organisms/bulletin-map.jsx';
import BulletinLegend from '../components/organisms/bulletin-legend.jsx';
import BulletinButtonbar from '../components/organisms/bulletin-buttonbar.jsx';
import BulletinReport from '../components/organisms/bulletin-report.jsx';
import BulletinAdditional from '../components/organisms/bulletin-additional.jsx';
import SmShare from '../components/organisms/sm-share.jsx';
import Context from '../components/organisms/context.jsx';

export default class Bulletin extends React.Component {
  constructor(props) {
    super(props);
    this.store = new BulletinStore();
    if(typeof(window.bulletinStore) === 'undefined') {
      window.bulletinStore = this.store;
    }
  }

  componentWillReceiveProps(nextProps) {
    this._fetchData(nextProps);
  }

  componentDidMount() {
    this._fetchData(this.props);
  }

  _fetchData(props) {
    const date = '2018-05-02'; // TODO: should be current date
    this.store.load(date);
  }

  render() {
    return (
      <div>
        <BulletinHeader date={this.store.date} />
        <BulletinMap date={this.store.date} />
        <BulletinLegend />
        <BulletinButtonbar />
        <BulletinReport date={this.store.date} />
        <BulletinAdditional />
        <SmShare />
        <Context />
      </div>
    );
  }
}
