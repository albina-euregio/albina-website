import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import Menu from "./../menu";
import { Util } from "leaflet";

import menuItems from "../../menu.json";

class PageHeader extends React.Component {
  // changing language on header language button click
  handleChangeLanguage = newLanguage => {
    console.info("Changing language to " + newLanguage);
    if (APP_DEV_MODE) {
      // since website is served from localhost, just change language in appStore
      window["appStore"].setLanguage(newLanguage);
      return;
    }

    const newHost = config.languageHostSettings[newLanguage];
    if (newHost && document.location.hostname !== newHost) {
      console.info("Changing hostname to " + newHost);
      document.location.hostname = newHost;
    } else {
      window["appStore"].setLanguage(newLanguage);
    }
  };

  setActiveMenuItem = e => {
    if (typeof e == "object") {
      Object.keys(e).forEach(k => {
        window["appStore"].navigation.activeElement[k] = e[k];
      });
    }
  };

  setActiveTopLevelMenuItem = e => {
    if (typeof e == "object") {
      Object.keys(e).forEach(k => {
        window["appStore"].navigation.activeTopLevelElement[k] = e[k];
      });
    }
  };

  render() {
    const langs = window["appStore"].languages;
    const lang = window["appStore"].language;

    return (
      <div id="page-header" className="page-header" data-scroll-header>
        <div className="page-header-logo">
          <Link
            to="/"
            ref="logoImg"
            className="tooltip"
            title={this.props.intl.formatMessage({
              id: "header:logo:hover"
            })}
          >
            <span className="mark">
              {langs.map(l => (
                <span key={l} className={"mark-" + l} />
              ))}
            </span>
            <span className="url">
              {langs.map(l => (
                <span key={l} className={"url-" + l} />
              ))}
            </span>
          </Link>
        </div>
        <div className="page-header-navigation">
          <Menu
            intl={this.props.intl}
            className="list-plain navigation"
            entries={menuItems}
            childClassName="list-plain subnavigation"
            onSelect={() => {
              // close mobile menu on selection
              if ($("body").hasClass("navigation-open")) {
                $(".navigation-trigger").trigger("click");
              }
            }}
            onActiveMenuItem={this.setActiveTopLevelMenuItem}
            onActiveChildMenuItem={this.setActiveMenuItem}
          />
        </div>
        <div className="page-header-language">
          <ul className="list-plain language-trigger">
            <li>
              <a
                onClick={e => {
                  e.preventDefault();
                }}
                className="has-sub"
                title=""
              >
                <span></span>
              </a>
              <ul className="list-plain subnavigation">
                <li>
                  <a
                    className="language-trigger-de"
                    onClick={() => this.handleChangeLanguage("de")}
                  >
                    Deutsch
                  </a>
                </li>
                <li>
                  <a
                    className="language-trigger-it"
                    onClick={() => this.handleChangeLanguage("it")}
                  >
                    Italiano
                  </a>
                </li>
                <li>
                  <a
                    className="language-trigger-en"
                    onClick={() => this.handleChangeLanguage("en")}
                  >
                    English
                  </a>
                </li>
                <li>
                  <a
                    className="language-trigger-fr"
                    onClick={() => this.handleChangeLanguage("fr")}
                  >
                    Français
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="page-header-hamburger">
          <button
            href="#"
            title={this.props.intl.formatMessage({
              id: "header:hamburger:hover"
            })}
            className="pure-button pure-button-icon navigation-trigger tooltip"
          >
            <span className="icon-hamburger">
              <span className="icon-close" />
              &nbsp;
            </span>
          </button>
        </div>
        <div className="page-header-logo-secondary">
          <a
            href={Util.template(config.links.interreg, {
              lang: lang
            })}
            className="header-footer-logo-secondary tooltip"
            title={this.props.intl.formatMessage({
              id: "header:euregio:hover"
            })}
            rel="noopener"
            target="_blank"
          >
            <span>Euregio</span>
          </a>
        </div>
        <div className="page-header-weather-map-trigger">
          <button
            onClick={() => {
              $("body").toggleClass("scrolling-down");
            }}
            className="pure-button pure-button-icon page-header-trigger tooltip"
            title="Navigation"
          >
            <span className="icon-up-open-big">
              <span className="icon-down-open-big"></span>&nbsp;
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(withRouter(observer(PageHeader))));
