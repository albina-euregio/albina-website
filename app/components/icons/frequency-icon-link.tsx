import React from "react";
import { Tooltip } from "../tooltips/tooltip";

export default function FrequencyIcon({ title, frequency }) {
  const classes = ["bulletin-report-picto", "bulletin-situation-frequency"];

  return (
    <div className={classes.join(" ")} title={title}>
      <Tooltip label={title}>
        <a href={"/education/avalanche-problems#frequency"} className="img">
          <img
            src={`${window.config.projectRoot}images/pro/frequencies/frequency_${frequency}.png`}
            alt={title}
            title={title}
          />
        </a>
      </Tooltip>
    </div>
  );
}
