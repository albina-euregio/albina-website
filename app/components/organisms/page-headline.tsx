import React from "react";
import { useIntl } from "../../i18n";

interface Props {
  marginal: string;
  subtitle: string;
  title: string;
  children: React.ReactNode;
}

export default function PageHeadline(props: Props) {
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
