import React from 'react';

export default class PageHeadline extends React.Component {
  render() {
    return (
      <section className="section-padding section-header">
        <header className="section-centered">
          {
            this.props.marginal &&
              <p className="marginal">{this.props.marginal}</p>
          }
          {
            this.props.subtitle &&
              <h2 className="subheader">{this.props.subtitle}</h2>
          }
          {
            this.props.title &&
              <h1>{this.props.title}</h1>
          }
        </header>
      </section>
    );
  }
}
