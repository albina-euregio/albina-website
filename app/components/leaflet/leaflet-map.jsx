import React from "react";
import { observer, inject } from "mobx-react";
import L from "leaflet";
import {
  Map,
  TileLayer,
  LayersControl,
  AttributionControl,
  ZoomControl,
  ScaleControl
} from "react-leaflet";
import { injectIntl } from "react-intl";
import stringInject from "stringinject";
import { tooltip_init } from "../../js/tooltip";
import Base from "../../base";
import AppStore from "../../appStore";

require("../../util/l.geonames");
require("leaflet.locatecontrol");
require("leaflet-gesture-handling");
require("leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css");
require("../../css/geonames.css");

class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this.map = false;
  }

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
      window.removeEventListener("resize", this.invalidateMap);
      window.removeEventListener("orientationchange", this.invalidateMap);
    }
  }

  invalidateMap() {
    const map = this.map;
    if (map && map.invalidateSize) {
      window.setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }
  }

  updateMaps() {
    if (this.refs.mapDisabled && !this.mapDisabled) {
      this.mapDisabled = this.refs.mapDisabled.leafletElement;
      L.Util.setOptions(this.mapDisabled, { gestureHandling: false });
    }
    if (this.refs.map && !this.map) {
      this.map = this.refs.map.leafletElement;

      L.Util.setOptions(this.map, { gestureHandling: true });

      this.map.fitBounds(config.get("map.euregioBounds"));

      window.setTimeout(() => {
        const zoomControl = L.control
          .zoom({
            position: "topleft",
            zoomInTitle: this.props.intl.formatMessage({
              id: "bulletin:map:zoom-in:hover"
            }),
            zoomOutTitle: this.props.intl.formatMessage({
              id: "bulletin:map:zoom-out:hover"
            })
          })
          .addTo(this.map);

        const geonamesOptions = Object.assign(
          {},
          {
            clearOnPopupClose: true,
            lang: appStore.language,
            bbox: config.get("map.geonamesSearch.bbox"),
            title: this.props.intl.formatMessage({
              id: "bulletin:map:search"
            }),
            placeholder: this.props.intl.formatMessage({
              id: "bulletin:map:search:hover"
            })
          },
          config.get("map.geonames")
        );

        L.control.geonames(geonamesOptions).addTo(this.map);
        const outsideMessage = this.props.intl.formatMessage({
          id: "bulletin:map:locate:outside"
        });
        L.control
          .locate(
            Object.assign({}, config.get("map.locateOptions"), {
              onLocationOutsideMapBounds: function(control) {
                control.stop();
                alert(outsideMessage);
              },
              strings: {
                title: this.props.intl.formatMessage({
                  id: "bulletin:map:locate:title"
                }),
                metersUnit: this.props.intl.formatMessage({
                  id: "bulletin:map:locate:metersUnit"
                }),
                popup: this.props.intl.formatMessage({
                  id: "bulletin:map:locate:popup"
                }),

                outsideMapBoundsMsg: this.props.intl.formatMessage({
                  id: "bulletin:map:locate:outsideMapBoundsMsg"
                })
              }
            })
          )
          .addTo(this.map);
      }, 50);

      window.setTimeout(() => {
        $(".leaflet-control-zoom a").addClass("tooltip");
        tooltip_init();
      }, 100);

      const m = this.map;
      window.addEventListener("resize", this.invalidateMap);
      window.addEventListener("orientationchange", this.invalidateMap);

      this.map.on("zoomend", () => {
        const newZoom = this.map.getZoom();
        this.map.setMaxBounds(config.get("map.maxBounds")[newZoom]);
        this.invalidateMap();
      });
    }
  }

  get tileLayers() {
    const tileLayerConfig = config.get("map.tileLayers").map((l) => {
      // handle optional url arguments (all parameters ecxcept x, y and z)
      l.url = stringInject(l.url, {
        // append version number to url
        v: encodeURIComponent(config.get("version"))
      });
      return l;
    });
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

  render() {
    const mapProps = config.get("map.initOptions");
    const mapOptions = Object.assign(
      {},
      this.props.loaded ? this._enabledMapProps() : this._disabledMapProps(),
      mapProps
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
        zoom={window.mapStore.getMapZoom}
        center={window.mapStore.getMapCenter}
        {...mapOptions}
        attributionControl={false}
      >
        <AttributionControl
          prefix={
            '<a target="_blank" href="https://leafletjs.com/">Leaflet</a> | ' +
            config.get("map.attribution") +
            " | v." +
            config.get("version")
          }
        />
        {this.tileLayers}
        {this.props.overlays}
      </Map>
    );
  }

  renderLoadedMap(mapOptions) {
    return (
      <Map
        onViewportChanged={this.props.onViewportChanged.bind(this.map)}
        useFlyTo
        ref="map"
        gestureHandling
        dragging={L.Browser.mobile}
        style={this.mapStyle()}
        zoomControl={false}
        zoom={window.mapStore.getMapZoom}
        center={window.mapStore.getMapCenter}
        {...mapOptions}
        attributionControl={false}
      >
        <AttributionControl
          prefix={
            '<a target="_blank" href="https://leafletjs.com/">Leaflet</a> | ' +
            config.get("map.attribution") +
            " | v." +
            config.get("version")
          }
        />
        <ScaleControl imperial={false} position="bottomleft" />
        {this.props.controls}
        {this.tileLayers}
        {this.props.overlays}
      </Map>
    );
  }
}
export default inject("locale")(injectIntl(observer(LeafletMap)));
