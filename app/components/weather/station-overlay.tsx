import React, { useEffect } from "react";
import StationMarker, {
  type StationMarkerData
} from "../leaflet/station-marker";
import { StationData } from "../../stores/stationDataStore";
import { Domain, DomainId } from "../../stores/weatherMapStore";
import { useIntl } from "../../i18n";
import type { ParameterType } from "./station-parameter-control";

interface Props {
  onLoad?: () => void;
  onLoading?: () => void;
  item: Domain["item"];
  itemId: "any" | DomainId | ParameterType;
  selectedFeature?: { id: string };
  onMarkerSelected: (arg0: any) => void;
  features: StationData[] | any[];
  showMarkersWithoutValue?: boolean;
}

const StationOverlay = (props: Props) => {
  const intl = useIntl();
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
    data: StationData
  ): React.ReactElement<typeof StationMarker> | null => {
    // For "any" mode (used by observers), don't show parameter values
    const isAnyMode = props.itemId === "any";
    const value = data[props.itemId];
    const hasValue = value !== undefined && value !== null && value !== false;

    // If showMarkersWithoutValue is false (weather-maps), skip markers without values
    if (!props.showMarkersWithoutValue && !hasValue) {
      return null;
    }

    // Round temperature to 1 decimal, others to 0 decimals
    const digits = /TA|TD|TSS/.test(props.itemId) ? 1 : 0;

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
      detail: !hasValue
        ? "-"
        : intl.formatNumberUnit(value, props.item.units, digits),
      operator: data.properties?.operator || undefined,
      plainName: data.name,
      value: !hasValue ? "" : intl.formatNumber(value, digits),
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
        value={markerData.value}
        selected={
          props.selectedFeature ? data.id == props.selectedFeature.id : false
        }
        color={
          isAnyMode
            ? (Object.values(props.item.colors)[0] as number[])
            : hasValue
              ? getColor(value)
              : [200, 200, 200]
        }
        dataType="analyse"
        className="station-marker"
        direction={
          props.item.direction === "DW" && value >= 3.5
            ? data[props.item.direction]
            : false
        }
        onClick={data => {
          if (data.id) props.onMarkerSelected(data);
        }}
      />
    );
  };

  return props.features
    .filter(point => point[props.itemId] !== false)
    .map(point => renderMarker(point));
};

export default StationOverlay;
