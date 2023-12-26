import React, { useEffect, useState, useRef } from "react";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import { BULLETIN_STORE } from "../stores/bulletinStore";
import { hasDaytimeDependency } from "../stores/bulletin";

import { FormattedMessage, useIntl } from "react-intl";
import BulletinHeader from "../components/bulletin/bulletin-header";
import BulletinFooter from "../components/bulletin/bulletin-footer";
const BulletinMap = React.lazy(() =>
  import("../components/bulletin/bulletin-map")
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
//import { tooltip_init } from "../js/tooltip";
import BulletinList from "../components/bulletin/bulletin-list";
import { Suspense } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
  Link
} from "react-router-dom";

import "leaflet.sync";
import { Tooltip } from "../components/tooltips/tooltip";
import ControlBar from "../components/organisms/control-bar";
import HTMLPageLoadingScreen, {
  useSlowLoading
} from "../components/organisms/html-page-loading-screen";

const Bulletin = props => {
  let lastLocationRef = useRef(null);
  let mapRefs = [];
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [title] = useState("");
  const [slowLoading, setLoadingStart] = useSlowLoading();
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
        pathname: "/bulletin/latest",
        hash: location.hash,
        search: location.search.substring(1)
      });
    }

    setLoadingStart(Date.now());
    await BULLETIN_STORE.load(startDate);
  };

  const checkRegion = () => {
    let urlRegion = searchParams.get("region");
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
          // replace history when a (different) region was selected previously to avoid polluting browser history
          //.log("bulletin navigate #2", oldRegion);
          //todo: trans
          setSearchParams({ region: id }, true);
        } else {
          //console.log("bulletin navigate #3", oldRegion);
          //todo: trans
          setSearchParams({ region: id });
        }
      }
    } else if (BULLETIN_STORE.settings.region) {
      //console.log("bulletin navigate #4", BULLETIN_STORE.settings.region);
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
  // console.log("rendering bulletin ", BULLETIN_STORE.bulletins);

  const shareDescription =
    title && BULLETIN_STORE.settings.date
      ? collection
        ? title +
          " | " +
          this.props.intl.formatDate(BULLETIN_STORE.date, LONG_DATE_FORMAT)
        : intl.formatMessage({
            id: "bulletin:header:info-no-data"
          })
      : "";

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
      <BulletinHeader title={title} />

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
                highlightedRegion={highlightedRegion}
                onMapInit={handleMapInit}
                validTimePeriod={validTimePeriod}
              />
            ))}
          </div>
        ) : (
          <BulletinMap
            administrateLoadingBar={true}
            handleMapViewportChanged={() => {}}
            handleSelectRegion={handleSelectRegion}
            date={params.date}
            highlightedRegion={highlightedRegion}
          />
        )}
        <BulletinLegend handleSelectRegion={handleSelectRegion} />
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
