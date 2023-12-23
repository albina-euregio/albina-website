import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { Util } from "leaflet";
import { dateToISODateString, LONG_DATE_FORMAT } from "../../util/date.js";
import ArchiveAwmapStatic from "../bulletin/bulletin-awmap-static";
import { Tooltip } from "../tooltips/tooltip";
import { APP_STORE } from "../../appStore";
import { type Bulletin } from "../../stores/bulletin";
import { type Status } from "../../stores/bulletinStore";
import { RegionCodes } from "../../util/regions";
import BulletinDangerRating from "../bulletin/bulletin-danger-rating.js";
import ProblemIconLink from "../icons/problem-icon-link.js";

export type RegionBulletinStatus = {
  $type: "RegionBulletinStatus";
  status: Status;
  bulletin: Bulletin;
};
export type LegacyBulletinStatus = {
  $type: "LegacyBulletinStatus";
  status: Record<RegionCodes, string | undefined>;
};
export type BulletinStatus =
  | Status
  | RegionBulletinStatus
  | LegacyBulletinStatus;

type Props = {
  date: Date;
  status: BulletinStatus;
};

function ArchiveItem({ date, status }: Props) {
  const intl = useIntl();

  function getLanguage(dateString: string) {
    const lang = APP_STORE.language;
    if (dateString < "2020-12-01") {
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

  const dateString = dateToISODateString(date);
  const lang = getLanguage(dateString);

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
                      <FormattedMessage id={`region:${region}`} />{" "}
                      <FormattedMessage id="archive:download-pdf" />
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
          <li>
            <DownloadLink format="pdf" dateString={dateString} lang={lang} />
          </li>
          <li>
            <DownloadLink format="xml" dateString={dateString} lang={lang} />
          </li>
          <li>
            <DownloadLink format="json" dateString={dateString} lang={lang} />
          </li>
        </ul>
      </td>
      <td>
        <BulletinMap dateString={dateString} bulletin={bulletin} />
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
  format,
  dateString,
  lang
}: {
  format: "pdf" | "xml" | "json";
  dateString: string;
  lang: string;
}) {
  return (
    <a
      href={Util.template(config.apis.bulletin[format], {
        date: dateString,
        region: dateString > "2022-05-06" ? "EUREGIO_" : "",
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
  dateString,
  bulletin
}: {
  dateString: string;
  bulletin: Bulletin;
}): React.ReactNode {
  const intl = useIntl();
  if (!showMap(dateString)) return <></>;
  const region =
    bulletin && dateString > "2022-05-06"
      ? `EUREGIO_${bulletin.bulletinID}`
      : bulletin
      ? bulletin.bulletinID
      : dateString < "2022-05-06"
      ? "fd_albina_thumbnail"
      : "fd_EUREGIO_thumbnail";
  return (
    <Tooltip
      label={intl.formatMessage({
        id: "archive:show-forecast:hover"
      })}
    >
      <Link
        to={"/bulletin/" + dateString}
        className={"map-preview img tooltip"}
      >
        <ArchiveAwmapStatic
          date={dateString}
          imgFormat=".jpg"
          region={region}
        />
      </Link>
    </Tooltip>
  );

  function showMap(dateString: string) {
    const lang = APP_STORE.language;
    if (dateString < "2020-12-01") {
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
