import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class SubNavigation extends React.Component {
  constructor(props) {
    super(props);
  }

  _linkStyle(sectionPath) {
    return location.pathname.indexOf(sectionPath) > -1 ? 'is-active' : '';
  }

  _renderItem(sublink, key) {
    return (
        <li key={key} className={this._linkStyle(sublink.url)} >
            <Link to={this.props.viewPath + sublink.url}>{sublink.label}</Link>
        </li>
    )
  }

  render() {
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
