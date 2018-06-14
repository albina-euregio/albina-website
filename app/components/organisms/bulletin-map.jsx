import React from 'react';
import { observer } from 'mobx-react';
import LeafletMap from './leaflet-map';
import BulletinMapDetails from './bulletin-map-details';

@observer
class BulletinMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedRegion: null
    }
  }

  handleMapViewportChanged(mapState) {
    window['bulletinStore'].setMapViewport(mapState);
  }

  handleZoom(zoomIn = true) {
    zoomIn ? window['bulletinStore'].zoomIn() : window['bulletinStore'].zoomOut();
  }

  handleMapScrollZoom() {
    console.log('scroll');
    return true;
  }

  styleOverMap() {
    return {
      zIndex: 1000
    };
  }

  get bulletin() {
    return this.props.store.activeBulletin;
  }

  get highlightedBulletin() {
    if(this.state && this.state.highlightedRegion) {
      const b = this.props.store.getBulletinForRegion(this.state.highlightedRegion);
      const daytime = (b.hasDaytimeDependency && this.props.store.settings.ampm == 'pm') ?
        'afternoon' : 'forenoon';
      return b[daytime];
    }
    return null;
  }

  handleHighlightFeature = (e) => {
    if(e) {
      const id = e.layer.feature.properties.bid;
      console.log('Highlight region ' + id);
      this.setState({highlightedRegion: id});
    } else if(this.state.highlightedRegion) {
      this.setState({highlightedRegion: null});
    }
  }

  render() {
    const highlightedBulletin = this.highlightedBulletin
    return (
      <section
        id="section-bulletin-map"
        className="section section-bulletin section-bulletin-map"
      >
        <div className="bulletin-map-container">
          <LeafletMap
            mapScrollZoom={this.handleMapScrollZoom.bind(this)}
            mapViewportChanged={this.handleMapViewportChanged.bind(this)}
            vectorLayer={this.props.store.activeVectorLayer}
            store={this.props.store}
            handleHighlightRegion={this.handleHighlightFeature}
          />
          <div style={this.styleOverMap()} className="bulletin-map-search">
            <div className="pure-form pure-form-search">
              <input
                type="text"
                id="input"
                className="tooltip"
                placeholder="Search"
                title="Type in a region"
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
          <div style={this.styleOverMap()} className="bulletin-map-zoom">
            <ul className="list-plain">
              <li className="bulletin-map-zoom-plus">
                <button
                  onClick={this.handleZoom.bind(this)}
                  href="#"
                  className="pure-button pure-button-icon icon-plus-big tooltip"
                  title="Zoom in"
                >
                  <span>&nbsp;</span>
                </button>
              </li>
              <li className="bulletin-map-zoom-minus">
                <button
                  onClick={this.handleZoom.bind(this, false)}
                  href="#"
                  className="pure-button pure-button-icon icon-minus-big tooltip"
                  title="Zoom out"
                >
                  <span>&nbsp;</span>
                </button>
              </li>
            </ul>
          </div>
          { highlightedBulletin &&
            <BulletinMapDetails
              bulletin={highlightedBulletin}
              style={this.styleOverMap()} />
          }
        </div>
      </section>
    );
  }
}

export default BulletinMap;
