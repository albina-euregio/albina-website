import React from "react";
import { modal_open_by_params } from "../../js/modal";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

class FeatureInfo extends React.Component {
  constructor(props) {
    super(props);
    this.triggerStationDiagrams = this.triggerStationDiagrams.bind(this);
  }

  triggerStationDiagrams() {
    window["modalStateStore"].setData({ stationData: this.props.feature });
    modal_open_by_params(
      null,
      "inline",
      "#weatherStationDiagrams",
      "weatherStationDiagrams",
      true
    );
  }

  render() {
    return (
      <div className="feature-info">
        <div className="box-content">
          <div className="feature-name">
            <span>{this.props.feature.name}</span>
          </div>
          {this.props.feature.operator && (
            <div className="operator-name">
              <span>{this.props.feature.operator}</span>
            </div>
          )}
          <div>
            {this.props.feature.detail && (
              <span className="feature-details">
                {this.props.feature.detail}
              </span>
            )}
            {this.props.feature.date && (
              <span className="feature-date">{this.props.feature.date}</span>
            )}
            {this.props.feature.plot && (
              <a onClick={this.triggerStationDiagrams}>
                {this.props.intl.formatMessage({
                  id: "weathermap:map:feature-info:more"
                })}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(FeatureInfo));
