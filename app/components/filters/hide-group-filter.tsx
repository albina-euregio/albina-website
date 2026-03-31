import React, { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function HideGroupFilter({ title, children }: Props) {
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
