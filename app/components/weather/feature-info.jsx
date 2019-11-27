import React from "react";
import { Link } from "react-router-dom";
import { modal_open_by_params } from "../../js/modal";

export default class FeatureInfo extends React.Component {
  constructor(props) {
    super(props);
    this.triggerStationDiagrams = this.triggerStationDiagrams.bind(this);
  }

  triggerStationDiagrams() {
    //console.log('this.props.feature.feature.data', this.props.feature);
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
                <strong>more infos</strong>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
}
