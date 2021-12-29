import React from "react";

export default React.forwardRef(function ExpositionIcon(props, ref) {
  const imgRoot = window.config.projectRoot + "images/pro/expositions/";
  const alts = {
    n: "North",
    ne: "North East",
    e: "East",
    se: "South East",
    s: "South",
    sw: "South West",
    w: "West",
    nw: "North West"
  };
  const classes = [
    "bulletin-report-picto",
    "bulletin-report-expositions",
    "tooltip"
  ].concat(props.expositions.map(e => "expo_" + e.toLowerCase()));
  const backgroundEntries = Object.entries(alts).map(e => (
    <img
      key={e[0]}
      className={"expo_" + e[0]}
      src={imgRoot + "exposition_" + e[0] + ".png"}
      alt={alts[e[0]]}
    />
  ));
  return (
    <div ref={ref} className={classes.join(" ")} title={props.title}>
      <img
        className="bulletin-report-exposition-rose"
        src={imgRoot + "exposition_bg.png"}
        alt={props.title}
      />
      {backgroundEntries}
    </div>
  );
});
