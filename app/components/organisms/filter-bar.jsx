import React from 'react';

export default class FilterBar extends React.Component {
  render() {
    return (
      <section className="section controlbar">
        <div className="section-centered">
          <ul className="list-inline list-controlbar">
            {
              Object.keys(this.props.filters).map((f) => (
                <li key={f}>
                  {this.props.filters[f]}
                </li>
              ))
            }
          </ul>
        </div>
      </section>
    )
  }
}
