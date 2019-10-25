import React from "react";
import L from "leaflet";
import { GeoJSON, Pane, Polygon } from "react-leaflet";

export default class BulletinVectorLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      over: false
    };
  }

  handleClickRegion(bid, state, e) {
    L.DomEvent.stopPropagation(e);
    if (state !== "hidden") {
      if (L.Browser.mobile) {
        const polygon = e.target;
        const center = polygon.getCenter();
        this.props.handleCenterToRegion(center);
      }
      this.props.handleSelectRegion(bid);
    }
  }

  handleMouseOut(e) {
    const bid = e.target.options.bid;
    if (!L.Browser.mobile && bid === this.state.over) {
      this.setState({ over: false });
    }
  }
  handleMouseMove(e) {
    const bid = e.target.options.bid;
    if (
      //e.target._containsPoint(e.containerPoint) &&
      !L.Browser.mobile &&
      bid !== this.state.over
    ) {
      this.setState({ over: bid });
    }
  }

  get uniqueKey() {
    // A unique key is needed for <GeoJSON> component to indicate the need
    // for rerendering. We use the selected date and region as well as a hash
    // of the settings of avalancheproblems.
    // The hash is a binary string where '1' or '0' indicate
    // the current activity setting of a problem. The positions within the
    // binary string are determined by the (lexicographical) order of the
    // problem ids (since neither Object.values nor for .. in loops are
    // guaranteed to preserve order).
    const problemKeys = Object.keys(this.props.problems).sort();
    const problemHash = problemKeys.reduce((acc, p) => {
      return acc * 2 + (this.props.problems[p].active ? 1 : 0);
    }, 0);

    return this.props.date + this.props.activeRegion + problemHash;
  }

  renderRegion(vector, state, geometry, style, key) {
    const bid = vector.properties.bid;
    return (
      <Polygon
        key={key + bid}
        onClick={this.handleClickRegion.bind(this, bid, state)}
        bid={bid}
        onMouseMove={this.handleMouseMove.bind(this)}
        onMouseOut={this.handleMouseOut.bind(this)}
        positions={geometry}
        {...style}
        {...config.get("map.vectorOptions")}
      />
    );
  }

  render() {
    return (
      <Pane key={this.uniqueKey}>
        {// not over state regions
        this.props.regions
          .filter(vector => this.state.over !== vector.properties.bid)
          .map((vector, vi) => {
            const state = vector.properties.state;
            // setting the style for each region
            const style = Object.assign(
              {},
              config.get("map.regionStyling.all"),
              config.get("map.regionStyling." + state)
            );

            return vector.properties.latlngs.map((g, gi) => {
              return this.renderRegion(vector, state, g, style, vi + "" + gi);
            });
          })}
        {// over state region
        this.props.regions
          .filter(vector => this.state.over === vector.properties.bid)
          .map((vector, vi) => {
            const state = vector.properties.state;
            // setting the style for each region
            const style = Object.assign(
              {},
              config.get("map.regionStyling.all"),
              config.get("map.regionStyling." + state),
              config.get("map.regionStyling.mouseOver")
            );

            return vector.properties.latlngs.map((g, gi) =>
              this.renderRegion(vector, state, g, style, vi + "" + gi)
            );
          })}
      </Pane>
    );
  }
}
