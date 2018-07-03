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
        <select className="dropdown" onChange={(e) => {
          const target = e.target;
          this.props.handleChange(target.options[target.selectedIndex].value);
        }} value={this.props.value}>
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
