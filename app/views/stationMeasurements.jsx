import React from 'react';
import PageHeadline from '../components/organisms/page-headline';

export default class StationMeasurements extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const url = config.get('links.stationTable');
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
