import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Tooltip } from "../tooltips/tooltip";

import { DomEvent } from "leaflet";
import LeafletMap from "../leaflet/leaflet-map";
import { eawsRegionIds, microRegionIds } from "../../stores/microRegions";
import BulletinMapDetails from "./bulletin-map-details";
import { preprocessContent } from "../../util/htmlParser";
import type {
  BulletinCollection,
  RegionState,
  Status
} from "../../stores/bulletin";
import { scrollIntoView } from "../../util/scrollIntoView";
import {
  DangerRatings,
  EawsDangerRatings,
  PbfLayer,
  PbfLayerOverlay,
  PbfRegionState
} from "../leaflet/pbf-map";
import { ValidTimePeriod } from "../../stores/bulletin";
import eawsRegionOutlines from "@eaws/outline_properties/index.json";

type Props = {
  activeBulletinCollection: BulletinCollection;
  getRegionState: (
    regionId: string,
    validTimePeriod?: ValidTimePeriod
  ) => RegionState;
  status: Status;
  region: string;
  validTimePeriod: ValidTimePeriod;
  date: string;
  handleSelectRegion: (region: string) => void;
  onMapInit: (map: L.Map) => void;
};

const BulletinMap = (props: Props) => {
  const intl = useIntl();
  const language = intl.locale.slice(0, 2);
  const [regionMouseover, setRegionMouseover] = useState("");

  const handleMapInit = (map: L.Map) => {
    map.on("click", _click, this);
    map.on("unload", () => map.off("click", _click, this));

    if (typeof props.onMapInit === "function") {
      props.onMapInit(map);
    }
  };

  const _click = () => {
    props.handleSelectRegion(null);
  };

  const styleOverMap = () => {
    return {
      zIndex: 1000
    };
  };

  const eawsRegions = Object.freeze([
    "AD",
    "AT-02",
    "AT-03",
    "AT-04",
    "AT-05",
    "AT-06",
    "AT-08",
    "CH",
    "CZ",
    "DE-BY",
    "ES-CT-L",
    "ES-CT",
    "ES",
    "FI",
    "FR",
    "GB",
    "IS",
    "IT-21",
    "IT-23",
    "IT-25",
    "IT-34",
    "IT-36",
    "IT-57",
    "NO",
    "PL",
    "PL-12",
    "SE",
    "SI",
    "SK"
  ]);

  const regionIds = useMemo(
    () => [...microRegionIds(props.date), ...eawsRegionIds(props.date)],
    [props.date]
  );

  const getMapOverlays = () => {
    const overlays = [];
    const date = props.date;
    overlays.push(
      <PbfLayer
        key={`eaws-regions-${props.validTimePeriod}-${date}-${props.status}`}
        date={date}
        validTimePeriod={props.validTimePeriod}
      >
        {props.activeBulletinCollection && (
          <DangerRatings
            maxDangerRatings={props.activeBulletinCollection.maxDangerRatings}
          />
        )}
        {date >= "2023-11-01" ? (
          <EawsDangerRatings date={date} regions={eawsRegions} />
        ) : date >= "2021-01-25" ? (
          eawsRegions.map(region => (
            <EawsDangerRatings key={region} date={date} regions={[region]} />
          ))
        ) : undefined}
      </PbfLayer>
    );
    overlays.push(
      <PbfLayerOverlay
        key={`eaws-regions-${props.validTimePeriod}-${date}-${props.status}-overlay`}
        date={date}
        validTimePeriod={props.validTimePeriod}
        eventHandlers={{
          click(e) {
            DomEvent.stop(e);
            props.handleSelectRegion(e.sourceTarget.properties.id);
          },
          mouseover(e) {
            requestAnimationFrame(() =>
              setRegionMouseover(e.sourceTarget.properties.id)
            );
          },
          mouseout(e) {
            requestAnimationFrame(() =>
              setRegionMouseover(id =>
                id === e.sourceTarget.properties.id ? "" : id
              )
            );
          }
        }}
      >
        {regionIds.map(region => {
          const regionState =
            region === regionMouseover
              ? "mouseOver"
              : props.getRegionState(region, props.validTimePeriod);
          return (
            <PbfRegionState
              key={region + regionState + props.validTimePeriod}
              region={region}
              regionState={regionState}
            />
          );
        })}
      </PbfLayerOverlay>
    );
    return overlays;
  };

  const getBulletinMapDetails = () => {
    const res = [];
    const detailsClasses = ["bulletin-map-details", "top-right"];
    const activeBulletin =
      props.activeBulletinCollection?.getBulletinForBulletinOrRegion(
        props.region
      );
    const activeEaws = eawsRegionOutlines.find(r => r.id === props.region);
    if (activeBulletin) {
      detailsClasses.push("js-active");
      res.push(
        <BulletinMapDetails
          key="details"
          bulletin={activeBulletin}
          region={intl.formatMessage({
            id: "region:" + props.region
          })}
          validTimePeriod={props.validTimePeriod}
        />
      );
      res.push(
        activeBulletin?.bulletinID && (
          <Tooltip
            key="tp-link"
            label={intl.formatMessage({
              id: "bulletin:map:info:details:hover"
            })}
          >
            <a
              tabIndex="-1"
              key="link"
              href={"#" + activeBulletin?.bulletinID}
              onClick={e => scrollIntoView(e)}
              className="pure-button"
            >
              {preprocessContent(
                intl.formatMessage({
                  id: "bulletin:map:info:details"
                })
              )}
              <span className="icon-arrow-down" />
            </a>
          </Tooltip>
        )
      );
    } else if (activeEaws) {
      detailsClasses.push("js-active");
      const country = activeEaws.id.replace(/-.*/, "");
      const region = activeEaws.id;
      res.push(
        <p key={`eaws-name-${country}`} className="bulletin-report-region-name">
          <span className="bulletin-report-region-name-country">
            {intl.formatMessage({ id: "region:" + country })}
          </span>
          <span>&nbsp;/ </span>
          <span className="bulletin-report-region-name-region">
            {intl.formatMessage({ id: "region:" + region })}
          </span>
        </p>
      );
      (activeEaws.aws || []).forEach((aws, index) => {
        const href =
          aws.url.find(url => url[language])?.[language] ||
          Object.values(aws.url[0])[0];
        res.push(
          <Tooltip
            key={`tp-eaws-link-${index}`}
            label={intl.formatMessage({
              id: "bulletin:map:info:details:hover"
            })}
          >
            <a
              tabIndex="-1"
              key={`eaws-link-${index}`}
              href={href}
              rel="noopener noreferrer"
              target="_blank"
              className={
                /ALPSOLUT|METEOMONT/.test(aws.name)
                  ? "pure-button is-de-highlighted"
                  : "pure-button"
              }
              style={{
                // override rules from node_modules/purecss-sass/vendor/assets/stylesheets/purecss/_buttons.scss
                cursor: "pointer",
                pointerEvents: "initial"
              }}
            >
              {aws.name} <span className="icon-arrow-right" />
            </a>
          </Tooltip>
        );
      });
    }

    return (
      <div style={styleOverMap()} className={detailsClasses.join(" ")}>
        {res}
      </div>
    );
  };

  return (
    <section
      id="section-bulletin-map"
      className="section section-bulletin-map"
      aria-hidden
    >
      <div
        className={
          "section-map" + (config.map.useWindowWidth ? "" : " section-centered")
        }
      >
        <LeafletMap
          loaded={props.microRegionIds}
          overlays={getMapOverlays()}
          mapConfigOverride={{}}
          tileLayerConfigOverride={{}}
          gestureHandling={true}
          onInit={handleMapInit}
        />
        {getBulletinMapDetails()}

        {props.validTimePeriod && (
          <p className="bulletin-map-daytime">
            <span className="primary label">
              {intl.formatMessage({
                id: `bulletin:header:${props.validTimePeriod}`
              })}
            </span>
          </p>
        )}
      </div>
    </section>
  );
};

export default BulletinMap;
