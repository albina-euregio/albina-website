import React from "react";
import { useIntl } from "../../i18n";
import { Link } from "react-router-dom";

interface Props {
  marginal: string;
  subtitle: string;
  title: string;
  children: React.ReactNode;
  backLink: string;
}

export default function PageHeadline(props: Props) {
  const intl = useIntl();

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

        {props.backLink && (
          <Link to={props.backLink} className="back-link" href="#">
            {intl.formatMessage({
              id: "bulletin:linkbar:back-to-bulletin"
            })}
          </Link>
        )}
      </header>
    </section>
  );
}
