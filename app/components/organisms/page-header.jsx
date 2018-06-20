import React from 'react';
import { matchPath } from 'react-router';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { injectIntl, FormattedMessage} from 'react-intl';

class PageHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChangeLanguage = (newLanguage) => {
    window['appStore'].language = newLanguage;
  };

  _linkStyle(path) {
    let active = false;
    const router = this.context;

    if(path && router) {
      active = (matchPath(window.location.pathname, path) != null);
    }
    return (active) ? 'active' : '';
  }

  renderLink(path, text) {
    return <Link to={path} className={this._linkStyle(path)}>{text}</Link>
  }

  render() {
    return (
      <div id="page-header" className="page-header" data-scroll-header>
        <div className="page-header-logo">
          <a href="#" className="tooltip" title="Home">
            <span className="mark mark-de" />
            <span className="mark mark-it" />
            <span className="mark mark-en" />
            <span className="url url-de" />
            <span className="url url-it" />
            <span className="url url-en" />
          </a>
        </div>
        <div className="page-header-navigation">
          <ul className="list-plain navigation">
            <li>
              {this.renderLink('/bulletin', <span>Avalanche Bulletin <small><FormattedMessage id="home" /></small></span>)}
            </li>
            <li>
              {this.renderLink('/weather', 'Snow & Weather')}
              <ul className="list-plain subnavigation">
                <li>
                  <a href="#" className title>
                    Aktuelle Karten
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Stationsmesswerte
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Progonosekarten
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Wetterstationen
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Schneeprofile
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Unfälle
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Webcams
                  </a>
                </li>
              </ul>
            </li>
            <li>
              { this.renderLink('/education', 'Education & Prevention')}
              <ul className="list-plain subnavigation">
                <li>
                  <a href="#" className title>
                    Gefahrenskala
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Matrix
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Lawinenprobleme
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Gefahrenmuster
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Lawinengrößen
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Geländeneigungen
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Glossar
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    Icons
                  </a>
                </li>
              </ul>
            </li>
            <li>
              { this.renderLink('/blog', 'Blog')}
            </li>
            <li>
              <a href="#" className=" has-sub" title>
                More
              </a>
              <ul className="list-plain subnavigation">
                <li>
                  <a href="#" className title>
                    Archive
                  </a>
                </li>
                <li>
                  <a href="#" className title>
                    API
                  </a>
                </li>
                <li>
                  <Link to="/about">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/imprint">
                    Imprint
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="page-header-language">
          <ul className="list-inline language-trigger">
            <li>
              <a
                className="language-trigger-de tooltip"
                title="Deutsche Version"
                onClick={() => this.handleChangeLanguage('de')}
              >
                DE
              </a>
            </li>
            <li>
              <a
                className="language-trigger-it tooltip"
                title="Versione Italiana"
                onClick={() => this.handleChangeLanguage('it')}
              >
                IT
              </a>
            </li>
            <li>
              <a
                className="language-trigger-en tooltip"
                title="English Version"
                onClick={() => this.handleChangeLanguage('en') }
              >
                EN
              </a>
            </li>
          </ul>
        </div>
        <div className="page-header-hamburger">
          <button
            href
            title="Navigation"
            className="pure-button pure-button-icon navigation-trigger tooltip"
          >
            <span className="icon-hamburger">
              <span className="icon-close" />&nbsp;
            </span>
          </button>
        </div>
        <div className="page-header-interreg">
          <a href="#" className="logo-interreg tooltip" title="Interreg">
            <span>Interreg</span>
          </a>
        </div>
      </div>
    );
  }
}

export default inject('locale')(injectIntl(observer(PageHeader)));
