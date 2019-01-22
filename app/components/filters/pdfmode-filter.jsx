import React from "react";
import Selectric from "../selectric";

export default class PdfModeFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.title && <p className="info">{this.props.title}</p>}
        <Selectric onChange={this.props.handleChange} {...this.props}>
          {this.props.options.map(l => (
            <option key={l.value} value={l.value}>
              {l.label.toUpperCase()}
            </option>
          ))}
        </Selectric>
      </div>
    );
  }
}
