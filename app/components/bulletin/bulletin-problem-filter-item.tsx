import React from "react";
import { useIntl } from "react-intl";
import ProblemIcon from "../icons/problem-icon";
import { Tooltip } from "../tooltips/tooltip";
import type * as Caaml from "../../stores/bulletin";

type Props = {
  active: boolean;
  handleSelectRegion: (id?: string) => void;
  toggleProblem: (problemId: Caaml.AvalancheProblemType) => void;
  problemId: Caaml.AvalancheProblemType;
};

function BulletinProblemFilterItem({
  active,
  handleSelectRegion,
  toggleProblem,
  problemId
}: Props) {
  const intl = useIntl();
  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    handleSelectRegion();
    requestAnimationFrame(() => toggleProblem(problemId));
  }

  const problemText = intl.formatMessage({
    id: "problem:" + problemId
  });
  const problemTextShort = intl.formatMessage({
    id: "problem:" + problemId + ":short"
  });

  const title = intl.formatMessage(
    {
      id: active
        ? "bulletin:legend:dehighlight:hover"
        : "bulletin:legend:highlight:hover"
    },
    { problem: problemText }
  );
  const classes = "img " + (active ? "" : " js-deactivated");

  return (
    <li>
      <Tooltip label={title}>
        <a href="#" className={classes} onClick={e => toggle(e)}>
          <div className="picto-img">
            <ProblemIcon problem={problemId} active alt={problemText} />
          </div>
          <div className="picto-caption">{problemTextShort}</div>
        </a>
      </Tooltip>
    </li>
  );
}

export default BulletinProblemFilterItem;
