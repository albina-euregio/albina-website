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
          <Link to="/" className="tooltip" title={this.props.intl.formatMessage({id: 'header:logo:hover'})}>
            {
              langs.map((l) => <span key={l} className={'mark mark-' + l} />)
            }
            {
              langs.map((l) => <span key={l} className={'url url-' + l} />)
            }
          </Link>
        </div>
        <div className="page-header-navigation">
          <Menu className="list-plain navigation"
            entries={menuItems}
            childClassName="list-plain subnavigation"
            onSelect={() => {
              // close mobile menu on selection
              if($('body').hasClass('navigation-open')) {
                $('.navigation-trigger').trigger('click');
              }
            }} />
        </div>
        <div className="page-header-language">
          <ul className="list-inline language-trigger">
            <li>
              <a
                className="language-trigger-de tooltip"
                title={this.props.intl.formatMessage({id: 'header:language-switch:de:hover'})}
                onClick={() => this.handleChangeLanguage('de')}
              >
                DE
              </a>
            </li>
            <li>
              <a
                className="language-trigger-it tooltip"
                title={this.props.intl.formatMessage({id: 'header:language-switch:it:hover'})}
                onClick={() => this.handleChangeLanguage('it')}
              >
                IT
              </a>
            </li>
            <li>
              <a
                className="language-trigger-en tooltip"
                title={this.props.intl.formatMessage({id: 'header:language-switch:en:hover'})}
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
            title={this.props.intl.formatMessage({id: 'header:hamburger:hover'})}
            className="pure-button pure-button-icon navigation-trigger tooltip"
          >
            <span className="icon-hamburger">
              <span className="icon-close" />&nbsp;
            </span>
          </button>
        </div>
        <div className="page-header-interreg">
          <a href={config.get('links.interreg')}
            className="logo-interreg tooltip"
            title={this.props.intl.formatMessage({id: 'header:interreg:hover'})}
            target="_blank" >
            <span>Interreg</span>
          </a>
        </div>
      </div>
    );
  }
}

export default inject('locale')(injectIntl(withRouter(observer(PageHeader))));
