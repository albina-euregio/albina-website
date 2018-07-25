import React from 'react';
import { observer } from 'mobx-react';
import LeafletMap from './leaflet-map';
import BulletinMapDetails from './bulletin-map-details';

@observer
class BulletinMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*
       * Highlighted state is used only for mouseover effects. If regions are
       * clicked (i.e. selected), the region settings in bulletinStore will
       * be set instead.
       */
      highlightedRegion: null,
    };
  }

  handleMapViewportChanged(mapState) {
    window['bulletinStore'].setMapViewport(mapState);
  }

  handleZoom(zoomIn = true) {
    zoomIn
      ? window['bulletinStore'].zoomIn()
      : window['bulletinStore'].zoomOut();
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

  get highlightedBulletin() {
    return this.props.store.activeBulletin;

    // NOTE: code below is usefull for mouseover effects
    //
    // if (this.state && this.state.highlightedRegion) {
    //   return this.props.store.getBulletinForRegion(
    //     this.state.highlightedRegion
    //   );
    // }
    // return null;
  }

  handleHighlightFeature = id => {
    if (id) {
      console.log('Highlight region ' + id);
      this.setState({ highlightedRegion: id });
    } else if (this.state.highlightedRegion) {
      console.log('Dehighlight region ' + this.state.highlightedRegion);
      this.setState((prevState, props) => ({
        highlightedRegion: props.store.settings.region
          ? props.store.settings.region
          : ''
      }));
    }
  };

  handleSelectFeature = id => {
    if (id) {
      console.log('Select region ' + id);
      window['bulletinStore'].setRegion(id);
      this.handleHighlightFeature(id); // also do highlighting
    } else if (window['bulletinStore'].settings.region) {
      console.log('Deselect ' + window['bulletinStore'].settings.region);
      window['bulletinStore'].setRegion('');
      this.handleHighlightFeature(null);
    }
  };

  render() {
    console.log('**************');
    console.log(this.props.store.vectorRegions);
    console.log('**************');
    return (
      <section
        id="section-bulletin-map"
        className="section section-bulletin section-bulletin-map"
      >
        <div className="bulletin-map-container section-map section-centered">
          <LeafletMap
            vectorRegions={this.props.store.vectorRegions}
            mapScrollZoom={this.handleMapScrollZoom.bind(this)}
            mapViewportChanged={this.handleMapViewportChanged.bind(this)}
            handleHighlightFeature={this.handleHighlightFeature}
            handleSelectFeature={this.handleSelectFeature}
          />
          { false && /* hide map search */
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
          }
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
          {this.highlightedBulletin && (
            <div
              style={this.styleOverMap()}
              className="bulletin-map-details js-active top-right"
            >
              <BulletinMapDetails
                store={this.props.store}
                bulletin={this.highlightedBulletin}
              />
              {this.props.store.settings.region ==
                this.state.highlightedRegion && (
                <a
                  href="#section-bulletin-report"
                  className="pure-button tooltip"
                  title="See full bulletin report"
                >
                  <span>Click for</span> Details<span className="icon-arrow-down" />
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default BulletinMap;