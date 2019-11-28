import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import Menu from "./../menu";
import { Util } from "leaflet";

class PageHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  // changing language on header language button click
  handleChangeLanguage = newLanguage => {
    console.info("Changing language to " + newLanguage);

    // window["appStore"].setLanguage(newLanguage);
    // Base.searchChange(this.props.history, { lang: newLanguage }, false);
    const newHost = config.get("languageHostSettings")[newLanguage];
    console.info("Changing hostname to " + newHost);
    document.location.hostname = newHost;

    // if (this.props.location.pathname.includes("blog")) {
    //   Base.searchChange(
    //     this.props.history,
    //     { searchLang: appStore.language },
    //     false
    //   );
    // }
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
    const menuItems = this.props.menuStore.getMenu("main");

    return (
      <div id="page-header" className="page-header" data-scroll-header>
        <div className="page-header-logo">
          <Link
            to="/"
            className="tooltip"
            title={this.props.intl.formatMessage({
              id: "header:logo:hover"
            })}
            data-tilty
          >
            {langs.map(l => (
              <span key={l} className={"mark mark-" + l} />
            ))}
            {langs.map(l => (
              <span key={l} className={"url url-" + l} />
            ))}
          </Link>
        </div>
        <div className="page-header-navigation">
          <Menu
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
          <ul className="list-inline language-trigger">
            <li>
              <a
                className="language-trigger-de tooltip"
                title={this.props.intl.formatMessage({
                  id: "header:language-switch:de:hover"
                })}
                onClick={() => this.handleChangeLanguage("de")}
              >
                DE
              </a>
            </li>
            <li>
              <a
                className="language-trigger-it tooltip"
                title={this.props.intl.formatMessage({
                  id: "header:language-switch:it:hover"
                })}
                onClick={() => this.handleChangeLanguage("it")}
              >
                IT
              </a>
            </li>
            <li>
              <a
                className="language-trigger-en tooltip"
                title={this.props.intl.formatMessage({
                  id: "header:language-switch:en:hover"
                })}
                onClick={() => this.handleChangeLanguage("en")}
              >
                EN
              </a>
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
            href={Util.template(config.get("links.interreg"), {
              lang: lang
            })}
            data-tilty
            className="header-footer-logo-secondary tooltip"
            title={this.props.intl.formatMessage({
              id: "header:euregio:hover"
            })}
            target="_blank"
          >
            <span>Euregio</span>
          </a>
        </div>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(withRouter(observer(PageHeader))));
