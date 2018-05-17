import React from 'react';
import {observer} from 'mobx-react';
import {action, computed} from 'mobx';
import {parseDate, getPredDate, getSuccDate, dateToISODateString, dateToDateString} from '../../util/date.js';

@observer class BulletinDateFlipper extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed get date() {
    return parseDate(this.props.settings.date);
  }

  @computed get nextDate() {
    const d = this.date;
    if(d) {
      const next = getSuccDate(d);
      if(next.valueOf() < Date.now()) {
        return next;
      }
    }
    return undefined;
  }

  @computed get prevDate() {
    const d = this.date;
    if(d) {
      return getPredDate(d);
    }
    return undefined;
  }

  dateBack = () => {
    const d = getPredDate(parseDate(bulletinStore.settings.date));
    if(d) {
      bulletinStore.load(dateToISODateString(d));
    }
  }

  dateForward = () => {
    const d = getSuccDate(parseDate(bulletinStore.settings.date));
    if(d) {
      bulletinStore.load(dateToISODateString(d));
    }
  }

  goToLatest = () => {
    bulletinStore.load(dateToISODateString(new Date()));
  }

  render() {
    const prevDate = this.prevDate ? dateToDateString(this.prevDate) : '';
    const nextDate = this.nextDate ? dateToDateString(this.nextDate) : '';

    return (
      <ul className="list-inline bulletin-flipper">
        <li className="bulletin-flipper-back"><a href="#" title="Back" className="tooltip" onClick={this.dateBack}><span className="icon-arrow-left" />{prevDate}</a></li>
        <li className="bulletin-flipper-latest"><a href="#" title="Go to current Bulletin" className="tooltip" onClick={this.goToLatest}>Latest</a></li>
        <li className="bulletin-flipper-forward"><a href="#" title="Forward" className="tooltip" onClick={this.dateForward}>{nextDate} <span className="icon-arrow-right" /></a></li>
        <li className="bulletin-flipper-archive"><a href="#" title="Recent Bulletins" className="tooltip">Archive <span className="icon-arrow-right" /></a></li>
      </ul>
    );
  }
}

export default BulletinDateFlipper;
