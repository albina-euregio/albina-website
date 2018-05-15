import React from 'react';
import {observer} from 'mobx-react';

@observer class BulletinHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  _formatDate(date, options = {}) {
    const parsed = Date.parse(date);
    if(parsed) {
      // TODO: replace with current language
      return Intl.DateTimeFormat('de', options).format(parsed);
    }
    return '';
  }

  render() {
    const bulletin = bulletinStore.getActive();
    const bulletinDate = (bulletin && bulletin.length > 0) ? this._formatDate(this.props.bulletin.date + 'T00:00:00', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }) : '';
    const publicationDate = (bulletin && bulletin.length > 0) ? this._formatDate(bulletin[0].publicationDate, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }) : '';

    return (
      <section id="section-bulletin-header" className="section-padding section-header section-bulletin-header 0bulletin-archive bulletin-updated">
        <header className="section-centered">
          <p className="marginal bulletin-datetime-publishing">Published {publicationDate}</p>
          <h2 className="subheader">Avalanche Bulletin</h2>
          <h1 className="bulletin-datetime-validity">{bulletinDate} <span title="PM is currently selected" className="bulletin-ampm tooltip">PM</span> <span className="bulletin-ampm"><a href="#" title="Switch to AM" className="textlink tooltip">AM</a></span></h1>
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
