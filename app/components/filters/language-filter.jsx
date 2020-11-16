import React from "react";
import Selectric from "../selectric";

export default class LanguageFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.title && <p className="info">{this.props.title}</p>}
        <Selectric onChange={this.props.handleChange} {...this.props}>
          {this.props.all && <option value="all">{this.props.all}</option>}
          {window.appStore.mainLanguages.map(l => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </Selectric>
      </div>
    );
  }
}
