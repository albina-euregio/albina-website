import React from "react";
import Selectric from "../selectric";

export default class ProvinceFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const regions = window["appStore"].getRegions();
    console.log("rendering province filter with value", this.props.value);

    return (
      <div>
        {this.props.title && <p className="info">{this.props.title}</p>}
        <Selectric onChange={this.props.handleChange} {...this.props}>
          {this.props.all && <option value="">{this.props.all}</option>}
          {Object.keys(regions).map(r => (
            <option key={r} value={r}>
              {regions[r]}
            </option>
          ))}
        </Selectric>
      </div>
    );
  }
}
