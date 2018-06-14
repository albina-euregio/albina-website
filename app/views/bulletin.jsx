import React from 'react';
import { withRouter } from 'react-router-dom';
import { reaction } from 'mobx';
import {BulletinStore} from '../bulletinStore.js';
import BulletinHeader from '../components/organisms/bulletin-header.jsx';
import BulletinMap from '../components/organisms/bulletin-map.jsx';
import BulletinLegend from '../components/organisms/bulletin-legend.jsx';
import BulletinButtonbar from '../components/organisms/bulletin-buttonbar.jsx';
import BulletinReport from '../components/organisms/bulletin-report.jsx';
import SmShare from '../components/organisms/sm-share.jsx';
import Context from '../components/organisms/context.jsx';
import { parseDate } from '../util/date.js';

class Bulletin extends React.Component {
  constructor(props) {
    super(props);
    if (typeof window.bulletinStore === 'undefined') {
      window.bulletinStore = new BulletinStore();
    }
    this.store = window.bulletinStore;
  }

  componentDidMount() {
    // automatically update url
    // const urlHandler = reaction(
    //   () => this.store.settings.date,
    //   (date) => {
    //     if(date && date != )
    //     this.props.history.push('/bulletin/' + date);
    //   }
    // );

    return this._fetchData(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const newDate = this.props.match.params.date;
      if(newDate && newDate != this.store.settings.date) {
        this._fetchData(this.props);
      }
    }
  }

  _fetchData(props) {
    const startDate = (props.match.params.date && parseDate(props.match.params.date))
      ? props.match.params.date : (
        this.store.settings.date ? this.store.settings.date : '2018-06-09' // TODO: should be current date
      );

    if(startDate != this.props.match.params.date) {
      // update URL if necessary
      props.history.push('/bulletin/' + startDate);
    }
    return this.store.load(startDate);
  }

  render() {
    return (
      <div>
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
export default withRouter(Bulletin);
