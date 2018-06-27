import React from 'react';

export default class YearFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  get years() {
    const minYear = window['config'].get('archive.minYear');
    const years = [];
    const maxYear = (new Date()).getFullYear();

    for(var d = minYear; d <= maxYear; d++) {
      years.push(d);
    }
    return years;
  }

  render() {
    return (
      <div>
        <p className="info">Year</p>
        <select className="dropdown">
          <option value="">All</option>
          {
            this.years.map((y) => <option key={y} value={y}>{y}</option>)
          }
        </select>
      </div>
    );
  }
}
