import React from 'react';
import Selectric from '../selectric';

export default class ProvinceFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const regions = window['appStore'].getRegions();

    return (
      <div>
        <p className="info">Province</p>
        <Selectric onChange={this.props.handleChange} value={this.props.value}>
          <option value="">All</option>
          {
            Object.keys(regions).map((r) =>
              <option key={r} value={r}>{regions[r]}</option>
            )
          }
        </Selectric>
      </div>
    );
  }
}
