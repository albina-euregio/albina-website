import React from "react";
import { observer } from "mobx-react";
import BulletinProblemFilterItem from "./bulletin-problem-filter-item.jsx";
import { BULLETIN_STORE } from "../../stores/bulletinStore.js";

type Props = {
  handleSelectRegion: (id?: string) => void;
};

function BulletinProblemFilter({ handleSelectRegion }: Props) {
  const listItems = Object.entries(BULLETIN_STORE.problems).map(
    ([p, { highlighted }]) => (
      <BulletinProblemFilterItem
        handleSelectRegion={handleSelectRegion}
        key={p}
        problemId={p}
        active={highlighted}
      />
    )
  );

  return (
    <ul className="list-inline list-avalanche-problems-filter">{listItems}</ul>
  );
}

export default observer(BulletinProblemFilter);
