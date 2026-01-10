import React from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { LONG_DATE_FORMAT } from "../../util/date";
import ArchiveAwmapStatic from "../bulletin/bulletin-awmap-static";
import { Tooltip } from "../tooltips/tooltip";
import { type Bulletin, type Status } from "../../stores/bulletin";
import BulletinDangerRating from "../bulletin/bulletin-danger-rating.js";
import ProblemIconLink from "../icons/problem-icon-link.js";
import { useStore } from "@nanostores/react";
import { $province } from "../../appStore.js";

export interface RegionBulletinStatus {
  $type: "RegionBulletinStatus";
  status: Status;
  bulletin: Bulletin;
}
export interface LegacyBulletinStatus {
  $type: "LegacyBulletinStatus";
  status: Record<string, string | undefined>;
}
export type BulletinStatus =
  | Status
  | RegionBulletinStatus
  | LegacyBulletinStatus;

interface Props {
  date: Temporal.PlainDate;
  status: BulletinStatus;
}

function ArchiveItem({ date, status }: Props) {
  const intl = useIntl();

  function getLanguage() {
    const lang = intl.locale.slice(0, 2);
    if (date.toString() < "2020-12-01") {
      switch (lang) {
        case "fr":
        case "es":
        case "ca":
        case "oc":
          return "en";
        default:
          return lang;
      }
    } else {
      return lang;
    }
  }

  const lang = getLanguage();

  if (typeof status === "object" && status.$type === "LegacyBulletinStatus") {
    return (
      <tr>
        <td>
          <strong>{intl.formatDate(date, LONG_DATE_FORMAT)}</strong>
        </td>
        <td colSpan={2}>
          <ul className="list-inline list-download">
            {Object.entries(status.status).map(
              ([region, url]) =>
                url && (
                  <li key={url}>
                    <a
                      href={url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="small secondary pure-button"
                    >
                      <FormattedMessage id={`region:${region}`} /> PDF
                    </a>
                  </li>
                )
            )}
          </ul>
        </td>
      </tr>
    );
  }

  const bulletin =
    typeof status === "object" && status.$type === "RegionBulletinStatus"
      ? status.bulletin
      : undefined;

  return (
    <tr>
      <td>
        <strong>{intl.formatDate(date, LONG_DATE_FORMAT)}</strong>
      </td>
      <td>
        <ul className="list-inline list-buttongroup-dense list-download">
          {bulletin?.bulletinID && (
            <li>
              <DownloadLink
                format="pdf"
                date={date}
                lang={lang}
                bulletin={bulletin?.bulletinID}
              />
            </li>
          )}
          <li>
            <DownloadLink format="xml" date={date} lang={lang} />
          </li>
          <li>
            <DownloadLink format="json" date={date} lang={lang} />
          </li>
        </ul>
      </td>
      <td>
        <BulletinMap date={date} bulletin={bulletin} />
      </td>
      {bulletin && (
        <td>
          {bulletin?.dangerRatings && (
            <div className="bulletin-report-picto">
              <BulletinDangerRating dangerRatings={bulletin.dangerRatings} />
            </div>
          )}
        </td>
      )}
      {bulletin && (
        <td>
          {bulletin?.avalancheProblems?.length > 0 && (
            <div className="avalanche-situation-preview">
              {bulletin.avalancheProblems
                .filter(
                  // deduplicate
                  (problem, index, array) =>
                    array.findIndex(
                      p => p.problemType === problem.problemType
                    ) === index
                )
                .map((problem, index) => (
                  <div
                    className="bulletin-report-picto avalanche-situation"
                    key={index + problem.problemType}
                  >
                    <ProblemIconLink problem={problem} wrapper={false} />
                  </div>
                ))}
            </div>
          )}
        </td>
      )}
    </tr>
  );
}

function DownloadLink({
  bulletin,
  format,
  date,
  lang
}: {
  bulletin?: string;
  format: "pdf" | "xml" | "json";
  date: Temporal.PlainDate;
  lang: string;
}) {
  const province = useStore($province);
  // The following keys are used here:
  // config.apis.bulletin.pdf
  // config.apis.bulletin.xml
  // config.apis.bulletin.json
  const url = config.apis.bulletin[format];
  return (
    <a
      href={config.template(url, {
        bulletin: bulletin || "",
        date,
        region: `${province || "EUREGIO"}${format === "pdf" && url.includes("/api/bulletins") ? "" : "_"}`,
        lang,
        bw: ""
      })}
      rel="noopener noreferrer"
      target="_blank"
      className="small secondary pure-button tooltip"
    >
      {format.toUpperCase()}
    </a>
  );
}

function BulletinMap({
  date,
  bulletin
}: {
  date: Temporal.PlainDate;
  bulletin: Bulletin;
}): React.ReactNode {
  const intl = useIntl();
  const province = useStore($province);

  if (!showMap(date)) return <></>;
  const region = bulletin
    ? `${province || "EUREGIO"}_${bulletin.bulletinID}`
    : `fd_${province || "EUREGIO"}_thumbnail`;
  return (
    <Tooltip
      label={intl.formatMessage({
        id: "archive:show-forecast:hover"
      })}
    >
      <a href={`/bulletin/${date}`} className={"map-preview img tooltip"}>
        <ArchiveAwmapStatic date={date} imgFormat=".jpg" region={region} />
      </a>
    </Tooltip>
  );

  function showMap(date: Temporal.PlainDate) {
    const lang = intl.locale.slice(0, 2);
    if (date.toString() < "2020-12-01") {
      switch (lang) {
        case "fr":
        case "es":
        case "ca":
        case "oc":
          return false;
        default:
          return true;
      }
    } else {
      return true;
    }
  }
}

export default ArchiveItem;
