import React from "react";
import { observer, inject } from "mobx-react";
import L from "leaflet";
import "leaflet-sleep";
import {
  Map,
  TileLayer,
  ImageOverlay,
  LayersControl,
  ZoomControl
} from "react-leaflet";
import { injectIntl } from 'react-intl';
import BulletinVectorLayer from "./bulletin-vector-layer";

class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this.map = false;
    this.sleepProps = {
      // false if you want an unruly map
      sleep: false,
      // time(ms) until map sleeps on mouseout
      sleepTime: 750,
      // time(ms) until map wakes on mouseover
      wakeTime: 750,
      // should the user receive wake instructions?
      sleepNote: true,
      // should hovering wake the map? (non-touch devices only)
      hoverToWake: true,
      // a message to inform users about waking the map
      wakeMessage: "Click or Hover to Wake up the map",
      // a constructor for a control button
      sleepButton: L.Control.sleepMapControl,
      // opacity for the sleeping map
      sleepOpacity: 0.7
    };
  }

  mapStyle() {
    return {
      width: "100%",
      height: "100%",
      zIndex: 1
    };
  }

  componentDidMount() {
    this.map = this.refs.map.leafletElement;
    this.map.fitBounds(config.get('map.euregioBounds'));
    this.map.on('click', e => {
      L.DomEvent.stopPropagation(e);
      this.props.handleSelectFeature(null);
    });

    const m = this.map;
    window.addEventListener('resize', () => {
      window.setTimeout(() => { m.invalidateSize(); }, 2000);
    });
    window.addEventListener('orientationchange', () => {
      window.setTimeout(() => { m.invalidateSize(); }, 2000);
    });
  }

  get tileLayers() {
    const tileLayerConfig = config.get("map.tileLayers");
    let tileLayers = "";
    if (tileLayerConfig.length == 1) {
      // only a single raster layer -> no layer control
      tileLayers = <TileLayer {...tileLayerConfig[0]} />;
    } else if (tileLayerConfig.length > 1) {
      // add a layer switch zoomControl
      tileLayers = (
        <LayersControl>
          {tileLayerConfig.map((layerProps, i) => (
            <LayersControl.BaseLayer
              name={layerProps.id}
              key={layerProps.id}
              checked={i == 0}
            >
              <TileLayer key={layerProps.id} {...layerProps} />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>
      );
    }
    return tileLayers;
  }

  get mapOverlays() {
    const b = bulletinStore.activeBulletinCollection;
    if(b) {
      const daytime = b.hasDaytimeDependency() ?
        bulletinStore.settings.ampm : 'am';

      const url = config.get("apis.geo") + bulletinStore.settings.date + "/" + daytime + "_overlay.png";
      const params = config.get("map.overlay");

      return <ImageOverlay url={url} {...params} />;
    }
    return null;
  }

  render() {
    const mapProps = config.get("map.initOptions");
    return (
      <Map
        onViewportChanged={this.props.mapViewportChanged.bind(this.map)}
        useFlyTo={true}
        ref="map"
        {...this.sleepProps}
        {...mapProps}
        dragging={!L.Browser.mobile}
        style={this.mapStyle()}
        zoomControl={false}
        zoom={bulletinStore.getMapZoom}
        center={bulletinStore.getMapCenter}
      >
        <ZoomControl
          position="topleft"
          zoomInTitle={this.props.intl.formatMessage({id: 'map:zoomIn'})}
          zoomOutTitle={this.props.intl.formatMessage({id: 'map:zoomOut'})} />
        {this.tileLayers}
        {this.mapOverlays}
        {this.props.vectorRegions && (
          <BulletinVectorLayer
            store={bulletinStore}
            regions={this.props.vectorRegions}
            handleHighlightFeature={this.props.handleHighlightFeature}
            handleSelectFeature={this.props.handleSelectFeature}
          />
        )}
      </Map>
    );
  }
}
export default inject('locale')(injectIntl(observer(LeafletMap)));
