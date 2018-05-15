import React from 'react';
import { observer } from 'mobx-react';

class PageHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  hangleChangeLanguage(newLanguage) {
    window['appStore'].setLanguage(newLanguage);
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
              <a href="./bulletin" className=" " title>
                Avalanche Bulletin{' '}
                <small>{window['appStore'].homeTranslation}</small>
              </a>
            </li>
            <li>
              <a href="./weather" className=" has-sub" title>
                Snow &amp; Weather
              </a>
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
              <a href="./education" className=" has-sub" title>
                Education &amp; Prevention
              </a>
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
              <a href="./blog" className title>
                Blog
              </a>
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
                  <a href="./about" className title>
                    About
                  </a>
                </li>
                <li>
                  <a href="./contact" className title>
                    Contact
                  </a>
                </li>
                <li>
                  <a href="./imprint" className title>
                    Imprint
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="page-header-language">
          <ul className="list-inline language-trigger">
            <li onClick={this.hangleChangeLanguage.bind(this, 'de')}>
              <a
                className="language-trigger-de tooltip"
                title="Deutsche Version"
              >
                DE
              </a>
            </li>
            <li onClick={this.hangleChangeLanguage.bind(this, 'it')}>
              <a
                className="language-trigger-it tooltip"
                title="Versione Italiana"
              >
                IT
              </a>
            </li>
            <li onClick={this.hangleChangeLanguage.bind(this, 'en')}>
              <a
                className="language-trigger-en tooltip"
                title="English Version"
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

export default observer(PageHeader);
