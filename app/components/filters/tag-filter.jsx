import React from "react";
import { injectIntl } from "react-intl";
import { avalancheProblems } from "../../util/avalancheProblems";
import Selectric from "../selectric";

class TagFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.title && <p className="info">{this.props.title}</p>}
        <Selectric onChange={this.props.handleChange} {...this.props}>
          {this.props.all && <option value="">{this.props.all}</option>}
          {avalancheProblems.map(d => (
            <option key={d} value={d}>
              {this.props.intl.formatMessage({ id: "problem:" + d })}
            </option>
          ))}
        </Selectric>
      </div>
    );
  }
}

export default injectIntl(TagFilter);
