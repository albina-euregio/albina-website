import React from "react";
import { Link } from "react-router-dom";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Util } from "leaflet";
import { dateToISODateString, dateToDateString } from "../../util/date.js";
import ArchiveAwmapStatic from "../bulletin/bulletin-awmap-static.jsx";
import { APP_STORE } from "../../appStore";

class ArchiveItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fd: false };
  }

  getLanguage(dateString) {
    var lang = APP_STORE.language;
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

  showMap(dateString) {
    var lang = APP_STORE.language;
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

  render() {
    const dateString = dateToISODateString(this.props.date);
    const lang = this.getLanguage(dateString);

    return (
      <tr>
        <td>
          <strong>{dateToDateString(this.props.date)}</strong>
        </td>
        <td>
          <ul className="list-inline list-download">
            <li>
              <a
                href={Util.template(config.apis.bulletin.pdf, {
                  date: dateString,
                  file: lang
                })}
                rel="noopener noreferrer"
                target="_blank"
                title={this.props.intl.formatMessage({
                  id: "archive:download-pdf:hover"
                })}
                className="small secondary pure-button tooltip"
              >
                <FormattedHTMLMessage id="archive:download-pdf" />
              </a>
            </li>
            <li>
              <a
                href={Util.template(config.apis.bulletin.xml, {
                  date: dateString,
                  lang
                })}
                title={this.props.intl.formatMessage({
                  id: "archive:download-xml:hover"
                })}
                rel="noopener noreferrer"
                target="_blank"
                className="small secondary pure-button tooltip"
              >
                <FormattedHTMLMessage id="archive:download-xml" />
              </a>
            </li>
          </ul>
        </td>
        <td>
          {this.showMap(dateString) && (
            <Link
              to={"/bulletin/" + dateString}
              className="map-preview img tooltip"
              title={this.props.intl.formatMessage({
                id: "archive:show-forecast:hover"
              })}
            >
              <ArchiveAwmapStatic
                date={dateString}
                region={
                  this.state.fd ? "fd_albina_thumbnail" : "am_albina_thumbnail"
                }
                onError={() => this.setState({ fd: true })}
              />
            </Link>
          )}
        </td>
      </tr>
    );
  }
}

export default injectIntl(ArchiveItem);
