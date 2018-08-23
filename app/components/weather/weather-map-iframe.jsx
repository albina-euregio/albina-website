import React from 'react';
import Base from '../../base';

export default class WeatherMapIframe extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const url = Base.makeUrl(config.get('links.meteoViewer'), {
      domain: this.props.domain
    });

    return (
      <iframe id="meteoMap" src={url}>
        <p>Your browser does not support iframes.</p>
      </iframe>
    );
  }
}
