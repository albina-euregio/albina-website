import React from 'react';
import PageHeadingWrapper from './pageheading/wrapper.jsx';
import PageFooterWrapper from './pagefooter/wrapper.jsx';
import { renderRoutes } from 'react-router-config';

require('../css/bulma.css');
require('../css/app.css');

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
        <PageHeadingWrapper />
        <div className="container">{renderRoutes(this.props.route.routes)}</div>
        <PageFooterWrapper />
      </div>
    );
  }
}
