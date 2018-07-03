import React from 'react';

export default class ProvinceFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const regions = window['appStore'].getRegions();

    return (
      <div>
        <p className="info">Province</p>
        <select className="dropdown">
          <option value="">All</option>
          {
            Object.keys(regions).map((r) =>
              <option key={r} value={r}>{regions[r]}</option>
            )
          }
        </select>
      </div>
    );
  }
}
