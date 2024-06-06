import React from "react";
import { Link } from "wouter";
import { Tooltip } from "../tooltips/tooltip";

export default function FrequencyIcon({ title, frequency }) {
  const imgRoot = window.config.projectRoot + "images/pro//frequencies/";
  const classes = ["bulletin-report-picto", "bulletin-situation-frequency"];

  return (
    <div className={classes.join(" ")} title={title}>
      <Tooltip label={title}>
        <Link
          to={"/education/avalanche-problems#frequency"}
          className="img"
          href="#"
        >
          <img
            src={imgRoot + "frequency_" + frequency + ".png"}
            alt={title}
            title={title}
          />
        </Link>
      </Tooltip>
    </div>
  );
}
