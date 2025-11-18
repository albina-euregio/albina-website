import React from "react";
import { useIntl } from "../../i18n";
import ProblemIcon from "./problem-icon.js";
import { Tooltip } from "../tooltips/tooltip";
import { AvalancheProblem } from "../../stores/bulletin";

interface Props {
  problem: AvalancheProblem;
  wrapper?: boolean;
}

export default function ProblemIconLink({ problem, wrapper }: Props) {
  const intl = useIntl();
  const problemType = problem.problemType;
  const title = intl.formatMessage({
    id: "problem:" + problemType
  });
  const problemTextShort = intl.formatMessage({
    id: "problem:" + problemType + ":short"
  });

  const icon = (
    <Tooltip label={title}>
      <a href={`/education/avalanche-problems#${problemType}`} className="img">
        <div className="picto-img">
          <ProblemIcon problem={problemType} alt={title} active={true} />
        </div>
        <div className="picto-caption">{problemTextShort}</div>
      </a>
    </Tooltip>
  );
  return wrapper !== false ? (
    <div className="bulletin-report-picto avalanche-situation">{icon}</div>
  ) : (
    icon
  );
}
