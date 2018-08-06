import React from 'react';
import { withRouter } from 'react-router';
import PageLoadingScreen from './organisms/page-loading-screen.jsx';
import Jumpnav from './organisms/jumpnav.jsx';
import PageHeader from './organisms/page-header.jsx';
import PageFooter from './organisms/page-footer.jsx';
import MenuStore from '../stores/menuStore';
import ModalDialog from './modal-dialog';
import SubscribeDialog from './dialogs/subscribe-dialog';
import SubscribeSocialMediaDialog from './dialogs/subscribe-social-media-dialog';
import SubscribeAppDialog from './dialogs/subscribe-app-dialog';
import CookieConsent from './dialogs/cookie-consent';
import { renderRoutes } from 'react-router-config';
import { modal_init } from '../js/modal';
import { tooltip_init } from '../js/tooltip';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.menuStore = new MenuStore();
  }

  componentDidUpdate() {
    this._didUpdate();
  }

  componentDidMount() {
    this._didUpdate();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location !== this.props.location
      && nextProps.history.action === 'PUSH'
      && !nextProps.location.hash) {

      // scroll to top on forward page change (if no hash is set)
      // see https://github.com/ReactTraining/react-router/issues/2019
      window.scrollTo(0, 0);
    }
  }

  _didUpdate() {
    if (
      this.props.location.pathname === '' ||
      this.props.location.pathname === '/'
    ) {
      this.props.history.push('bulletin');
    }
    modal_init();
    tooltip_init();
  }

  render() {
    return (
      <div>
        <PageLoadingScreen />
        <Jumpnav />
        <div id="page-all" className="page-all">
          <PageHeader menuStore={this.menuStore} />
          <main id="page-main" className="page-main">
            <div id="global-grid">{renderRoutes(this.props.route.routes)}</div>
          </main>
          <PageFooter menuStore={this.menuStore} />
        </div>
        <ModalDialog id="subscribeDialog">
          <SubscribeDialog />
        </ModalDialog>
        <ModalDialog id="subscribeSocialMediaDialog">
          <SubscribeSocialMediaDialog />
        </ModalDialog>
        <ModalDialog id="subscribeAppDialog">
          <SubscribeAppDialog />
        </ModalDialog>
        <CookieConsent />
      </div>
    );
  }
}

export default withRouter(Page);
