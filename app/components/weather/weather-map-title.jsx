import React from 'react';
import {observer} from 'mobx-react';

@observer
export default class WeatherMapTitle extends React.Component {
  render() {
    return (
      <div>
        <h2 className='subheader'>
          {this.props.store.activeItem.dateCreation}
        </h2>
        <h2>{this.props.store.activeConfig ? this.props.store.activeConfig.description[window['appStore'].language] : ''}</h2>
      </div>
    )
  }
}
