import React from 'react';
import SearchField from '../search-field';

export default class FilterBar extends React.Component {
  render() {
    const filterList = (
      <ul className="list-inline list-controlbar">
        {
          Object.keys(this.props.filters).map((f) => (
            <li key={f}>
              {this.props.filters[f]}
            </li>
          ))
        }
      </ul>
    );

    let grid;
    if(this.props.search) {
      grid = <div className="grid">
        <div className="normal-9 grid-item">{filterList}</div>
        <div className="normal-3 grid-item"><SearchField title={this.props.searchTitle} /></div>
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
