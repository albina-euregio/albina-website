import React from "react";
import { AvalancheProblemType } from "../../stores/bulletin";

interface Props {
  problem: AvalancheProblemType;
  alt: string;
  active: boolean;
}

export default function ProblemIcon({ problem, active, alt }: Props) {
  return (
    <img
      src={`${window.config.projectRoot}images/pro/avalanche-problems/${problem}.webp`}
      alt={alt}
      style={active ? {} : { filter: "grayscale(100%)" }}
    />
  );
}
