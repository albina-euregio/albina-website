import React, { useContext } from "react";
import { Temporal } from "temporal-polyfill";
import { Link, useNavigate } from "react-router-dom";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import { HeadlessContext } from "../../contexts/HeadlessContext.tsx";

interface Props {
  date?: Temporal.PlainDate;
  latest?: Temporal.PlainDate;
}

function BulletinDateFlipper({ date, latest }: Props) {
  const intl = useIntl();
  const navigate = useNavigate();
  const headless = useContext(HeadlessContext);

  let nextDate$: Temporal.PlainDate | null = null;
  if (date && latest) {
    const next = date.add({ days: 1 });
    /* show next day only it is not the future or if this day is after bulletin.isTomorrow value */
    nextDate$ = Temporal.PlainDate.compare(latest, next) >= 0 ? next : null;
  }

  const prevDate$: Temporal.PlainDate | null = date
    ? date.subtract({ days: 1 })
    : null;
  const prevDate = prevDate$ ? intl.formatDate(prevDate$) : "";
  const nextDate = nextDate$ ? intl.formatDate(nextDate$) : "";

  function bulletinURL(newDate?: Temporal.PlainDate | null) {
    return `../bulletin/${newDate ? newDate.toString() : "latest"}`;
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
              {date && latest && (
                <input
                  type="date"
                  max={latest.toString()}
                  value={date.toString()}
                  onChange={e =>
                    navigate(
                      bulletinURL(Temporal.PlainDate.from(e.target.value))
                    )
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
            <Link to={headless ? '/headless/archive' : '/more/archive'}>
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
