import React from 'react';

export default class SearchField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p className="info">{this.props.title}</p>
        <div className="pure-form pure-form-search">
          <input type="text" id="input" placeholder="Search" />
          <button href="#" title="Search" className="pure-button pure-button-icon icon-search">
            <span>&nbsp;</span>
          </button>
        </div>
      </div>
    );
  }
}
