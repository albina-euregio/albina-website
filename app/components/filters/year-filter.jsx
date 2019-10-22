import React from "react";
import Selectric from "../selectric";

export default class YearFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  get years() {
    const minYear = this.props.minYear;
    const years = [];
    const maxYear = new Date().getFullYear();

    for (var d = minYear; d <= maxYear; d++) {
      years.push(d);
    }
    return years;
  }

  render() {
    return (
      <div>
        {this.props.title && <p className="info">{this.props.title}</p>}
        <Selectric onChange={this.props.handleChange} {...this.props}>
          {this.props.all && <option value="">{this.props.all}</option>}
          {this.years.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Selectric>
      </div>
    );
  }
}
