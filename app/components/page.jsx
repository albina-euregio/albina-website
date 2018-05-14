import React from 'react';
import PageLoadingScreen from './organisms/page-loading-screen.jsx';
import Jumpnav from './organisms/jumpnav.jsx';
import PageHeader from './organisms/page-header.jsx';
import PageFooter from './organisms/page-footer.jsx';
import { renderRoutes } from 'react-router-config';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    this._didUpdate();
  }

  componentDidMount() {
    this._didUpdate();
  }

  _didUpdate() {
    if (
      this.props.location.pathname === '' ||
      this.props.location.pathname === '/'
    ) {
      this.props.history.push('bulletin');
    }
  }

  render() {
    return (
      <div>
        <PageLoadingScreen />
        <Jumpnav />
        <div id="page-all" className="page-all">
          <PageHeader store={store} />
          <main id="page-main" className="page-main">
            <div id="global-grid">{renderRoutes(this.props.route.routes)}</div>
          </main>
          <PageFooter />
        </div>
      </div>
    );
  }
}
