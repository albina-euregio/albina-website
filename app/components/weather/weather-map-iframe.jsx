import React from 'react';
import Base from '../../base';
import { observer } from 'mobx-react';

@observer
export default class WeatherMapIframe extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const params = {
      domain: this.props.store.domain,
      lang: window['appStore'].language,
      config: 'albina'
    };
    if(this.props.store.activeItem) {
      params['item'] = this.props.store.activeItem.id;
    }

    const url = Base.makeUrl(config.get('links.meteoViewer'), params);

    return (
      <iframe id="meteoMap" src={url}>
        <p>Your browser does not support iframes.</p>
      </iframe>
    );
  }
}
