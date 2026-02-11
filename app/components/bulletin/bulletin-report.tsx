import React, {
  type FunctionComponent,
  Suspense,
  useState,
  useMemo,
  useEffect
} from "react";
import DiffMatchPatch from "diff-match-patch";
import { FormattedMessage, useIntl } from "../../i18n";
import DangerPatternItem from "./danger-pattern-item";
import BulletinDaytimeReport, {
  compareDangerRatings,
  compareRegions
} from "./bulletin-daytime-report";
import { compareAvalancheProblem } from "./bulletin-problem-item";
import SynthesizedBulletin from "./synthesized-bulletin";
import { LONG_DATE_FORMAT } from "../../util/date";
import { getWarnlevelNumber } from "../../util/warn-levels";
const BulletinGlossaryText = React.lazy(
  () => import("./bulletin-glossary-text")
);
import {
  Bulletin,
  hasDaytimeDependency,
  getDangerPatterns
} from "../../stores/bulletin";
import { scrollIntoView } from "../../util/scrollIntoView";
import { wordDiff } from "../../util/wordDiff";
import { Tooltip } from "../tooltips/tooltip.tsx";
import { useStore } from "@nanostores/react";
import { $province } from "../../appStore.ts";
import LeafletMap from "../leaflet/leaflet-map";
import StationOverlay from "../weather/station-overlay";
import { useStationData } from "../../stores/stationDataStore";
import { AVAILABLE_PARAMETERS } from "../weather/station-parameter-control";
import WeatherStationDialog, {
  useStationId
} from "../dialogs/weather-station-dialog";

const LocalizedText: FunctionComponent<{
  text: string;
  text170000: string;
  showDiff: 0 | 1 | 2;
}> = ({ text, text170000, showDiff }) => {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  // bulletins are loaded in correct language
  if (!text) return <></>;
  text = text.replace(/&lt;br\/&gt;/g, "<br/>");
  if (text !== text170000 && text170000 && showDiff > 0) {
    text = wordDiff(text170000, text)
      .map(([diff, value]) =>
        diff === DiffMatchPatch.DIFF_INSERT
          ? `<ins>${value.replace(/(<br\/>)+/g, br => `</ins>${br}<ins>`)}</ins>`
          : diff === DiffMatchPatch.DIFF_DELETE
            ? showDiff === 2
              ? `<del>${value.replace(/(<br\/>)+/g, br => `</del>${br}<del>`)}</del>`
              : ""
            : value
      )
      .join("");
  }
  return (
    <Suspense fallback={<span dangerouslySetInnerHTML={{ __html: text }} />}>
      <BulletinGlossaryText text={text} locale={lang} />
    </Suspense>
  );
};

interface Props {
  date: Temporal.PlainDate;
  region: string;
  bulletin: Bulletin;
  bulletin170000: Bulletin;
}

/**
 * This component shows the detailed bulletin report including all icons and
 * texts.
 */
/**
 * Calculate bounds from bulletin regions using their polygon boundaries
 * Looks up each region's bounds (derived from EAWS region polygons) in config
 * and calculates an encompassing bounding box for all regions in the bulletin
 */
function calculateRegionBounds(
  bulletinRegions: Array<{ regionID: string }> | undefined,
  config: any
): [[number, number], [number, number]] {
  if (!bulletinRegions || bulletinRegions.length === 0) {
    return config.map.euregioBounds;
  }

  let minLat = 90,
    maxLat = -90,
    minLng = 180,
    maxLng = -180;

  // Calculate bounds by examining each region's polygon boundary from config
  const hasValidBounds = bulletinRegions.some(bulletinRegion => {
    const regionId = bulletinRegion.regionID;
    const regionPolygonBounds = config.map[`${regionId}.bounds`];

    if (regionPolygonBounds && regionPolygonBounds.length === 2) {
      const [minBound, maxBound] = regionPolygonBounds;
      // bounds format: [[minLat, minLng], [maxLat, maxLng]]
      minLat = Math.min(minLat, minBound[0]);
      minLng = Math.min(minLng, minBound[1]);
      maxLat = Math.max(maxLat, maxBound[0]);
      maxLng = Math.max(maxLng, maxBound[1]);
      return true;
    }
    return false;
  });

  // Return encompassing bounds or fallback to Euregio bounds if no valid regions found
  if (hasValidBounds && minLat <= maxLat && minLng <= maxLng) {
    return [
      [minLat, minLng],
      [maxLat, maxLng]
    ] as [[number, number], [number, number]];
  }

  return config.map.euregioBounds;
}

