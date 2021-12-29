import React from "react";

export default React.forwardRef(function ElevationIcon(props, ref) {
  const imgRoot = window.config.projectRoot + "images/pro/warning-pictos/";
  const imgFormat = window.config.webp ? ".webp" : ".png";
  const icons = {
    above: "levels_above" + imgFormat,
    below: "levels_below" + imgFormat,
    all: "levels_all" + imgFormat,
    middle: "levels_middle" + imgFormat
  };
  const classes = [
    "bulletin-report-picto",
    "problem-altitude",
    "tooltip",
    "problem-" + props.where
  ];
  const src = imgRoot + icons[props.where];

  return (
    <div ref={ref} className={classes.join(" ")} title={props.title}>
      <img src={src} alt={props.title} />
      {props.where != "all" && (
        <span>
          {props.text}
          <i className="icon" />
        </span>
      )}
    </div>
  );
});
