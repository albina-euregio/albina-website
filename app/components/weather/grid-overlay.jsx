import React from "react";
import { FeatureGroup } from "react-leaflet";
import DivIcon from 'react-leaflet-div-icon';

class GridOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  getColor(value) {
    const v = parseFloat(value);
    const colors = Object.values(this.props.item.colors);

    let color = colors[0];
    this.props.item.thresholds.forEach((tr, i) => {
      if(v > tr) {
        color = colors[i + 1];
      }
    });

    return color;
  }

  renderMarker(data, key) {
    const value = data.properties[this.props.item.id];
    const color = this.getColor(value);
    const coordinates = [data.geometry.coordinates[1], data.geometry.coordinates[0]];
    const selected = this.props.selectedFeature && (data.properties.id == this.props.selectedFeature.id);
    const d = {
      id: data.properties.id,
      name: data.properties.name,
      detail: value + " " + this.props.item.units
    }
    return (
      <DivIcon
        key={data.properties.id}
        position={coordinates}
        onClick={(e) => {
          this.props.onMarkerSelected(d);
        }}>
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

export default GridOverlay;
