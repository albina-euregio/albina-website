import React from 'react';
import { withRouter } from 'react-router-dom';
import PageHeadline from '../components/organisms/page-headline.jsx';

class WeatherMap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // use the last path parameter as "domain" and add optional parameters
    const url = config.get('links.meteoViewer')
    + '?domain=' + this.props.match.params.datum
    + (this.props.location.search ? ('&' + this.props.location.search.substr(1)) : '');
    return (
      <div>
        <PageHeadline title="Snow &amp; Weather" />
        <section className="section-map section-centered">
          <iframe id="meteoMap" src={url}>
            <p>Your browser does not support iframes.</p>
          </iframe>
        </section>
      </div>
    );
  }
}
export default withRouter(WeatherMap);
