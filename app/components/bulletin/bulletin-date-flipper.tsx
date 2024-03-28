import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIntl } from "../../i18n";
import {
  getPredDate,
  getSuccDate,
  dateToISODateString,
  isSameDay,
  isAfter
} from "../../util/date";
import { Tooltip } from "../tooltips/tooltip";
import { dateFormat } from "../../util/date";

type Props = { date: Date; latest: Date };

function BulletinDateFlipper({ date, latest }: Props) {
  const intl = useIntl();
  const navigate = useNavigate();
  const date$: Date | null = date && +date ? date : null;
  let nextDate$: Date | null = null;
  if (date$ && latest) {
    const next = getSuccDate(date$);
    /* show next day only it is not the future or if this day is after bulletin.isTomorrow value */
    nextDate$ = isSameDay(latest, next) || isAfter(latest, next) ? next : null;
  }

  const prevDate$: Date | null = date$ ? getPredDate(date$) : null;
  const prevDate = prevDate$ ? intl.formatDate(prevDate$) : "";
  const nextDate = nextDate$ ? intl.formatDate(nextDate$) : "";

  function bulletinURL(newDate?: Date) {
    return `../bulletin/${newDate ? dateToISODateString(newDate) : "latest"}`;
  }

  return (
    <>
      <ul className="list-inline bulletin-flipper">
        <li className="bulletin-flipper-back">
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:header:dateflipper:back"
            })}
          >
            <Link to={bulletinURL(prevDate$)}>
              <span className="icon-arrow-left" />
              {prevDate}
            </Link>
          </Tooltip>
        </li>
        <li className="bulletin-flipper-calendar">
          <Tooltip
            placement="top"
            label={intl.formatMessage({
              id: "bulletin:header:dateflipper:showHideCalendar"
            })}
          >
            <div className="calendar-trigger icon-calendar">
              {date$ && latest && (
                <input
                  type="date"
                  max={dateFormat(latest, "%Y-%m-%d", false)}
                  value={dateFormat(date$, "%Y-%m-%d", false)}
                  onChange={e =>
                    navigate(bulletinURL(new Date(e.target.value)))
                  }
                />
              )}
            </div>
          </Tooltip>
        </li>
        {/* {nextLink && <li className="bulletin-flipper-separator">&nbsp;</li>} */}
        {nextDate$ && (
          <li className="bulletin-flipper-forward">
            <Tooltip
              label={intl.formatMessage({
                id: "bulletin:header:dateflipper:forward"
              })}
            >
              <Link to={bulletinURL(nextDate$)}>
                {nextDate + " "}
                <span className="icon-arrow-right" />
              </Link>
            </Tooltip>
          </li>
        )}
        {nextDate && (
          <li className="bulletin-flipper-latest">
            <Tooltip
              label={intl.formatMessage({
                id: "bulletin:header:dateflipper:latest:hover"
              })}
            >
              <Link to={bulletinURL()}>
                {intl.formatMessage({
                  id: "bulletin:header:dateflipper:latest"
                })}
              </Link>
            </Tooltip>
          </li>
        )}
        <li className="bulletin-flipper-archive">
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:header:archive:hover"
            })}
          >
            <Link to="/more/archive">
              {intl.formatMessage({
                id: "bulletin:header:archive"
              })}
            </Link>
          </Tooltip>
        </li>
      </ul>
    </>
  );
}

export default BulletinDateFlipper;
