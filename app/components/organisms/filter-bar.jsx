import React from 'react';
import SearchField from '../search-field';

export default class FilterBar extends React.Component {
  render() {
    const filterList = (
      <ul className="list-inline list-controlbar">
        { Array.isArray(this.props.children) &&
          this.props.children.map((f, i) => f && (
            <li key={i}>{f}</li>
          ))
        }
      </ul>
    );

    // if the filter bar contains a search field, we use a 9-3 grid,
    // otherwise no grid is used
    let grid;
    if(this.props.search) {
      grid = <div className="grid">
        <div className="normal-9 grid-item">{filterList}</div>
        <div className="normal-3 grid-item">
          <SearchField
            title={this.props.searchTitle}
            handleSearch={this.props.searchOnChange}
            value={this.props.searchValue} />
        </div>
      </div>;
    } else {
      grid = filterList;
    }

    return (
      <section className="section controlbar">
        <div className="section-centered">
          {grid}
        </div>
      </section>
    )
  }
}
