import React from "react";
import { Link } from "react-router-dom";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import stringInject from "stringinject";
import { dateToISODateString, dateToDateString } from "../../util/date.js";

class ArchiveItem extends React.Component {
  get previewMap() {
    // TODO: fix daytime
    return (
      window["config"].get("apis.geo") +
      dateToISODateString(this.props.date) +
      "/am_albina_thumbnail.jpg"
    );
  }

  render() {
    const dateString = dateToISODateString(this.props.date);

    const baseLink = config.get("links.downloads")["base"];
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
                  stringInject(config.get("links.downloads.pdf"), {
                    date: dateString,
                    lang: this.props.lang
                  })
                }
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
                  stringInject(config.get("links.downloads.xml"), {
                    date: dateString,
                    lang: this.props.lang
                  })
                }
                title={this.props.intl.formatMessage({
                  id: "archive:download-xml:hover"
                })}
                target="_blank"
                className="small secondary pure-button tooltip"
              >
                <FormattedHTMLMessage id="archive:download-xml" />
              </a>
            </li>
          </ul>
        </td>
        <td>
          <Link
            to={"/bulletin/" + dateString}
            className="map-preview img tooltip"
            title={this.props.intl.formatMessage({
              id: "archive:show-forecast:hover"
            })}
          >
            <img src={this.previewMap} alt="Region" />
          </Link>
        </td>
      </tr>
    );
  }
}

export default inject("locale")(injectIntl(ArchiveItem));
