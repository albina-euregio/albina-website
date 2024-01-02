import React from "react";
import BulletinProblemFilterItem from "./bulletin-problem-filter-item.jsx";
import { AvalancheProblemType } from "../../stores/bulletin/CAAMLv6.js";

type Props = {
  handleSelectRegion: (id?: string) => void;
  problems: Record<
    AvalancheProblemType,
    {
      highlighted: boolean;
    }
  >;
  toggleProblem: (problemId: AvalancheProblemType) => void;
};

function BulletinProblemFilter(props: Props) {
  const listItems = Object.entries(props.problems).map(
    ([p, { highlighted }]) => (
      <BulletinProblemFilterItem
        handleSelectRegion={props.handleSelectRegion}
        toggleProblem={props.toggleProblem}
        key={p}
        problemId={p}
        active={highlighted}
      />
    )
  );

  return (
    <ul className="list-plain list-avalanche-problems-filter">{listItems}</ul>
  );
}

export default BulletinProblemFilter;
