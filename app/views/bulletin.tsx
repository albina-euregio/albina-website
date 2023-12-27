import React, { useEffect, useState, useRef } from "react";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import { BULLETIN_STORE } from "../stores/bulletinStore";
import { hasDaytimeDependency } from "../stores/bulletin";

import { FormattedMessage, useIntl } from "react-intl";
import BulletinHeader from "../components/bulletin/bulletin-header";
import BulletinFooter from "../components/bulletin/bulletin-footer";

const BulletinMap = React.lazy(
  () => import("../components/bulletin/bulletin-map")
);
import BulletinLegend from "../components/bulletin/bulletin-legend";
import BulletinButtonbar from "../components/bulletin/bulletin-buttonbar";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import {
  parseDate,
  LONG_DATE_FORMAT,
  dateToISODateString
} from "../util/date.js";
import BulletinList from "../components/bulletin/bulletin-list";
import { Suspense } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
  Link
} from "react-router-dom";

import "leaflet";
import "leaflet.sync";
import { Tooltip } from "../components/tooltips/tooltip";
import ControlBar from "../components/organisms/control-bar";
import HTMLPageLoadingScreen, {
  useSlowLoading
} from "../components/organisms/html-page-loading-screen";

const Bulletin = () => {
  const lastLocationRef = useRef(null);
  const mapRefs = [];
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [slowLoading, setLoadingStart] = useSlowLoading();
  BULLETIN_STORE.init();

  useEffect(() => {
    reaction(
      () => BULLETIN_STORE.latest,
      () => didUpdate()
    );
    _fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    didUpdate();
  });

  const didUpdate = () => {
    const updateConditions = [
      location !== lastLocationRef.current?.location &&
        params.date &&
        params.date != BULLETIN_STORE.settings.date,

      typeof params.date === "undefined" &&
        BULLETIN_STORE.latest &&
        BULLETIN_STORE.latest != BULLETIN_STORE.settings.date
    ];

    if (updateConditions.reduce((acc, cond) => acc || cond, false)) {
      _fetchData();
    }
    checkRegion();
    lastLocationRef.current = location;
  };

  const _fetchData = async () => {
    const startDate =
      params.date && parseDate(params.date)
        ? params.date
        : BULLETIN_STORE.latest;

    if (!params.date || params.date == BULLETIN_STORE.latest) {
      navigate({
        pathname: "/bulletin/latest",
        hash: location.hash,
        search: location.search.substring(1)
      });
    }

    setLoadingStart(Date.now());
    await BULLETIN_STORE.load(startDate);
  };

  const checkRegion = () => {
    const urlRegion = searchParams.get("region");
    const storeRegion = BULLETIN_STORE.settings.region;
    if (urlRegion !== storeRegion) {
      BULLETIN_STORE.setRegion(urlRegion);
    }
  };

  const handleSelectRegion = id => {
    if (id) {
      const oldRegion = searchParams.get("region");
      if (oldRegion !== id) {
        if (oldRegion) {
          setSearchParams({ region: id }, true);
        } else {
          setSearchParams({ region: id });
        }
      }
    } else if (BULLETIN_STORE.settings.region) {
      //todo: trans
      setSearchParams({});
    }
  };

  const handleMapInit = map => {
    if (mapRefs.length > 0) {
      [map, ...mapRefs].forEach(otherMap => {
        // patch out the slow parts of L.Map.Sync
        otherMap._selfSetView = () => {};
        otherMap._syncOnMoveend = () => {};
        otherMap._syncOnDragend = () => {};
      });
      mapRefs.forEach(otherMap => {
        map.sync(otherMap);
        otherMap.sync(map);
      });
    }

    mapRefs.push(map);
  };

  const collection = BULLETIN_STORE.activeBulletinCollection;
  const daytimeDependency = collection?.bulletins?.some(b =>
    hasDaytimeDependency(b)
  );

  const title = intl.formatMessage({ id: "bulletin:title" });
  const shareDescription = collection
    ? title + " | " + intl.formatDate(collection.date, LONG_DATE_FORMAT)
    : intl.formatMessage({
        id: "bulletin:header:info-no-data"
      });

  const shareImage =
    collection && BULLETIN_STORE.settings.date
      ? config.template(config.apis.bulletin.map, {
          date: BULLETIN_STORE.settings.date,
          publication: ".",
          file: (daytimeDependency ? "am" : "fd") + "_EUREGIO_map",
          format: ".jpg"
        })
      : "";

  const simple = () =>
    config.template(window.config.apis.bulletin.simple, {
      date: BULLETIN_STORE.settings.date
        ? dateToISODateString(parseDate(BULLETIN_STORE.settings.date))
        : "latest",
      lang: document.body.parentElement.lang
    });

  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "bulletin:title" })} />
      <HTMLPageLoadingScreen
        loading={BULLETIN_STORE.settings.status === "pending"}
      />
      <BulletinHeader
        date={BULLETIN_STORE.date}
        latestDate={BULLETIN_STORE.latestDate}
        status={BULLETIN_STORE.settings.status}
        activeBulletinCollection={BULLETIN_STORE.activeBulletinCollection}
      />

      {BULLETIN_STORE.settings.status === "n/a" && (
        <ControlBar
          addClass="fade-in"
          message={
            <>
              <p>
                <FormattedMessage id="bulletin:header:info-no-data" />
              </p>
              <p>
                <Tooltip
                  label={intl.formatMessage({
                    id: "bulletin:map:blog:button:title"
                  })}
                >
                  <Link to="/blog" className="secondary pure-button">
                    {intl.formatMessage({ id: "blog:title" })}
                  </Link>
                </Tooltip>
              </p>
            </>
          }
        />
      )}
      {BULLETIN_STORE.settings.status === "pending" && slowLoading && (
        <ControlBar
          addClass="fade-in"
          message={intl.formatMessage(
            { id: "bulletin:header:info-loading-data-slow" },
            { a: msg => <a href={simple()}>{msg}</a> }
          )}
        />
      )}

      <Suspense fallback={<div>...</div>}>
        {daytimeDependency ? (
          <div className="bulletin-parallel-view">
            {["earlier", "later"].map((validTimePeriod, index) => (
              <BulletinMap
                key={validTimePeriod}
                handleMapViewportChanged={() => {}}
                administrateLoadingBar={index === 0}
                handleSelectRegion={handleSelectRegion}
                date={params.date}
                onMapInit={handleMapInit}
                validTimePeriod={validTimePeriod}
                activeBulletin={BULLETIN_STORE.activeBulletin}
                activeBulletinCollection={
                  BULLETIN_STORE.activeBulletinCollection
                }
                activeEaws={BULLETIN_STORE.activeEaws}
                eawsRegionIds={BULLETIN_STORE.eawsRegionIds}
                getRegionState={BULLETIN_STORE.getRegionState.bind(
                  BULLETIN_STORE
                )}
                microRegionIds={BULLETIN_STORE.microRegionIds}
                settings={BULLETIN_STORE.settings}
              />
            ))}
          </div>
        ) : (
          <BulletinMap
            administrateLoadingBar={true}
            handleMapViewportChanged={() => {}}
            handleSelectRegion={handleSelectRegion}
            date={params.date}
            activeBulletin={BULLETIN_STORE.activeBulletin}
            activeBulletinCollection={BULLETIN_STORE.activeBulletinCollection}
            activeEaws={BULLETIN_STORE.activeEaws}
            eawsRegionIds={BULLETIN_STORE.eawsRegionIds}
            getRegionState={BULLETIN_STORE.getRegionState.bind(BULLETIN_STORE)}
            microRegionIds={BULLETIN_STORE.microRegionIds}
            settings={BULLETIN_STORE.settings}
          />
        )}
        <BulletinLegend
          handleSelectRegion={handleSelectRegion}
          problems={BULLETIN_STORE.problems}
          toggleProblem={BULLETIN_STORE.toggleProblem.bind(BULLETIN_STORE)}
        />
      </Suspense>
      <BulletinButtonbar showPdfDialog={collection?.bulletins?.length} />
      {collection && (
        <BulletinList
          bulletins={collection.bulletins}
          date={BULLETIN_STORE.date}
          region={BULLETIN_STORE.settings.region}
        />
      )}
      <SmShare
        image={shareImage}
        title={title}
        description={shareDescription}
      />
      <BulletinFooter />
    </>
  );
};

export default observer(Bulletin);
