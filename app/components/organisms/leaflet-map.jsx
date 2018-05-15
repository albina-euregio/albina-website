import React from 'react';
import { observer } from 'mobx-react';
import {
  Map,
  TileLayer,
  WMSTileLayer,
  CircleMarker,
  Tooltip,
  Marker,
  LayerGroup,
  GeoJSON,
  Pane
} from 'react-leaflet';

@observer
class BulletinMap extends React.Component {
  constructor(props) {
    super(props);
    this.map = false;
  }

  mapStyle() {
    return {
      width: '100%',
      height: '100%'
    };
  }

  componentDidMount() {
    this.map = this.refs.map.leafletElement;
  }

  render() {
    return (
      <Map
        onViewportChanged={this.props.mapViewportChanged.bind(this.map)}
        useFlyTo={true}
        ref="map"
        style={this.mapStyle()}
        attributionControl={false}
        zoomControl={false}
        zoom={bulletinStore.getMapZoom}
        center={bulletinStore.getMapCenter}
      >
        <LayerGroup>
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            maxZoom={19}
            attribution="&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>, Tiles courtesy of <a href='http://hot.openstreetmap.org/' target='_blank'>Humanitarian OpenStreetMap Team</a>"
            OpenStreetMap
          />
        </LayerGroup>
      </Map>
    );
  }
}

export default BulletinMap;
