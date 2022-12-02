import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import TendencyIcon from "../icons/tendency-icon";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";
import BulletinProblemItem from "./bulletin-problem-item.jsx";
import BulletinAWMapStatic from "./bulletin-awmap-static.jsx";
import { parseDate, getSuccDate, LONG_DATE_FORMAT } from "../../util/date.js";
import { Tooltip } from "../tooltips/tooltip";
import type * as Caaml from "../../stores/bulletin/CaamlBulletin";

type Props = {
  ampm: "am" | "pm";
  bulletin: Caaml.Bulletin;
  date: string;
  publicationTime: string;
};

function BulletinDaytimeReport({
  ampm,
  bulletin,
  date,
  publicationTime
}: Props) {
  const intl = useIntl();
  const problems = bulletin?.avalancheProblems || [];

  const tendency = bulletin?.tendency?.type || "none";
  const tendencyTitle = intl.formatMessage({
    id: "bulletin:report:tendency:" + tendency
  });
  const tendencyDate = intl.formatDate(
    getSuccDate(parseDate(date)),
    LONG_DATE_FORMAT
  );

  return (
    <div>
      {ampm && (
        <h2 className="subheader">
          <FormattedMessage id={"bulletin:report:daytime:" + ampm} />
        </h2>
      )}
      <div className="bulletin-report-pictobar">
        <div className="bulletin-report-region">
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:report:selected-region:hover"
            })}
          >
            <a href="#page-main" className="img icon-arrow-up" data-scroll="">
              <BulletinAWMapStatic
                date={date}
                publicationTime={publicationTime}
                region={bulletin.id} // possibly contains _PM
              />
            </a>
          </Tooltip>
        </div>
        <ul className="list-plain list-bulletin-report-pictos">
          <li>
            <div className="bulletin-report-picto tooltip">
              <BulletinDangerRating bulletin={bulletin} />
            </div>
            <Tooltip
              label={intl.formatMessage({
                id: "bulletin:report:tendency:hover"
              })}
            >
              <div className="bulletin-report-tendency">
                <span>
                  <FormattedMessage
                    id="bulletin:report:tendency"
                    values={{
                      strong: (...msg) => (
                        <strong className="heavy">{msg}</strong>
                      ),
                      br: (...msg) => (
                        <>
                          <br />
                          {msg}
                        </>
                      ),
                      tendency: tendencyTitle,
                      daytime: "", // ampmId ? intl.formatMessage({id: 'bulletin:report:tendency:daytime:' + ampmId}) : '',
                      date: tendencyDate
                    }}
                  />
                </span>
                <TendencyIcon tendency={tendency} />
              </div>
            </Tooltip>
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
