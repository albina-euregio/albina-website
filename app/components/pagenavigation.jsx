import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

export default class PageNavigation extends React.Component {
  constructor(props) {
    super(props);
  }

  _linkStyle(path, allowedChildPaths) {
    if (allowedChildPaths) {
        return location.pathname.indexOf(path) > -1 ? 'title column is-active' : 'title column';
    } else {
        return location.pathname === path ? 'title column is-active' : 'title column';
    }
  }

  render() {
    return (
      <div className="pagenavigation tabs is-centered is-boxed">
        <ul>
          <li className={this._linkStyle('/', false)}><Link to="/">News</Link></li>
          <li className={this._linkStyle('/weather', true)}><Link to="/weather">Weather</Link></li>
          <li className={this._linkStyle('/info', true)}><Link to="/info">Info</Link></li>
        </ul>
      </div>
    );
  }
}