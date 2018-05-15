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

  render() {
    //const bulletin = bulletinStore.get(this.props.date, this.props.ampm);

    return (
      <section
        id="section-bulletin-map"
        className="section section-bulletin section-bulletin-map"
      >
        <div className="bulletin-map-container">
          <LeafletMap
            mapViewportChanged={this.handleMapViewportChanged.bind(this)}
          />
          <div className="bulletin-map-search">
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
          <div className="bulletin-map-zoom">
            <ul className="list-plain">
              <li className="bulletin-map-zoom-plus">
                <button
                  href="#"
                  className="pure-button pure-button-icon icon-plus-big tooltip"
                  title="Zoom in"
                >
                  <span>&nbsp;</span>
                </button>
              </li>
              <li className="bulletin-map-zoom-minus">
                <button
                  href="#"
                  className="pure-button pure-button-icon icon-minus-big tooltip"
                  title="Zoom out"
                >
                  <span>&nbsp;</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="bulletin-map-details js-active top-right">
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
