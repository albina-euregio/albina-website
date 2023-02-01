import React from "react";
import { Tooltip } from "../tooltips/tooltip";

export default function HideFilter({ active, tooltip, onToggle, id, title }) {
  const classes = ["label"];
  if (active) {
    classes.push("js-active");
  }

  return (
    <Tooltip label={tooltip}>
      <a
        className={classes.join(" ")}
        href="#"
        onClick={e => {
          //e.target.blur();
          e.preventDefault();
          e.stopPropagation();
          onToggle(id);
        }}
      >
        {title}
      </a>
    </Tooltip>
  );
}
