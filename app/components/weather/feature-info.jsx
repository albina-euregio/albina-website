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

<a
  href="#dcbc65d1-4fb1-40ae-a43f-bf37e51b0311"
  class="pure-button tooltip"
  data-scroll=""
  data-tippy=""
  data-original-title="Vollständige Lawinenvorhersage anzeigen"
>
  Details<span class="icon-arrow-down"></span>
</a>;
