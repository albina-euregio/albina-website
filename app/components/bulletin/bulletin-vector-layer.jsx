import React from "react";
import L from "leaflet";
import { Pane, Polygon, Tooltip } from "react-leaflet";
import { injectIntl } from "react-intl";

export class BulletinVectorLayer extends React.Component {
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

  render() {
    return (
      <Pane key={this.uniqueKey}>
        {this.props.regions.map((vector, vi) => {
          const bid = vector.id;
          const state = vector.properties.state;
          // setting the style for each region
          const style = Object.assign(
            {},
            config.map.regionStyling.all,
            config.map.regionStyling[state],
            bid === this.state.over ? config.map.regionStyling.mouseOver : {}
          );
          const tooltip = this.props.intl.formatMessage({
            id: "region:" + bid
          });

          return vector.properties.latlngs.map((geometry, gi) => (
            <Polygon
              key={`${vi}${gi}${bid}`}
              onClick={this.handleClickRegion.bind(this, bid, state)}
              bid={bid}
              onMouseMove={this.handleMouseMove.bind(this)}
              onMouseOut={this.handleMouseOut.bind(this)}
              positions={geometry}
              {...style}
              {...config.map.vectorOptions}
            >
              {tooltip && (
                <Tooltip>
                  <div>{tooltip}</div>
                </Tooltip>
              )}
            </Polygon>
          ));
        })}
      </Pane>
    );
  }
}

export default injectIntl(BulletinVectorLayer);
