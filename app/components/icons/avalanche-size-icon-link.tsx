import React from "react";
import { Tooltip } from "../tooltips/tooltip";
import type * as Caaml from "../../stores/bulletin/CaamlBulletin";

interface Props {
  avalancheSize: Caaml.AvalancheSize;
  title: string;
}

export function AvalancheSizeIcon({ avalancheSize, title }: Props) {
  return (
    <div
      className="bulletin-report-picto bulletin-situation-frequency"
      title={title}
    >
      <Tooltip label={title}>
        <a href={"/education/avalanche-problems#avalancheSize"} className="img">
          <img
            src={`${window.config.projectRoot}images/pro/avalanche-sizes/avalanche-size_${avalancheSize}.png`}
            alt={title}
          />
        </a>
      </Tooltip>
    </div>
  );
}
