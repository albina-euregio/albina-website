import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Tooltip } from "../tooltips/tooltip";

import { DomEvent } from "leaflet";
import LeafletMap from "../leaflet/leaflet-map";
import BulletinMapDetails from "./bulletin-map-details";
import { preprocessContent } from "../../util/htmlParser";

import { observer } from "mobx-react";
import { BULLETIN_STORE } from "../../stores/bulletinStore";
import { APP_STORE } from "../../appStore";
import { scroll_init } from "../../js/scroll";
import {
  DangerRatings,
  EawsDangerRatings,
  PbfLayer,
  PbfLayerOverlay,
  PbfRegionState
} from "../leaflet/pbf-map";
import { toAmPm, ValidTimePeriod } from "../../stores/bulletin";

type Props = {
  validTimePeriod: ValidTimePeriod;
  date: string;
  handleMapViewportChanged: (map: L.Map) => void;
  handleSelectRegion: (region: string) => void;
  onMapInit: (map: L.Map) => void;
};

const BulletinMap = (props: Props) => {
  const intl = useIntl();
  const [regionMouseover, setRegionMouseover] = useState("");

  useEffect(() => {
    scroll_init();
  }, []);

  const handleMapInit = map => {
    map.on("click", _click, this);
    map.on("unload", () => map.off("click", _click, this));

    if (typeof props.onMapInit === "function") {
      props.onMapInit(map);
    }
  };

  const _click = () => {
    //console.log("Bulletin-map->_click");
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

  const getMapOverlays = () => {
    const overlays = [];
    const date = BULLETIN_STORE.settings.date;
    const b = BULLETIN_STORE.activeBulletinCollection;
    overlays.push(
      <PbfLayer
        key={`eaws-regions-${props.validTimePeriod}-${date}-${BULLETIN_STORE.settings.status}`}
        date={date}
        validTimePeriod={props.validTimePeriod}
      >
        {b && <DangerRatings maxDangerRatings={b.maxDangerRatings} />}
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
        key={`eaws-regions-${props.validTimePeriod}-${date}-${BULLETIN_STORE.settings.status}-overlay`}
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
        {[
          ...BULLETIN_STORE.microRegionIds,
          ...BULLETIN_STORE.eawsRegionIds
        ].map(region => {
          const regionState =
            region === regionMouseover
              ? "mouseOver"
              : BULLETIN_STORE.getRegionState(region, props.validTimePeriod);
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
    if (BULLETIN_STORE.activeBulletin) {
      const activeBulletin = BULLETIN_STORE.activeBulletin;
      detailsClasses.push("js-active");
      res.push(
        <BulletinMapDetails
          key="details"
          bulletin={activeBulletin}
          region={intl.formatMessage({
            id: "region:" + BULLETIN_STORE.settings.region
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
              className="pure-button"
              data-scroll=""
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
    } else if (BULLETIN_STORE.activeEaws) {
      const activeEaws = BULLETIN_STORE.activeEaws;
      detailsClasses.push("js-active");
      const language = APP_STORE.language;
      const country = activeEaws.id.replace(/-.*/, "");
      const region = activeEaws.id;
      // res.push(
      //   <p>{intl.formatMessage({ id: "region:" + country })}</p>
      // );
      // res.push(
      //   <p>{intl.formatMessage({ id: "region:" + region })}</p>
      // );
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

  //console.log("bulletin-map->render", BULLETIN_STORE.settings.status);

  // if (lastDate != props.date) {
  //   console.log("bulletin-map->render:SET TO INIT #aaa",  BULLETIN_STORE.settings.status, lastDate, props.date);
  //   newLevel = "init";
  //   lastDate = props.date;
  // }

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
          loaded={BULLETIN_STORE.microRegionIds}
          onViewportChanged={props.handleMapViewportChanged}
          overlays={getMapOverlays()}
          mapConfigOverride={{}}
          tileLayerConfigOverride={{}}
          gestureHandling={true}
          onInit={handleMapInit}
        />
        {false /* hide map search */ && (
          <div style={styleOverMap()} className="bulletin-map-search">
            <div className="pure-form pure-form-search">
              <Tooltip
                label={intl.formatMessage({
                  id: "bulletin:map:search:hover"
                })}
              >
                <input
                  tabIndex="-1"
                  type="text"
                  id="input"
                  placeholder={intl.formatMessage({
                    id: "bulletin:map:search"
                  })}
                />
              </Tooltip>
              <button
                tabIndex="-1"
                href="#"
                title={intl.formatMessage({
                  id: "bulletin:map:search:label"
                })}
                className="pure-button pure-button-icon icon-search"
              >
                <span>&nbsp;</span>
              </button>
            </div>
          </div>
        )}
        {getBulletinMapDetails()}

        {props.validTimePeriod && (
          <p className="bulletin-map-daytime">
            <span className="primary label">
              {intl.formatMessage({
                id: `bulletin:header${toAmPm[props.validTimePeriod]}`
              })}
            </span>
          </p>
        )}
      </div>
    </section>
  );
};

export default observer(BulletinMap);
