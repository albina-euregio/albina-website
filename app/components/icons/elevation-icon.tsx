import React from "react";
import { Tooltip } from "../tooltips/tooltip";

interface Props {
  where: "above" | "below" | "all" | "middle";
  text: string;
  title: string;
}

export default function ElevationIcon({ where, text, title }: Props) {
  return (
    <Tooltip label={title}>
      <div
        className={`bulletin-report-picto problem-altitude problem-${where}`}
      >
        <img
          src={`${window.config.projectRoot}images/pro/warning-pictos/levels_${where}.webp`}
          alt={title}
        />
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
