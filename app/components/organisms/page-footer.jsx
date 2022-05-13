import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import Menu from "../menu";
import SmFollow from "./sm-follow.jsx";
import FooterLogos from "./footer-logos.jsx";
import { Util } from "leaflet";
import tilty from "vanilla-tilt";

import { Tooltip } from "../../components/tooltips/tooltip";
import footerMenuMore from "../../menu-footer.json";
import footerMenuMain from "../../menu-footer-main.json";
import { APP_STORE } from "../../appStore";

const license = import.meta.env.APP_LICENSE; // included via vite.config.js
const repository = import.meta.env.APP_REPOSITORY; // included via vite.config.js
const version = import.meta.env.APP_VERSION; // included via vite.config.js
const versionDate = import.meta.env.APP_VERSION_DATE; // included via vite.config.js

class PageFooter extends React.Component {
  componentDidMount() {
    tilty.init(document.querySelectorAll(".tilt"));
  }

  render() {
    return (
      <div id="page-footer" className="page-footer">
        <section className="section section-padding page-footer-navigation">
          <div className="grid">
            <div className="grid-item normal-6">
              <Menu
                intl={this.props.intl}
                className="list-inline footer-navigation footer-navigation-more"
                entries={footerMenuMore}
              />
              <Menu
                intl={this.props.intl}
                className="list-plain footer-navigation footer-navigation-main"
                entries={footerMenuMain}
              />
            </div>
            <div className="grid-item normal-6">
              {!config.subscribe.buttonHidden && (
                <p className="page-footer-subscribe">
                  <Tooltip
                    label={this.props.intl.formatMessage({
                      id: "footer:subscribe:hover"
                    })}
                    html={true}
                  >
                    <a
                      href="#subscribeDialog"
                      title={this.props.intl.formatMessage({
                        id: "footer:subscribe:hover"
                      })}
                      className="modal-trigger popup-modal pure-button"
                    >
                      {this.props.intl.formatMessage({
                        id: "footer:subscribe"
                      })}
                    </a>
                  </Tooltip>
                </p>
              )}
              <p className="page-footer-text">
                <a href={repository} rel="noopener noreferrer" target="_blank">
                  albina-website {version}
                </a>
                , {versionDate}, {license}
              </p>

              <p className="page-footer-logo-tertiary">
                <Tooltip label="EAWS">
                  <a
                    href="https://www.avalanches.org/"
                    {...window["tiltySettings"]}
                    className="footer-logo-tertiary tilt"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>EAWS</span>
                  </a>
                </Tooltip>
              </p>

              <p className="page-footer-logo-secondary">
                <Tooltip
                  label={this.props.intl.formatMessage({
                    id: "footer:interreg:hover"
                  })}
                >
                  <a
                    href={Util.template(config.links.interreg, {
                      lang: APP_STORE.language
                    })}
                    {...window["tiltySettings"]}
                    className="header-footer-logo-secondary tilt"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>Interreg</span>
                  </a>
                </Tooltip>
              </p>
            </div>
            <div className="grid-item all-12">
              <p className="page-footer-top">
                <Tooltip
                  label={this.props.intl.formatMessage({
                    id: "footer:top:hover"
                  })}
                >
                  <a
                    href="#page-main"
                    className="icon-arrow-up"
                    aria-label={this.props.intl.formatMessage({
                      id: "footer:top:hover"
                    })}
                    data-scroll=""
                  >
                    <span>Top</span>
                  </a>
                </Tooltip>
              </p>
            </div>
          </div>
        </section>
        {!config.footer.iconsHidden && <FooterLogos />}

        <SmFollow />
      </div>
    );
  }
}
export default injectIntl(observer(PageFooter));
