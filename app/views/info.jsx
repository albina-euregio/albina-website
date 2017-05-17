import React from 'react';
import SubNavigation from './../components/subnavigation';

export default class Info extends React.Component {
  constructor(props) {
    super(props);
  }

  _sublinks() {
    return [
      {url: 'about', label: 'about us'},
      {url: 'contact', label: 'contact us'},
      {url: 'come', label: 'come and say hi'},
    ]
  }

  render() {
    return (
      <div>
        <SubNavigation sublinks={this._sublinks()}/>
        <h1 className="title">INFO</h1>
      </div>
    );
  }
}
