import React from 'react'
import { observer, inject } from 'mobx-react'
import { injectIntl } from 'react-intl'
import { Parser } from 'html-to-react'
import LeafletMap from './leaflet-map'
import Base from './../../base'
import BulletinMapDetails from './bulletin-map-details'

class BulletinMap extends React.Component {
  constructor(props) {
    super(props)
  }

  styleOverMap() {
    return {
      zIndex: 1000
    }
  }

  render() {
    return (
      <section
        id="section-bulletin-map"
        className="section section-bulletin section-bulletin-map"
      >
        <div
          className={
            'bulletin-map-container section-map' +
            (config.get('map.useWindowWidth')
              ? ''
              : ' section-centered')
          }
        >
          <LeafletMap
            vectorRegions={this.props.store.vectorRegions}
            mapViewportChanged={this.props.handleMapViewportChanged}
            handleHighlightRegion={this.props.handleHighlightRegion}
            handleSelectRegion={this.props.handleSelectRegion}
          />
          {false /* hide map search */ && (
            <div
              style={this.styleOverMap()}
              className="bulletin-map-search"
            >
              <div className="pure-form pure-form-search">
                <input
                  type="text"
                  id="input"
                  className="tooltip"
                  placeholder={this.props.intl.formatMessage({
                    id: 'bulletin:map:search'
                  })}
                  title={this.props.intl.formatMessage({
                    id: 'bulletin:map:search:hover'
                  })}
                />
                <button
                  href="#"
                  title="The Button"
                  className="pure-button pure-button-icon icon-search"
                >
                  <span>&nbsp;</span>
                </button>
              </div>
            </div>
          )}
          {this.props.highlightedBulletin && (
            <div
              style={this.styleOverMap()}
              className="bulletin-map-details js-active top-right"
            >
              <BulletinMapDetails
                store={this.props.store}
                bulletin={this.props.highlightedBulletin}
              />
              {this.props.store.settings.region ==
                this.state.highlightedRegion && (
                <a
                  href="#section-bulletin-buttonbar"
                  className="pure-button tooltip"
                  title={this.props.intl.formatMessage({
                    id: 'bulletin:map:info:details:hover'
                  })}
                  data-scroll=""
                >
                  {new Parser().parse(
                    this.props.intl.formatHTMLMessage({
                      id: 'bulletin:map:info:details'
                    })
                  )}
                  <span className="icon-arrow-down" />
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }
}

export default inject('locale')(injectIntl(observer(BulletinMap)))
