import React from "react";
import L from "leaflet";
import { observer } from "mobx-react";
import { GeoJSON, Pane, Polygon } from "react-leaflet";

@observer
export default class BulletinVectorLayer extends React.Component {
  /*
  componentDidMount(props) {
    this.layer = this.refs.feature.leafletElement;

    // Set click event hander on leaflet feature instead of using the
    // react-leaflet component in the render method below. Otherwise, stopping
    // event propagation will not work :/
    this.layer.eachLayer(l => {
      l.on("click", e => {
        // stop event propagation to prevent the map from getting a click event
        // this would otherwise trigger an immediate deselection of the feature
        L.DomEvent.stopPropagation(e);
        this.props.handleSelectFeature(l.feature.properties.bid);
      });
    });
  }
*/

  shouldComponentUpdate() {
    return true;
  }

  get uniqueKey() {
    // A unique key is needed for <GeoJSON> component to indicate the need
    // for rerendering. We use the date and a hash of the settings of
    // avalancheproblems. The hash is a binary string where '1' or '0' indicate
    // the current activity setting of a problem. The positions within the
    // binary string are determined by the (lexicographical) order of the
    // problem ids (since neither Object.values nor for .. in loops are
    // guaranteed to preserve order).
    const problemKeys = Object.keys(bulletinStore.problems).sort();
    const problemHash = problemKeys.reduce((acc, p) => {
      return acc * 2 + (bulletinStore.problems[p].active ? 1 : 0);
    }, 0);
    return bulletinStore.settings.date + problemHash;
  }

  render() {
    console.log("vector renders");
    return (
      <Pane key={this.uniqueKey}>
        {this.props.regions.map((vector, vi) => {
          const state = vector.properties.state;
          const style = Object.assign(
            {},
            config.get("map.regionStyling.all"),
            config.get("map.regionStyling." + state)
          );
          console.log(style);
          return (
            <Polygon
              key={vi}
              positions={vector.geometry.coordinates[0]}
              {...style}
            />
          );
        })}
      </Pane>
    );
  }
}
