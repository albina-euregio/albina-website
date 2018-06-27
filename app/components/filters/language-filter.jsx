import React from 'react';

export default class LanguageFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p className="info">Language</p>
        <select className="dropdown">
          <option value="">All</option>
          <option value="de">DE</option>
          <option value="it">IT</option>
          <option value="en">EN</option>
        </select>
      </div>
    );
  }
}
