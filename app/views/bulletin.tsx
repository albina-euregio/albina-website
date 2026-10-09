import React, { useEffect, useState } from "react";
import { BulletinCollection, Status } from "../stores/bulletin";
import { AvalancheProblemType, hasDaytimeDependency } from "../stores/bulletin";

import { FormattedMessage, useIntl } from "../i18n";
import BulletinHeader from "../components/bulletin/bulletin-header";
import BulletinFooter from "../components/bulletin/bulletin-footer";

const BulletinMap = React.lazy(
  () => import("../components/bulletin/bulletin-map")
);
import BulletinLegendLinkbar from "../components/bulletin/bulletin-legendlinkbar";
import HTMLHeader from "../components/organisms/html-header";
import BulletinList from "../components/bulletin/bulletin-list";
import { Suspense } from "react";

import ControlBar from "../components/organisms/control-bar";
import HTMLPageLoadingScreen, {
  useSlowLoading
} from "../components/organisms/html-page-loading-screen";
import { $headless, type Language, setLanguage } from "../appStore";
import { useStore } from "@nanostores/react";
import { $router } from "../components/router";

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

// keeps content below the bulletin list from shifting while it loads
const bulletinListPlaceholder = <div style={{ minHeight: "100vh" }} />;

const Bulletin = () => {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const router = useStore($router);
  if (
    router?.route !== "home" &&
    router?.route !== "homeDate" &&
    router?.route !== "bulletin" &&
    router?.route !== "bulletinDate" &&
    router?.route !== "bulletinLatest"
  )
    throw new Error();
  const dateParam =
    router.route === "homeDate" || router.route === "bulletinDate"
      ? router.params.date
      : undefined;
  const [slowLoading, setLoadingStart] = useSlowLoading();
  const { problems } = useProblems();
  const [region, setRegion] = useState("");
  const [latest, setLatest] = useState<Temporal.PlainDate | null>(null);
  const [status, setStatus] = useState<Status>();
  const [collection, setCollection] = useState<BulletinCollection>();
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<string>("earlier");
  if (["de", "en"].includes(router.search.language || "")) {
    setLanguage(router.search.language as Language);
  }
  const headless = useStore($headless);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    _latestBulletinChecker();
    async function _latestBulletinChecker() {
      const today = Temporal.Now.plainDateISO();
      let next = today;
      if (BulletinCollection.isAfter1700()) {
        const tomorrow = Temporal.Now.plainDateISO().add({ days: 1 });
        const status = await new BulletinCollection(
          tomorrow,
          lang
        ).loadStatus();
        if (status === "ok") next = tomorrow;
      }
      if (cancelled) return;
      setLatest(next);
      timer = setTimeout(
        () => _latestBulletinChecker(),
        config.bulletin.checkForLatestInterval * 60000
      );
    }
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [lang]);

  const date = dateParam ? Temporal.PlainDate.from(dateParam) : latest;
  const dateKey = date?.toString();

  useEffect(() => {
    if (!dateKey) return;
    let ignore = false;
    (async () => {
      setLoadingStart(Date.now());
      const collection = new BulletinCollection(
        Temporal.PlainDate.from(dateKey),
        lang
      );
      setStatus(collection.status);
      try {
        await Promise.all([
          collection.load().then(() => collection.load170000()),
          collection.loadExtraBulletins(),
          collection.loadEawsBulletins()
        ]);
      } catch (error) {
        console.error(`Cannot load bulletin for date ${dateKey}`, error);
        collection.status = "n/a";
      }
      if (ignore) return;
      setStatus(collection.status);
      setCollection(collection);
    })();
    return () => {
      ignore = true;
    };
  }, [dateKey, lang, setLoadingStart]);

  useEffect(() => setRegion(router.search.region), [router.search]);

  const handleSelectRegion = (id: string) => {
    // Always replace the history entry (redirect, not push). Using openPage
    // (push) for the first selection produced a visible full re-render/blank
    // that the replace path (used for subsequent selections) does not.
    //
    // Built from router.path directly (rather than via redirectPage/
    // getPagePath, which reverse router.route into a path template): the
    // bulletin view can be reached through RegExp-based routes (homeDate,
    // bulletinDate) that have no reversible path template.
    if (id) {
      if (router.search.region !== id) {
        $router.open(
          `${router.path}?${new URLSearchParams({ region: id })}`,
          true
        );
      }
    } else {
      $router.open(router.path, true);
    }
  };

  const daytimeDependency = collection?.ownBulletins?.some(b =>
    hasDaytimeDependency(b)
  );

  const simple = () =>
    config.template(window.config.apis.bulletin.simple, {
      date: collection?.date || "latest",
      lang
    });

  // Activate the 2026 bulletin styling ([data-bulletin-version="2026"] scope in
  // _bulletin-2026.scss); scoped to the bulletin view so other pages are unaffected.
  useEffect(() => {
    const pageAll = document.getElementById("page-all");
    pageAll?.setAttribute("data-bulletin-version", "2026");
    return () => pageAll?.removeAttribute("data-bulletin-version");
  }, []);

  if (headless) {
    document.getElementById("page-all").classList.add("headless");
  }
  if (router.search["map-ratio"]) {
    document.body.classList.add("with-custom-ratio");
    document.documentElement.style.setProperty(
      "--desktop-map-ratio",
      router.search["map-ratio"] ?? "1/1"
    );
  }

  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "caaml:forecast.label" })} />
      <HTMLPageLoadingScreen loading={status === "pending"} />
      <BulletinHeader
        date={collection?.date ?? date ?? undefined}
        latestDate={latest}
        status={status}
        bulletins={collection?.bulletinsWith170000}
      />

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

      <Suspense
        fallback={
          // same size as the lazy map, avoids a layout shift
          <section className="section section-bulletin-map">
            <div className="section-map" />
          </section>
        }
      >
        <div className="bulletin-map-cta-container">
          {daytimeDependency ? (
            <div
              className={
                !config.bulletin.switchBetweenTimePeriods
                  ? "bulletin-parallel-view"
                  : "bulletin-switchable-view"
              }
            >
              {["earlier", "later"].map(
                (validTimePeriod, index) =>
                  (!config.bulletin.switchBetweenTimePeriods ||
                    validTimePeriod === selectedTimePeriod) && (
                    <BulletinMap
                      key={validTimePeriod}
                      administrateLoadingBar={index === 0}
                      handleSelectRegion={handleSelectRegion}
                      region={region}
                      status={status}
                      date={collection?.date}
                      validTimePeriod={validTimePeriod}
                      activeBulletinCollection={collection}
                      problems={problems}
                      onSelectTimePeriod={timePeriod =>
                        setSelectedTimePeriod(timePeriod)
                      }
                    />
                  )
              )}
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
        </div>
      </Suspense>
      <BulletinLegendLinkbar activeBulletinCollection={collection} />
      {collection?.generalHeadline && (
        <section id="section-general-headline" className="section-padding">
          <div className="section-centered">
            <h2 className="h1">{collection?.generalHeadline}</h2>
          </div>
        </section>
      )}
      {!collection && router.search.region && bulletinListPlaceholder}
      {collection && (
        // Own Suspense boundary: selecting the first region renders that report
        // for the first time, which lazily loads the glossary chunk/data. Without
        // a boundary here that suspend bubbles to the app-level Suspense and blanks
        // the whole page; contain it to the report area instead.
        <Suspense fallback={bulletinListPlaceholder}>
          <BulletinList
            bulletins={collection.bulletinsWith170000}
            date={collection?.date}
            region={region}
            handleSelectRegion={handleSelectRegion}
          />
        </Suspense>
      )}
      {headless ? (
        <></>
      ) : (
        <>
          <BulletinFooter />
        </>
      )}
    </>
  );
};

export default Bulletin;
