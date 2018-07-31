import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl } from 'react-intl';

class BulletinAWMapStatic extends React.Component {
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

    return (
      <img src={url}
        alt={this.props.intl.formatMessage({id: 'bulletin:report:selected-region:alt'})}
        title={this.props.intl.formatMessage({id: 'bulletin:report:selected-region:hover'})} />
    );
  }
}

export default inject('locale')(injectIntl(observer(BulletinAWMapStatic)));
