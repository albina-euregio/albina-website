import React, { useEffect, useState } from "react";
import Cluster from "./leaflet/cluster";
import StationMarker from "../leaflet/station-marker";

const StationOverlay = props => {
  const [activeMarkerPos, setActiveMarkerPos] = useState(null);

  const [spiderfiedMarkers, setSpiderfiedMarkers] = useState(null);

  useEffect(() => {
    if (props.onLoad) props.onLoad();
    else if (props.onLoading) props.onLoading();

    return () => {};
  });

  const getColor = value => {
    const v = parseFloat(value);
    const colors = Object.values(props.item.colors);
    //console.log("StationOverlay->getColor#1", value, props.item.colors);
    let color = colors[0];
    props.item.thresholds.forEach((tr, i) => {
      if (v > tr) {
        color = colors[i + 1];
      }
    });
    return color;
  };

  const handleActiveMarkerPositionUpdate = pos => {
    //console.log("handleActiveMarkerPositionUpdate qqq3", pos);
    setActiveMarkerPos(pos);
  };

  const handleSpiderfiedMarkers = list => {
    //console.log("handleSpiderfiedMarkers ggg3", list);
    if (Array.isArray(list) && list.length > 0) {
      setSpiderfiedMarkers(list);
    } else {
      setSpiderfiedMarkers(null);
      activeMarkerPos(null);
    }
  };

  const renderMarker = (data, features, pos = null) => {
    if (
      (data.date === undefined || data[props.itemId] === undefined) &&
      props.itemId !== "any"
    )
      return;

    // console.log(
    //   "station-overlay->renderMarker aaa",
    //   props.itemId
    //   props.item.colors ||
    //     getColor(Math.round(data[props.itemId])),
    //   data,
    //   data[props.itemId]
    // );

    const value = Math.round(data[props.itemId]);
    const coordinates = pos
      ? [pos.lat, pos.lng]
      : [data.geometry.coordinates[1], data.geometry.coordinates[0]];
    const markerData = {
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
    // console.log(
    //   "station-overlay->renderMarker qqq",
    //   props.itemId + "-" + data.id
    // );
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
          //console.log("onClick ggg2 #1", data.id, state.spiderfiedMarkers);
          // if (data && data.id) {
          //   if (
          //     !state.spiderfiedMarkers ||
          //     state.spiderfiedMarkers.indexOf(data.id) < 0
          //   ) {
          //     // only handle click events for markers outside of cluster -
          //     // other markers will be handled by cluster's click-event-handler
          //     //console.log("onClick ggg2 #2", state.spiderfiedMarkers);
          //     //handleSpiderfiedMarkers(null);
          //     //props.onMarkerSelected(data);
          //   }
          // }
          if (data.id) props.onMarkerSelected(data);
        }}
      />
    );
  };

  //let sPl = props.features ? props.features.find(feature => feature?.name == "Tannheim") : null;
  //console.log("station-overlay->render qq", props.selectedFeature?.id, sPl?.name, sPl?.properties.LT);
  //console.log("station-overlay->render aaa", props.selectedFeature, props.features);
  const points = props.features.filter(
    point => props.itemId === "any" || point[props.itemId] !== false
  );

  // const selectedFeature = props.selectedFeature
  //   ? points.find(point => point.id == props.selectedFeature.id)
  //   : null;

  //console.log("render qqq3", props, points);

  return (
    <div>
      <Cluster
        item={props.item}
        tooltip={true}
        spiderfiedMarkers={handleSpiderfiedMarkers}
        onActiveMarkerPositionUpdate={handleActiveMarkerPositionUpdate}
        // onMarkerSelected={props.onMarkerSelected}
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
