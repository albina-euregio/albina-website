import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { Util } from "leaflet";
import { dateToISODateString, LONG_DATE_FORMAT } from "../../util/date.js";
import ArchiveAwmapStatic from "../bulletin/bulletin-awmap-static";
import { Tooltip } from "../tooltips/tooltip";
import { APP_STORE } from "../../appStore";
import { Status } from "../../stores/bulletinStore";
import { RegionCodes } from "../../util/regions";

export type LegacyBulletinStatus = {
  $type: "LegacyBulletinStatus";
  status: Record<RegionCodes, string | undefined>;
};
export type BulletinStatus = Status | LegacyBulletinStatus;

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

  return (
    <tr>
      <td>
        <strong>{intl.formatDate(date, LONG_DATE_FORMAT)}</strong>
      </td>
      <td>
        <ul className="list-inline list-download">
          <li>{pdfDownloadLink()}</li>
          <li>{xmlDownloadLink()}</li>
        </ul>
      </td>
      <td>{bulletinMap()}</td>
    </tr>
  );

  function pdfDownloadLink() {
    return (
      <a
        href={Util.template(config.apis.bulletin.pdf, {
          date: dateString,
          region: dateString > "2022-05-06" ? "EUREGIO_" : "",
          lang,
          bw: ""
        })}
        rel="noopener noreferrer"
        target="_blank"
        className="small secondary pure-button tooltip"
      >
        <FormattedMessage id="archive:download-pdf" />
      </a>
    );
  }

  function xmlDownloadLink() {
    return (
      <a
        href={Util.template(config.apis.bulletin.xml, {
          date: dateString,
          region: dateString > "2022-05-06" ? "EUREGIO_" : "",
          lang
        })}
        rel="noopener noreferrer"
        target="_blank"
        className="small secondary pure-button tooltip"
      >
        <FormattedMessage id="archive:download-xml" />
      </a>
    );
  }

  function bulletinMap(): React.ReactNode {
    if (!showMap(dateString)) return;
    const region =
      dateString < "2022-05-06"
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
  }
}

export default ArchiveItem;
