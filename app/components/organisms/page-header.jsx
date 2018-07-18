import React from 'react';
import { matchPath, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Menu from '../menu';

class PageHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChangeLanguage = (newLanguage) => {
    window['appStore'].language = newLanguage;
  };

  render() {
    const langs = window['appStore'].languages;
    const menuItems = this.props.menuStore.getMenu('main');

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
          <Menu className="list-plain navigation"
            entries={menuItems}
            childClassName="list-plain subnavigation" />
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
