import React from "react";

interface Props {
  tags: string[];
  handleChangeCategory?: (tag: string, e: React.MouseEvent) => void;
}

export default function TagList({ tags, handleChangeCategory }: Props) {
  if (Array.isArray(tags) && tags.length > 0) {
    return (
      <ul className="list-inline blog-list-labels">
        {tags.map((t, i) => (
          <li key={i} onClick={e => handleChangeCategory?.(t, e)}>
            <span className="label">{t}</span>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}
