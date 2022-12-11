import React, { useState, useMemo } from "react";
import L from "leaflet";
import { Pane, Polygon, Tooltip, useMap } from "react-leaflet";
import { useIntl } from "react-intl";
import { BULLETIN_STORE } from "../../stores/bulletinStore";

type Props = {
  handleSelectRegion: (region?: string) => void;
  name: string;
  regions: typeof BULLETIN_STORE._microRegions.features;
};

const BulletinVectorLayer = (props: Props) => {
  const intl = useIntl();
  const map = useMap();
  const pane = useMemo(() => {
    return (
      <Pane name={props.name}>
        {props.regions.map((vector, vi) => {
          const bid = vector.id as string;
          const state = vector.properties.state;
          const tooltip = intl.formatMessage({
            id: "region:" + bid
          });
          const pathOptions: L.PathOptions = {
            ...config.map.regionStyling.all,
            ...config.map.regionStyling[state],
            ...config.map.vectorOptions
          };
          return vector.properties.latlngs.map((geometry, gi) => {
            return (
              <Polygon
                key={`${vi}${gi}${bid}`}
                eventHandlers={{
                  click(e) {
                    L.DomEvent.stopPropagation(e);
                    if (L.Browser.mobile) {
                      const polygon: L.Polygon = e.target;
                      const center = polygon.getCenter();
                      map.panTo(center);
                    }
                    props.handleSelectRegion(bid);
                  },
                  mouseover(e) {
                    if (!L.Browser.mobile) {
                      e.target.setStyle(config.map.regionStyling.mouseOver);
                    }
                  },
                  mouseout(e) {
                    if (!L.Browser.mobile) {
                      e.target.setStyle(config.map.regionStyling.all);
                    }
                  }
                }}
                positions={geometry}
                pathOptions={pathOptions}
              >
                {tooltip && (
                  <Tooltip pane="tooltipPane">
                    <div>{tooltip}</div>
                  </Tooltip>
                )}
              </Polygon>
            );
          });
        })}
      </Pane>
    );
  }, [props.regions]);

  return pane;
};

export default BulletinVectorLayer;
