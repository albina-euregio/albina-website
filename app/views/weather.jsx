import React from 'react';

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
        <section className="section-padding section-header">
          <header className="section-centered">
            <h1>Snow &amp; Weather</h1>
          </header>
        </section>
        <iframe id="meteoMap" src="//data1.geo.univie.ac.at/sandbox/map_viewer/framemap.html">
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    );
  }
}
