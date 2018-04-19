import React from 'react';
import SubNavigation from './../components/subnavigation.jsx';

export default class Weather extends React.Component {
  constructor(props) {
    super(props);
  }

  _sublinks() {
    return [
      { url: 'precipitation', label: 'precipitation' },
      { url: 'temperature', label: 'temperature' },
      { url: 'snowfall', label: 'snowfall' }
    ];
  }

  render() {
    return (
      <div>
        <SubNavigation sublinks={this._sublinks()} viewPath="/weather/" />
        <div className="content-wrapper">
          <h1 className="title">WEATHER</h1>
          <iframe style={{border: "0px", width: "100%", height: "600px"}} src="//data1.geo.univie.ac.at/sandbox/map_viewer/framemap.html">
            <p>Your browser does not support iframes.</p>
          </iframe>
        </div>
      </div>
    );
  }
}
