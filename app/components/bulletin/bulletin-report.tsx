import React, {
  type FunctionComponent,
  Suspense,
  useEffect,
  useRef,
  useState
} from "react";
import DiffMatchPatch from "diff-match-patch";
import { FormattedMessage, MessageId, useIntl } from "../../i18n";
import DangerPatternItem from "./danger-pattern-item";
import BulletinDaytimeReport from "./bulletin-daytime-report";
import { useSynthesizedBulletinUrl } from "./synthesized-bulletin";
import { LONG_DATE_FORMAT, LONG_DATE_FORMAT_NO_WEEKDAY } from "../../util/date";
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
  getBulletinPhotos,
  getMaxMainValue
} from "../../stores/bulletin";
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
          className="img avoid-external-icon"
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

// Nav-style micro-region switcher: inline text + chevron toggle revealing a
// floating list. Selecting a region navigates (URL-driven), re-driving the
// per-region view. Used in the report header and the tendency section.
const RegionDropdown: FunctionComponent<{
  region: string;
  options: { id: string; name: string }[];
  onSelect: (id: string) => void;
}> = ({ region, options, onSelect }) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      className={"bulletin-report-region-dropdown" + (open ? " is-open" : "")}
    >
      <button
        type="button"
        className="bulletin-report-region-toggle text"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={intl.formatMessage({
          id: "bulletin:report:selected-region:hover"
        })}
        onClick={() => setOpen(o => !o)}
      >
        <FormattedMessage id={`region:${region}` as MessageId} />
        <span className="icon icon-down-open"></span>
      </button>
      {open && (
        <ul className="list-plain bulletin-report-region-menu" role="listbox">
          {options.map(o => (
            <li key={o.id}>
              <button
                type="button"
                role="option"
                aria-selected={o.id === region}
                className={
                  "bulletin-report-region-option" +
                  (o.id === region ? " active" : "")
                }
                onClick={() => {
                  setOpen(false);
                  onSelect(o.id);
                }}
              >
                {o.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
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
  const [audioOpen, setAudioOpen] = useState(false);
  const audioUrl = useSynthesizedBulletinUrl(date, bulletin);
  const dangerPatterns = getDangerPatterns(bulletin.customData);
  const dangerPatterns170000 = getDangerPatterns(bulletin170000?.customData);
  const bulletinPhotos = getBulletinPhotos(bulletin.customData);

  if (!bulletin || !bulletin) {
    return <div />;
  }

  // "Update" status mirrors the header's "Updated" indicator: an amendment exists
  // when the 17:00 predecessor (bulletin170000, only loaded for unscheduled
  // bulletins) is present — independent of whether this micro-region changed.
  const isUpdated = !!(
    bulletin.publicationTime && bulletin170000?.publicationTime
  );

  const maxWarnlevel = getMaxMainValue(bulletin.dangerRatings);
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
                {isUpdated && showDiff > 0 && (
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
                    <RegionDropdown
                      region={region}
                      options={regionOptions}
                      onSelect={handleSelectRegion}
                    />
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
                  {isUpdated && showDiff === 0 && (
                    <li>
                      <Tooltip
                        label={intl.formatMessage({
                          id: "bulletin:header:updated-at:tooltip"
                        })}
                      >
                        <button
                          type="button"
                          className="pure-button inverse error tooltip pure-button-icon-text"
                          onClick={() => setShowDiff(2)}
                        >
                          <span className="icon icon-show-small"></span>
                          <span className="text">
                            <FormattedMessage id="bulletin:report:update" />
                          </span>
                        </button>
                      </Tooltip>
                    </li>
                  )}
                  {audioUrl && (
                    <li>
                      <Tooltip
                        label={intl.formatMessage({
                          id: "bulletin:report:listen:hover"
                        })}
                      >
                        <button
                          type="button"
                          className={
                            "pure-button inverse tooltip pure-button-icon-text" +
                            (audioOpen ? " active" : "")
                          }
                          aria-expanded={audioOpen}
                          onClick={() => setAudioOpen(o => !o)}
                        >
                          <span className="icon icon-listen-small"></span>
                          <span className="text">
                            <FormattedMessage id="bulletin:report:listen" />
                          </span>
                        </button>
                      </Tooltip>
                    </li>
                  )}
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
                          className="pure-button inverse tooltip pure-button-icon-text"
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
                          <span className="text">
                            <FormattedMessage id="bulletin:linkbar:pdf" />
                          </span>
                        </a>
                      </Tooltip>
                    </li>
                  )}
                </ul>
                {audioUrl && audioOpen && (
                  <div className="bulletin-report-audio">
                    <audio controls={true} autoPlay={true} src={audioUrl}>
                      <a href={audioUrl}></a>
                    </audio>
                  </div>
                )}
              </div>
            </header>

            {(bulletin.highlights || bulletin.travelAdvisory?.comment) && (
              <div
                className={
                  "bulletin-report-recommendation" +
                  (bulletin.highlights ? " is-alert" : "") +
                  (bulletin.travelAdvisory?.comment ? " is-recommendation" : "")
                }
              >
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
                      {showRegionSwitcher ? (
                        <RegionDropdown
                          region={region}
                          options={regionOptions}
                          onSelect={handleSelectRegion}
                        />
                      ) : (
                        <span className="text">
                          <FormattedMessage
                            id={`region:${region}` as MessageId}
                          />
                        </span>
                      )}
                    </span>
                    <h2 className="subheader">
                      <FormattedMessage id="bulletin:report:tendency:development:headline" />
                      {tendencyInfo && (
                        <Tooltip
                          html={true}
                          label={`<p>${tendencyInfo.replace(
                            /\{\s*region\s*\}/g,
                            tendencyRegionName
                          )}</p>`}
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
                        {intl.formatDate(date, LONG_DATE_FORMAT_NO_WEEKDAY)}
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

        <section
          id={bulletin.bulletinID + "-back-to-map"}
          className="section-centered section-bulletin section-bulletin-additional"
        >
          <div className="panel secondary-light">
            <AdditionalBulletinInformation
              bulletin={bulletin}
              date={date}
              region={region}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default BulletinReport;
