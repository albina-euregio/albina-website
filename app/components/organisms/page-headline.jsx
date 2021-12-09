import React from "react";
import { NAVIGATION_STORE } from "../../stores/navigationStore";

export default class PageHeadline extends React.Component {
  render() {
    // if no subtitle is given, take the active first-level header menu entry
    const subtitle = this.props.subtitle
      ? this.props.subtitle
      : NAVIGATION_STORE.activeTopLevelElement
      ? NAVIGATION_STORE.activeTopLevelElement.title
      : "";

    return (
      <section className="section-padding section-header">
        <header className="section-centered">
          {this.props.marginal && (
            <p className="marginal">{this.props.marginal}</p>
          )}
          {subtitle && (
            <h2 className="subheader" aria-hidden>
              {subtitle}
            </h2>
          )}
          {this.props.title && <h1>{this.props.title}</h1>}
          {this.props.children}
        </header>
      </section>
    );
  }
}
