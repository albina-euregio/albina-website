import React from "react";

export default class FeatureInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="feature-info">
        <div className="box-content">
          <div className="feature-name"><span>{this.props.feature.name}</span></div>
          <div>
            {this.props.feature.detail &&
              <span className="feature-details">{this.props.feature.detail}</span>
            }
            {this.props.feature.date &&
              <span className="feature-date">{this.props.feature.date}</span>
            }
          </div>
        </div>
      </div>
    )
  }
}
