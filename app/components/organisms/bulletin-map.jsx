import React from 'react';
import { observer } from 'mobx-react';
import LeafletMap from './leaflet-map';

@observer
class BulletinMap extends React.Component {
  constructor(props) {
    super(props);
  }

  handleMapViewportChanged(mapState) {
    bulletinStore.setMapViewport(mapState);
  }

  handleZoom(zoomIn = true) {
    zoomIn ? bulletinStore.zoomIn() : bulletinStore.zoomOut();
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
    return this.props.store.active;
  }

  render() {
    return (
      <section
        id="section-bulletin-map"
        className="section section-bulletin section-bulletin-map"
      >
        <div className="bulletin-map-container">
          <LeafletMap
            mapScrollZoom={this.handleMapScrollZoom.bind(this)}
            mapViewportChanged={this.handleMapViewportChanged.bind(this)}
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
          <div
            style={this.styleOverMap()}
            className="bulletin-map-details js-active top-right"
          >
            <ul className="list-plain">
              <li
                className="bulletin-report-picto tooltip"
                title="Above 1800m: Warning Level 3<br/>Below 1800m: Warning Level 2"
              >
                <img
                  src="../../images/pro/warning-pictos/levels_2_3.png"
                  alt="Warning Levels 2 and 3"
                />
                <span>1800m</span>
              </li>
              <li
                className="bulletin-report-picto tooltip"
                title="Drifting Snow"
              >
                <img
                  src="../../images/pro/avalanche-situations/drifting_snow.png"
                  alt="Drifting Snow"
                />
              </li>
              <li className="bulletin-report-picto tooltip" title="Old Snow">
                <img
                  src="../../images/pro/avalanche-situations/old_snow.png"
                  alt="DrifOldting Snow"
                />
              </li>
            </ul>
            <a
              href="#section-bulletin-report"
              className="pure-button tooltip"
              title="See full bulletin report"
              data-scroll
            >
              <span>Click for</span> Details<span className="icon-arrow-down" />
            </a>
          </div>
        </div>
      </section>
    );
  }
}

export default BulletinMap;
