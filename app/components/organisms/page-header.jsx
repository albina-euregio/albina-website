import React from 'react';
import { matchPath, withRouter } from 'react-router';
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

  _linkStyle(path, hasChildren) {
    const router = this.context;
    const classes = [];

    if(path && router) {
      const pathname =
        window.location.pathname.substr(config.get('projectRoot').length - 1);
      if(matchPath(pathname, path) != null) {
        classes.push('active');
      }
    }
    if(hasChildren) {
      classes.push('has-sub');
    }

    return classes.join(' ');
  }

  renderLink(path, text, hasChildren = false) {
    return <Link to={path} className={this._linkStyle(path, hasChildren)}>{text}</Link>
  }

  render() {
    const langs = window['appStore'].languages;

    return (
      <div id="page-header" className="page-header" data-scroll-header>
        <div className="page-header-logo">
          <a href="#" className="tooltip" title="Home">
            {
              langs.map((l) => <span key={l} className={'mark mark-' + l} />)
            }
            {
              langs.map((l) => <span key={l} className={'url url-' + l} />)
            }
          </a>
        </div>
        <div className="page-header-navigation">
          <ul className="list-plain navigation">
            <li>
              {this.renderLink('/bulletin', <span>Avalanche Bulletin <small><FormattedMessage id="home" /></small></span>)}
            </li>
            <li>
              {this.renderLink('/weather', 'Snow & Weather', true)}
              <ul className="list-plain subnavigation">
                <li>
                  <Link to="/weather">Karten</Link>
                </li>
                <li>
                  <Link to="/weather/measurements">
                    Stationsmesswerte
                  </Link>
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
              { this.renderLink('/education', 'Education & Prevention', true)}
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
                  <Link to="/archive">
                    Archive
                  </Link>
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

export default inject('locale')(injectIntl(withRouter(observer(PageHeader))));
