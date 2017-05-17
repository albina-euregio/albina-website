import React from 'react';
import SubNavigation from './../components/subnavigation';

export default class Weather extends React.Component {
  constructor(props) {
    super(props);
  }

  _sublinks() {
    return [
      {url: 'precipitation', label: 'precipitation'},
      {url: 'temperature', label: 'temperature'},
      {url: 'snowfall', label: 'snowfall'},
    ]
  }

  render() {
    return (
      <div>
        <SubNavigation sublinks={this._sublinks()}/>
        <h1 className="title">WEATHER</h1>
      </div>
    );
  }
}
