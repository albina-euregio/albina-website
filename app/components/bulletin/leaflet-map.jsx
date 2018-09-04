import React from 'react'
import { observer, inject } from 'mobx-react'
import L from 'leaflet'
require('leaflet-geonames')
require('leaflet-gesture-handling')
import 'leaflet-sleep'
import { Map, TileLayer, ImageOverlay, LayersControl, ZoomControl } from 'react-leaflet'
import { injectIntl } from 'react-intl'
import BulletinVectorLayer from './bulletin-vector-layer'
import { tooltip_init } from '../../js/tooltip'
import Base from './../../base'
import AppStore from '../../appStore'

require('leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css')
require('./../../css/geonames.css')

class LeafletMap extends React.Component {
  constructor (props) {
    super(props)
    this.map = false
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
      wakeMessage: 'Click or Hover to Wake up the map',
      // a constructor for a control button
      sleepButton: L.Control.sleepMapControl,
      // opacity for the sleeping map
      sleepOpacity: 0.7
    }
  }

  mapStyle () {
    return {
      width: '100%',
      height: '100%',
      zIndex: 1
    }
  }

  componentDidMount () {
    this.map = this.refs.map.leafletElement

    L.Util.setOptions(this.map, { gestureHandling: true })

    this.map.fitBounds(config.get('map.euregioBounds'))
    this.map.on('click', e => {
      L.DomEvent.stopPropagation(e)
      this.props.handleSelectFeature(null)
    })

    window.setTimeout(() => {
      L.control
        .geonames({
          geonamesURL: '//api.geonames.org/searchJSON', // override this if using a proxy to get connection to geonames
          username: 'adammertel', // Geonames account username.  Must be provided
          zoomLevel: null, // Max zoom level to zoom to for location.  If null, will use the map's max zoom level.
          maxresults: 5, // Maximum number of results to display per search
          className: 'tooltip leaflet-geonames-icon', // class for icon
          workingClass: 'leaflet-geonames-icon-working', // class for search underway
          featureClasses: ['A', 'H', 'L', 'P', 'R', 'T', 'U', 'V'], // feature classes to search against.  See: http://www.geonames.org/export/codes.html
          baseQuery: 'isNameRequired=true', // The core query sent to GeoNames, later combined with other parameters above
          position: 'topleft',
          showMarker: true, // Show a marker at the location the selected location
          showPopup: true, // Show a tooltip at the selected location
          lang: AppStore.language, // language for results
          bbox: { east: 17, west: 5, north: 50, south: 44 }, // bounding box filter for results (e.g., map extent).  Values can be an object with east, west, north, south, or a function that returns that object.
          alwaysOpen: false, // if true, search field is always visible
          enablePostalCodes: false // if true, use postalCodesRegex to test user provided string for a postal code.  If matches, then search against postal codes API instead.
        })
        .addTo(this.map)
    }, 0)

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

  get tileLayers () {
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

  get mapOverlays () {
    const b = bulletinStore.activeBulletinCollection
    if (b) {
      const daytime = b.hasDaytimeDependency() ? bulletinStore.settings.ampm : 'fd'

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

  render () {
    const mapProps = config.get('map.initOptions')
    return (
      <Map
        onViewportChanged={this.props.mapViewportChanged.bind(this.map)}
        useFlyTo
        ref='map'
        {...this.sleepProps}
        {...mapProps}
        dragging={!L.Browser.mobile}
        style={this.mapStyle()}
        zoomControl={false}
        zoom={bulletinStore.getMapZoom}
        gestureHandling
        center={bulletinStore.getMapCenter}
      >
        <ZoomControl
          position='topleft'
          zoomInTitle={this.props.intl.formatMessage({
            id: 'bulletin:map:zoom-in:hover'
          })}
          zoomOutTitle={this.props.intl.formatMessage({
            id: 'bulletin:map:zoom-out:hover'
          })}
        />
        {this.tileLayers}
        {this.mapOverlays}
        {this.props.vectorRegions &&
          <BulletinVectorLayer
            store={bulletinStore}
            regions={this.props.vectorRegions}
            handleHighlightFeature={this.props.handleHighlightFeature}
            handleSelectFeature={this.props.handleSelectFeature}
          />}
      </Map>
    )
  }
}
export default inject('locale')(injectIntl(observer(LeafletMap)))
