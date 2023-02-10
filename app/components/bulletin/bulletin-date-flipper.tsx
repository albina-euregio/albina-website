import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import {
  getPredDate,
  getSuccDate,
  dateToISODateString,
  isSameDay,
  isAfter
} from "../../util/date.js";
import { Tooltip } from "../tooltips/tooltip";
import { DatePicker } from "../datePicker/datePicker";

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
  const prevLink = dateToISODateString(prevDate$);
  const nextLink = dateToISODateString(nextDate$);
  const prevDate = prevDate$ ? intl.formatDate(prevDate$) : "";
  const nextDate = nextDate$ ? intl.formatDate(nextDate$) : "";

  const onChangeCurrentDate = (newDate: Date) => {
    navigate("/bulletin/" + dateToISODateString(newDate));
  };

  return (
    <>
      <ul className="list-inline bulletin-flipper">
        <li className="bulletin-flipper-back">
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:header:dateflipper:back"
            })}
          >
            <Link to={"/bulletin/" + prevLink}>
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
            <a href="#">
              <DatePicker
                value={date$}
                onChange={onChangeCurrentDate}
                maxDate={latest}
              >
                <span className="icon-calendar"></span>
              </DatePicker>
            </a>
          </Tooltip>
        </li>
        {/* {nextLink && <li className="bulletin-flipper-separator">&nbsp;</li>} */}
        {nextLink && (
          <li className="bulletin-flipper-forward">
            <Tooltip
              label={intl.formatMessage({
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
        {nextDate && (
          <li className="bulletin-flipper-latest">
            <Tooltip
              label={intl.formatMessage({
                id: "bulletin:header:dateflipper:latest:hover"
              })}
            >
              <Link to={"/bulletin/" + (latest || "")}>
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
