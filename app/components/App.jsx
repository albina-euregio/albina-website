import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import News from '../views/news';
import Weather from '../views/weather';
import Info from '../views/info';
import PageHeadingWrapper from './pageheading/wrapper';
import PageFooterWrapper from './pagefooter/wrapper';

require('../css/bulma.css');
require('../css/app.css');

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }


  render() {
    console.log('router renders');
    return (
      <Router>
        <div>
          <PageHeadingWrapper />
          <div className="content-wrapper section">
            <Route exact path="/" component={News} />
            <Route exact path="/weather" component={Weather} />
            <Route exact path="/info" component={Info} />
          </div>
          <PageFooterWrapper />
        </div>
      </Router>
    );
  }
}
