import React from 'react';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import BulletinAmPmSwitch from './bulletin-ampm-switch.jsx';

@observer class BulletinHeader extends React.Component {
  // TODO: move date formating to separate component
  dateFormat = {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  };
  dateTimeFormat = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  };

  constructor(props) {
    super(props);
  }

  _formatDate(date, options = {}) {
    if(date) {
      // TODO: replace with current language
      return Intl.DateTimeFormat('de', options).format(date);
    }
    return '';
  }

  @computed get nextDate() {
    const d = this.date;
    if(d) {
      const next = new Date(d.valueOf() + 1000*60*60*24);
      if(next.valueOf() < Date.now()) {
        return next;
      }
    }
    return undefined;
  }

  @computed get prevDate() {
    const d = this.date;
    if(d) {
      return new Date(d.valueOf() - 1000*60*60*24);
    }
    return undefined;
  }

  @computed get date() {
    return Date.parse(this.props.bulletin.date + 'T00:00:00');
  }

  render() {
    const today = new Date();
    const bulletin = bulletinStore.getActive();
    const bulletinDate = (bulletin && bulletin.length > 0) ? this._formatDate(this.date, this.dateFormat) : '';
    const publicationDate = (bulletin && bulletin.length > 0) ? this._formatDate(Date.parse(bulletin[0].publicationDate), this.dateTimeFormat) : '';
    //const nextDate =
    return (
      <section id="section-bulletin-header" className="section-padding section-header section-bulletin-header 0bulletin-archive bulletin-updated">
        <header className="section-centered">
          <p className="marginal bulletin-datetime-publishing">Published {publicationDate}</p>
          <h2 className="subheader">Avalanche Bulletin</h2>
          <h1 className="bulletin-datetime-validity">{bulletinDate} <BulletinAmPmSwitch bulletin={this.props.bulletin} /></h1>
          <ul className="list-inline bulletin-flipper">
            <li className="bulletin-flipper-back"><a href="#" title="Back" className="tooltip"><span className="icon-arrow-left" />08.12.2017</a></li>
            <li className="bulletin-flipper-latest"><a href="#" title="Go to current Bulletin" className="tooltip">Latest</a></li>
            <li className="bulletin-flipper-forward"><a href="#" title="Forward" className="tooltip">10.12.2017 <span className="icon-arrow-right" /></a></li>
            <li className="bulletin-flipper-archive"><a href="#" title="Recent Bulletins" className="tooltip">Archive <span className="icon-arrow-right" /></a></li>
          </ul>
        </header>
      </section>
    );
  }
}

export default BulletinHeader;
