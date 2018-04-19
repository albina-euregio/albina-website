import React from 'react';
import SubNavigation from './../components/subnavigation.jsx';

export default class Info extends React.Component {
  constructor(props) {
    super(props);
  }

  _sublinks() {
    return [
      { url: 'about', label: 'about us' },
      { url: 'contact', label: 'contact us' },
      { url: 'imprint', label: 'imprint' }
    ];
  }

  render() {
    return (
      <div>
        <SubNavigation sublinks={this._sublinks()} viewPath="/info/" />
        <div className="content-wrapper">
          <h1 className="title">INFO</h1>
        </div>
      </div>
    );
  }
}
