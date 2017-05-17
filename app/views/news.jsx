import React from 'react';
import SubNavigation from './../components/subnavigation';

export default class News extends React.Component {
  constructor(props) {
    super(props);
  }

  _sublinks() {
    return [
      {url: '2016', label: '2016'},
      {url: '2017', label: '2017'},
    ]
  }

  render() {
    return (
      <div>
        <SubNavigation sublinks={this._sublinks()} viewPath="/news/" />
        <h1 className="title">NEWS</h1>
      </div>
    );
  }
}
