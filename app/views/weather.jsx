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
    const url = config.get('links.meteoViewer');
    return (
      <div>
        <section className="section-padding section-header">
          <header className="section-centered">
            <h1>Snow &amp; Weather</h1>
          </header>
        </section>
        <iframe id="meteoMap" src={url}>
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    );
  }
}
