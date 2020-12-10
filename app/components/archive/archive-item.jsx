import React from "react";
import { Link } from "react-router-dom";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Util } from "leaflet";
import { dateToISODateString, dateToDateString } from "../../util/date.js";

class ArchiveItem extends React.Component {
  get previewMap() {
    // TODO: fix daytime
    return (
      window.config.apis.geo +
      dateToISODateString(this.props.date) +
      "/am_albina_thumbnail.jpg"
    );
  }

  getLanguage(dateString) {
    var lang = window["appStore"].language;
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
    var lang = window["appStore"].language;
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

    const baseLink = config.links.downloads["base"];
    return (
      <tr>
        <td>
          <strong>{dateToDateString(this.props.date)}</strong>
        </td>
        <td>
          <ul className="list-inline list-download">
            <li>
              <a
                href={
                  baseLink +
                  Util.template(config.links.downloads.pdf, {
                    date: dateString,
                    lang
                  })
                }
                rel="noopener"
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
                href={
                  baseLink +
                  Util.template(config.links.downloads.xml, {
                    date: dateString,
                    lang
                  })
                }
                title={this.props.intl.formatMessage({
                  id: "archive:download-xml:hover"
                })}
                rel="noopener"
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
              <img src={this.previewMap} alt="Region" />
            </Link>
          )}
        </td>
      </tr>
    );
  }
}

export default inject("locale")(injectIntl(ArchiveItem));
