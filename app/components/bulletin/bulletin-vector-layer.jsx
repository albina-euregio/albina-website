import React from "react";
import L from "leaflet";
import { observer } from "mobx-react";
import { GeoJSON, Pane, Polygon } from "react-leaflet";
import Base from "./../../base";

@observer
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
      this.props.handleSelectRegion(bid);
    }
  }

  handleMouseOut(bid) {
    if (bid === this.state.over) {
      this.setState({ over: false });
    }
  }
  handleMouseMove(bid) {
    if (!L.Browser.mobile && bid !== this.state.over) {
      this.setState({ over: bid });
    }
  }

  shouldComponentUpdate() {
    return true;
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

  render() {
    const vectorOptions = config.get("map.vectorOptions");

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

            return vector.geometry.coordinates.map((g, gi) => (
              <Polygon
                key={vi + "" + gi}
                onClick={this.handleClickRegion.bind(
                  this,
                  vector.properties.bid,
                  state
                )}
                onMouseMove={this.handleMouseMove.bind(
                  this,
                  vector.properties.bid
                )}
                onMouseOut={this.handleMouseOut.bind(
                  this,
                  vector.properties.bid
                )}
                positions={g}
                {...style}
                {...vectorOptions}
              />
            ));
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

            return vector.geometry.coordinates.map((g, gi) => (
              <Polygon
                key={vi + "" + gi}
                onClick={this.handleClickRegion.bind(
                  this,
                  vector.properties.bid,
                  state
                )}
                onMouseMove={this.handleMouseMove.bind(
                  this,
                  vector.properties.bid
                )}
                onMouseOut={this.handleMouseOut.bind(
                  this,
                  vector.properties.bid
                )}
                positions={g}
                {...style}
                {...vectorOptions}
              />
            ));
          })}
      </Pane>
    );
  }
}
