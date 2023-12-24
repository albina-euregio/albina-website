import React from "react";

export default function PageHeadline(props) {
  return (
    <section className="section-padding section-header">
      <header className="section-centered">
        {props.marginal && <p className="marginal">{props.marginal}</p>}
        {props.subtitle && (
          <h2 className="subheader" aria-hidden>
            {props.subtitle}
          </h2>
        )}
        {props.title && <h1>{props.title}</h1>}
        {props.children}
      </header>
    </section>
  );
}
