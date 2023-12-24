import React from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import Menu from "./../menu";
import { NAVIGATION_STORE } from "../../stores/navigationStore";
import { Util } from "leaflet";
import { Tooltip } from "../tooltips/tooltip";

import menuItems from "../../menu.json";
import { APP_STORE } from "../../appStore";
import { BULLETIN_STORE } from "../../stores/bulletinStore";

function PageHeader() {
  const intl = useIntl();
  // changing language on header language button click
  const handleChangeLanguage = newLanguage => {
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

  const setActiveMenuItem = e => {
    if (typeof e == "object") {
      Object.keys(e).forEach(k => {
        NAVIGATION_STORE.activeElement[k] = e[k];
      });
    }
  };

  const setActiveTopLevelMenuItem = e => {
    if (typeof e == "object") {
      Object.keys(e).forEach(k => {
        NAVIGATION_STORE.activeTopLevelElement[k] = e[k];
      });
    }
  };
  const lang = document.body.parentElement.lang;

  return (
    <div id="page-header" className="page-header" data-scroll-header>
      <div className="page-header-logo">
        <Tooltip
          label={intl.formatMessage({
            id: "header:logo:hover"
          })}
        >
          <Link
            aria-label={intl.formatMessage({
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
          intl={intl}
          className="list-plain navigation"
          entries={menuItems}
          childClassName="list-plain subnavigation"
          onSelect={() => {
            // close mobile menu on selection
            if ($("body").hasClass("navigation-open")) {
              $(".navigation-trigger").trigger("click");
            }
          }}
          onActiveMenuItem={setActiveTopLevelMenuItem}
          onActiveChildMenuItem={setActiveMenuItem}
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
              title={intl.formatMessage({
                id: "header:languages:title"
              })}
              name={intl.formatMessage({
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
                  onClick={() => handleChangeLanguage("oc")}
                >
                  Aranés
                </a>
              </li>
              <li>
                <a
                  role="button"
                  tabIndex="0"
                  className="language-trigger-ca"
                  onClick={() => handleChangeLanguage("ca")}
                >
                  Català
                </a>
              </li>
              <li>
                <a
                  role="button"
                  tabIndex="0"
                  className="language-trigger-de"
                  onClick={() => handleChangeLanguage("de")}
                >
                  Deutsch
                </a>
              </li>
              <li>
                <a
                  role="button"
                  tabIndex="0"
                  className="language-trigger-en"
                  onClick={() => handleChangeLanguage("en")}
                >
                  English
                </a>
              </li>
              <li>
                <a
                  role="button"
                  tabIndex="0"
                  className="language-trigger-es"
                  onClick={() => handleChangeLanguage("es")}
                >
                  Español
                </a>
              </li>
              <li>
                <a
                  role="button"
                  tabIndex="0"
                  className="language-trigger-fr"
                  onClick={() => handleChangeLanguage("fr")}
                >
                  Français
                </a>
              </li>
              <li>
                <a
                  role="button"
                  tabIndex="0"
                  className="language-trigger-it"
                  onClick={() => handleChangeLanguage("it")}
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
          label={intl.formatMessage({
            id: "header:hamburger:hover"
          })}
        >
          <button
            href="#"
            aria-label={intl.formatMessage({
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
          label={intl.formatMessage({
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

export default observer(PageHeader);
