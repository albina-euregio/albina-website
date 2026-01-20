import React from "react";
import { useIntl } from "../../i18n";
import Menu from "../menu";
import { Tooltip } from "../tooltips/tooltip";

import { setLanguage } from "../../appStore";

function PageHeader() {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  // changing language on header language button click
  const handleChangeLanguage = newLanguage => {
    console.info("Changing language to " + newLanguage);
    if (import.meta.env.DEV) {
      // since website is served from localhost, just change language in appStore
      setLanguage(newLanguage);
      return;
    }

    const newHost = config.languageHostSettings[newLanguage];
    if (newHost && document.location.hostname !== newHost) {
      console.info("Changing hostname to " + newHost);
      document.location.hostname = newHost;
    } else {
      setLanguage(newLanguage);
    }
  };

  let navOpen = false;

  function toggleNavigation() {
    if (navOpen) {
      document.body.classList.remove("navigation-open");
      navOpen = false;
      return;
    }
    document.body.classList.add("navigation-open");
    document.querySelectorAll(".navigation li").forEach(li => {
      li.animate(
        [
          { opacity: "0", marginTop: "-100px" },
          { opacity: "1", marginTop: "0", visibility: "visible" }
        ],
        {
          duration: window["scroll_duration"] / 2,
          easing: "ease-out"
        }
      );
    });
    navOpen = true;
  }

  return (
    <div id="page-header" className="page-header">
      <div className="page-header-logo">
        <Tooltip
          label={intl.formatMessage({
            id: "header:logo:hover"
          })}
        >
          <a
            aria-label={intl.formatMessage({
              id: "header:logo:hover"
            })}
            href="/"
          >
            <span className="mark">
              <span
                className={`mark-${lang}`}
                data-base-url={import.meta.env.BASE_URL}
              />
              <span
                className={`mark-en`}
                data-base-url={import.meta.env.BASE_URL}
              />
            </span>
            <span className="url">
              <span
                className={`url-${lang}`}
                data-base-url={import.meta.env.BASE_URL}
              />
            </span>
          </a>
        </Tooltip>
      </div>
      <div id="navigation" className="page-header-navigation">
        <Menu
          className="list-plain navigation"
          entries={config.menu}
          childClassName="list-plain subnavigation"
          onSelect={() => {
            // close mobile menu on selection
            if (document.body.classList.contains("navigation-open")) {
              toggleNavigation();
            }
          }}
          onActiveMenuItem={() => {}}
          onActiveChildMenuItem={() => {}}
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
            onClick={() => toggleNavigation()}
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
            href={config.template(config.links.euregio, {
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

export default PageHeader;
