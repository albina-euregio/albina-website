import React from "react";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import ProblemIcon from "./problem-icon.js";
import { Tooltip } from "../tooltips/tooltip";
import { AvalancheProblem } from "../../stores/bulletin";

type Props = {
  problem: AvalancheProblem;
};

export default function ProblemIconLink({ problem }: Props) {
  const intl = useIntl();
  const problemType = problem.problemType;
  const title = intl.formatMessage({
    id: "problem:" + problemType
  });

  return (
    <div className="bulletin-report-picto avalanche-situation">
      {title && (
        <Tooltip label={title}>
          <Link
            to={"/education/avalanche-problems#" + problemType}
            className="img"
            href="#"
          >
            <ProblemIcon problem={problemType} alt={title} active={true} />
          </Link>
        </Tooltip>
      )}
    </div>
  );
}
