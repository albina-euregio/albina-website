import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class SubNavigation extends React.Component {
  constructor(props) {
    super(props);
  }

  _linkStyle(path, allowedChildPaths) {
    if (allowedChildPaths) {
      return location.pathname.indexOf(path) > -1 ? 'is-active' : '';
    }
    return location.pathname === path ? 'is-active' : '';
  }

  _renderItem(sublink, key) {
    return (
        <li key={key}>
            <Link to={sublink.url}>{sublink.label}</Link>
        </li>
    )
  }

  render() {
    console.log(this.props.sublinks);
    return (
      <div className="subnavigation tabs">
        <ul>
            {
                this.props.sublinks.map((item, i) => {
                    return this._renderItem(item, i);
                })
            }
        </ul>
      </div>
    );
  }
}
