import React, { useEffect } from "react";
import StationMarker, {
  type StationMarkerData
} from "../leaflet/station-marker";
import { StationData } from "../../stores/stationDataStore";
import { Domain, DomainId } from "../../stores/weatherMapStore";

interface Props {
  onLoad?: () => void;
  onLoading?: () => void;
  item: Domain["item"];
  itemId: "any" | DomainId | string;
  selectedFeature?: { id: string };
  onMarkerSelected: (arg0: any) => void;
  features: StationData[] | any[];
  showMarkersWithoutValue?: boolean;
  useWeatherStationIcon?: boolean;
}

const StationOverlay = (props: Props) => {
  useEffect(() => {
    if (props.onLoad) props.onLoad();
    else if (props.onLoading) props.onLoading();

    return () => {};
  });

  const getColor = (value: number | string) => {
    const v = parseFloat(value as string);
    const colors = Object.values(props.item.colors);

    let color = colors[0];
    props.item.thresholds.forEach((tr, i) => {
      if (v > tr) {
        color = colors[i + 1];
      }
    });
    return color;
  };

  const renderMarker = (
    data: StationData | any
  ): React.ReactElement<typeof StationMarker> | null => {
    // For "any" mode (used by observers), don't show parameter values
    const isAnyMode = props.itemId === "any";
    const rawValue = isAnyMode ? 0 : data[props.itemId as any];
    const hasValue =
      rawValue !== undefined && rawValue !== null && rawValue !== false;

    // If showMarkersWithoutValue is false (weather-maps), skip markers without values
    if (!props.showMarkersWithoutValue && !isAnyMode && !hasValue) {
      return null;
    }

    // Round temperature to 1 decimal, others to 0 decimals
    const shouldRound =
      props.itemId &&
      (props.itemId.includes("TA") ||
        props.itemId === "TD" ||
        props.itemId === "TSS");
    const value = isAnyMode
      ? ""
      : !hasValue
        ? ""
        : shouldRound
          ? Math.round(rawValue * 10) / 10
          : Math.round(rawValue);

    const coordinates: L.LatLngExpression = [
      data.geometry.coordinates[1],
      data.geometry.coordinates[0]
    ];
    const markerData: StationMarkerData = {
      id: data.id,
      name:
        data.name +
        " " +
        (data.province ? `(${data.province}) ` : "") +
        data.geometry.coordinates[2] +
        "m",
      detail: isAnyMode ? "" : hasValue ? value + " " + props.item.units : "-",
      operator: data.properties?.operator || undefined,
      plainName: data.name,
      value: value,
      plot: data.plot || undefined
    };

    return (
      <StationMarker
        type="station"
        key={props.itemId + "-" + data.id}
        itemId={props.itemId}
        data={markerData}
        stationName={data.name}
        tooltip={data.name}
        coordinates={coordinates}
        iconAnchor={[12.5, 12.5]}
        value={value}
        selected={
          props.selectedFeature ? data.id == props.selectedFeature.id : false
        }
        color={
          isAnyMode
            ? (Object.values(props.item.colors)[0] as any)
            : hasValue
              ? getColor(value)
              : [200, 200, 200]
        }
        dataType="analyse"
        className="station-marker"
        direction={
          !isAnyMode && props.item.direction && value >= 3.5
            ? data[props.item.direction as any]
            : false
        }
        onClick={data => {
          if (data.id) props.onMarkerSelected(data);
        }}
        useWeatherStationIcon={props.useWeatherStationIcon}
      />
    );
  };

  return props.features
    .filter(
      point => props.itemId === "any" || point[props.itemId as any] !== false
    )
    .map(point => renderMarker(point));
};

export default StationOverlay;
