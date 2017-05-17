import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class PageHeadingNavigation extends React.Component {
  constructor(props) {
    super(props);
  }

  _linkStyle(path) {
    return location.pathname.indexOf(path) > -1 ? 'column is-active' : 'column';
  }

  render() {
    return (
      <div className="pagenavigation tabs is-centered is-boxed">
        <ul>
          <li className={this._linkStyle('/news')}><Link to="/news">News</Link></li>
          <li className={this._linkStyle('/weather')}><Link to="/weather">Weather</Link></li>
          <li className={this._linkStyle('/info')}><Link to="/info">Info</Link></li>
        </ul>
      </div>
    );
  }
}
