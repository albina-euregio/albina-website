import React from "react";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";
import {
  parseDate,
  getPredDate,
  getSuccDate,
  dateToISODateString,
  isSameDay,
  isAfter
} from "../../util/date.js";
import { Tooltip } from "../tooltips/tooltip";

class BulletinDateFlipper extends React.Component {
  constructor(props) {
    super(props);
  }

  get date() {
    return this.props.date ? parseDate(this.props.date) : null;
  }

  get nextDate() {
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

  get prevDate() {
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

    const prevDate = this.prevDate
      ? this.props.intl.formatDate(this.prevDate)
      : "";
    const nextDate = this.nextDate
      ? this.props.intl.formatDate(this.nextDate)
      : "";

    return (
      <ul className="list-inline bulletin-flipper">
        <li className="bulletin-flipper-back">
          <Tooltip
            label={this.props.intl.formatMessage({
              id: "bulletin:header:dateflipper:back"
            })}
          >
            <Link to={"/bulletin/" + prevLink}>
              <span className="icon-arrow-left" />
              {prevDate}
            </Link>
          </Tooltip>
        </li>
        {/* {nextLink && <li className="bulletin-flipper-separator">&nbsp;</li>} */}
        {nextLink && (
          <li className="bulletin-flipper-forward">
            <Tooltip
              label={this.props.intl.formatMessage({
                id: "bulletin:header:dateflipper:forward"
              })}
            >
              <Link to={"/bulletin/" + nextLink}>
                {nextDate + " "}
                <span className="icon-arrow-right" />
              </Link>
            </Tooltip>
          </li>
        )}
        {this.nextDate && (
          <li className="bulletin-flipper-latest">
            <Tooltip
              label={this.props.intl.formatMessage({
                id: "bulletin:header:dateflipper:latest:hover"
              })}
            >
              <Link to={"/bulletin/" + latestLink}>
                {this.props.intl.formatMessage({
                  id: "bulletin:header:dateflipper:latest"
                })}
              </Link>
            </Tooltip>
          </li>
        )}
        <li className="bulletin-flipper-archive">
          <Tooltip
            label={this.props.intl.formatMessage({
              id: "bulletin:header:archive:hover"
            })}
          >
            <Link to="/more/archive">
              {this.props.intl.formatMessage({
                id: "bulletin:header:archive"
              })}
            </Link>
          </Tooltip>
        </li>
      </ul>
    );
  }
}

export default injectIntl(BulletinDateFlipper);
