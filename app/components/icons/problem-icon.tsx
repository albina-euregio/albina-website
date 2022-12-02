import React from "react";
import { AvalancheProblem } from "../../stores/bulletin";

type Props = {
  problem: AvalancheProblem;
  alt: string;
  active: boolean;
};

export default function ProblemIcon({ problem, active, alt }: Props) {
  const imgRoot = window.config.projectRoot + "images/pro/avalanche-problems/";
  const imgFormat = window.config.webp ? ".webp" : ".png";
  const path = imgRoot + problem + imgFormat;
  const style = active ? {} : { filter: "grayscale(100%)" };

  return <img src={path} alt={alt} style={style} />;
}
