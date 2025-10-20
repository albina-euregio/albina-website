import React, { useEffect, useState } from "react";
import Cluster from "./leaflet/cluster";
import StationMarker, {
  type StationMarkerData
} from "../leaflet/station-marker";
import { StationData } from "../../stores/stationDataStore";
import { Domain, DomainId } from "../../stores/weatherMapStore";

interface Props {
  onLoad: () => void;
  onLoading: () => void;
  item: Domain["item"];
  itemId: "any" | DomainId;
  selectedFeature: { id: string };
  onMarkerSelected: (arg0: unknown) => void;
  features: StationData[];
}

const StationOverlay = (props: Props) => {
  const [activeMarkerPos, setActiveMarkerPos] = useState(null);

  const [, setSpiderfiedMarkers] = useState(null);

  useEffect(() => {
    if (props.onLoad) props.onLoad();
    else if (props.onLoading) props.onLoading();

    return () => {};
  });

  const getColor = value => {
    const v = parseFloat(value);
    const colors = Object.values(props.item.colors);

    let color = colors[0];
    props.item.thresholds.forEach((tr, i) => {
      if (v > tr) {
        color = colors[i + 1];
      }
    });
    return color;
  };

  const handleActiveMarkerPositionUpdate = pos => {
    setActiveMarkerPos(pos);
  };

  const handleSpiderfiedMarkers = list => {
    if (Array.isArray(list) && list.length > 0) {
      setSpiderfiedMarkers(list);
    } else {
      setSpiderfiedMarkers(null);
      activeMarkerPos(null);
    }
  };

  const renderMarker = (
    data: StationData,
    features: StationData[],
    pos: L.LatLng | L.LatLngLiteral | null = null
  ): React.ReactElement<typeof StationMarker> => {
    if (
      (data.date === undefined || data[props.itemId] === undefined) &&
      props.itemId !== "any"
    )
      return;

    const value = Math.round(data[props.itemId]);
    const coordinates: L.LatLngExpression = pos
      ? [pos.lat, pos.lng]
      : [data.geometry.coordinates[1], data.geometry.coordinates[0]];
    const markerData: StationMarkerData = {
      id: data.id,
      name:
        data.name +
        " " +
        (data.region ? `(${data.region}) ` : "") +
        data.geometry.coordinates[2] +
        "m",
      detail: value + " " + props.item.units,
      operator: data.operator,
      plainName: data.name,
      value: value,
      plot: data.plot
    };

    return (
      <StationMarker
        type="station"
        key={props.itemId + "-" + data.id}
        itemId={props.itemId}
        data={markerData}
        stationId={data.id}
        tooltip={data.name}
        coordinates={coordinates}
        iconAnchor={[12.5, 12.5]}
        value={value}
        selected={props.selectedFeature && data.id == props.selectedFeature.id}
        color={getColor(value)}
        direction={
          props.item.direction && value >= 3.5
            ? data[props.item.direction]
            : false
        }
        onClick={data => {
          if (data.id) props.onMarkerSelected(data);
        }}
      />
    );
  };

  const points = props.features.filter(
    point => props.itemId === "any" || point[props.itemId] !== false
  );

  return (
    <div>
      <Cluster
        item={props.item}
        tooltip={true}
        spiderfiedMarkers={handleSpiderfiedMarkers}
        onActiveMarkerPositionUpdate={handleActiveMarkerPositionUpdate}
      >
        {points.map(point => renderMarker(point, props.features))}
      </Cluster>
      {/* {selectedFeature &&
        renderMarker(selectedFeature, state.activeMarkerPos)} */}
      {/* {selectedFeature &&
        state.spiderfiedMarkers &&
        renderPositionMarker(selectedFeature)} */}
    </div>
  );
};

export default StationOverlay;
