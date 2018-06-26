import React from 'react';
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {dateToDateTimeString} from '../../util/date.js';

@observer class BulletinStatusLine extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed get statusText() {
    const collection = this.props.store.activeBulletinCollection;

    if(this.props.status == 'pending') {
      return 'Loading\u2026';
    }

    if(this.props.status == 'ok') {
      const date = dateToDateTimeString(collection.publicationDate);

      // There must be a status entry for each downloaded bulletin. Query its
      // original status message.
      const message =
        window['archiveStore'].getStatusMessage(this.props.store.settings.date);

      if(message == 'republished') {
        return 'Updated ' + date;
      }
      return 'Published ' + date;
    }

    return 'No Bulletin';
  }

  render() {
    return (
      <p className="marginal bulletin-datetime-publishing">{this.statusText}</p>
    );
  }
}

export default BulletinStatusLine;
