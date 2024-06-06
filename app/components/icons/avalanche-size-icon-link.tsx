import React from "react";
import { Link } from "wouter";
import { Tooltip } from "../tooltips/tooltip";
import type * as Caaml from "../../stores/bulletin/CaamlBulletin";

type Props = { avalancheSize: Caaml.AvalancheSize; title: string };

export function AvalancheSizeIcon({ avalancheSize, title }: Props) {
  const imgRoot = `${window.config.projectRoot}images/pro/avalanche-sizes/`;
  return (
    <div
      className="bulletin-report-picto bulletin-situation-frequency"
      title={title}
    >
      <Tooltip label={title}>
        <Link
          to={"/education/avalanche-problems#avalancheSize"}
          className="img"
          href="#"
        >
          <img
            src={`${imgRoot}avalanche-size_${avalancheSize}.png`}
            alt={title}
          />
        </Link>
      </Tooltip>
    </div>
  );
}
