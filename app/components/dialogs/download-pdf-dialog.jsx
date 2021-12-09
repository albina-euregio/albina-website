import React from "react";
import { observer } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Util } from "leaflet";
import { regionCodes } from "../../util/regions";

import ProvinceFilter from "../filters/province-filter";
import PdfModeFilter from "../filters/pdfmode-filter";

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
    if (window["bulletinStore"] && window["appStore"]) {
      const links = config.links.downloads;
      const link =
        links["base"] +
        links["pdf" + (isRegion ? "-region" : "") + (isBw ? "-bw" : "")];

      return Util.template(link, {
        date: window["bulletinStore"].settings.date,
        lang: window["appStore"].language,
        region: isRegion
      });
    } else {
      // not loaded yet
      return "";
    }
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
        <label for="input">
          {label}
          <span class="normal"> in</span>
        </label>
        <ul class="list-inline list-buttongroup">
          <li>
            <button
              href={this.pdfLink(region, false)}
              title=""
              class="pure-button"
            >
              {this.props.intl.formatMessage({
                id: "dialog:download-pdf:mode:color"
              })}
            </button>
          </li>
          <li>
            <span class="buttongroup-boolean">or</span>
          </li>
          <li>
            <button
              href={this.pdfLink(region, true)}
              title=""
              class="inverse pure-button"
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
          <div class="modal-header">
            <h2 class="subheader">PDF</h2>
            <h2>Download Bulletin</h2>
            <span>
              Choose your region of interest and get a PDF in color or black
              &amp; white.
            </span>
          </div>
          <form class="pure-form pure-form-stacked">
            {this.regionSelector()}

            {regionCodes.map(r => this.regionSelector(r))}
          </form>
        </div>
      </div>
    );
  }
}

export default injectIntl(observer(DownloadPdfDialog));
