import React from 'react';
import { withRouter } from 'react-router-dom';
import { Parser } from 'html-to-react';
import { reaction } from 'mobx';
import { BulletinStore } from '../stores/bulletinStore';
import BulletinHeader from '../components/bulletin/bulletin-header';
import BulletinMap from '../components/bulletin/bulletin-map';
import BulletinLegend from '../components/bulletin/bulletin-legend';
import BulletinButtonbar from '../components/bulletin/bulletin-buttonbar';
import BulletinReport from '../components/bulletin/bulletin-report';
import SmShare from '../components/organisms/sm-share';
import { parseDate } from '../util/date.js';
import Base from './../base';
import { tooltip_init } from '../js/tooltip';

class Bulletin extends React.Component {
  constructor(props) {
    super(props);
    if (typeof window.bulletinStore === 'undefined') {
      window.bulletinStore = new BulletinStore();
    }
    this.store = window.bulletinStore;
    this.state = {
      title: '',
      content: ''
    }
  }

  componentDidMount() {
    window['staticPageStore'].loadPage('/bulletin').then((response) => {
      // parse content
      const responseParsed = JSON.parse(response);
      this.setState({
        title: responseParsed.data.attributes.title,
        content: responseParsed.data.attributes.body
      });
    });

    const onUpdateStatus = reaction(
      () => this.store.settings.status,
      (status) => {
        window.setTimeout(tooltip_init, 100);
      }
    );
    const onUpdateRegion = reaction(
      () => this.store.settings.region,
      (region) => {
        if(region) {
          window.setTimeout(tooltip_init, 100);
        }
      }
    );
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
        this.store.settings.date ? this.store.settings.date : '2018-07-17' // TODO: should be current date
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
        <BulletinHeader store={this.store} title={this.state.title} />
        <BulletinMap store={this.store} />
        <BulletinLegend problems={this.store.problems} />
        <BulletinButtonbar />
        <BulletinReport store={this.store} />
        <SmShare />
        <div>
          { (new Parser()).parse(this.state.content) }
        </div>
      </div>
    );
  }
}
export default withRouter(Bulletin);
