import React from "react";
import { Tooltip } from "../tooltips/tooltip";

export default function SnowpackStabilityIcon({ title, snowpackStability }) {
  const imgRoot =
    window.config.projectRoot + "images/pro//snowpack-stabilities/";
  const classes = ["bulletin-report-picto", "bulletin-situation-frequency"];

  return (
    <div className={classes.join(" ")}>
      <Tooltip label={title}>
        <a
          href={"/education/avalanche-problems#snowpackStability"}
          className="img"
        >
          <img
            src={imgRoot + "snowpack-stability_" + snowpackStability + ".png"}
            alt={title}
          />
        </a>
      </Tooltip>
    </div>
  );
}
