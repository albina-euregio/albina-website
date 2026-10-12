import React from "react";
import { Tooltip } from "../tooltips/tooltip";

interface Props {
  where: "above" | "below" | "all" | "middle";
  text: string;
  title: string;
}

const bands = {
  low: "m1 47 9-15h44l9 15z",
  middle: "m9 33 10-17h26l10 17z",
  high: "m19 17 7-12 4 6 6-10 9 16z"
};

const visible: Record<Props["where"], (keyof typeof bands)[]> = {
  above: ["middle", "high"],
  below: ["low", "middle"],
  all: ["low", "middle", "high"],
  middle: ["middle"]
};

const lines: Record<Props["where"], string> = {
  above: "M10.6 32h54.4v1h-55z",
  below: "M19.9 16h45.1v1H19.3z",
  all: "",
  middle: "M10.6 32h54.4v1h-55zM19.9 16h45.1v1H19.3z"
};

export default function ElevationIcon({ where, text, title }: Props) {
  return (
    <Tooltip label={title}>
      <div
        className={`bulletin-report-picto problem-altitude problem-${where}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 65 48"
          role="img"
          aria-label={title}
        >
          {visible[where].map(b => (
            <path key={b} d={bands[b]} fill="#19abff" />
          ))}
          <path
            d="m63 47.5-27-47-6 11-4-7-25 43z"
            fill="none"
            stroke="currentColor"
          />
          {lines[where] && <path d={lines[where]} fill="currentColor" />}
        </svg>
        {where != "all" && (
          <span>
            {text}
            <i className="icon" />
          </span>
        )}
      </div>
    </Tooltip>
  );
}
