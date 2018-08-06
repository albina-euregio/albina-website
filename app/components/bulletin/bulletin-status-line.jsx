import React from 'react';
import { observer, inject } from 'mobx-react';
import { computed } from 'mobx';
import { injectIntl } from 'react-intl';
import { dateToDateString, dateToTimeString } from '../../util/date.js';

class BulletinStatusLine extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed get statusText() {
    const collection = this.props.store.activeBulletinCollection;

    if(this.props.status == 'pending') {
      return this.props.intl.formatMessage({id: 'bulletin:header:loading'}) + '\u2026';
    }

    if(this.props.status == 'ok') {
      const pubDate = collection.publicationDate;

      // There must be a status entry for each downloaded bulletin. Query its
      // original status message.
      const message =
        window['archiveStore'].getStatusMessage(this.props.store.settings.date);

      const params = {
        date: dateToDateString(pubDate),
        time: dateToTimeString(pubDate)
      };
      if(message == 'republished') {
        return this.props.intl.formatMessage({id: 'bulletin:header:updated-at'}, params);
      }
      return this.props.intl.formatMessage({id: 'bulletin:header:published-at'}, params);
    }

    return this.props.intl.formatMessage({id: 'bulletin:header:no-bulletin'});
  }

  render() {
    return (
      <p className="marginal bulletin-datetime-publishing">{this.statusText}</p>
    );
  }
}

export default inject('locale')(injectIntl(observer(BulletinStatusLine)));
