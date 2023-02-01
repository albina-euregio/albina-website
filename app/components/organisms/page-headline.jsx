import React from "react";
import { NAVIGATION_STORE } from "../../stores/navigationStore";

export default function PageHeadline(props) {
  // if no subtitle is given, take the active first-level header menu entry
  const subtitle = props.subtitle
    ? props.subtitle
    : NAVIGATION_STORE.activeTopLevelElement
    ? NAVIGATION_STORE.activeTopLevelElement.title
    : "";

  return (
    <section className="section-padding section-header">
      <header className="section-centered">
        {props.marginal && <p className="marginal">{props.marginal}</p>}
        {subtitle && (
          <h2 className="subheader" aria-hidden>
            {subtitle}
          </h2>
        )}
        {props.title && <h1>{props.title}</h1>}
        {props.children}
      </header>
    </section>
  );
}
