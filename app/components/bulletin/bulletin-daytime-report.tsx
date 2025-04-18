import React, { useContext } from "react";
import type { Temporal } from "temporal-polyfill";
import { FormattedMessage, useIntl } from "../../i18n";
import TendencyIcon from "../icons/tendency-icon";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";
import BulletinProblemItem from "./bulletin-problem-item.jsx";
import BulletinAWMapStatic from "./bulletin-awmap-static.jsx";
import { LONG_DATE_FORMAT } from "../../util/date";
import { Tooltip } from "../tooltips/tooltip";
import {
  matchesValidTimePeriod,
  type Bulletin,
  type DangerRating,
  type Tendency,
  type Region,
  type ValidTimePeriod
} from "../../stores/bulletin";
import { scrollIntoView } from "../../util/scrollIntoView";
import { HeadlessContext } from "../../contexts/HeadlessContext.tsx";

interface Props {
  validTimePeriod: ValidTimePeriod;
  bulletin: Bulletin;
  bulletin170000: Bulletin;
  showDiff: 0 | 1 | 2;
  date: Temporal.PlainDate;
}

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
  const problems170000 =
    bulletin170000?.avalancheProblems?.filter(p =>
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
  const isInserted = !compareDangerRatings(dangerRatings, dangerRatings170000);

  let tendencyReportItems: JSX.Element[] = [];
  let tendencyReportItemsAllNew = isInserted;
  if (Array.isArray(bulletin.tendency)) {
    tendencyReportItems = bulletin.tendency.map((tendency, index) => {
      const tendency170000 = bulletin170000?.tendency?.[index];
      //console.log("BulletinDaytimeReport #1 #juhu", {index, isInserted, tendency, tendency170000, tendencyType: tendency?.tendencyType, tendency170000Type: tendency170000?.tendencyType});
      tendencyReportItemsAllNew =
        tendency?.tendencyType !== tendency170000?.tendencyType
          ? tendencyReportItemsAllNew
          : false;
      return (
        <TendencyReport
          tendency={tendency}
          tendency170000={tendency170000}
          showDiff={showDiff}
          date={date}
          key={index}
        />
      );
    });
  }

  const headless = useContext(HeadlessContext);

  //console.log("BulletinDaytimeReport #2 #juhu", {tendencyReportItemsAllNew});

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
              href={headless ? "#page-all" : "#page-main"}
              onClick={e => scrollIntoView(e)}
              // className="img icon-arrow-up"
              // style={
              //   showDiff &&
              //   !compareRegions(bulletin?.regions, bulletin170000?.regions)
              //     ? { border: "#ff0000 5px solid" }
              //     : {}
              // }
              className={
                showDiff &&
                !compareRegions(bulletin?.regions, bulletin170000?.regions)
                  ? "img icon-arrow-up bulletin-update-diff bulletin-update-diff-border"
                  : "img icon-arrow-up"
              }
            >
              <BulletinAWMapStatic
                bulletin={bulletin}
                date={date}
                region={bulletin.bulletinID}
                validTimePeriod={validTimePeriod}
              />
            </a>
          </Tooltip>
        </div>
        <ul className="list-plain list-bulletin-report-pictos">
          <li
            className={
              showDiff && tendencyReportItemsAllNew
                ? "bulletin-update-diff"
                : ""
            }
          >
            <div
              // className="bulletin-report-picto tooltip"
              // style={
              //   showDiff && isInserted ? { backgroundColor: "#e6eef2" } : {}
              // }
              className={
                showDiff && isInserted
                  ? "bulletin-report-picto tooltip bulletin-update-diff"
                  : "bulletin-report-picto tooltip"
              }
            >
              <BulletinDangerRating dangerRatings={dangerRatings} />
            </div>
            {tendencyReportItems}
          </li>
          {problems.map((problem, index) => (
            <BulletinProblemItem
              key={index}
              problem={problem}
              problem170000={problems170000.find(
                p => p.problemType === problem.problemType
              )}
              showDiff={showDiff}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BulletinDaytimeReport;

export function compareRegions(regions: Region[], regions170000: Region[]) {
  return (
    regions
      .map(r => r.regionID)
      .sort((s1, s2) => s1.localeCompare(s2))
      .join() ===
    regions170000
      ?.map(r => r.regionID)
      .sort((s1, s2) => s1.localeCompare(s2))
      .join()
  );
}

export function compareDangerRatings(
  dangerRatings: DangerRating[],
  dangerRatings170000: DangerRating[]
): boolean {
  return (
    dangerRatings.length === dangerRatings170000.length &&
    dangerRatings.every((r1, i) =>
      compareDangerRating(r1, dangerRatings170000[i])
    )
  );
}

function compareDangerRating(r1: DangerRating, r2: DangerRating): boolean {
  if (!r2) return false;
  return (
    r1.elevation?.lowerBound === r2.elevation?.lowerBound &&
    r1.elevation?.upperBound === r2.elevation?.upperBound &&
    r1.mainValue === r2.mainValue &&
    r1.validTimePeriod === r2.validTimePeriod
  );
}

function TendencyReport({
  tendency,
  tendency170000,
  showDiff,
  date
}: {
  tendency: Tendency;
  tendency170000: Tendency;
  showDiff: 0 | 1 | 2;
  date: Temporal.PlainDate;
}) {
  const intl = useIntl();
  return (
    <Tooltip
      label={intl.formatMessage({
        id: "bulletin:report:tendency:hover"
      })}
    >
      <div
        // className="bulletin-report-tendency"
        // style={
        //   showDiff && tendency?.tendencyType !== tendency170000?.tendencyType
        //     ? {
        //         backgroundColor: "#e6eef2"
        //       }
        //     : {}
        // }
        className={
          showDiff && tendency?.tendencyType !== tendency170000?.tendencyType
            ? "bulletin-report-tendency bulletin-update-diff"
            : "bulletin-report-tendency"
        }
      >
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
                tendency.validTime?.startTime && tendency.validTime?.endTime
                  ? new Date(
                      +tendency.validTime?.startTime / 2 +
                        +tendency.validTime?.endTime / 2
                    )
                  : date.add({ days: 1 }),
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
