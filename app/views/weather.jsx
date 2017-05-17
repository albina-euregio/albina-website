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
    console.log(this.props)
    return (
      <div>
        <SubNavigation sublinks={this._sublinks()} viewPath="/weather/" />
        <h1 className="title">WEATHER</h1>
      </div>
    );
  }
}
