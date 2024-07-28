import React from "react";

type Props = {
  tags: string[];
};

export default function TagList({ tags }: Props) {
  if (Array.isArray(tags) && tags.length > 0) {
    return (
      <ul className="list-inline blog-list-labels">
        {tags.map((t, i) => (
          <li key={i}>
            <span className="label">{t}</span>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}
