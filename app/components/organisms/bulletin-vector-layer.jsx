import React from 'react';
import { GeoJSON } from 'react-leaflet';

export default class BulletinVectorLayer extends React.Component {
  componentDidMount(props) {
    this.layer = this.refs.feature.leafletElement;
  }

  render() {
    return (
      <GeoJSON
        ref="feature"
        key={this.props.date}
        data={this.props.data}
        onClick={(e) => { this.props.handleSelectFeature(e) }}
        onMouseOver={(e) => { this.props.handleHighlightFeature(e) }}
        onMouseOut={() => {this.props.handleHighlightFeature(null)}}  />
    );
  }
}
