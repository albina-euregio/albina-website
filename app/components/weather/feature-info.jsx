import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

class FeatureInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="feature-info weather-map-details">
        <div className="box-content">
          <div class="weather-map-details-text">
            {this.props.feature.name && (
              <p className="feature-name">{this.props.feature.name}</p>
            )}
            {this.props.feature.operator && (
              <p className="operator-name">{this.props.feature.operator}</p>
            )}
            {this.props.feature.detail && (
              <p className="feature-details">{this.props.feature.detail}</p>
            )}
            {this.props.feature.date && (
              <p className="feature-date">{this.props.feature.date}</p>
            )}
          </div>
          {this.props.feature.plot && (
            <a
              onClick={this.triggerStationDiagrams}
              className="pure-button tooltip weather-map-details-button"
            >
              {this.props.intl.formatMessage({
                id: "weathermap:map:feature-info:more"
              })}
            </a>
          )}
        </div>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(FeatureInfo));
