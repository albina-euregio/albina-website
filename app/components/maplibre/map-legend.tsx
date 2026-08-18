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
}

export default function MapLegend({ items }: Props) {
  return (
    <ul className="map-legend">
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
  );
}