function BulletinReport({ date, region, bulletin, bulletin170000 }: Props) {
  const intl = useIntl();
  const province = useStore($province);
  const [showDiff, setShowDiff] = useState<0 | 1 | 2>(0);
  const [stationId, setStationId] = useStationId();
  const dangerPatterns = getDangerPatterns(bulletin.customData);
  const dangerPatterns170000 = getDangerPatterns(bulletin170000?.customData);
  const { data: stationData, load: loadStationData } =
    useStationData("microRegion");
  const parameterConfig =
    AVAILABLE_PARAMETERS.find(p => p.id === "HS") || AVAILABLE_PARAMETERS[0];
  const regionBounds = useMemo(
    () => calculateRegionBounds(bulletin?.regions, config),
    [bulletin?.regions]
  );

  useEffect(() => {
    loadStationData();
  }, [loadStationData]);

  const isInserted = useMemo(() => {
    if (!bulletin || !bulletin170000) {
      return false;
    }
    const checks: ((b: Bulletin) => string | number)[] = [
      b => b.avalancheActivity?.highlights,
      b => b.avalancheActivity?.comment,
      b => b.snowpackStructure?.comment,
      b => b.tendency?.[0]?.highlights,
      b => b.tendency?.[0]?.tendencyType,
      b => getDangerPatterns(b.customData).join()
    ];
    return !(
      checks.every(c => c(bulletin) === c(bulletin170000)) &&
      compareRegions(bulletin.regions, bulletin170000?.regions) &&
      compareDangerRatings(
        bulletin.dangerRatings,
        bulletin170000?.dangerRatings
      ) &&
      bulletin.avalancheProblems.every(problem =>
        compareAvalancheProblem(
          problem,
          bulletin170000?.avalancheProblems.find(
            p =>
              p.problemType === problem.problemType &&
              p.validTimePeriod === problem.validTimePeriod
          )
        )
      )
    );
  }, [bulletin, bulletin170000]);

  if (!bulletin || !bulletin) {
    return <div />;
  }

  const maxWarnlevel = bulletin.dangerRatings
    .map(r => r.mainValue)
    .reduce((v1, v2) =>
      getWarnlevelNumber(v1) > getWarnlevelNumber(v2) ? v1 : v2
    );
  const classes =
    "panel field callout warning-level-" + getWarnlevelNumber(maxWarnlevel);

  const hasTendencyHighlights =
    Array.isArray(bulletin.tendency) &&
    bulletin.tendency.some(tendency => tendency.highlights);

  return (
    <>
      {!!stationData.length && (
        <WeatherStationDialog
          stationData={stationData}
          stationId={stationId}
          setStationId={setStationId}
        />
      )}
      <div>
        <section
          id={bulletin.bulletinID + "-main"}
          className="section-centered section-bulletin section-bulletin-report"
        >
          <div className={classes}>
            <header className="bulletin-report-header">
              <div>
                {isInserted && bulletin.publicationTime && (
                  <button
                    type="button"
                    className="bulletin-report-header-diff"
                    onClick={() => setShowDiff(d => (d + 1) % 3)}
                  >
                    <Tooltip
                      label={intl.formatMessage({
                        id: "bulletin:header:updated-at:tooltip"
                      })}
                    >
                      <span className="text-icon bulletin-datetime-update">
                        <span className="icon icon-update"></span>
                        <span className="text">
                          {intl.formatMessage(
                            { id: "bulletin:header:updated-at" },
                            {
                              date: intl.formatDate(bulletin.publicationTime),
                              time: intl.formatDate(bulletin.publicationTime, {
                                timeStyle: "short"
                              })
                            }
                          )}
                        </span>
                      </span>
                    </Tooltip>
                    {showDiff == 2 && (
                      <span className="icon icon-update"></span>
                    )}
                    {showDiff == 1 && (
                      <span className="icon icon-release"></span>
                    )}
                  </button>
                )}
                <p className="bulletin-report-header-meta">
                  <span>
                    <FormattedMessage
                      id="bulletin:report:headline"
                      html={true}
                      values={{
                        strong: (...msg) => <strong>{msg}</strong>,
                        date: intl.formatDate(date, LONG_DATE_FORMAT),
                        daytime: ""
                      }}
                    />
                  </span>
                </p>
                <h1 className="bulletin-report-header-danger-level">
                  <span>
                    <FormattedMessage
                      id={
                        getWarnlevelNumber(maxWarnlevel) == 0
                          ? "bulletin:report:headline2:level0"
                          : "bulletin:report:headline2"
                      }
                      values={{
                        number: getWarnlevelNumber(maxWarnlevel),
                        text: intl.formatMessage({
                          id: "danger-level:" + maxWarnlevel
                        })
                      }}
                    />
                  </span>
                </h1>
                {bulletin.source?.provider?.name && (
                  <p className="bulletin-author">
                    <FormattedMessage id="bulletin:report:provider" />
                    {": "}
                    <a
                      href={bulletin.source?.provider?.website}
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                    >
                      {bulletin.source?.provider?.name}
                    </a>
                  </p>
                )}
                <SynthesizedBulletin
                  date={date}
                  bulletin={bulletin}
                ></SynthesizedBulletin>
              </div>

              {bulletin.regions?.some(
                r =>
                  r.regionID.match(config.regionsRegex) ||
                  r.regionID.startsWith(province || "???")
              ) && (
                <div>
                  <ul className="list-inline list-buttongroup bulletin-report-header-download">
                    <li>
                      <Tooltip
                        label={intl.formatMessage({
                          id: "bulletin:linkbar:pdf:hover"
                        })}
                      >
                        <a
                          rel="noopener noreferrer nofollow"
                          target="_blank"
                          href={config.template(config.apis.bulletin.pdf, {
                            region: province ?? "EUREGIO",
                            bulletin: bulletin.bulletinID,
                            lang: intl.locale.slice(0, 2)
                          })}
                        >
                          PDF
                        </a>
                      </Tooltip>
                    </li>
                  </ul>
                </div>
              )}
            </header>

            {hasDaytimeDependency(bulletin) ? (
              [
                <BulletinDaytimeReport
                  key={"earlier"}
                  bulletin={bulletin}
                  bulletin170000={bulletin170000}
                  showDiff={showDiff}
                  date={date}
                  validTimePeriod={"earlier"}
                />,
                <BulletinDaytimeReport
                  key={"later"}
                  bulletin={bulletin}
                  bulletin170000={bulletin170000}
                  showDiff={showDiff}
                  date={date}
                  validTimePeriod={"later"}
                />
              ]
            ) : (
              <BulletinDaytimeReport
                bulletin={bulletin}
                bulletin170000={bulletin170000}
                showDiff={showDiff}
                date={date}
              />
            )}
            {bulletin.highlights && (
              <p className="bulletin-report-public-alert">
                <span className="icon-attention bulletin-report-public-alert-icon"></span>
                {bulletin.highlights}
              </p>
            )}
            <h2 className="subheader">
              <LocalizedText
                text={bulletin.avalancheActivity?.highlights}
                text170000={bulletin170000?.avalancheActivity?.highlights}
                showDiff={showDiff}
              />
            </h2>
            <p>
              <LocalizedText
                text={bulletin.avalancheActivity?.comment}
                text170000={bulletin170000?.avalancheActivity?.comment}
                showDiff={showDiff}
              />
            </p>
          </div>
        </section>
        {(hasTendencyHighlights ||
          bulletin.snowpackStructure?.comment ||
          bulletin.weatherForecast?.comment) && (
          <section
            id={bulletin.bulletinID + "-bulletin-additional"}
            className="section-centered section-bulletin section-bulletin-additional"
          >
            <div className="panel brand">
              {(dangerPatterns.length > 0 ||
                bulletin.snowpackStructure?.comment) && (
                <div>
                  <h2 className="subheader">
                    <FormattedMessage id="bulletin:report:snowpack-structure:headline" />
                  </h2>
                  {dangerPatterns.length > 0 && (
                    <ul className="list-inline list-labels">
                      <li>
                        <span className="tiny heavy letterspace">
                          <FormattedMessage id="bulletin:report:danger-patterns" />
                        </span>
                      </li>
                      {dangerPatterns.map((dp, index) => (
                        <li key={index}>
                          <DangerPatternItem
                            dangerPattern={dp}
                            isInserted={
                              showDiff && !dangerPatterns170000.includes(dp)
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  <p>
                    <LocalizedText
                      text={bulletin.snowpackStructure?.comment}
                      text170000={bulletin170000?.snowpackStructure?.comment}
                      showDiff={showDiff}
                    />
                  </p>
                </div>
              )}
              {bulletin.weatherForecast?.comment && (
                <div>
                  <h2 className="subheader">
                    <FormattedMessage id="bulletin:report:weather:headline" />
                  </h2>
                  <p>
                    <LocalizedText
                      text={bulletin.weatherForecast?.comment}
                      text170000={bulletin170000?.weatherForecast?.comment}
                    />
                  </p>
                </div>
              )}
              {hasTendencyHighlights && (
                <div>
                  <h2 className="subheader">
                    <FormattedMessage id="bulletin:report:tendency:headline" />
                  </h2>
                  {bulletin.tendency.map((tendency, index) => (
                    <p key={index}>
                      <LocalizedText
                        text={tendency?.highlights}
                        text170000={
                          bulletin170000?.tendency?.[index]?.highlights
                        }
                        showDiff={showDiff}
                      />
                    </p>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
        <section
          id={bulletin.bulletinID + "-back-to-map"}
          className="section-centered section-bulletin section-bulletin-additional"
        >
          <div className="panel brand">
            <div>
              <h2 className="subheader">
                <FormattedMessage id="bulletin:report:additional:headline" />
              </h2>
              <div
                style={{
                  marginTop: "2rem",
                  height: "300px",
                  borderRadius: "4px",
                  overflow: "hidden"
                }}
              >
                <LeafletMap
                  loaded={true}
                  gestureHandling={false}
                  controls={null}
                  onInit={() => {}}
                  mapConfigOverride={{
                    bounds: regionBounds
                  }}
                  tileLayerConfigOverride={{}}
                  overlays={[
                    <StationOverlay
                      key="stations"
                      onMarkerSelected={feature => {
                        setStationId(feature.id);
                      }}
                      itemId=""
                      item={{
                        id: "HS",
                        colors: parameterConfig.colors as any,
                        thresholds: parameterConfig.thresholds,
                        units: parameterConfig.unit,
                        direction: parameterConfig.direction || false,
                        clusterOperation: "none"
                      }}
                      features={stationData}
                      showMarkersWithoutValue={true}
                      useWeatherStationIcon={true}
                    />
                  ]}
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id={bulletin.bulletinID + "-back-to-map"}
          className="section-centered section-bulletin section-bulletin-additional"
        >
          <div className="panel brand">
            <a
              href="#page-all"
              onClick={e => scrollIntoView(e)}
              className="icon-link icon-arrow-up"
            >
              <FormattedMessage id="bulletin:linkbar:back-to-map" />
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

export default BulletinReport;
