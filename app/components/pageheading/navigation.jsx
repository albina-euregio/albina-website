import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class PageHeadingNavigation extends React.Component {
  constructor(props) {
    super(props);
  }

  _linkStyle(path, allowedChildPaths) {
    if (allowedChildPaths) {
      return location.pathname.indexOf(path) > -1 ? 'column is-active' : 'column';
    }
    return location.pathname === path ? 'column is-active' : 'column';
  }

  render() {
    return (
      <div className="pagenavigation tabs is-centered is-boxed">
        <ul>
          <li className={this._linkStyle('/news', false)}><Link to="/news">News</Link></li>
          <li className={this._linkStyle('/weather', true)}><Link to="/weather">Weather</Link></li>
          <li className={this._linkStyle('/info', true)}><Link to="/info">Info</Link></li>
        </ul>
      </div>
    );
  }
}
