import React from "react";
import { FeatureGroup } from "react-leaflet";
import DivIcon from 'react-leaflet-div-icon';

export default class GridOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  getColor(value) {
    const v = parseFloat(value);
    const colors = Object.values(this.props.item.colors);

    let color = colors[0];
    this.props.item.thresholds.forEach((tr, i) => {
      if(v > tr) {
        console.log('TR: ' + JSON.stringify(tr));
        color = colors[i + 1];
      }
    });

    console.log('COLOR: ' + color);
    return color;
  }

  renderMarkerTooltip(point) {
    return (
      <tbody>
        {
          this.props.item.displayedItems.map((dItemId) => {
            const unit = this.props.grid.definitions.units[dItemId] || "";
            const value = point.properties[dItemId] || "";
            return (<tr key={dItemId}><td><b>{value + "" + unit}</b></td></tr>);
          })
        }
      </tbody>
    );
  }

  renderMarker(data, key) {
    const coords = data.geometry.coordinates;
    const value = data.properties[this.props.item.id];
    const color = this.getColor(value);
    const feature = {
      el: coords[2],
      //info: grid._tooltip(gridPoint),
      coordinates: [coords[1], coords[0]],
      data: data.properties
    };
    const selected = false; // TODO

    return (
      <DivIcon
        key={data.properties.id}
        position={feature.coordinates}>
        <svg
          className={'gridpoint ' +
            (selected ? 'gridpoint-selected' : 'gridpoint-default')}
          width={50}
          height={50}
          >
          <g transform="translate(25,25)">
            <circle className="inner"
              r={10}
              fill={"rgb(" + color + ")"}>
            </circle>
            { selected &&
              <circle className="outer" r={10}>
                <animate
                  attributeType="xml"
                  attributeName="r"
                  from={10}
                  to={25}
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite">
                </animate>
                <animate
                  attributeType="xml"
                  attributeName="opacity"
                  from="0.8"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite">
                </animate>
              </circle>
            }
            <text y="3.5" textAnchor="middle">
              {value}
            </text>
          </g>
        </svg>
      </DivIcon>
    );
  }

  render() {
    const mapBounds = this.props.mapBounds;
    const zoom = this.props.zoom;
    const gridPoints = this.props.grid.features
      .filter(point => point.properties.zoom <= zoom)
      // .filter(point => {
      //   const c = point.geometry.coordinates;
      //   return mapBounds.contains([c[1], c[0]]);
      // });

    console.log('TEST: ' + this.props.zoom + ' ' + gridPoints.length);
      // .forEach(point => {
      //   //console.log(mapBounds.contains(point.coordinates))
      //   map.gridLayer.addLayer(
      //     state.values.gridPoint === point.data.id
      //       ? point.markerSelected
      //       : point.marker
      //   );
      // });
    return (
      <FeatureGroup>
        { gridPoints.map((point, i) =>
          this.renderMarker(point, i)
        )}>
      </FeatureGroup>
    );
  }
}
