import React from "react";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import ProblemIcon from "../icons/problem-icon";
import { BULLETIN_STORE } from "../../stores/bulletinStore";
import { Tooltip } from "../tooltips/tooltip";
import type * as Caaml from "../../stores/bulletin";

type Props = {
  active: boolean;
  handleSelectRegion: (id?: string) => void;
  problemId: Caaml.AvalancheProblemType;
};

function BulletinProblemFilterItem({
  active,
  handleSelectRegion,
  problemId
}: Props) {
  const intl = useIntl();
  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    handleSelectRegion();
    requestAnimationFrame(() => {
      if (active) {
        BULLETIN_STORE.dimProblem(problemId);
      } else {
        BULLETIN_STORE.highlightProblem(problemId);
      }
    });
  }

  const problemText = intl.formatMessage({
    id: "problem:" + problemId
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
          <ProblemIcon problem={problemId} active alt={problemText} />
          {/* <ProblemIcon
              problem={problemId}
              active={false}
              alt={problemText}
            /> */}
        </a>
      </Tooltip>
    </li>
  );
}

export default observer(BulletinProblemFilterItem);
