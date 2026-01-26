import React, { useMemo, useState } from "react";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";

import "leaflet";
import "leaflet.sync";
import { DomEvent } from "leaflet";
import LeafletMap from "../leaflet/leaflet-map";
import BulletinMapDetails from "./bulletin-map-details";
import { preprocessContent } from "../../util/htmlParser";
import type {
  AvalancheProblemType,
  BulletinCollection,
  Status
} from "../../stores/bulletin";
import { scrollIntoView } from "../../util/scrollIntoView";
import { DangerRatings, PbfLayer, PbfLayerOverlay } from "../leaflet/pbf-map";
import { PbfRegionState } from "../leaflet/pbf-region-state";
import {
  isOneDangerRating as isOneDangerRating0,
  ValidTimePeriod
} from "../../stores/bulletin";
import { useMapEvent } from "react-leaflet";
import { useStore } from "@nanostores/react";
import { eawsRegion } from "../../stores/eawsRegions";

interface Props {
  activeBulletinCollection: BulletinCollection;
  problems: Record<AvalancheProblemType, { highlighted: boolean }>;
  status: Status;
  region: string;
  validTimePeriod: ValidTimePeriod;
  date: Temporal.PlainDate;
  handleSelectRegion: (region: string) => void;
  onMapInit: (map: L.Map) => void;
  onSelectTimePeriod: (timePeriod: string) => void;
}

const BulletinMap = (props: Props) => {
  const intl = useIntl();
  const isOneDangerRating = useStore(isOneDangerRating0);
  const language = intl.locale.slice(0, 2);
  const [regionMouseover, setRegionMouseover] = useState("");

  function RegionClickHandler(): null {
    useMapEvent("click", () => props.handleSelectRegion(""));
    return null;
  }

  const styleOverMap = () => {
    return {
      zIndex: 1000
    };
  };

  const regionState = useMemo(
    () => (
      <PbfRegionState
        activeBulletinCollection={props.activeBulletinCollection}
        problems={props.problems}
        region={props.region}
        regionMouseover={regionMouseover}
        validTimePeriod={props.validTimePeriod}
      />
    ),
    [
      props.activeBulletinCollection,
      props.problems,
      props.region,
      props.validTimePeriod,
      regionMouseover
    ]
  );

  const getMapOverlays = () => {
    const overlays = [<RegionClickHandler key="region-click-handler" />];
    overlays.push(
      <PbfLayer
        key={`eaws-regions-${props.validTimePeriod}-${props.date}-${props.status}`}
        date={props.date}
        isOneDangerRating={isOneDangerRating}
        handleSelectRegion={props.handleSelectRegion}
        validTimePeriod={props.validTimePeriod}
      >
        {props.activeBulletinCollection && (
          <DangerRatings
            maxDangerRatings={props.activeBulletinCollection.maxDangerRatings}
          />
        )}
        {props.activeBulletinCollection?.eawsMaxDangerRatings && (
          <DangerRatings
            maxDangerRatings={
              props.activeBulletinCollection.eawsMaxDangerRatings
            }
          />
        )}
      </PbfLayer>
    );
    overlays.push(
      <PbfLayerOverlay
        key={`eaws-regions-${props.validTimePeriod}-${props.date}-${props.status}-overlay`}
        date={props.date}
        validTimePeriod={props.validTimePeriod}
        eventHandlers={{
          click(e) {
            DomEvent.stop(e);
            props.handleSelectRegion(e.sourceTarget.properties.id);
          },
          pointerover(e) {
            requestAnimationFrame(() =>
              setRegionMouseover(e.sourceTarget.properties.id)
            );
          },
          pointerout(e) {
            requestAnimationFrame(() =>
              setRegionMouseover(id =>
                id === e.sourceTarget.properties.id ? "" : id
              )
            );
          }
        }}
      >
        {regionState}
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
    const activeEaws = eawsRegion(props.region);
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
          unselectRegion={() => props.handleSelectRegion("")}
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
        <div>
          <a
            href="#"
            onClick={() => props.handleSelectRegion("")}
            className="bulletin-map-details-close icon-close"
          >
            <span className="is-visually-hidden">
              {intl.formatMessage({ id: "bulletin:map:details:close" })}
            </span>
          </a>

          <p
            key={`eaws-name-${country}`}
            className="bulletin-report-region-name"
          >
            <span className="bulletin-report-region-name-country">
              {intl.formatMessage({ id: "region:" + country })}
            </span>
            <span>&nbsp;/ </span>
            <span className="bulletin-report-region-name-region">
              {intl.formatMessage({ id: "region:" + region })}
            </span>
          </p>
        </div>
      );
      (activeEaws.aws || []).forEach((aws, index) => {
        const href = aws.url[language] || Object.values(aws.url)[0];
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
        data-iframe-ignore
      >
        <LeafletMap
          loaded={true}
          overlays={getMapOverlays()}
          mapConfigOverride={{}}
          tileLayerConfigOverride={{}}
          gestureHandling={true}
          onInit={props.onMapInit}
        />
        {getBulletinMapDetails()}

        {props.validTimePeriod && (
          <p className="bulletin-map-daytime">
            <span className="primary label">
              {!config.bulletin.switchBetweenTimePeriods
                ? intl.formatMessage({
                    id: `bulletin:header:${props.validTimePeriod}`
                  })
                : (["earlier", "later"] as const).map(timePeriod => (
                    <a
                      key={timePeriod}
                      href="#"
                      className={
                        "toggle-link" +
                        (props.validTimePeriod === timePeriod ? " active" : "")
                      }
                      onClick={() => props.onSelectTimePeriod(timePeriod)}
                    >
                      {intl.formatMessage({
                        id: `bulletin:header:${timePeriod}`
                      })}
                    </a>
                  ))}
            </span>
          </p>
        )}
      </div>
    </section>
  );
};

export default BulletinMap;
