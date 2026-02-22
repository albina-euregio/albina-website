import React from "react";
import { Tooltip } from "../tooltips/tooltip";
import { Aspect } from "../../stores/bulletin";

interface Props {
  title: string;
  expositions: Aspect[];
}

export default function ExpositionIcon({ title, expositions }: Props) {
  const paths: Record<Aspect, string> = {
    E: "m49 25-7.071-7.071L24.959 25l16.97 7.071z",
    N: "m25 .958 7.071 7.071L25 25 17.929 8.03z",
    NE: "M42 8H32l-7 17 17-7z",
    NW: "M8 8h10l7 17-17-7z",
    S: "m25 49 7.071-7.071L25 24.959l-7.071 16.97z",
    SE: "M42 42H32l-7-17 17 7z",
    SW: "M8 42h10l7-17-17 7z",
    W: "m.958 25 7.071-7.071L25 25 8.03 32.071z",
    "n/a": ""
  };

  return (
    <Tooltip label={title}>
      <div
        className="bulletin-report-picto bulletin-report-expositions"
        title={title}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          className="bulletin-report-exposition-rose"
        >
          <g fill="none" fillRule="evenodd">
            {expositions.map(e => (
              <path d={paths[e]} fill="#19ABFF" fillRule="evenodd" key={e} />
            ))}
            <g fill="#222" fontSize="8" fontWeight="bold" letterSpacing=".5">
              <text transform="translate(21 5)">
                <tspan x=".928" y="8">
                  N
                </tspan>
              </text>
              <text transform="translate(21 5)">
                <tspan x="1.299" y="37">
                  S
                </tspan>
              </text>
            </g>
            <g stroke="#222" strokeLinecap="round" strokeLinejoin="round">
              <path d="m.958 25 7.071-7.071L25 25 8.03 32.071z" />
              <path d="m49 25-7.071-7.071L24.959 25l16.97 7.071z" />
              <path d="m25 .958 7.071 7.071L25 25 17.929 8.03z" />
              <path d="m25 49 7.071-7.071L25 24.959l-7.071 16.97z" />
              <path d="M42 8H32l-7 17 17-7zM8 42h10l7-17-17 7zm34 0H32l-7-17 17 7zM8 8h10l7 17-17-7z" />
            </g>
          </g>
        </svg>
      </div>
    </Tooltip>
  );
}
