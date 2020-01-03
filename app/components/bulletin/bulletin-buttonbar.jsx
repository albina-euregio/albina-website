import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Util } from "leaflet";
import { modal_init } from "../../js/modal";

class BulletinButtonbar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    modal_init();
  }

  render() {
    return (
      <section
        id="section-bulletin-linkbar"
        className="section-padding section-linkbar section-bulletin-linkbar top-fix"
      >
        <div className="section-centered">
          <div className="grid linkbar">
            <div className="normal-4 grid-item">
              <a
                href="#page-main"
                title={this.props.intl.formatMessage({
                  id: "bulletin:linkbar:back-to-map:hover"
                })}
                className="icon-link icon-arrow-up tooltip"
                data-scroll=""
              >
                <FormattedHTMLMessage id="bulletin:linkbar:back-to-map" />
              </a>
            </div>
            <div className="normal-8 grid-item">
              <ul className="list-inline bulletin-buttonbar">
                {this.props.store.activeBulletinCollection && (
                  <li>
                    <a
                      href="#downloadPdfDialog"
                      title={this.props.intl.formatMessage({
                        id: "bulletin:linkbar:pdf:hover"
                      })}
                      className="modal-trigger popup-modal pure-button tooltip"
                    >
                      {this.props.intl.formatMessage({
                        id: "bulletin:linkbar:pdf"
                      })}
                    </a>
                    {false && (
                      <a
                        href={Util.template(config.links.downloads.pdf, {
                          date: this.props.store.settings.date,
                          lang: window["appStore"].language
                        })}
                        rel="noopener"
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
                    )}
                  </li>
                )}
                {!config.subscribe.buttonHidden && (
                  <li>
                    <a
                      href="#subscribeDialog"
                      title={this.props.intl.formatMessage({
                        id: "bulletin:linkbar:subscribe:hover"
                      })}
                      className="modal-trigger popup-modal pure-button tooltip"
                    >
                      {this.props.intl.formatMessage({
                        id: "bulletin:linkbar:subscribe"
                      })}
                    </a>
                  </li>
                )}
                {config.dialogs.feedback && (
                  <li>
                    <a
                      href={config.links.feedback[appStore.language]}
                      title={this.props.intl.formatMessage({
                        id: "bulletin:feedback:hover"
                      })}
                      rel="noopener"
                      target="_blank"
                      className="success pure-button tooltip"
                    >
                      {this.props.intl.formatMessage({
                        id: "bulletin:feedback"
                      })}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default inject("locale")(injectIntl(BulletinButtonbar));
