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
          {
            window.appStore.languages.map((l) =>
              <option key={l} value={l}>{l.toUpperCase()}</option>
            )
          }
        </select>
      </div>
    );
  }
}
