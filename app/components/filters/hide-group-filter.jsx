import React from "react";

export default function HideGroupFilter({ title, children }) {
  return (
    <div>
      {title && <p className="info">{title}</p>}
      {Array.isArray(children) && (
        <ul className="list-inline filter">
          {children.map((f, i) => f && <li key={i}>{f}</li>)}
        </ul>
      )}
    </div>
  );
}
