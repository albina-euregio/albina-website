import React from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import Base from '../base';
import PageHeadline from '../components/organisms/page-headline';

class StationMeasurements extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const params = {
      lang: window['appStore'].language
    };
    const url = Base.makeUrl(config.get('links.stationTable'),
      Object.assign(params, queryString.parse(this.props.location.params)));
    return (
      <div>
        <PageHeadline title="Station Measurements" subtitle="Snow &amp; Weather" />
        <section className="section">
          <div className="table-container">
            <iframe id="stationTable" src={url}>
              <p>Your browser does not support iframes.</p>
            </iframe>
          </div>
        </section>
      </div>
    );
  }
}
export default withRouter(StationMeasurements);
