import React from "react";
import { Tooltip } from "../tooltips/tooltip";

type Props = {
  where: "above" | "below" | "all" | "middle";
  text: string;
  title: string;
};

export default function ElevationIcon({ where, text, title }: Props) {
  const imgRoot = `${window.config.projectRoot}images/pro/warning-pictos/`;
  const imgFormat = window.config.webp ? ".webp" : ".png";
  const src = `${imgRoot}levels_${where}${imgFormat}`;

  return (
    <Tooltip label={title}>
      <div
        className={`bulletin-report-picto problem-altitude problem-${where}`}
      >
        <img src={src} alt={title} />
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
