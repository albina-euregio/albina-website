import React from 'react';
import PageHeadingNavigation from './navigation';

export default class PageHeadingWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="hero is-info is-small">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div>
              <h1 className="title">
                Albina
              </h1>
            </div>
            <div>
              <h2 className="subtitle">
                Avalanches are great
              </h2>
            </div>
          </div>
        </div>
        <div className="hero-foot">
          <PageHeadingNavigation />
        </div>
      </section>
    );
  }
}
