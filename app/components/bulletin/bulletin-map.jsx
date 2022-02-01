import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { GeoJSON } from "react-leaflet";
import InfoBar from "../organisms/info-bar";
import { dateToISODateString, parseDate } from "../../util/date";

import LeafletMap from "../leaflet/leaflet-map";
import { Util } from "leaflet";
import BulletinMapDetails from "./bulletin-map-details";
import BulletinVectorLayer from "./bulletin-vector-layer";
import { preprocessContent } from "../../util/htmlParser";

import { observer } from "mobx-react";
import { BULLETIN_STORE } from "../../stores/bulletinStore";
import { APP_STORE } from "../../appStore";
import { scroll_init } from "../../js/scroll";
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
  const [map, setMap] = useState(null);

  useEffect(() => {
    //console.log("BulletinMap->useEffect[props.regions] xx03");
    scroll_init();
  }, [props.regions]);

  const infoMessageLevels = useMemo(() => {
    const simple = Util.template(window.config.apis.bulletin.simple, {
      date: props.date ? dateToISODateString(parseDate(props.date)) : "",
      lang: APP_STORE.language
    });

    let levels = {
      init: {
        message: "",
        iconOn: true
      },
      ok: { message: "", keep: false }
    };

    levels.pending = {
      message: intl.formatMessage(
        { id: "bulletin:header:info-loading-data-slow" },
        { a: msg => <a href={simple}>{msg}</a> }
      ),
      iconOn: true,
      delay: 5000
    };

    levels.empty = {
      message: (
        <>
          <p>
            <FormattedMessage id="bulletin:header:info-no-data" />
          </p>
          <p>
            <Link
              to="/blog"
              title={intl.formatMessage({
                id: "bulletin:map:blog:button:title"
              })}
              className="secondary pure-button tooltip"
            >
              {intl.formatMessage({ id: "blog:title" })}
            </Link>
          </p>
        </>
      ),
      keep: false
    };
    return levels;
  }, [props.date]);

  const handleMapInit = map => {
    setMap(map);

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

    if (BULLETIN_STORE.eawsRegions) {
      overlays.push(
        <BulletinVectorLayer
          key="eaws-regions"
          name="eaws-regions"
          problems={BULLETIN_STORE.problems}
          date={BULLETIN_STORE.settings.date}
          activeRegion={BULLETIN_STORE.settings.region}
          regions={BULLETIN_STORE.eawsRegions}
          bulletin={BULLETIN_STORE.activeBulletin}
          handleSelectRegion={props.handleSelectRegion}
          handleCenterToRegion={center => map.panTo(center)}
        />
      );
    }

    const { activeEawsBulletins } = BULLETIN_STORE;
    if (BULLETIN_STORE.settings.eawsCount && activeEawsBulletins) {
      overlays.push(
        <GeoJSON
          // only a different key triggers layer update, see https://github.com/PaulLeCam/react-leaflet/issues/332
          key={`eaws-bulletins-${activeEawsBulletins.name}`}
          data={activeEawsBulletins}
          pane="mapPane"
          style={feature =>
            this.props.ampm === "am"
              ? feature.properties.amStyle
              : this.props.ampm === "pm"
              ? feature.properties.pmStyle
              : feature.properties.style
          }
        />
      );
    }

    const b = BULLETIN_STORE.activeBulletinCollection;
    if (b) {
      overlays.push(
        <GeoJSON
          // only a different key triggers layer update, see https://github.com/PaulLeCam/react-leaflet/issues/332
          key={`bulletin-regions-${props.ampm}-${b.date}-${b.status}`}
          data={BULLETIN_STORE.microRegionsElevation}
          pane="mapPane"
          style={feature =>
            BULLETIN_STORE.getMicroElevationStyle(feature, props.ampm)
          }
        />
      );
    }

    if (props.regions) {
      console.log("bulletin-map push Vector xx01", "eaws-regions");
      overlays.push(
        <BulletinVectorLayer
          key="bulletin-regions"
          name="bulletin-regions"
          problems={BULLETIN_STORE.problems}
          date={BULLETIN_STORE.settings.date}
          activeRegion={BULLETIN_STORE.settings.region}
          regions={props.regions}
          bulletin={BULLETIN_STORE.activeBulletin}
          handleSelectRegion={props.handleSelectRegion}
          handleCenterToRegion={center => map.panTo(center)}
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
        activeBulletin?.id && (
          <a
            tabIndex="-1"
            key="link"
            href={"#" + activeBulletin?.id}
            className="pure-button tooltip"
            title={intl.formatMessage({
              id: "bulletin:map:info:details:hover"
            })}
            data-scroll=""
          >
            {preprocessContent(
              intl.formatMessage({
                id: "bulletin:map:info:details"
              })
            )}
            <span className="icon-arrow-down" />
          </a>
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
          <a
            tabIndex="-1"
            key={`eaws-link-${index}`}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            className="pure-button tooltip"
            title={intl.formatMessage({
              id: "bulletin:map:info:details:hover"
            })}
          >
            {aws.name} <span className="icon-arrow-right" />
          </a>
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
      {props.administrateLoadingBar && (
        <InfoBar
          level={BULLETIN_STORE.settings.status}
          levels={infoMessageLevels}
        />
      )}
      <div
        className={
          "section-map" + (config.map.useWindowWidth ? "" : " section-centered")
        }
      >
        <LeafletMap
          loaded={props.regions}
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
              <input
                tabIndex="-1"
                type="text"
                id="input"
                className="tooltip"
                placeholder={intl.formatMessage({
                  id: "bulletin:map:search"
                })}
                title={intl.formatMessage({
                  id: "bulletin:map:search:hover"
                })}
              />
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
