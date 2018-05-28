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
    return dateToLongDateString(parseDate(this.props.store.settings.date));
  }

  @computed get statusClass() {
    let cl = '';
    switch(this.props.store.settings.status) {
      case 'pending':
        cl = 'loading';
        break;
      case 'n/a':
        cl = 'not-available';
        break;
      case 'empty':
        cl = 'no-data';
        break;
      default:
        break;
    }

    return cl ? ' ' + cl : '';
  }

  render() {
    return (
      <section id="section-bulletin-header" className={`section-padding section-header section-bulletin-header 0bulletin-archive bulletin-updated${this.statusClass}`}>
        <header className="section-centered">
          <BulletinStatusLine store={this.props.store} status={this.props.store.settings.status} />
          <h2 className="subheader">Avalanche Bulletin</h2>
          <h1 className="bulletin-datetime-validity">{this.date} <BulletinAmPmSwitch store={this.props.store} ampm={this.props.store.settings.ampm} /></h1>
          <BulletinDateFlipper date={this.props.store.settings.date} />
        </header>
      </section>
    );
  }
}

export default BulletinHeader;
