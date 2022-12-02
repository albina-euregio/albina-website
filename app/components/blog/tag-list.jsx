import React from "react";
import { useIntl } from "react-intl";

export default function TagList({ tags }) {
  const intl = useIntl();
  if (Array.isArray(tags) && tags.length > 0) {
    return (
      <ul className="list-inline blog-list-labels">
        {tags.map((t, i) => (
          <li key={i}>
            <span className="label">
              {intl.formatMessage({ id: "problem:" + t })}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}
