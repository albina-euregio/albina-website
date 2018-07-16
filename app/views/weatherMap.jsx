import React from 'react';
import PageHeadline from '../components/organisms/page-headline.jsx';

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
        <PageHeadline title="Snow &amp; Weather" />
        <section className="section-map section-centered">
          <iframe id="meteoMap" src={url}>
            <p>Your browser does not support iframes.</p>
          </iframe>
        </section>
      </div>
    );
  }
}
