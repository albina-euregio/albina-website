import React from "react";
import { Link } from "react-router-dom";
import { Parser } from "html-to-react";

// add link to a tag
function renderLinkedMessage(intl, intlId, link) {
  const msg = intl.formatHTMLMessage({
    id: intlId
  });

  // split the string at <a> and </a>
  const parts = msg.match(/^(.*)<a[^>]*>([^<]*)<\/a>(.*)$/);

  return (
    <span>
      {parts.length > 1 && new Parser().parse(parts[1])}
      {parts.length > 2 && ["http://", "https://"].includes(link) ? (
        <Link to={link} className="tooltip" title={parts[2]}>
          <strong>{parts[2]}</strong>
        </Link>
      ) : (
        <a href={link} className="tooltip" title={parts[2]}>
          <strong>{parts[2]}</strong>
        </a>
      )}
      {parts.length > 3 && new Parser().parse(parts[3])}
    </span>
  );
}

export { renderLinkedMessage };
