import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import Menu from "./../menu";
import { NAVIGATION_STORE } from "../../stores/navigationStore";
import { Util } from "leaflet";
import { Tooltip } from "../tooltips/tooltip";

import menuItems from "../../menu.json";
import { APP_STORE } from "../../appStore";
import { BULLETIN_STORE } from "../../stores/bulletinStore";

class PageHeader extends React.Component {
  // changing language on header language button click
  handleChangeLanguage = newLanguage => {
    console.info("Changing language to " + newLanguage);
    if (import.meta.env.DEV) {
      const date = BULLETIN_STORE.settings.date;
      // since website is served from localhost, just change language in appStore
      APP_STORE.setLanguage(newLanguage);
      if (date) {
        BULLETIN_STORE.load(date, true);
      }
      return;
    }

    const newHost = config.languageHostSettings[newLanguage];
    if (newHost && document.location.hostname !== newHost) {
      console.info("Changing hostname to " + newHost);
      document.location.hostname = newHost;
    } else {
      APP_STORE.setLanguage(newLanguage);
    }
  };

  setActiveMenuItem = e => {
    if (typeof e == "object") {
      Object.keys(e).forEach(k => {
        NAVIGATION_STORE.activeElement[k] = e[k];
      });
    }
  };

  setActiveTopLevelMenuItem = e => {
    if (typeof e == "object") {
      Object.keys(e).forEach(k => {
        NAVIGATION_STORE.activeTopLevelElement[k] = e[k];
      });
    }
  };

  render() {
    const lang = APP_STORE.language;

    return (
      <div id="page-header" className="page-header" data-scroll-header>
        <div className="page-header-logo">
          <Tooltip
            label={this.props.intl.formatMessage({
              id: "header:logo:hover"
            })}
          >
            <Link
              aria-label={this.props.intl.formatMessage({
                id: "header:logo:hover"
              })}
              to="/"
            >
              <span className="mark">
                <span key={"mark-" + lang} className={"mark-" + lang} />
                <span key="en" className={"mark-en"} />
              </span>
              <span className="url">
                <span key={"url-" + lang} className={"url-" + lang} />
              </span>
            </Link>
          </Tooltip>
        </div>
        <div id="navigation" className="page-header-navigation">
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
                role="button"
                tabIndex="0"
                onClick={e => {
                  e.preventDefault();
                }}
                className="has-sub"
                title={this.props.intl.formatMessage({
                  id: "header:languages:title"
                })}
                name={this.props.intl.formatMessage({
                  id: "header:languages:title"
                })}
                id="languages"
              >
                <span></span>
              </a>
              <ul className="list-plain subnavigation">
                {/* languages in alphabetical order */}
                <li>
                  <a
                    role="button"
                    tabIndex="0"
                    className="language-trigger-oc"
                    onClick={() => this.handleChangeLanguage("oc")}
                  >
                    Aranés
                  </a>
                </li>
                <li>
                  <a
                    role="button"
                    tabIndex="0"
                    className="language-trigger-ca"
                    onClick={() => this.handleChangeLanguage("ca")}
                  >
                    Català
                  </a>
                </li>
                <li>
                  <a
                    role="button"
                    tabIndex="0"
                    className="language-trigger-de"
                    onClick={() => this.handleChangeLanguage("de")}
                  >
                    Deutsch
                  </a>
                </li>
                <li>
                  <a
                    role="button"
                    tabIndex="0"
                    className="language-trigger-en"
                    onClick={() => this.handleChangeLanguage("en")}
                  >
                    English
                  </a>
                </li>
                <li>
                  <a
                    role="button"
                    tabIndex="0"
                    className="language-trigger-es"
                    onClick={() => this.handleChangeLanguage("es")}
                  >
                    Español
                  </a>
                </li>
                <li>
                  <a
                    role="button"
                    tabIndex="0"
                    className="language-trigger-fr"
                    onClick={() => this.handleChangeLanguage("fr")}
                  >
                    Français
                  </a>
                </li>
                <li>
                  <a
                    role="button"
                    tabIndex="0"
                    className="language-trigger-it"
                    onClick={() => this.handleChangeLanguage("it")}
                  >
                    Italiano
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="page-header-hamburger">
          <Tooltip
            label={this.props.intl.formatMessage({
              id: "header:hamburger:hover"
            })}
          >
            <button
              href="#"
              aria-label={this.props.intl.formatMessage({
                id: "header:hamburger:hover"
              })}
              className="pure-button pure-button-icon navigation-trigger"
            >
              <span className="icon-hamburger">
                <span className="icon-close" />
                &nbsp;
              </span>
            </button>
          </Tooltip>
        </div>
        <div className="page-header-logo-secondary">
          <Tooltip
            label={this.props.intl.formatMessage({
              id: "header:euregio:hover"
            })}
          >
            <a
              href={Util.template(config.links.euregio, {
                lang: lang
              })}
              className="header-footer-logo-secondary"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Euregio</span>
            </a>
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default injectIntl(observer(PageHeader));
