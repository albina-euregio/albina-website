import React from "react";
import { observer } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Util } from "leaflet";
import { regionCodes } from "../../util/regions";
import { BULLETIN_STORE } from "../../stores/bulletinStore";
import { APP_STORE } from "../../appStore";

class DownloadPdfDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: false,
      mode: "color" // 'bw'
    };
  }

  handleChangeRegion = newRegion => {
    this.setState({ region: newRegion !== "none" ? newRegion : false });
  };
  handleChangeMode = newMode => {
    this.setState({ mode: newMode });
  };

  pdfLink(isRegion, isBw) {
    const links = config.links.downloads;
    const link =
      links["base"] +
      links["pdf" + (isRegion ? "-region" : "") + (isBw ? "-bw" : "")];

    return Util.template(link, {
      date: BULLETIN_STORE.settings.date,
      lang: APP_STORE.language,
      region: isRegion
    });
  }

  regionSelector(region) {
    const label = region
      ? this.props.intl.formatMessage({
          id: `region:${region}`
        })
      : this.props.intl.formatMessage({
          id: "dialog:subscribe-email:region-all:button"
        });
    return (
      <>
        <label htmlFor="input">
          {label}
          <span className="normal">
            {" "}
            <FormattedHTMLMessage id="dialog:download-pdf:in" />
          </span>
        </label>
        <ul className="list-inline list-buttongroup">
          <li>
            <button
              type="button"
              onClick={() => {
                window.open(this.pdfLink(region, false));
              }}
              title=""
              className="pure-button"
            >
              {this.props.intl.formatMessage({
                id: "dialog:download-pdf:mode:color"
              })}
            </button>
          </li>
          <li>
            <span className="buttongroup-boolean">
              <FormattedHTMLMessage id="dialog:download-pdf:or" />
            </span>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                window.open(this.pdfLink(region, true));
              }}
              title=""
              className="inverse pure-button"
            >
              {this.props.intl.formatMessage({
                id: "dialog:download-pdf:mode:bw"
              })}
            </button>
          </li>
        </ul>
      </>
    );
  }

  render() {
    return (
      <div className="modal-container">
        <div className="modal-subscribe">
          <div className="modal-header">
            <h2 className="subheader">
              <FormattedHTMLMessage id="dialog:download-pdf:subheading" />
            </h2>
            <h2>
              <FormattedHTMLMessage id="dialog:download-pdf:heading" />
            </h2>
            <span>
              <FormattedHTMLMessage id="dialog:download-pdf:description" />
            </span>
          </div>
          <form className="pure-form pure-form-stacked">
            {this.regionSelector()}

            {regionCodes.map(r => this.regionSelector(r))}
          </form>
        </div>
      </div>
    );
  }
}

export default injectIntl(observer(DownloadPdfDialog));
