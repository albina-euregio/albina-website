import React from "react";

interface Props {
  tendency: "increasing" | "steady" | "decreasing";
}

export default function TendencyIcon({ tendency }: Props) {
  switch (tendency) {
    case "increasing":
      return <span className="icon-arrow-increase"></span>;
    case "steady":
      return <span className="icon-arrow-steady"></span>;
    case "decreasing":
      return <span className="icon-arrow-decrease"></span>;
    default:
      return <span className=""></span>;
  }
}
