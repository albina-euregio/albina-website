import React from "react";
import L from "leaflet";
import { observer } from "mobx-react";
import { GeoJSON, Pane, Polygon } from "react-leaflet";
import Base from "./../../base";

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
        this.props.handleCenterToRegion(bid);
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
      e.target._containsPoint(e.containerPoint) &&
      !L.Browser.mobile &&
      bid !== this.state.over
    ) {
      this.setState({ over: bid });
    }
  }

  /*
  componentDidUpdate() {
    console.log("vector layer rendered in", Base.now() - this.t1);
  }
  */

  // checking if at least one region changed the status
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.over !== this.state.over) {
      return true;
    } else {
      const changesInRegions = this.props.regions.some(region => {
        const region2 = nextProps.regions.find(
          r => r.properties.bid === region.properties.bid
        );
        return region2
          ? region2.properties.state !== region.properties.state
          : true;
      });
      /*
      const changes = this.props.regions
        .filter(region => {
          const region2 = nextProps.regions.find(
            r => r.properties.bid === region.properties.bid
          );
          return region2
            ? region2.properties.state !== region.properties.state
            : true;
        })
        .map(region => {
          const region2 = nextProps.regions.find(
            r => r.properties.bid === region.properties.bid
          );
          return {
            id: region.properties.bid,
            oldState: region.properties.state,
            newState: region2.properties.state
          };
        });
      console.log("should", changes);
      */
      return changesInRegions;
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
    const problemKeys = Object.keys(bulletinStore.problems).sort();
    const problemHash = problemKeys.reduce((acc, p) => {
      return acc * 2 + (bulletinStore.problems[p].active ? 1 : 0);
    }, 0);

    return (
      bulletinStore.settings.date + bulletinStore.settings.region + problemHash
    );
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
    //this.t1 = Base.now();
    //console.log("rendering map");
    // this has to be refactored
    return (
      <Pane key={this.uniqueKey}>
        {this.props.regions
          .filter(vector => this.state.over !== vector.properties.bid)
          .map((vector, vi) => {
            const state = vector.properties.state;
            // setting the style for each region
            const style = Object.assign(
              {},
              config.get("map.regionStyling.all"),
              config.get("map.regionStyling." + state)
            );

            return vector.geometry.coordinates.map((g, gi) =>
              this.renderRegion(vector, state, g, style, vi + "" + gi)
            );
          })}
        {this.props.regions
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

            return vector.geometry.coordinates.map((g, gi) =>
              this.renderRegion(vector, state, g, style, vi + "" + gi)
            );
          })}
      </Pane>
    );
  }
}
