import React from 'react';
import { observer } from 'mobx-react';
import 'leaflet';
import 'leaflet-sleep';
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
class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this.map = false;
  }

  mapStyle() {
    return {
      width: '100%',
      height: '100%',
      zIndex: 1
    };
  }

  componentDidMount() {
    this.map = this.refs.map.leafletElement;
  }

  render() {
    // leaflet-sleep props
    const sleepProps = {
      // false if you want an unruly map
      sleep: true,
      // time(ms) until map sleeps on mouseout
      sleepTime: 750,
      // time(ms) until map wakes on mouseover
      wakeTime: 750,
      // should the user receive wake instructions?
      sleepNote: true,
      // should hovering wake the map? (non-touch devices only)
      hoverToWake: true,
      // a message to inform users about waking the map
      wakeMessage: 'Click or Hover to Wake up the map',
      // a constructor for a control button
      sleepButton: L.Control.sleepMapControl,
      // opacity for the sleeping map
      sleepOpacity: 0.7
    };
    return (
      <Map
        onViewportChanged={this.props.mapViewportChanged.bind(this.map)}
        useFlyTo={true}
        ref="map"
        {...sleepProps}
        style={this.mapStyle()}
        attributionControl={false}
        zoomControl={false}
        zoom={bulletinStore.getMapZoom}
        center={bulletinStore.getMapCenter}
      >
        <LayerGroup>
          <TileLayer
            url="https://lawis.at/wms/LAWIS/LAWIS-TMS_bw/{z}/{x}/{y}.png"
            maxZoom={10}
            detectRetina={false}
            tms={true}
            attribution="&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>, Tiles courtesy of <a href='http://hot.openstreetmap.org/' target='_blank'>Humanitarian OpenStreetMap Team</a>"
            OpenStreetMap
          />{
            this.props.vectorLayer &&
              <GeoJSON
                key={this.props.store.settings.date + this.props.store.settings.ampm}
                data={this.props.vectorLayer} />
          }
        </LayerGroup>
      </Map>
    );
  }
}

export default LeafletMap;
