import React from "react";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import ProblemIcon from "./problem-icon.js";
import { Tooltip } from "../tooltips/tooltip";
import { AvalancheProblem } from "../../stores/bulletin";

type Props = {
  problem: AvalancheProblem;
  wrapper?: boolean;
};

export default function ProblemIconLink({ problem, wrapper }: Props) {
  const intl = useIntl();
  const problemType = problem.problemType;
  const title = intl.formatMessage({
    id: "problem:" + problemType
  });

  const icon = (
    <Tooltip label={title}>
      <Link
        to={"/education/avalanche-problems#" + problemType}
        className="img"
        href="#"
      >
        <div className="picto-img">
          <ProblemIcon problem={problemType} alt={title} active={true} />
        </div>
        {/* <div class="picto-caption">Triebschnee</div> */}
      </Link>
    </Tooltip>
  );
  return wrapper !== false ? (
    <div className="bulletin-report-picto avalanche-situation">{icon}</div>
  ) : (
    icon
  );
}
