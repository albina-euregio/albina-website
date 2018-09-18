import React from 'react'
import { observer, inject } from 'mobx-react'
import L from 'leaflet'
import {
  Map,
  TileLayer,
  ImageOverlay,
  LayersControl,
  ZoomControl
} from 'react-leaflet'
import { injectIntl } from 'react-intl'
import BulletinVectorLayer from './bulletin-vector-layer'
import { tooltip_init } from '../../js/tooltip'
import Base from './../../base'
import AppStore from '../../appStore'

require('leaflet-geonames')
require('leaflet-gesture-handling')
require('leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css')
require('./../../css/geonames.css')

class LeafletMap extends React.Component {
  constructor(props) {
    super(props)
    this.map = false
  }

  mapStyle() {
    return {
      width: '100%',
      height: '100%',
      zIndex: 1
    }
  }

  componentDidMount() {
    this.map = this.refs.map.leafletElement

    L.Util.setOptions(this.map, { gestureHandling: true })

    this.map.fitBounds(config.get('map.euregioBounds'))
    this.map.on('click', e => {
      L.DomEvent.stopPropagation(e)
      this.props.handleSelectRegion(null)
    })

    window.setTimeout(() => {
      const geonamesOptions = Object.assign(
        {},
        {
          lang: appStore.language,
          bbox: { east: 17, west: 5, north: 50, south: 44 },
          title: this.props.intl.formatMessage({
            id: 'bulletin:map:search'
          }),
          placeholder: this.props.intl.formatMessage({
            id: 'bulletin:map:search:hover'
          })
        },
        config.get('map.geonames')
      )
      L.control.geonames(geonamesOptions).addTo(this.map)
    }, 50)

    console.log(appStore.language)

    window.setTimeout(() => {
      $('.leaflet-control-zoom a').addClass('tooltip')
      tooltip_init()
    }, 100)

    const m = this.map
    window.addEventListener('resize', () => {
      window.setTimeout(() => {
        m.invalidateSize()
      }, 2000)
    })
    window.addEventListener('orientationchange', () => {
      window.setTimeout(() => {
        m.invalidateSize()
      }, 2000)
    })
  }

  get tileLayers() {
    const tileLayerConfig = config.get('map.tileLayers')
    let tileLayers = ''
    if (tileLayerConfig.length == 1) {
      // only a single raster layer -> no layer control
      tileLayers = <TileLayer {...tileLayerConfig[0]} />
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
      )
    }
    return tileLayers
  }

  get mapOverlays() {
    const b = bulletinStore.activeBulletinCollection
    if (b) {
      const daytime = b.hasDaytimeDependency()
        ? bulletinStore.settings.ampm
        : 'fd'

      const url =
        config.get('apis.geo') +
        bulletinStore.settings.date +
        '/' +
        daytime +
        '_overlay.png'
      const params = config.get('map.overlay')

      return (
        <ImageOverlay
          url={url}
          {...params}
          opacity={Base.checkBlendingSupport() ? 1 : 0.5}
        />
      )
    }
    return null
  }

  render() {
    const mapProps = config.get('map.initOptions')
    return (
      <Map
        onViewportChanged={this.props.mapViewportChanged.bind(
          this.map
        )}
        useFlyTo
        ref="map"
        {...mapProps}
        dragging={!L.Browser.mobile}
        style={this.mapStyle()}
        zoomControl={false}
        zoom={bulletinStore.getMapZoom}
        gestureHandling
        center={bulletinStore.getMapCenter}
      >
        <ZoomControl
          position="topleft"
          zoomInTitle={this.props.intl.formatMessage({
            id: 'bulletin:map:zoom-in:hover'
          })}
          zoomOutTitle={this.props.intl.formatMessage({
            id: 'bulletin:map:zoom-out:hover'
          })}
        />
        {this.tileLayers}
        {this.mapOverlays}
        {this.props.vectorRegions && (
          <BulletinVectorLayer
            store={bulletinStore}
            regions={this.props.vectorRegions}
            handleHighlightRegion={this.props.handleHighlightRegion}
            handleSelectRegion={this.props.handleSelectRegion}
          />
        )}
      </Map>
    )
  }
}
export default inject('locale')(injectIntl(observer(LeafletMap)))
