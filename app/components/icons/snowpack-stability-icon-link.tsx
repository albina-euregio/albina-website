import React from "react";
import { Link } from "wouter";
import { Tooltip } from "../tooltips/tooltip";

export default function SnowpackStabilityIcon({ title, snowpackStability }) {
  const imgRoot =
    window.config.projectRoot + "images/pro//snowpack-stabilities/";
  const classes = ["bulletin-report-picto", "bulletin-situation-frequency"];

  return (
    <div className={classes.join(" ")}>
      <Tooltip label={title}>
        <Link
          to={"/education/avalanche-problems#snowpackStability"}
          className="img"
          href="#"
        >
          <img
            src={imgRoot + "snowpack-stability_" + snowpackStability + ".png"}
            alt={title}
          />
        </Link>
      </Tooltip>
    </div>
  );
}
