import React from 'react';
import PageHeadingWrapper from './pageheading/wrapper';
import PageFooterWrapper from './pagefooter/wrapper';
import { renderRoutes } from 'react-router-config'

require('../css/bulma.css');
require('../css/app.css');

export default class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <PageHeadingWrapper />
        <div className="container">
          { renderRoutes(this.props.route.routes) }
        </div>
        <PageFooterWrapper />
      </div>
    );
  }
}
