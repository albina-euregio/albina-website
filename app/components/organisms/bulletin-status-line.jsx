import React from 'react';
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {dateToDateTimeString, parseDate} from '../../util/date.js';

@observer class BulletinStatusLine extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed get statusText() {
    const collection = this.props.store.activeBulletinCollection;

    if(!collection || this.props.status == 'pending') {
      return 'Loading\u2026';
    }

    if(this.props.status != 'ok') {
      return 'No Bulletin';
    }

    const publicationDate = dateToDateTimeString(parseDate(collection.publicationDate));
    return 'Published ' + publicationDate;
  }

  render() {
    return (
      <p className="marginal bulletin-datetime-publishing">{this.statusText}</p>
    );
  }
}

export default BulletinStatusLine;
