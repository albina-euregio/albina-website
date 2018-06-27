import React from 'react';

export default class ProvinceFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p className="info">Province</p>
        <select className="dropdown">
          <option value="">All</option>
          <option value="Tyrol">Tyrol</option>
          <option value="South Tyrol">South Tyrol</option>
          <option value="Trentino">Trentino</option>
        </select>
      </div>
    );
  }
}
