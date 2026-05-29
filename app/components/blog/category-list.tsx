import React from "react";

interface Props {
  categories: string[];
  handleChangeCategory?: (category: string, e: React.MouseEvent) => void;
}

export default function CategoryList({
  categories,
  handleChangeCategory
}: Props) {
  if (Array.isArray(categories) && categories.length > 0) {
    return (
      <ul className="list-inline blog-list-labels">
        {categories.map((category, i) => (
          <li key={i} onClick={e => handleChangeCategory?.(category, e)}>
            <span className="label">{category}</span>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}
