import React from 'react';
import Selectric from '../selectric';

export default class LanguageFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p className="info">Language</p>
        <Selectric onChange={this.props.handleChange} value={this.props.value}>
          <option value="">All</option>
          {
            window.appStore.languages.map((l) =>
              <option key={l} value={l}>{l.toUpperCase()}</option>
            )
          }
        </Selectric>
      </div>
    );
  }
}
