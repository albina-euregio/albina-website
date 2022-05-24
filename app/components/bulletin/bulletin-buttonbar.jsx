import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { APP_STORE } from "../../appStore";
import { modal_init } from "../../js/modal";
import { BULLETIN_STORE } from "../../stores/bulletinStore";
import { Tooltip } from "../tooltips/tooltip";

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
                className="icon-link icon-arrow-up"
                data-scroll=""
              >
                <FormattedMessage id="bulletin:linkbar:back-to-map" />
              </a>
            </div>
            <div className="normal-8 grid-item">
              <ul className="list-inline bulletin-buttonbar">
                {BULLETIN_STORE.activeBulletinCollection && (
                  <li>
                    <Tooltip
                      label={this.props.intl.formatMessage({
                        id: "bulletin:linkbar:pdf:hover"
                      })}
                    >
                      <a
                        href="#downloadPdfDialog"
                        className="modal-trigger popup-modal pure-button"
                      >
                        {this.props.intl.formatMessage({
                          id: "bulletin:linkbar:pdf"
                        })}
                      </a>
                    </Tooltip>
                  </li>
                )}
                {!config.subscribe.buttonHidden && (
                  <li>
                    <Tooltip
                      label={this.props.intl.formatMessage({
                        id: "bulletin:linkbar:subscribe:hover"
                      })}
                    >
                      <a
                        href="#subscribeDialog"
                        className="modal-trigger popup-modal pure-button"
                      >
                        {this.props.intl.formatMessage({
                          id: "bulletin:linkbar:subscribe"
                        })}
                      </a>
                    </Tooltip>
                  </li>
                )}
                {config.dialogs.feedback && (
                  <li>
                    <Tooltip
                      label={this.props.intl.formatMessage({
                        id: "bulletin:feedback:hover"
                      })}
                    >
                      <a
                        href={config.links.feedback[APP_STORE.language]}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="success pure-button"
                      >
                        {this.props.intl.formatMessage({
                          id: "bulletin:feedback"
                        })}
                      </a>
                    </Tooltip>
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
export default injectIntl(BulletinButtonbar);
