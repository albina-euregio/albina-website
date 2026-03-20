import React, { useEffect, useRef } from "react";
import { useIntl } from "../../i18n";
import Menu from "../menu";
import { Tooltip } from "../tooltips/tooltip";

import { setLanguage } from "../../appStore";

function PageHeader() {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  // Utility to determine tabIndex for focusable elements
  function getTabIndex(visible: boolean) {
    return visible ? 0 : -1;
  }
  // changing language on header language button click
  const handleChangeLanguage = (
    newLanguage: keyof typeof languageNameInNativeLanguage
  ) => {
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

  // Use state for navOpen to trigger re-render and accessibility updates
  const [navOpen, setNavOpen] = React.useState(false);

  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 1024);

  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1024);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ref for navigation menu
  const navRef = useRef(null);
  // Focus trap refs
  const firstTrapRef = useRef(null);
  const lastTrapRef = useRef(null);

  function toggleNavigation(focusMenu = false) {
    if (navOpen) {
      document.body.classList.remove("navigation-open");
      setNavOpen(false);
      return;
    }
    document.body.classList.add("navigation-open");
    setNavOpen(true);
    // Animate menu items
    setTimeout(() => {
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
      // Focus first menu item if requested
      if (focusMenu && navRef.current) {
        const firstItem = navRef.current.querySelector(
          'li a,li button,li [tabindex="0"]'
        );
        if (firstItem) {
          firstItem.focus();
        }
      }
    }, 0);
  }

  // Focus trap effect for mobile nav
  useEffect(() => {
    if (!navOpen || !isMobile) return;
    function handleKeyDown(e) {
      if (e.key !== "Tab") return;
      const focusable = navRef.current
        ? Array.from(
            navRef.current.querySelectorAll(
              'a[href], button:not([disabled]), [tabindex="0"]'
            )
          ).filter(
            el =>
              !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
          )
        : [];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [navOpen, isMobile]);

  const languageNameInNativeLanguage = {
    oc: "Aranés",
    ca: "Català",
    de: "Deutsch",
    en: "English",
    es: "Español",
    fr: "Français",
    it: "Italiano"
  };

  return (
    <div id="page-header" className="page-header">
      <div className="page-header-logo">
        {config.headlessLogo?.length ? (
          config.headlessLogo.map((logo, i) => (
            <a href="/" key={i}>
              <img src={logo} style={{ margin: 0 }} />
            </a>
          ))
        ) : (
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
        )}
      </div>
      <div
        id="navigation"
        className="page-header-navigation"
        ref={navRef}
        aria-hidden={!navOpen}
        role={isMobile ? "dialog" : undefined}
        aria-modal={isMobile ? "true" : undefined}
      >
        {/* Focus trap start */}
        {isMobile && navOpen && (
          <span
            tabIndex={0}
            ref={firstTrapRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              padding: 0,
              margin: 0,
              border: 0
            }}
          />
        )}
        {/* Hamburger/close button inside menu for focus trap */}
        {isMobile && navOpen && (
          <div
            className="page-header-hamburger"
            style={{ position: "absolute", top: 0, right: 0, zIndex: 1000 }}
          >
            <Tooltip
              label={intl.formatMessage({
                id: "header:hamburger:hover"
              })}
            >
              <button
                onClick={() => toggleNavigation(true)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleNavigation(true);
                  }
                }}
                aria-label={intl.formatMessage({
                  id: "header:hamburger:hover"
                })}
                className="pure-button pure-button-icon navigation-trigger"
                tabIndex={0}
                aria-expanded={navOpen}
                aria-controls="navigation"
              >
                <span className="icon-hamburger">
                  <span className="icon-close" />
                  &nbsp;
                </span>
              </button>
            </Tooltip>
          </div>
        )}
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
          // Pass navOpen and isMobile to Menu for tabIndex control
          navOpen={navOpen}
          isMobile={isMobile}
        />
        {/* Focus trap end */}
        {isMobile && navOpen && (
          <span
            tabIndex={0}
            ref={lastTrapRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              padding: 0,
              margin: 0,
              border: 0
            }}
          />
        )}
      </div>
      <div className="page-header-language">
        <ul className="list-plain language-trigger">
          <li>
            <a
              role="button"
              tabIndex={0}
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
              {config.languages.map(l => (
                <li key={l}>
                  <a
                    role="button"
                    tabIndex={0}
                    // className used: language-trigger-oc language-trigger-ca language-trigger-de language-trigger-en language-trigger-es language-trigger-fr language-trigger-it
                    className={`language-trigger-${l}`}
                    onClick={() =>
                      handleChangeLanguage(
                        l as keyof typeof languageNameInNativeLanguage
                      )
                    }
                  >
                    {
                      languageNameInNativeLanguage[
                        l as keyof typeof languageNameInNativeLanguage
                      ]
                    }
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      {/* Hamburger button outside menu for desktop or when menu is closed */}
      {(!isMobile || !navOpen) && (
        <div className="page-header-hamburger">
          <Tooltip
            label={intl.formatMessage({
              id: "header:hamburger:hover"
            })}
          >
            <button
              onClick={() => toggleNavigation(true)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleNavigation(true);
                }
              }}
              aria-label={intl.formatMessage({
                id: "header:hamburger:hover"
              })}
              className="pure-button pure-button-icon navigation-trigger"
              tabIndex={getTabIndex(isMobile)}
              aria-expanded={navOpen}
              aria-controls="navigation"
            >
              <span className="icon-hamburger">
                <span className="icon-close" />
                &nbsp;
              </span>
            </button>
          </Tooltip>
        </div>
      )}
      {config.links.euregio && (
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
              tabIndex={getTabIndex(!isMobile)}
            >
              <span>Euregio</span>
            </a>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export default PageHeader;
