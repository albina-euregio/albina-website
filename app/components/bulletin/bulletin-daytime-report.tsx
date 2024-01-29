import React from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import TendencyIcon from "../icons/tendency-icon";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";
import BulletinProblemItem from "./bulletin-problem-item.jsx";
import BulletinAWMapStatic from "./bulletin-awmap-static.jsx";
import {
  dateToISODateString,
  getSuccDate,
  LONG_DATE_FORMAT
} from "../../util/date.js";
import { Tooltip } from "../tooltips/tooltip";
import {
  matchesValidTimePeriod,
  type Bulletin,
  type Tendency,
  type ValidTimePeriod
} from "../../stores/bulletin";
import { scrollIntoView } from "../../util/scrollIntoView";

type Props = {
  validTimePeriod: ValidTimePeriod;
  bulletin: Bulletin;
  bulletin170000: Bulletin;
  showDiff: 0 | 1 | 2;
  date: Date;
};

function BulletinDaytimeReport({
  validTimePeriod,
  bulletin,
  bulletin170000,
  showDiff,
  date
}: Props) {
  const intl = useIntl();
  const problems =
    bulletin?.avalancheProblems?.filter(p =>
      matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
    ) || [];
  const dangerRatings =
    bulletin?.dangerRatings?.filter(p =>
      matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
    ) || [];
  const dangerRatings170000 =
    bulletin170000?.dangerRatings?.filter(p =>
      matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
    ) || [];
  const isInserted =
    dangerRatings.length !== dangerRatings170000.length ||
    !dangerRatings.every((r1, i) => {
      const r2 = dangerRatings170000[i];
      if (!r2) return true;
      return (
        r1.elevation?.lowerBound === r2.elevation?.lowerBound &&
        r1.elevation?.upperBound === r2.elevation?.upperBound &&
        r1.mainValue === r2.mainValue &&
        r1.validTimePeriod === r2.validTimePeriod
      );
    });

  return (
    <div>
      {validTimePeriod && (
        <h2 className="subheader">
          <FormattedMessage id={`bulletin:report:daytime:${validTimePeriod}`} />
        </h2>
      )}
      <div className="bulletin-report-pictobar">
        <div className="bulletin-report-region">
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:report:selected-region:hover"
            })}
          >
            <a
              href="#page-main"
              onClick={e => scrollIntoView(e)}
              className="img icon-arrow-up"
            >
              <BulletinAWMapStatic
                bulletin={bulletin}
                date={dateToISODateString(date)}
                region={bulletin.bulletinID}
                validTimePeriod={validTimePeriod}
              />
            </a>
          </Tooltip>
        </div>
        <ul className="list-plain list-bulletin-report-pictos">
          <li>
            <div
              className="bulletin-report-picto tooltip"
              style={
                showDiff && isInserted ? { backgroundColor: "#e6eef2" } : {}
              }
            >
              <BulletinDangerRating dangerRatings={dangerRatings} />
            </div>
            {Array.isArray(bulletin.tendency) &&
              bulletin.tendency.map((tendency, index) => (
                <TendencyReport tendency={tendency} date={date} key={index} />
              ))}
          </li>
          {problems.map((p, index) => (
            <BulletinProblemItem key={index} problem={p} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BulletinDaytimeReport;

function TendencyReport({
  tendency,
  date
}: {
  tendency: Tendency;
  date: Date;
}) {
  const intl = useIntl();
  return (
    <Tooltip
      label={intl.formatMessage({
        id: "bulletin:report:tendency:hover"
      })}
    >
      <div className="bulletin-report-tendency">
        <span>
          <FormattedMessage
            id="bulletin:report:tendency"
            html={true}
            values={{
              strong: (...msg) => <strong className="heavy">{msg}</strong>,
              br: (...msg) => (
                <>
                  <br />
                  {msg}
                </>
              ),
              tendency: tendency.tendencyType
                ? intl.formatMessage({
                    id: `bulletin:report:tendency:${tendency.tendencyType}`
                  })
                : "–",
              daytime: "",
              date: intl.formatDate(
                tendency.validTime?.startTime
                  ? new Date(tendency.validTime?.startTime)
                  : getSuccDate(date),
                LONG_DATE_FORMAT
              )
            }}
          />
        </span>
        <TendencyIcon tendency={tendency.tendencyType} />
      </div>
    </Tooltip>
  );
}
