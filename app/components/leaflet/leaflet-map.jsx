import React from "react";
import { inject } from "mobx-react";
import L from "leaflet";
require("leaflet/dist/leaflet.css");
require("./leaflet-player.css");

import {
  Map,
  TileLayer,
  LayersControl,
  AttributionControl,
  ScaleControl
} from "react-leaflet";
import { injectIntl } from "react-intl";
import { tooltip_init } from "../../js/tooltip";

require("leaflet-geonames");
require("leaflet.locatecontrol");
require("leaflet-gesture-handling");
require("leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css");
require("../../css/geonames.css");

class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @type L.Map
     */
    this.map = undefined;
    this.mapRef;
    this._layers = [];
  }

  // onTick(){
  //   console.log("onTick xxx", this.playerStore.currentTime.get());
  //   this.test = this.props.currentTime.get();
  // }

  mapStyle() {
    return {
      width: "100%",
      height: "100%",
      zIndex: 1,
      opacity: 1
    };
  }

  componentDidMount() {
    this.updateMaps();
  }

  componentDidUpdate() {
    this.updateMaps();
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.off("zoomend", this._zoomend, this);
      // workaround for https://github.com/Leaflet/Leaflet/pull/6958
      this.map.off("moveend", this._panInsideMaxBounds, this.map);
    }
  }

  updateMaps() {
    //console.log("updateMaps xyy");
    if (this.refs.mapDisabled && !this.mapDisabled) {
      this.mapDisabled = this.refs.mapDisabled.leafletElement;
      L.Util.setOptions(this.mapDisabled, { gestureHandling: false });
    }

    if (this.mapRef && !this.map) {
      this.map = this.mapRef.leafletElement;
      //window.currMap = this.map;
      //console.log("updateMaps xyz", L);
      if (this.props.onInit) {
        this.props.onInit(this.map);
      }

      if (this.props.gestureHandling)
        L.Util.setOptions(this.map, { gestureHandling: true });

      this.map.fitBounds(config.map.euregioBounds);

      const map = this.map;
      //console.log("this.map", this.map);
      window.setTimeout(() => {
        L.control
          .zoom({
            position: "topleft",
            zoomInTitle: this.props.intl.formatMessage({
              id: "bulletin:map:zoom-in:hover"
            }),
            zoomOutTitle: this.props.intl.formatMessage({
              id: "bulletin:map:zoom-out:hover"
            })
          })
          .addTo(map);

        L.control
          .geonames({
            lang: appStore.language,
            title: this.props.intl.formatMessage({
              id: "bulletin:map:search"
            }),
            placeholder: this.props.intl.formatMessage({
              id: "bulletin:map:search:hover"
            }),
            ...config.map.geonames
          })
          .addTo(map);
        L.control
          .locate({
            ...config.map.locateOptions,
            icon: "icon-geolocate",
            iconLoading: "icon-geolocate",
            strings: {
              title: this.props.intl.formatMessage({
                id: "bulletin:map:locate:title"
              }),
              metersUnit: this.props.intl.formatMessage({
                id: "bulletin:map:locate:metersUnit"
              }),
              popup: this.props.intl.formatMessage(
                {
                  id: "bulletin:map:locate:popup"
                },
                {
                  // keep placeholders for L.control.locate
                  distance: "{distance}",
                  unit: "{unit}"
                }
              ),
              outsideMapBoundsMsg: this.props.intl.formatMessage({
                id: "bulletin:map:locate:outside"
              })
            }
          })
          .addTo(map);
      }, 50);

      this._init_tooltip();
      this.map.on("zoomend", this._zoomend, this);
    }
  }

  _init_tooltip() {
    window.setTimeout(() => {
      // console.log("leaflet-map ggg1 update tooltip");
      $(".leaflet-cluster-marker").prop(
        "title",
        this.props.intl.formatMessage({
          id: "station-overlay:cluster:title"
        })
      );
      $(".leaflet-control-zoom a").addClass("tooltip");
      $(".leaflet-control-zoom a").addClass("tooltip");
      $(".leaflet-control-locate a").addClass("tooltip");
      tooltip_init();
    }, 100);
  }

  _zoomend() {
    const map = this.map;
    const newZoom = Math.round(map.getZoom());
    console.log("leaflet-map->_zoomend newZoom", newZoom);
    map.setMaxBounds(config.map.maxBounds[newZoom]);
    this._init_tooltip();
  }

  get tileLayers() {
    const tileLayerConfig = config.map.tileLayers;
    let tileLayers = "";
    if (tileLayerConfig.length == 1) {
      // only a single raster layer -> no layer control
      tileLayers = (
        <TileLayer
          {...Object.assign(
            {},
            tileLayerConfig[0],
            this.props.tileLayerConfigOverride
          )}
        />
      );
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
              <TileLayer
                key={layerProps.id}
                {...Object.assign(
                  {},
                  layerProps,
                  this.props.tileLayerConfigOverride
                )}
              />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>
      );
    }
    return tileLayers;
  }

  _disabledMapProps() {
    return {
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false
    };
  }
  _enabledMapProps() {
    return {
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      boxZoom: true,
      keyboard: true
    };
  }

  connectLayers(map) {
    //console.log("connectLayers", map);
    if (map) {
      this.mapRef = map;
    }
  }

  render() {
    const mapProps = config.map.initOptions;
    const mapOptions = Object.assign(
      {},
      this.props.loaded ? this._enabledMapProps() : this._disabledMapProps(),
      mapProps,
      this.props.mapConfigOverride
    );

    return this.props.loaded
      ? this.renderLoadedMap(mapOptions)
      : this.renderDisabledMap(mapOptions);
  }

  renderDisabledMap(mapOptions) {
    return (
      <Map
        className="map-disabled"
        ref="mapDisabled"
        gestureHandling
        style={this.mapStyle()}
        zoomControl={false}
        zoom={window.mapStore.mapZoom}
        center={window.mapStore.mapCenter}
        {...mapOptions}
        attributionControl={false}
      >
        <AttributionControl prefix={config.map.attribution} />
        {this.tileLayers}
      </Map>
    );
  }

  renderLoadedMap(mapOptions) {
    return (
      <Map
        onViewportChanged={this.props.onViewportChanged.bind(this.map)}
        useFlyTo
        ref={el => this.connectLayers(el)}
        gestureHandling={this.props.gestureHandling}
        dragging={L.Browser.mobile}
        style={this.mapStyle()}
        zoomControl={false}
        zoom={window.mapStore.mapZoom}
        center={window.mapStore.mapCenter}
        {...mapOptions}
        attributionControl={false}
      >
        <AttributionControl prefix={config.map.attribution} />
        <ScaleControl imperial={false} position="bottomleft" />
        {this.props.controls}
        {this.tileLayers}
        {this.props.overlays}
      </Map>
    );
  }
}
export default inject("locale")(injectIntl(LeafletMap));
