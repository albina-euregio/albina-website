import React from 'react';
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
  }

  _fetchData(props) {
    const date = '2018-05-02'; // TODO: should be current date
    const url = config.get('apis.bulletin') + '?' + encodeURIComponent(date + 'T00:00:00+02:00');

    Base.doRequest(url).then(
      response => {
        const responseParsed = JSON.parse(response);
        this.setState({
          current: responseParsed
        })
      }
    );
  }

  render() {
    return (
      <div>
        <BulletinHeader />
        <BulletinMap />
        <BulletinLegend />
        <BulletinButtonbar />
        <BulletinReport />
        <BulletinAdditional />
        <SmShare />
        <Context />
      </div>
    );
  }
}
