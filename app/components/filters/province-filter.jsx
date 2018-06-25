import React from 'react';

export default class ProvinceFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <select className="dropdown">
        <option value="">Province</option>
        <option value="Tyrol">Tyrol</option>
        <option value="South Tyrol">South Tyrol</option>
        <option value="Trentino">Trentino</option>
      </select>
    );
  }
}
