import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Parser } from "html-to-react";
import LeafletMap from "./leaflet-map";
import BulletinMapDetails from "./bulletin-map-details";
import { Link } from "react-router-dom";

class BulletinMap extends React.Component {
  constructor(props) {
    super(props);
  }

  styleOverMap() {
    return {
      zIndex: 1000
    };
  }

  render() {
    const hlBulletin = this.props.store.activeBulletin;

    return (
      <section
        id="section-bulletin-map"
        className="section section-bulletin section-bulletin-map"
      >
        <div
          className={
            "bulletin-map-container section-map" +
            (config.get("map.useWindowWidth") ? "" : " section-centered")
          }
        >
          {/*
              no-bulletin banner
            */
          ["", "empty"].includes(this.props.store.settings.status) &&
            config.get("bulletin.noBulletinBanner") && (
              <section className="bulletinbar section controlbar">
                <div className="bar section-centered">
                  <p>
                    {this.props.intl.formatMessage({
                      id: "bulletin:header:no-bulletin-info"
                    })}
                    <strong>
                      <Link title="blog" to="/blog/">
                        {this.props.intl.formatMessage({
                          id: "bulletin:header:blog"
                        })}
                      </Link>
                    </strong>
                    {this.props.intl.formatMessage({
                      id: "bulletin:header:no-bulletin-info-post"
                    })}
                  </p>
                </div>
              </section>
            )}
          <LeafletMap
            regions={this.props.regions}
            mapViewportChanged={this.props.handleMapViewportChanged}
            handleSelectRegion={this.props.handleSelectRegion}
            store={this.props.store}
          />
          {false /* hide map search */ && (
            <div style={this.styleOverMap()} className="bulletin-map-search">
              <div className="pure-form pure-form-search">
                <input
                  type="text"
                  id="input"
                  className="tooltip"
                  placeholder={this.props.intl.formatMessage({
                    id: "bulletin:map:search"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "bulletin:map:search:hover"
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
          {hlBulletin && (
            <div
              style={this.styleOverMap()}
              className="bulletin-map-details js-active top-right"
            >
              <BulletinMapDetails
                store={this.props.store}
                bulletin={hlBulletin}
              />
              {this.props.store.settings.region && (
                <a
                  href="#section-bulletin-buttonbar"
                  className="pure-button tooltip"
                  title={this.props.intl.formatMessage({
                    id: "bulletin:map:info:details:hover"
                  })}
                  data-scroll=""
                >
                  {new Parser().parse(
                    this.props.intl.formatHTMLMessage({
                      id: "bulletin:map:info:details"
                    })
                  )}
                  <span className="icon-arrow-down" />
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default inject("locale")(injectIntl(observer(BulletinMap)));
