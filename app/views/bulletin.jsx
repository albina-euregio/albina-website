import React, { useEffect, useState, useRef } from "react";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import { BULLETIN_STORE } from "../stores/bulletinStore";
import { MAP_STORE } from "../stores/mapStore";

import { FormattedMessage, useIntl } from "react-intl";
import BulletinHeader from "../components/bulletin/bulletin-header";
import BulletinFooter from "../components/bulletin/bulletin-footer";
const BulletinMap = React.lazy(() =>
  import("../components/bulletin/bulletin-map")
);
import BulletinLegend from "../components/bulletin/bulletin-legend";
import BulletinButtonbar from "../components/bulletin/bulletin-buttonbar";
import ControlBar from "../components/organisms/control-bar.jsx";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { parseDate, dateToLongDateString } from "../util/date.js";
//import { tooltip_init } from "../js/tooltip";
import BulletinList from "../components/bulletin/bulletin-list";
import { parseSearchParams } from "../util/searchParams";
import { Suspense } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import "leaflet.sync";
import { Util } from "leaflet";
//import { scroll_init } from "../js/scroll";

const Bulletin = props => {
  let lastLocationRef = useRef(null);
  let mapRefs = [];
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [title] = useState("");
  // const [sharable, setSharable] = useState(false);
  const [highlightedRegion] = useState(null);
  BULLETIN_STORE.init();

  useEffect(() => {
    //("Bulletin->useEffect[]");
    // reaction(
    //   () => BULLETIN_STORE.settings.status
    // () => {
    //   window.setTimeout(tooltip_init, 100);
    // }
    // );
    // reaction(
    //   () => BULLETIN_STORE.settings.region
    // region => {
    //   if (region) {
    //     window.setTimeout(tooltip_init, 100);
    //   }
    // }
    // );
    reaction(
      () => BULLETIN_STORE.latest,
      () => didUpdate()
    );
    _fetchData(props);
  }, []);

  // useEffect(() => {
  //   console.log("Bulletin->useEffect[BULLETIN_STORE.activeBulletinCollection.daytimeBulletins] xx03");
  //   scroll_init();

  // }, [BULLETIN_STORE?.activeBulletinCollection?.daytimeBulletins]);

  useEffect(() => {
    //console.log("Bulletin->useEffect");
    didUpdate();
  });

  const didUpdate = () => {
    //console.log("Bulletin->didUpdate", params.date, BULLETIN_STORE.settings.date);
    const updateConditions = [
      // update when date changes to YEAR-MONTH-DAY format
      location !== lastLocationRef.current?.location &&
        params.date &&
        params.date != BULLETIN_STORE.settings.date,

      // update when date changes to "latest"
      typeof params.date === "undefined" &&
        BULLETIN_STORE.latest &&
        BULLETIN_STORE.latest != BULLETIN_STORE.settings.date
    ];

    if (updateConditions.reduce((acc, cond) => acc || cond, false)) {
      // if any update condition holds
      _fetchData(props);
    }
    checkRegion();
    lastLocationRef.current = location;
  };

  const _fetchData = async () => {
    let startDate =
      params.date && parseDate(params.date)
        ? params.date
        : BULLETIN_STORE.latest;

    //console.log("Bulletin->_fetchData",startDate);
    if (!params.date || params.date == BULLETIN_STORE.latest) {
      // update URL if necessary
      //console.log("bulletin navigate #1", params, location.hash);
      navigate({
        pathname: "/bulletin/latest" + (location.hash ? location.hash : ""),
        search: document.location.search.substring(1)
      });
    }

    try {
      await BULLETIN_STORE.load(startDate);
    } finally {
      await BULLETIN_STORE.loadEawss(startDate);
    }
  };

  const checkRegion = () => {
    let urlRegion = parseSearchParams().get("region");
    const storeRegion = BULLETIN_STORE.settings.region;
    if (urlRegion !== storeRegion) {
      BULLETIN_STORE.setRegion(urlRegion);
    }
  };

  const handleSelectRegion = id => {
    if (id) {
      const oldRegion = parseSearchParams().get("region");
      if (oldRegion !== id) {
        const search = "?region=" + encodeURIComponent(id);
        if (oldRegion) {
          // replace history when a (different) region was selected previously to avoid polluting browser history
          //.log("bulletin navigate #2", oldRegion);
          //todo: trans
          navigate({ pathname: location.pathname, search, replace: true });
        } else {
          //console.log("bulletin navigate #3", oldRegion);
          //todo: trans
          navigate({ pathname: location.pathname, search });
        }
      }
    } else if (BULLETIN_STORE.settings.region) {
      //console.log("bulletin navigate #4", BULLETIN_STORE.settings.region);
      //todo: trans
      navigate({ pathname: location.pathname, search: "" });
    }
  };

  const handleMapViewportChanged = map => {
    MAP_STORE.setMapViewport({
      zoom: map.zoom,
      center: map.center
    });
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
  // console.log("rendering bulletin ", BULLETIN_STORE.bulletins);

  const shareDescription =
    title && BULLETIN_STORE.settings.date
      ? collection
        ? title +
          " | " +
          dateToLongDateString(parseDate(BULLETIN_STORE.settings.date))
        : intl.formatMessage({
            id: "bulletin:header:info-no-data"
          })
      : "";

  const shareImage =
    collection && BULLETIN_STORE.settings.date
      ? Util.template(config.apis.bulletin.map, {
          date: BULLETIN_STORE.settings.date,
          publication: ".",
          file:
            (collection.hasDaytimeDependency() ? "am" : "fd") + "_EUREGIO_map",
          format: ".jpg"
        })
      : "";

  return (
    <>
      <HTMLHeader
        title={intl.formatMessage({ id: "bulletin:title" })}
        description={shareDescription}
        meta={{
          "og:image": shareImage,
          "og:image:width": 1890,
          "og:image:height": 1890
        }}
      />
      <BulletinHeader title={title} />

      <Suspense fallback={<div>...</div>}>
        {BULLETIN_STORE.activeBulletinCollection &&
        BULLETIN_STORE.activeBulletinCollection.hasDaytimeDependency() ? (
          <div className="bulletin-parallel-view">
            {["am", "pm"].map((daytime, index) => (
              <BulletinMap
                key={daytime}
                handleMapViewportChanged={handleMapViewportChanged}
                administrateLoadingBar={index === 0}
                handleSelectRegion={handleSelectRegion}
                date={params.date}
                highlightedRegion={highlightedRegion}
                regions={BULLETIN_STORE.getVectorRegions(daytime)}
                onMapInit={handleMapInit}
                ampm={daytime}
              />
            ))}
          </div>
        ) : (
          <BulletinMap
            administrateLoadingBar={true}
            handleMapViewportChanged={handleMapViewportChanged}
            handleSelectRegion={handleSelectRegion}
            date={params.date}
            highlightedRegion={highlightedRegion}
            regions={BULLETIN_STORE.getVectorRegions()}
          />
        )}
        <BulletinLegend
          handleSelectRegion={handleSelectRegion}
          problems={BULLETIN_STORE.problems}
        />
      </Suspense>
      <BulletinButtonbar />
      {BULLETIN_STORE.activeBulletinCollection && (
        <BulletinList
          daytimeBulletins={
            BULLETIN_STORE.activeBulletinCollection.daytimeBulletins
          }
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
