import React, { type ReactNode } from "react";

export interface MapLegendItem {
  /** Stable key for React. */
  key: string;
  /** Swatch color — a CSS color or a `var(--…)` reference. */
  color: string;
  label: ReactNode;
}

interface Props {
  items: MapLegendItem[];
  title?: ReactNode;
}

export default function MapLegend({ items, title }: Props) {
  return (
    <div className="map-legend">
      {title && <p className="map-legend__title">{title}</p>}
      <ul className="map-legend__items">
        {items.map(item => (
          <li key={item.key}>
            <span
              className="map-legend__swatch"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
