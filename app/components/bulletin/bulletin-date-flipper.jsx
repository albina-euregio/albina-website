import React from "react";
import { Link } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { computed } from "mobx";
import { injectIntl } from "react-intl";
import {
  parseDate,
  getPredDate,
  getSuccDate,
  dateToISODateString,
  dateToDateString,
  isAfter,
  isSameDay
} from "../../util/date.js";

@observer
class BulletinDateFlipper extends React.Component {
  constructor(props) {
    super(props);
    this.DEV_MODE = false;
  }

  @computed get date() {
    return parseDate(this.props.date);
  }

  @computed get nextDate() {
    const d = this.date;
    if (d) {
      const next = getSuccDate(d);
      /* show next day only it is not the future or if this day is after bulletin.isTomorrow value */

      const now = new Date();
      if (
        this.DEV_MODE ||
        (isSameDay(now, this.date) &&
          now.getHours() >= config.get("bulletin.isTomorrow")) ||
        isAfter(now, next)
      ) {
        return next;
      }
    }
    return undefined;
  }

  @computed get prevDate() {
    const d = this.date;
    if (d) {
      return getPredDate(d);
    }
    return undefined;
  }

  render() {
    const prevLink = dateToISODateString(this.prevDate);
    const nextLink = dateToISODateString(this.nextDate);
    const latestLink = dateToISODateString(new Date());

    const prevDate = this.prevDate ? dateToDateString(this.prevDate) : "";
    const nextDate = this.nextDate ? dateToDateString(this.nextDate) : "";

    return (
      <ul className="list-inline bulletin-flipper">
        <li className="bulletin-flipper-back">
          <Link
            to={"/bulletin/" + prevLink}
            title={this.props.intl.formatMessage({
              id: "bulletin:header:dateflipper:back"
            })}
            className="tooltip"
          >
            <span className="icon-arrow-left" />
            {prevDate}
          </Link>
        </li>
        <li className="bulletin-flipper-separator">—</li>
        {nextLink && (
          <li className="bulletin-flipper-forward">
            <Link
              to={"/bulletin/" + nextLink}
              title={this.props.intl.formatMessage({
                id: "bulletin:header:dateflipper:forward"
              })}
              className="tooltip"
            >
              {nextDate + " "}
              <span className="icon-arrow-right" />
            </Link>
          </li>
        )}
        {!this.DEV_MODE && this.nextDate && (
          <li className="bulletin-flipper-latest">
            <Link
              to={"/bulletin/" + latestLink}
              title={this.props.intl.formatMessage({
                id: "bulletin:header:dateflipper:latest:hover"
              })}
              className="tooltip"
            >
              {this.props.intl.formatMessage({
                id: "bulletin:header:dateflipper:latest"
              })}
            </Link>
          </li>
        )}
        <li className="bulletin-flipper-archive">
          <Link
            to="/archive"
            title={this.props.intl.formatMessage({
              id: "bulletin:header:archive:hover"
            })}
            className="tooltip"
          >
            {this.props.intl.formatMessage({
              id: "bulletin:header:archive"
            })}
          </Link>
        </li>
      </ul>
    );
  }
}

export default inject("locale")(injectIntl(observer(BulletinDateFlipper)));
