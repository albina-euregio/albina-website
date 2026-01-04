import React from "react";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import { getPagePath, redirectPage } from "@nanostores/router";
import { $router } from "../router";

interface Props {
  date?: Temporal.PlainDate;
  latest?: Temporal.PlainDate;
}

function BulletinDateFlipper({ date, latest }: Props) {
  const intl = useIntl();

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

  return (
    <>
      <ul className="list-inline bulletin-flipper">
        <li className="bulletin-flipper-back">
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:header:dateflipper:back"
            })}
          >
            <a
              href={getPagePath($router, "bulletinDate", {
                date: prevDate$?.toString() ?? ""
              })}
            >
              <span className="icon-arrow-left" />
              {prevDate}
            </a>
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
                    redirectPage($router, "bulletinDate", {
                      date: Temporal.PlainDate.from(e.target.value).toString()
                    })
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
              <a
                href={getPagePath($router, "bulletinDate", {
                  date: nextDate$.toString()
                })}
              >
                {nextDate + " "}
                <span className="icon-arrow-right" />
              </a>
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
              <a href={getPagePath($router, "bulletinLatest")}>
                {intl.formatMessage({
                  id: "bulletin:header:dateflipper:latest"
                })}
              </a>
            </Tooltip>
          </li>
        )}
        <li className="bulletin-flipper-archive">
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:header:archive:hover"
            })}
          >
            <a href={"/more/archive"}>
              {intl.formatMessage({
                id: "bulletin:header:archive"
              })}
            </a>
          </Tooltip>
        </li>
      </ul>
    </>
  );
}

export default BulletinDateFlipper;
