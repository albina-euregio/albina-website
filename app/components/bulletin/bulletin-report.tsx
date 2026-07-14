import React, {
  type FunctionComponent,
  Suspense,
  useState,
  useMemo
} from "react";
import DiffMatchPatch from "diff-match-patch";
import { FormattedMessage, MessageId, useIntl } from "../../i18n";
import DangerPatternItem from "./danger-pattern-item";
import BulletinDaytimeReport, {
  compareDangerRatings,
  compareRegions
} from "./bulletin-daytime-report";
import { compareAvalancheProblem } from "./bulletin-problem-item";
import SynthesizedBulletin from "./synthesized-bulletin";
import { LONG_DATE_FORMAT } from "../../util/date";
import { getWarnlevelNumber } from "../../util/warn-levels";
import TendencyIcon from "../icons/tendency-icon";

const BulletinGlossaryText = React.lazy(
  () => import("./bulletin-glossary-text")
);
import {
  Bulletin,
  BulletinPhoto,
  hasDaytimeDependency,
  getDangerPatterns,
  getBulletinPhotos
} from "../../stores/bulletin";
import { scrollIntoView } from "../../util/scrollIntoView";
import { wordDiff } from "../../util/wordDiff";
import { Tooltip } from "../tooltips/tooltip.tsx";
import { useStore } from "@nanostores/react";
import { $province } from "../../appStore.ts";
import { AdditionalBulletinInformation } from "./additional-bulletin-information.tsx";

