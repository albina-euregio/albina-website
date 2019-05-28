import React from "react";
import DivIcon from 'react-leaflet-div-icon';

export default class StationMarker extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DivIcon
        position={this.props.coordinates}
        onClick={this.props.onClick}>
        <svg
          className={this.props.type +
            (this.props.selected ? (' ' + this.props.type + '-selected') : '')}
          width={50}
          height={50}
          >
          <g transform="translate(25,25)">
            <circle className="inner"
              r={10}
              fill={"rgb(" + this.props.color + ")"}>
            </circle>
            { this.props.selected &&
              <circle className="outer" r={10}>
                <animate
                  attributeType="xml"
                  attributeName="r"
                  from={10}
                  to={25}
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite">
                </animate>
                <animate
                  attributeType="xml"
                  attributeName="opacity"
                  from="0.8"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite">
                </animate>
              </circle>
            }
            <text y="3.5" textAnchor="middle">
              {this.props.value}
            </text>
          </g>
        </svg>
      </DivIcon>

    );
  }
}
