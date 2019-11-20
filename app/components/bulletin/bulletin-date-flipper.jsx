import React from "react";
import { Link } from "react-router-dom";
import { inject } from "mobx-react";
import { computed } from "mobx";
import { injectIntl } from "react-intl";
import {
  parseDate,
  getPredDate,
  getSuccDate,
  dateToISODateString,
  dateToDateString,
  isSameDay,
  isAfter
} from "../../util/date.js";

class BulletinDateFlipper extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed get date() {
    return this.props.date ? parseDate(this.props.date) : null;
  }

  @computed get nextDate() {
    const d = this.date;
    if (d && this.props.latest) {
      const next = getSuccDate(d);
      const latest = parseDate(this.props.latest);
      /* show next day only it is not the future or if this day is after bulletin.isTomorrow value */

      return isSameDay(latest, next) || isAfter(latest, next)
        ? next
        : undefined;
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

    const latestLink = this.props.latest ? this.props.latest : "";

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
        {/* {nextLink && <li className="bulletin-flipper-separator">&nbsp;</li>} */}
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
        {this.nextDate && (
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

export default inject("locale")(injectIntl(BulletinDateFlipper));
