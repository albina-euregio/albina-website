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
          {this.props.feature.detail &&
            <div className="feature-details"><span>{this.props.feature.detail}</span></div>
          }
        </div>
      </div>
    )
  }
}
