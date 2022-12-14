import React from "react";
import { observer } from "mobx-react";
import BulletinProblemFilterItem from "./bulletin-problem-filter-item.jsx";
import type * as Caaml from "../../stores/bulletin/CaamlBulletin";

type Props = {
  handleSelectRegion: any;
  problems: Record<Caaml.AvalancheProblemType, { highlighted: boolean }>;
};

function BulletinProblemFilter({ handleSelectRegion, problems }: Props) {
  const listItems = Object.entries(problems).map(([p, { highlighted }]) => (
    <BulletinProblemFilterItem
      handleSelectRegion={handleSelectRegion}
      key={p}
      problemId={p}
      active={highlighted}
    />
  ));

  return (
    <ul className="list-plain list-avalanche-problems-filter">{listItems}</ul>
  );
}

export default observer(BulletinProblemFilter);
