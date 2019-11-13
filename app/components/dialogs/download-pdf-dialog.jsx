import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Util } from "leaflet";

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

  shouldComponentUpdate() {
    return true;
  }

  pdfLink() {
    if (window["bulletinStore"] && window["appStore"]) {
      const isRegion = !!this.state.region;
      const isBw = this.state.mode === "bw";

      const links = config.get("links.downloads");
      const link =
        links["base"] +
        links["pdf" + (isRegion ? "-region" : "") + (isBw ? "-bw" : "")];

      return Util.template(link, {
        date: window["bulletinStore"].settings.date,
        lang: window["appStore"].language,
        region: this.state.region
      });
    } else {
      // not loaded yet
      return "";
    }
  }

  render() {
    return (
      <div className="modal-subscribe">
        <div
          className="modal-header"
          style={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <h2 className="subheader">
            <FormattedHTMLMessage id="dialog:download-pdf:heading" />
          </h2>
        </div>
        <div
          className="modal mfp-content"
          style={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            display: "flex"
          }}
        >
          <div className="modal-container">
            <div style={{}}>
              <div>
                <label htmlFor="province">
                  <FormattedHTMLMessage id="dialog:download-pdf:region" />
                </label>
                <ul
                  style={{
                    alignContent: "center",
                    textAlign: "center"
                  }}
                  className="list-inline list-buttongroup"
                >
                  <li style={{ margin: "0 auto" }}>
                    <ProvinceFilter
                      name="province"
                      all={this.props.intl.formatMessage({
                        id: "dialog:subscribe-email:region-all:button"
                      })}
                      handleChange={r => this.handleChangeRegion(r)}
                      value={this.state.region}
                    />
                  </li>
                </ul>
              </div>
              <div>
                <label htmlFor="mode">
                  <FormattedHTMLMessage id="dialog:download-pdf:mode" />
                </label>
                <ul
                  style={{
                    alignContent: "center",
                    textAlign: "center"
                  }}
                  className="list-inline list-buttongroup"
                >
                  <li style={{ margin: "0 auto" }}>
                    {/* mode */}
                    <PdfModeFilter
                      name="mode"
                      onChange={this.handleChangeMode}
                      value={this.state.mode}
                      options={[
                        {
                          value: "color",
                          label: this.props.intl.formatMessage({
                            id: "dialog:download-pdf:mode:color"
                          })
                        },
                        {
                          value: "bw",
                          label: this.props.intl.formatMessage({
                            id: "dialog:download-pdf:mode:bw"
                          })
                        }
                      ]}
                    />
                  </li>
                </ul>
              </div>
              <p>
                <a
                  href={this.pdfLink()}
                  target="_blank"
                  title={this.props.intl.formatMessage({
                    id: "bulletin:linkbar:pdf:hover"
                  })}
                  className="pure-button tooltip"
                >
                  {this.props.intl.formatMessage({
                    id: "bulletin:linkbar:pdf"
                  })}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(observer(DownloadPdfDialog)));
