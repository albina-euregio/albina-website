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
  LayersControl,
  Pane
} from 'react-leaflet';
import BulletinVectorLayer from './bulletin-vector-layer';

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
    this.map.fitBounds(config.get('map.euregioBounds'));
  }

  get tileLayers() {
    const tileLayerConfig = config.get('map.tileLayers');
    let tileLayers = '';
    if(tileLayerConfig.length == 1) {
      // only a single raster layer -> no layer control
      tileLayers = <TileLayer {...tileLayerConfig[0]} />;
    } else if(tileLayerConfig.length > 1) {
      // add a layer switch zoomControl
      tileLayers = <LayersControl>{
        tileLayerConfig.map((layerProps, i) =>
          <LayersControl.BaseLayer
            name={layerProps.id}
            key={layerProps.id}
            checked={i == 0}>
            <TileLayer key={layerProps.id} {...layerProps} />
          </LayersControl.BaseLayer>)
      }</LayersControl>;
    }
    return tileLayers;
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

    const mapProps = config.get('map.initOptions');

    return (
      <Map
        onViewportChanged={this.props.mapViewportChanged.bind(this.map)}
        useFlyTo={true}
        ref="map"
        {...sleepProps}
        {...mapProps}
        style={this.mapStyle()}
        attributionControl={true}
        zoomControl={false}
        zoom={bulletinStore.getMapZoom}
        center={bulletinStore.getMapCenter}
      >
        { this.tileLayers }
        {
          this.props.vectorLayer &&
            <BulletinVectorLayer
              data={this.props.vectorLayer}
              handleHighlightFeature={this.props.handleHighlightFeature}
              handleSelectFeature={this.props.handleSelectFeature} />
        }
      </Map>
    );
  }
}

export default LeafletMap;