const LocalizedText: FunctionComponent<{
  text: string;
  text170000: string;
  showDiff: 0 | 1 | 2;
}> = ({ text, text170000, showDiff }) => {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  // bulletins are loaded in correct language
  if (!text) return <></>;
  text = text.replace(/&lt;br\/&gt;/g, "<br/>").replace(/\n/g, "<br/>");
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

// One gallery card. Copyright is always visible; date + micro-region are hidden
// behind a "Details" toggle (Email 3 §3). Assigned avalanche problems are not in
// the photo data yet, so those labels are omitted for now.
const BulletinReportPictureCard: FunctionComponent<{
  photo: BulletinPhoto;
}> = ({ photo }) => {
  const [open, setOpen] = useState(false);
  const hasDetails = !!(photo.date || photo.microRegionId);
  return (
    <li className="bulletin-report-gallery-item">
      <article className="bulletin-report-picture-card">
        <a
          href={photo.url}
          className="img"
          target="_blank"
          rel="noopener noreferrer"
          title={photo.locationName}
        >
          <img
            src={photo.url}
            alt={photo.locationName}
            loading="lazy"
            decoding="async"
          />
        </a>
        <div
          className={"bulletin-report-picture-meta" + (open ? " is-open" : "")}
        >
          {photo.copyright && (
            <span className="text-icon">
              <span className="icon icon-copyright" aria-hidden="true"></span>
              <span className="text">{photo.copyright}</span>
            </span>
          )}
          {hasDetails && (
            <>
              <button
                type="button"
                className="bulletin-report-picture-toggle text-icon"
                aria-expanded={open}
                onClick={() => setOpen(o => !o)}
              >
                <span className="text button-text">
                  <FormattedMessage id="bulletin:report:picture:details" />
                </span>
                <span className="icon icon-down-open"></span>
              </button>
              <div className="bulletin-report-picture-details">
                {photo.date && (
                  <span className="text-icon">
                    <span
                      className="icon icon-calendar"
                      aria-hidden="true"
                    ></span>
                    <span className="text">{photo.date}</span>
                  </span>
                )}
                {photo.microRegionId && (
                  <span className="text-icon">
                    <span
                      className="icon icon-location-small"
                      aria-hidden="true"
                    ></span>
                    <span className="text">
                      {photo.locationName}
                      {photo.locationName && photo.microRegionId ? ", " : ""}
                      <FormattedMessage
                        id={`region:${photo.microRegionId}` as MessageId}
                      />
                    </span>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </article>
    </li>
  );
};

// TODO: trend source — LWD confirmed (2026-07-14) the "Letzte 7 Tage" series is
// the per-micro-region daily-max danger level, extracted from the last 7 days'
// bulletins (no dedicated endpoint yet). Deterministic placeholder per region so
// switching micro-region visibly changes the series; replace with the real loader.
function getTrendPlaceholder(regionId: string): number[] {
  const seed = [...regionId].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return Array.from({ length: 7 }, (_, i) => ((seed + i * 3) % 5) + 1);
}

interface Props {
  date: Temporal.PlainDate;
  bulletin: Bulletin;
  bulletin170000: Bulletin;
  region: string;
  handleSelectRegion: (id: string) => void;
}

function BulletinReport({
  date,
  region,
  bulletin,
  bulletin170000,
  handleSelectRegion
}: Props) {
  const intl = useIntl();
  const province = useStore($province);
  const [showDiff, setShowDiff] = useState<0 | 1 | 2>(0);
  const dangerPatterns = getDangerPatterns(bulletin.customData);
  const dangerPatterns170000 = getDangerPatterns(bulletin170000?.customData);
  const bulletinPhotos = getBulletinPhotos(bulletin.customData);

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

  // "Entwicklung der Lawinengefahr": the report-day danger level and the tendency
  // arrow are warning-region-wide (from the current bulletin); only the 7-day
  // history is per micro-region (LWD confirmed 2026-07-14).
  const hasTendency =
    Array.isArray(bulletin.tendency) && bulletin.tendency.length > 0;
  const todayLevel = getWarnlevelNumber(maxWarnlevel);
  const tendencyType = bulletin.tendency?.find(
    t => t.tendencyType
  )?.tendencyType;
  const tendencyRegionName = intl.formatMessage({
    id: `region:${region}` as MessageId
  });
  // Guard: this string only ships in en/de; other locales fall back to no tooltip
  // until the translation sync fills them (avoids a crash on the values path).
  const tendencyInfo = intl.formatMessage({
    id: "bulletin:report:tendency:info"
  });

  // Micro-regions this report covers, for the region switcher dropdown.
  // Selecting one navigates to that region (re-driving the per-region view).
  const regionOptions = (bulletin.regions ?? [])
    .map(r => ({
      id: r.regionID,
      name: intl.formatMessage({ id: `region:${r.regionID}` as MessageId })
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const showRegionSwitcher =
    typeof handleSelectRegion === "function" &&
    regionOptions.length > 1 &&
    regionOptions.some(o => o.id === region);

  return (
    <>
      <div>
        <section
          id={bulletin.bulletinID + "-main"}
          className="section-centered section-bulletin section-bulletin-report"
        >
          <div className={classes}>
            <header className="bulletin-report-header top-fix">
              <div className="bulletin-report-header-details">
                <span className="text-icon bulletin-datetime-release">
                  <span className="icon icon-calendar"></span>
                  <span className="text">
                    {intl.formatDate(date, LONG_DATE_FORMAT)}
                  </span>
                </span>
                {isInserted && showDiff > 0 && bulletin.publicationTime && (
                  <span className="text-icon bulletin-datetime-update">
                    <span className="icon icon-update"></span>
                    <span className="text">
                      <FormattedMessage
                        id="bulletin:header:updated-at"
                        values={{
                          date: intl.formatDate(
                            bulletin.publicationTime,
                            LONG_DATE_FORMAT
                          ),
                          time: intl.formatDate(bulletin.publicationTime, {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: false
                          })
                        }}
                      />
                    </span>
                  </span>
                )}
                <span className="text-icon bulletin-report-region-name-country">
                  <span className="icon icon-location-small"></span>
                  {showRegionSwitcher ? (
                    <>
                      <select
                        className="dropdown selectric bulletin-report-region-select"
                        value={region}
                        onChange={e => handleSelectRegion(e.target.value)}
                        aria-label={intl.formatMessage({
                          id: "bulletin:report:selected-region:hover"
                        })}
                      >
                        {regionOptions.map(o => (
                          <option key={o.id} value={o.id}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                      <span className="icon icon-down-open"></span>
                    </>
                  ) : (
                    <span className="text">
                      <FormattedMessage id={`region:${region}` as MessageId} />
                    </span>
                  )}
                </span>
                {bulletin.source?.provider?.name && (
                  <span className="text-icon bulletin-report-copyright">
                    <span className="icon icon-copyright"></span>
                    <span className="text">
                      {bulletin.source.provider.website ? (
                        <a
                          href={bulletin.source.provider.website}
                          rel="noopener noreferrer nofollow"
                          target="_blank"
                        >
                          {bulletin.source.provider.name}
                        </a>
                      ) : (
                        bulletin.source.provider.name
                      )}
                    </span>
                  </span>
                )}
              </div>

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

              <div className="bulletin-report-header-buttons">
                <ul className="list-inline list-buttongroup">
                  {isInserted && bulletin.publicationTime && (
                    <li>
                      <Tooltip
                        label={intl.formatMessage({
                          id: "bulletin:header:updated-at:tooltip"
                        })}
                      >
                        <button
                          type="button"
                          className="pure-button inverse error tooltip bulletin-report-header-diff"
                          onClick={() => setShowDiff(d => (d + 1) % 3)}
                        >
                          <span className="icon icon-show-small"></span>
                          <FormattedMessage id="bulletin:report:update" />
                        </button>
                      </Tooltip>
                    </li>
                  )}
                  <SynthesizedBulletin
                    date={date}
                    bulletin={bulletin}
                  ></SynthesizedBulletin>
                  {bulletin.regions?.some(
                    r =>
                      r.regionID.match(config.regionsRegex) ||
                      r.regionID.startsWith(province || "???")
                  ) && (
                    <li>
                      <Tooltip
                        label={intl.formatMessage({
                          id: "bulletin:linkbar:pdf:hover"
                        })}
                      >
                        <a
                          className="pure-button inverse tooltip"
                          rel="noopener noreferrer nofollow"
                          target="_blank"
                          href={config.template(config.apis.bulletin.pdf, {
                            date: bulletin.validTime?.startTime?.toISOString(),
                            region: province ?? "EUREGIO",
                            microRegionId: region,
                            lang: intl.locale.slice(0, 2)
                          })}
                        >
                          <span className="icon icon-download"></span>
                          <FormattedMessage id="bulletin:linkbar:pdf" />
                        </a>
                      </Tooltip>
                    </li>
                  )}
                </ul>
              </div>
            </header>

            {(bulletin.highlights || bulletin.travelAdvisory?.comment) && (
              <div className="bulletin-report-recommendation is-alert is-recommendation">
                {bulletin.highlights && (
                  <p className="bulletin-report-public-alert">
                    <span className="icon-attention bulletin-report-public-alert-icon"></span>
                    <span className="bulletin-report-public-alert-text">
                      {bulletin.highlights}
                    </span>
                  </p>
                )}
                {bulletin.travelAdvisory?.comment && (
                  <ul className="okay list-bulletin-report-recommendation">
                    {bulletin.travelAdvisory.comment
                      .split(/\n|&lt;br\s*\/?&gt;|<br\s*\/?>/i)
                      .map(line => line.trim())
                      .filter(Boolean)
                      .map((line, index) => (
                        <li key={index}>
                          <LocalizedText
                            text={line}
                            text170000=""
                            showDiff={0}
                          />
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}

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
            <div className="bulletin-report-text">
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
            {bulletinPhotos.length > 0 && (
              <div className="bulletin-report-pictures">
                <h2 className="subheader">
                  <FormattedMessage id="bulletin:report:current-conditions:headline" />
                </h2>
                <ul className="list-plain bulletin-report-gallery">
                  {bulletinPhotos.map((photo, index) => (
                    <BulletinReportPictureCard
                      key={photo.url + index}
                      photo={photo}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
        {(hasTendency ||
          bulletin.snowpackStructure?.comment ||
          bulletin.weatherForecast?.comment) && (
          <section
            id={bulletin.bulletinID + "-bulletin-additional"}
            className="section-centered section-bulletin section-bulletin-additional"
          >
            <div className="panel brand">
              {(dangerPatterns.length > 0 ||
                bulletin.snowpackStructure?.comment) && (
                <div className="bulletin-additional-snowpack">
                  <div className="bulletin-additional-snowpack-header">
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
                  </div>
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
                <div className="bulletin-additional-weather">
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
              {hasTendency && (
                <div className="bulletin-additional-tendency">
                  <div className="bulletin-additional-tendency-header">
                    <span className="text-icon bulletin-report-region-name-country">
                      <span className="icon icon-location-small"></span>
                      <span className="text">
                        <FormattedMessage
                          id={`region:${region}` as MessageId}
                        />
                      </span>
                    </span>
                    <h2 className="subheader">
                      <FormattedMessage id="bulletin:report:tendency:development:headline" />
                      {tendencyInfo && (
                        <Tooltip
                          label={tendencyInfo.replace(
                            /\{\s*region\s*\}/g,
                            tendencyRegionName
                          )}
                        >
                          <span className="tooltip-trigger icon-info"></span>
                        </Tooltip>
                      )}
                    </h2>
                  </div>

                  <div className="bulletin-additional-tendency-progression">
                    <div className="progression-item progression-last-week">
                      <div className="progression-value progression-week">
                        {getTrendPlaceholder(region).map((value, index) => (
                          <span key={index}>{value}</span>
                        ))}
                      </div>
                      <div className="progression-legend">
                        <FormattedMessage id="bulletin:report:tendency:last-7-days" />
                      </div>
                    </div>

                    <div className="progression-item progression-now">
                      <div
                        className={
                          "progression-value progression-warning-level warning-level-" +
                          todayLevel
                        }
                      >
                        {todayLevel}
                      </div>
                      <div className="progression-legend">
                        {intl.formatDate(date, LONG_DATE_FORMAT)}
                      </div>
                    </div>

                    {tendencyType && (
                      <div className="progression-item progression-tendency">
                        <div className="progression-value progression-arrow">
                          <TendencyIcon tendency={tendencyType} />
                        </div>
                        <div className="progression-legend">
                          <FormattedMessage id="bulletin:report:tendency:headline" />
                        </div>
                      </div>
                    )}
                  </div>

                  {hasTendencyHighlights &&
                    bulletin.tendency.map((tendency, index) => (
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

        {(import.meta.env.APP_REGION === "BETA" ||
          import.meta.env.APP_REGION === "DEV" ||
          import.meta.env.DEV) && (
          <section
            id={bulletin.bulletinID + "-back-to-map"}
            className="section-centered section-bulletin section-bulletin-additional"
          >
            <div className="panel brand">
              <AdditionalBulletinInformation
                bulletin={bulletin}
                date={date}
                region={region}
              />
            </div>
          </section>
        )}

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
