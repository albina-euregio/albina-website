import React, { useContext, useEffect, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { BulletinCollection, Status } from "../stores/bulletin";
import { AvalancheProblemType, hasDaytimeDependency } from "../stores/bulletin";

import { FormattedMessage, useIntl } from "../i18n";
import BulletinHeader from "../components/bulletin/bulletin-header";
import BulletinFooter from "../components/bulletin/bulletin-footer";

const BulletinMap = React.lazy(
  () => import("../components/bulletin/bulletin-map")
);
import BulletinLegend from "../components/bulletin/bulletin-legend";
import BulletinButtonbar from "../components/bulletin/bulletin-buttonbar";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { LONG_DATE_FORMAT } from "../util/date";
import BulletinList from "../components/bulletin/bulletin-list";
import { Suspense } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";

import { Tooltip } from "../components/tooltips/tooltip";
import ControlBar from "../components/organisms/control-bar";
import HTMLPageLoadingScreen, {
  useSlowLoading
} from "../components/organisms/html-page-loading-screen";
import { type Language, setLanguage } from "../appStore";
import { HeadlessContext } from "../contexts/HeadlessContext.tsx";

function useProblems() {
  const [problems, setProblems] = useState({
    new_snow: { highlighted: false },
    wind_slab: { highlighted: false },
    persistent_weak_layers: { highlighted: false },
    wet_snow: { highlighted: false },
    gliding_snow: { highlighted: false }
  } as Record<AvalancheProblemType, { highlighted: boolean }>);

  function toggleProblem(problemId: AvalancheProblemType) {
    if (typeof problems[problemId] === "undefined") {
      return;
    }
    setProblems({
      ...problems,
      [problemId]: { highlighted: !problems[problemId].highlighted }
    });
  }

  return { problems, toggleProblem };
}

const Bulletin = () => {
  const mapRefs = [] as L.Map[];
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [slowLoading, setLoadingStart] = useSlowLoading();
  const { problems, toggleProblem } = useProblems();
  const [region, setRegion] = useState("");
  const [latest, setLatest] = useState<Temporal.PlainDate | null>(null);
  const [status, setStatus] = useState<Status>();
  const [collection, setCollection] = useState<BulletinCollection>();
  if (["de", "en"].includes(searchParams.get("language") || "")) {
    setLanguage(searchParams.get("language") as Language);
  }
  const headless = useContext(HeadlessContext);

  useEffect(() => {
    _latestBulletinChecker();
    async function _latestBulletinChecker() {
      const today = Temporal.Now.plainDateISO();
      const tomorrow = Temporal.Now.plainDateISO().add({ days: 1 });
      const status = await new BulletinCollection(tomorrow, lang).loadStatus();
      setLatest(status === "ok" ? tomorrow : today);
      window.setTimeout(
        () => _latestBulletinChecker(),
        config.bulletin.checkForLatestInterval * 60000
      );
    }
  }, [lang]);

  useEffect(() => {
    const date = params.date ? Temporal.PlainDate.from(params.date) : latest;
    if (!date) return;
    if (
      date?.toString() === collection?.date?.toString() &&
      lang === collection?.lang
    ) {
      return;
    }
    (async () => {
      setLoadingStart(Date.now());
      const collection = new BulletinCollection(date, lang);
      setStatus(collection.status);
      try {
        await Promise.all([
          collection
            .load()
            .then(() => collection.load170000())
            .then(() => collection.loadExtraBulletins()),
          collection.loadEawsBulletins()
          // collection.loadEawsProblems()
        ]);
        setStatus(collection.status);
        setCollection(collection);
      } catch (error) {
        console.error(`Cannot load bulletin for date ${date}`, error);
        collection.status = "n/a";
      }
      setStatus(collection.status);
      setCollection(collection);
    })();
  }, [
    collection?.date,
    collection?.lang,
    lang,
    latest,
    params.date,
    setLoadingStart
  ]);

  useEffect(() => setRegion(searchParams.get("region")), [searchParams]);

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
    } else {
      setSearchParams({});
    }
  };

  const handleMapInit = (map: L.Map) => {
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

  const daytimeDependency = collection?.bulletins?.some(b =>
    hasDaytimeDependency(b)
  );

  const title = intl.formatMessage({ id: "bulletin:title" });
  const shareDescription = collection
    ? title + " | " + intl.formatDate(collection.date, LONG_DATE_FORMAT)
    : intl.formatMessage({
        id: "bulletin:header:info-no-data"
      });

  const shareImage = collection?.date
    ? config.template(config.apis.bulletin.map, {
        date: collection?.date,
        publication: ".",
        file: (daytimeDependency ? "am" : "fd") + "_EUREGIO_map",
        format: ".jpg"
      })
    : "";

  const simple = () =>
    config.template(window.config.apis.bulletin.simple, {
      date: collection?.date || "latest",
      lang
    });

  if (headless) {
    document.getElementById("page-all").classList.add("headless");
  }
  if (searchParams.get("map-ratio")) {
    document.body.classList.add("with-custom-ratio");
    document.documentElement.style.setProperty(
      "--desktop-map-ratio",
      searchParams.get("map-ratio") ?? "1/1"
    );
  }

  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "bulletin:title" })} />
      <HTMLPageLoadingScreen loading={status === "pending"} />
      <BulletinHeader
        date={collection?.date}
        latestDate={latest}
        status={status}
        activeBulletinCollection={collection}
      />

      {status === "n/a" && (
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
                  <Link
                    to={`${headless ? "/headless" : ""}/blog`}
                    className="secondary pure-button"
                  >
                    {intl.formatMessage({ id: "blog:title" })}
                  </Link>
                </Tooltip>
              </p>
            </>
          }
        />
      )}
      {status === "pending" && slowLoading && (
        <ControlBar
          addClass="fade-in"
          message={
            <FormattedMessage
              id="bulletin:header:info-loading-data-slow"
              html={true}
              values={{ a: msg => <a href={simple()}>{msg}</a> }}
            />
          }
        />
      )}

      <HeadlessContext.Provider value={headless || false}>
        <Suspense fallback={<div>...</div>}>
          {daytimeDependency ? (
            <div className="bulletin-parallel-view">
              {["earlier", "later"].map((validTimePeriod, index) => (
                <BulletinMap
                  key={validTimePeriod}
                  administrateLoadingBar={index === 0}
                  handleSelectRegion={handleSelectRegion}
                  region={region}
                  status={status}
                  date={collection?.date}
                  onMapInit={handleMapInit}
                  validTimePeriod={validTimePeriod}
                  activeBulletinCollection={collection}
                  problems={problems}
                />
              ))}
            </div>
          ) : (
            <BulletinMap
              administrateLoadingBar={true}
              handleSelectRegion={handleSelectRegion}
              region={region}
              status={status}
              date={collection?.date}
              activeBulletinCollection={collection}
              problems={problems}
            />
          )}
          <BulletinLegend
            handleSelectRegion={handleSelectRegion}
            problems={problems}
            toggleProblem={toggleProblem}
          />
        </Suspense>
        <BulletinButtonbar />
        {collection?.generalHeadline && (
          <section id="section-general-headline" className="section-padding">
            <div className="section-centered">
              <h2 className="h1">{collection?.generalHeadline}</h2>
            </div>
          </section>
        )}
        {collection && (
          <BulletinList
            bulletins={collection.bulletinsWith170000}
            date={collection?.date}
            region={region}
          />
        )}
        {headless ? (
          <></>
        ) : (
          <>
            <SmShare
              image={shareImage}
              title={title}
              description={shareDescription}
            />
            <BulletinFooter />
          </>
        )}
      </HeadlessContext.Provider>
    </>
  );
};

export default Bulletin;
