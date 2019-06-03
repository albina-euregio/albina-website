import React from "react";
import ReactDOMServer from "react-dom/server";
import DivIcon from 'react-leaflet-div-icon';
import StationIcon from "./station-icon";

export default class StationMarker extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const icon = (
      <StationIcon
        type={this.props.type}
        color={this.props.color}
        selected={this.props.selected}
        value={this.props.value}
        direction={this.props.direction} />
    );

    // Render SVG-icon as child component an as static html string.
    // If not rendered as static string, the markercluster plugin will fail
    // to render single markers.
    // If not rendered as child compoents, leaflet-div-icon will throw lots
    // of errors
    return (
      <DivIcon
        position={this.props.coordinates}
        iconAnchor={[25,25]}
        html={ReactDOMServer.renderToStaticMarkup(icon)}
        onClick={this.props.onClick}>
        { icon }
      </DivIcon>

    );
  }
}
