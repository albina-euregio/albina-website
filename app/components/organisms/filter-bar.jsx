import React from 'react';

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

    const searchField = (this.props.search &&
      <div>
        <p className="info">Search Posts</p>
        <div className="pure-form pure-form-search">
          <input id="input" placeholder="Search" type="text" />
          <button href="#" title="Search" className="pure-button pure-button-icon icon-search"><span>&nbsp;</span></button>
        </div>
      </div>
    );

    let grid;
    if(searchField) {
      grid = <div className="grid">
        <div className="normal-9 grid-item">{filterList}</div>
        <div className="normal-3 grid-item">{searchField}</div>
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
