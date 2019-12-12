import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import Menu from "../menu";
import SmFollow from "./sm-follow.jsx";
import FooterLogos from "./footer-logos.jsx";
import { Util } from "leaflet";

import footerMenuMore from "../../menu-footer.json";
import footerMenuMain from "../../menu-footer-main.json";

class PageFooter extends React.Component {
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
              {!config.get("subscribe.buttonHidden") && (
                <p className="page-footer-subscribe">
                  <a
                    href="#subscribeDialog"
                    title={this.props.intl.formatMessage({
                      id: "footer:subscribe:hover"
                    })}
                    className="modal-trigger popup-modal pure-button tooltip"
                  >
                    {this.props.intl.formatMessage({
                      id: "footer:subscribe"
                    })}
                  </a>
                </p>
              )}
              <p className="page-footer-text">
                <a
                  href="https://gitlab.com/albina-euregio/albina-website"
                  target="_blank"
                >
                  albina-website {config.get("version")}
                </a>
                , {config.get("versionDate")}
              </p>
              <p className="page-footer-logo-tertiary">
                <a
                  href="https://www.avalanches.org/"
                  data-tilty
                  className="footer-logo-tertiary tooltip"
                  title="EAWS"
                  target="_blank"
                >
                  <span>EAWS</span>
                </a>
              </p>
              <p className="page-footer-logo-secondary">
                <a
                  href={Util.template(config.get("links.interreg"), {
                    lang: window["appStore"].language
                  })}
                  data-tilty
                  className="header-footer-logo-secondary tooltip"
                  title={this.props.intl.formatMessage({
                    id: "footer:euregio:hover"
                  })}
                  target="_blank"
                >
                  <span>
                    {this.props.intl.formatMessage({
                      id: "footer:euregio:hover"
                    })}
                  </span>
                </a>
              </p>
            </div>
            <div className="grid-item all-12">
              <p className="page-footer-top">
                <a
                  href="#page-main"
                  className="icon-arrow-up tooltip"
                  title={this.props.intl.formatMessage({
                    id: "footer:top:hover"
                  })}
                  data-scroll=""
                >
                  <span>Top</span>
                </a>
              </p>
              {/*
                config.get('developmentMode') && (
                  <p className="page-footer-dev-version">
                  <span>
                  Draft version - for internal use: v
                  {config.get('version')}
                  </span>
                  </p>
                  )
                */}
            </div>
            {/* <div className="grid-item all-12">
              <div className="page-footer-version">
                version {config.get("version")}, {config.get("versionDate")}
              </div>
            </div> */}
          </div>
        </section>
        {!config.get("footer.iconsHidden") && <FooterLogos />}

        <SmFollow />
      </div>
    );
  }
}
export default inject("locale")(injectIntl(observer(PageFooter)));
