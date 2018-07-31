import React from 'react';
import { withRouter } from 'react-router-dom';
import { Parser } from 'html-to-react';
import { BulletinStore } from '../stores/bulletinStore';
import BulletinHeader from '../components/bulletin/bulletin-header';
import BulletinMap from '../components/bulletin/bulletin-map';
import BulletinLegend from '../components/bulletin/bulletin-legend';
import BulletinButtonbar from '../components/bulletin/bulletin-buttonbar';
import BulletinReport from '../components/bulletin/bulletin-report';
import SmShare from '../components/organisms/sm-share';
import { parseDate } from '../util/date.js';
import Base from './../base';

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
    // TODO: use common staticPageStore
    const translatePath = (url) => Base.doRequest(config.get('apis.content') + 'router/translate-path?_format=json&path=/' + url);
    const getPageId = (response) => (JSON.parse(response)).entity.uuid;
    const lang = window['appStore'].language;

    const startDate = (props.match.params.date && parseDate(props.match.params.date))
      ? props.match.params.date : (
        this.store.settings.date ? this.store.settings.date : '2018-07-17' // TODO: should be current date
      );

    if(startDate != this.props.match.params.date) {
      // update URL if necessary
      props.history.push('/bulletin/' + startDate);
    }

    return Promise.all([
      this.store.load(startDate),
      translatePath('/bulletin').then(
        getPageId,
        () => {
          // if not found, fall back to 404 page
          return translatePath('404').then(getPageId)
        }
      ).then(id => {
        // query page content by id
        const langParam = (!lang || (lang == 'en')) ? '' : (lang + '/');
        const url = config.get('apis.content') + langParam + 'api/pages/' + id;
        return Base.doRequest(url);
      }).then(response => {
        // parse content
        const responseParsed = JSON.parse(response);
        this.setState({
          title: responseParsed.data.attributes.title,
          content: responseParsed.data.attributes.body
        });
      })
    ]);
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
        {
            (new Parser()).parse(this.state.content)
        }
        </div>
      </div>
    );
  }
}
export default withRouter(Bulletin);
