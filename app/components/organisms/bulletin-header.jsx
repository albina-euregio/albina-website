import React from 'react';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import BulletinAmPmSwitch from './bulletin-ampm-switch.jsx';
import BulletinDateFlipper from './bulletin-date-flipper.jsx';
import BulletinStatusLine from './bulletin-status-line.jsx';
import {parseDate, dateToLongDateString} from '../../util/date.js';

@observer class BulletinHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed get date() {
    return parseDate(this.props.bulletin.date);
  }

  render() {
    const bulletin = bulletinStore.getActive();
    const bulletinDate = (bulletin && bulletin.length > 0) ? dateToLongDateString(this.date) : '';

    return (
      <section id="section-bulletin-header" className="section-padding section-header section-bulletin-header 0bulletin-archive bulletin-updated">
        <header className="section-centered">
          <BulletinStatusLine bulletin={this.props.bulletin} />
          <h2 className="subheader">Avalanche Bulletin</h2>
          <h1 className="bulletin-datetime-validity">{bulletinDate} <BulletinAmPmSwitch bulletin={this.props.bulletin} /></h1>
          <BulletinDateFlipper bulletin={this.props.bulletin} />
        </header>
      </section>
    );
  }
}

export default BulletinHeader;
