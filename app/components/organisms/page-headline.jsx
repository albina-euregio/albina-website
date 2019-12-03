import React from "react";

export default class PageHeadline extends React.Component {
  render() {
    // if no subtitle is given, take the active first-level header menu entry
    const subtitle = this.props.subtitle
      ? this.props.subtitle
      : window["appStore"].navigation.activeTopLevelElement
      ? window["appStore"].navigation.activeTopLevelElement.title
      : "";

    return (
      <section className="section-padding section-header">
        <header className="section-centered">
          {this.props.marginal && (
            <p className="marginal">{this.props.marginal}</p>
          )}
          {subtitle && <h2 className="subheader">{subtitle}</h2>}
          {this.props.title && <h1>{this.props.title}</h1>}
          {this.props.children}
        </header>
      </section>
    );
  }
}
