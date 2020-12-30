import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";
import { regionCodes } from "../../util/regions";
import Selectric from "../selectric";

class ProvinceFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.title && <p className="info">{this.props.title}</p>}
        <Selectric onChange={this.props.handleChange} {...this.props}>
          {this.props.all && <option value="">{this.props.all}</option>}
          {this.props.none && <option value="none">{this.props.none}</option>}
          {regionCodes.map(r => (
            <option key={r} value={r}>
              {this.props.intl.formatMessage({ id: `region:${r}` })}
            </option>
          ))}
        </Selectric>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(ProvinceFilter));
