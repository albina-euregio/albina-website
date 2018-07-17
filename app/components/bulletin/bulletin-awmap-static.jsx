import React from 'react';
import {observer} from 'mobx-react';

@observer class BulletinAWMapStatic extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const url = window['config'].get('apis.geo')
      + this.props.store.settings.date + '/'
      + this.props.store.settings.region
      //+ (this.props.bulletin.hasDaytimeDependency ? ('_' + this.props.store.settings.ampm.toUpperCase()) : '')
      + ((this.props.bulletin.hasDaytimeDependency && this.props.store.settings.ampm == 'pm') ? '_PM' : '')
      + '.jpg';

    const text = 'Selected region ' + this.props.store.settings.region;
    return (
      <img src={url} alt={text} />
    );
  }
}

export default BulletinAWMapStatic;
