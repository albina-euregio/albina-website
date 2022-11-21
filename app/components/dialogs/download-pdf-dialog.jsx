import React from "react";
import { observer } from "mobx-react";
import { injectIntl, FormattedMessage } from "react-intl";
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

  pdfLink(region, isBw) {
    region = region
      ? `${region}_`
      : BULLETIN_STORE.settings.date > "2022-05-06"
      ? "EUREGIO_"
      : "";
    return Util.template(config.apis.bulletin.pdf, {
      date: BULLETIN_STORE.settings.date,
      region,
      lang: APP_STORE.language,
      bw: isBw ? "_bw" : ""
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
    return [
      <label htmlFor="input" key={(region || "base") + "_label"}>
        {label}
        <span className="normal">
          {" "}
          <FormattedMessage id="dialog:download-pdf:in" />
        </span>
      </label>,
      <ul
        className="list-inline list-buttongroup"
        key={(region || "base") + "_region"}
      >
        <li key={(region || "base") + "_bw"}>
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
        <li key={(region || "base") + "_spacer"}>
          <span className="buttongroup-boolean">
            <FormattedMessage id="dialog:download-pdf:or" />
          </span>
        </li>
        <li key={(region || "base") + "_color"}>
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
    ];
  }

  render() {
    return (
      <div className="modal-container" key="modal-download-pdf-dialog">
        <div className="modal-subscribe" key="modal-subscribe">
          <div className="modal-header" key="modal-header">
            <h2 key="subheading" className="subheader">
              <FormattedMessage id="dialog:download-pdf:subheading" />
            </h2>
            <h2 key="heading">
              <FormattedMessage id="dialog:download-pdf:heading" />
            </h2>
            <span key="description">
              <FormattedMessage id="dialog:download-pdf:description" />
            </span>
          </div>
          <form className="pure-form pure-form-stacked" key="form">
            {this.regionSelector()}
            {regionCodes.map(r => this.regionSelector(r))}
          </form>
        </div>
      </div>
    );
  }
}

export default injectIntl(observer(DownloadPdfDialog));
