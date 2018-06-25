import React from 'react';
import {Link} from 'react-router-dom';
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {parseDate, getPredDate, getSuccDate, dateToISODateString, dateToDateString} from '../../util/date.js';

@observer class BulletinDateFlipper extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed get date() {
    return parseDate(this.props.date);
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

  render() {
    const prevLink = dateToISODateString(this.prevDate);
    const nextLink = dateToISODateString(this.nextDate);
    const latestLink = dateToISODateString(new Date());

    const prevDate = this.prevDate ? dateToDateString(this.prevDate) : '';
    const nextDate = this.nextDate ? dateToDateString(this.nextDate) : '';

    return (
      <ul className="list-inline bulletin-flipper">
        <li className="bulletin-flipper-back">
          <Link to={prevLink} title="Back">
            <span className="icon-arrow-left" />
            {prevDate}
          </Link>
        </li>
        <li className="bulletin-flipper-latest">
          <Link to={latestLink} title="Go to current Bulletin">
            Latest
          </Link>
        </li>
        {nextLink &&
          <li className="bulletin-flipper-forward">
            <Link to={nextLink} title="Forward">
              {nextDate}
              <span className="icon-arrow-right" />
            </Link>
          </li>
        }
        <li className="bulletin-flipper-archive">
          <a href="#" title="Recent Bulletins" className="tooltip">Archive
            <span className="icon-arrow-right" />
          </a>
        </li>
      </ul>
    );
  }
}

export default BulletinDateFlipper;
