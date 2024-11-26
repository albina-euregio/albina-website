import React from "react";
import SearchField from "../search-field";

interface Props {
  children: React.ReactNode;
  search: boolean;
  searchTitle: string;
  searchOnChange: (val: string) => void;
  searchValue: string;
}

export default function FilterBar(props: Props) {
  const filterList = (
    <ul className="list-inline list-controlbar">
      {Array.isArray(props.children) &&
        props.children.map((f, i) => f && <li key={i}>{f}</li>)}
    </ul>
  );

  // if the filter bar contains a search field, we use a 9-3 grid,
  // otherwise no grid is used
  let grid;
  if (props.search) {
    grid = (
      <div className="grid">
        <div className="normal-9 grid-item">{filterList}</div>
        <div className="normal-3 grid-item">
          <SearchField
            title={props.searchTitle}
            handleSearch={props.searchOnChange}
            value={props.searchValue}
          />
        </div>
      </div>
    );
  } else {
    grid = filterList;
  }

  return (
    <section className="section controlbar">
      <div className="section-centered">{grid}</div>
    </section>
  );
}
