import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { GeoJSON } from "react-leaflet";
import { Tooltip } from "../tooltips/tooltip";

import LeafletMap from "../leaflet/leaflet-map";
import BulletinMapDetails from "./bulletin-map-details";
import BulletinVectorLayer from "./bulletin-vector-layer";
import { preprocessContent } from "../../util/htmlParser";

import { observer } from "mobx-react";
import { BULLETIN_STORE } from "../../stores/bulletinStore";
import { APP_STORE } from "../../appStore";
import { scroll_init } from "../../js/scroll";
import {
  DangerRatings,
  EawsDangerRatings,
  PbfLayer
} from "../leaflet/eaws-map";
/**
 * @typedef {object} Props
 * @prop {*} date
 * @prop {*} intl
 * @prop {"am" | "pm" | undefined} ampm
 * ... props
 *
 */
const BulletinMap = props => {
  const intl = useIntl();

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

  const getMapOverlays = () => {
    const overlays = [];
    const date = BULLETIN_STORE.settings.date;

    if (BULLETIN_STORE.eawsRegions) {
      overlays.push(
        <BulletinVectorLayer
          key="eaws-regions"
          name="eaws-regions"
          problems={BULLETIN_STORE.problems}
          date={date}
          activeRegion={BULLETIN_STORE.settings.region}
          regions={BULLETIN_STORE.eawsRegions}
          bulletin={BULLETIN_STORE.activeBulletin}
          handleSelectRegion={props.handleSelectRegion}
        />
      );
    }
    const b = BULLETIN_STORE.activeBulletinCollection;
    overlays.push(
      <PbfLayer
        key={`eaws-regions-${props.ampm}-${date}-${BULLETIN_STORE.settings.status}`}
        date={date}
        ampm={props.ampm}
      >
        {b && <DangerRatings maxDangerRatings={b.maxDangerRatings} />}
        <EawsDangerRatings date={date} />
      </PbfLayer>
    );

    if (BULLETIN_STORE.microRegions) {
      //console.log("bulletin-map push Vector xx01", "eaws-regions");
      overlays.push(
        <BulletinVectorLayer
          key="bulletin-regions"
          name="bulletin-regions"
          problems={BULLETIN_STORE.problems}
          date={BULLETIN_STORE.settings.date}
          activeRegion={BULLETIN_STORE.settings.region}
          regions={BULLETIN_STORE.microRegions}
          bulletin={BULLETIN_STORE.activeBulletin}
          handleSelectRegion={props.handleSelectRegion}
        />
      );
    }
    return overlays;
  };

  const getBulletinMapDetails = () => {
    let res = [];
    let detailsClasses = ["bulletin-map-details", "top-right"];
    const { activeBulletin, activeEaws, activeRegionName } = BULLETIN_STORE;
    if (activeBulletin) {
      detailsClasses.push("js-active");
      res.push(
        <BulletinMapDetails
          key="details"
          bulletin={activeBulletin}
          region={intl.formatMessage({
            id: "region:" + activeRegionName
          })}
          ampm={props.ampm}
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
    } else if (activeEaws) {
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
      (activeEaws.properties.aws || []).forEach((aws, index) => {
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
              className="pure-button"
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
          loaded={BULLETIN_STORE.microRegions}
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

        {props.ampm && (
          <p className="bulletin-map-daytime">
            <span className="primary label">
              {intl.formatMessage({
                id: "bulletin:header:" + props.ampm
              })}
            </span>
          </p>
        )}
      </div>
    </section>
  );
};

export default observer(BulletinMap);
