import React, { useState, useMemo } from "react";
import L from "leaflet";
import { Pane, Polygon, Tooltip } from "react-leaflet";
import { useIntl } from "react-intl";

const BulletinVectorLayer = props => {
  const intl = useIntl();
  const [over, setOver] = useState(false);

  const handleClickRegion = (bid, state, e) => {
    //console.log("BulletinVectorLayer->handleClickRegion", bid, state, e);
    L.DomEvent.stopPropagation(e);
    if (state !== "hidden") {
      if (L.Browser.mobile) {
        const polygon = e.target;
        const center = polygon.getCenter();
        props.handleCenterToRegion(center);
      }
      props.handleSelectRegion(bid);
    }
  };

  const handleMouseOut = e => {
    const bid = e.target.options.bid;
    //console.log("bulletin-vector-layer->handleMouseOut", bid);
    if (!L.Browser.mobile) {
      e.target.setStyle(config.map.regionStyling.all);
    }
  };
  const handleMouseOver = e => {
    const bid = e.target.options.bid;
    //console.log("bulletin-vector-layer->handleMouseOver", bid);
    if (
      //e.target._containsPoint(e.containerPoint) &&
      !L.Browser.mobile
    ) {
      e.target.setStyle(config.map.regionStyling.mouseOver);
    }
  };

  // const uniqueKey = () => {
  //   // A unique key is needed for <GeoJSON> component to indicate the need
  //   // for rerendering. We use the selected date and region as well as a hash
  //   // of the settings of avalancheproblems.
  //   // The hash is a binary string where '1' or '0' indicate
  //   // the current activity setting of a problem. The positions within the
  //   // binary string are determined by the (lexicographical) order of the
  //   // problem ids (since neither Object.values nor for .. in loops are
  //   // guaranteed to preserve order).
  //   const problemKeys = Object.keys(props.problems).sort();
  //   const problemHash = problemKeys.reduce((acc, p) => {
  //     return acc * 2 + (props.problems[p].active ? 1 : 0);
  //   }, 0);

  //   return props.date + props.activeRegion + problemHash;
  // };

  const pane = useMemo(() => {
    //console.log("BulletinVectorLayer->useMemo xx02", props.name, props.regions);
    return (
      <Pane name={props.name}>
        {props.regions.map((vector, vi) => {
          const bid = vector.id;
          const state = vector.properties.state;
          //console.log("bulletin-vector-layer", vector.id, over);
          // setting the style for each region
          const style = Object.assign(
            {},
            config.map.regionStyling.all,
            config.map.regionStyling[state],
            bid === over ? config.map.regionStyling.mouseOver : {}
          );

          const tooltip = intl.formatMessage({
            id: "region:" + bid
          });
          const pathOptions = { ...style, ...config.map.vectorOptions };
          // if(["IT-32-TN-08", "AT-07-02"].includes(bid)) console.log(
          //   "bulletin-vector-layer",
          //   bid,
          //   vector.properties.state,
          //   pathOptions
          // );
          return vector.properties.latlngs.map((geometry, gi) => {
            // if(["IT-32-TN-08", "AT-07-02"].includes(bid)) console.log(
            //   "bulletin-vector-layer #2", gi,
            //   geometry
            // );
            return (
              <Polygon
                key={`${vi}${gi}${bid}`}
                bid={bid}
                eventHandlers={{
                  click: handleClickRegion.bind(this, bid, state),
                  mouseover: handleMouseOver.bind(this),
                  mouseout: handleMouseOut.bind(this)
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
  }, [props.regions, over]);

  return pane;
};

export default BulletinVectorLayer;
