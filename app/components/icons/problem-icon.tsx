import React from "react";
import { AvalancheProblemType } from "../../stores/bulletin";

interface Props {
  problem: AvalancheProblemType;
  alt: string;
  active: boolean;
}

export default function ProblemIcon({ problem, active, alt }: Props) {
  const imgRoot = window.config.projectRoot + "images/pro/avalanche-problems/";
  const path = imgRoot + problem + ".webp";
  const style = active ? {} : { filter: "grayscale(100%)" };

  return <img src={path} alt={alt} style={style} />;
}
