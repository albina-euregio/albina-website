import React, { useState, type ReactNode } from "react";
import Modal from "../dialogs/albina-modal";
import {
  DialogFlipperButtons,
  useDialogFlipper
} from "../dialogs/dialog-flipper";
import { useDragScroll } from "../dialogs/use-drag-scroll";
import { useIntl, type MessageId } from "../../i18n";
import {
  useIncidentReportMessages,
  translateIncidentValue
} from "../../i18n/incident-report";
import {
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_SHORT,
  LONG_DATE_FORMAT
} from "../../util/date";
import IncidentLocationMap from "./incident-location-map";
import { Tooltip } from "../tooltips/tooltip";
import { involvementText } from "../../util/incident-involvement";
import { ANALYSIS_BADGE_KEY, incidentBadges } from "../../util/incident-badges";
import { IncidentBadges } from "./incident-badge";
import {
  getDangerRatingIconFile,
  getDangerRatingLabel,
  getWarnlevelNumber
} from "../../util/warn-levels";
import { INCIDENT_ANALYSIS_TEXT_FIELDS } from "../../stores/incidentDataStore";
import type {
  IncidentAttachmentView,
  IncidentData,
  IncidentPublicData
} from "../../stores/incidentDataStore";

const ANALYSIS_SECTION_ID = "incident-analysis";

/** Icon per public report status, shape-coded rather than color-coded. */
const REPORT_STATUS_ICONS: Record<string, string> = {
  Incomplete: "icon-attention",
  InReview: "icon-info",
  Verified: "icon-check-small"
};

/** Explanatory tooltip per public report status, shown on hover. */
const REPORT_STATUS_TOOLTIPS: Record<string, MessageId> = {
  Incomplete: "incidents:reportStatus:incomplete",
  InReview: "incidents:reportStatus:inReview",
  Verified: "incidents:reportStatus:verified"
};

/** The picklist fields shown as a table at the top of the analysis section. */
const ANALYSIS_ENUM_FIELDS = [
  "recentSlabAvalanches",
  "signsOfInstability",
  "recentLoading",
  "criticalWarming"
] as const satisfies readonly (keyof IncidentPublicData)[];

interface Props {
  incident: IncidentData | undefined;
  onClose: () => void;
}

type IntlApi = ReturnType<typeof useIntl>;

interface Field {
  label: ReactNode;
  value: ReactNode;
}

/** Renders a titled table of label/value rows, skipping empty values. */
function Section({
  title,
  fields,
  children
}: {
  title?: ReactNode;
  fields: Field[];
  children?: ReactNode;
}) {
  const rows = fields.filter(f => f.value || f.value === 0);
  if (!rows.length && !children) return null;
  return (
    <section className="incident-details-section">
      {title && <h3>{title}</h3>}
      {children}
      {rows.length > 0 && (
        <table className="pure-table pure-table-striped pure-table-small">
          <tbody>
            {rows.map((f, i) => (
              <tr key={i}>
                {f.label ? (
                  <>
                    <th>{f.label}</th>
                    <td>{f.value}</td>
                  </>
                ) : (
                  <td colSpan={2}>{f.value}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

interface WarningSign {
  label: ReactNode;
  status?: "Present" | "Absent" | "Unknown";
  text?: string;
}

/**
 * The four warning-sign picklists as a factbox: unlike {@link Section}, every
 * sign stays visible even without an answer, so "not selected" reads as a
 * gap in the report rather than a row that silently disappears.
 */
function WarningSigns({
  title,
  signs
}: {
  title: ReactNode;
  signs: WarningSign[];
}) {
  return (
    <section className="incident-details-section incident-warning-signs">
      <h3>{title}</h3>
      <ul className="incident-warning-signs__grid">
        {signs.map((sign, i) => (
          <li key={i} className="incident-warning-signs__item">
            <span className="incident-warning-signs__label">{sign.label}</span>
            <span
              className={`incident-warning-signs__status incident-warning-signs__status--${(
                sign.status ?? "none"
              ).toLowerCase()}`}
            >
              <span
                className="incident-warning-signs__dot"
                aria-hidden="true"
              />
              {sign.text ?? "–"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The "⌖ label" accuracy badge — standalone (e.g. next to a section title)
 * or trailing a value via {@link withAccuracy}. */
function AccuracyNote({
  accuracy,
  accuracyLabel
}: {
  accuracy: ReactNode;
  accuracyLabel: string;
}): ReactNode {
  if (!accuracy) return null;
  return (
    <span className="incident-details-accuracy" title={accuracyLabel}>
      <svg
        className="incident-details-accuracy-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        aria-hidden="true"
      >
        <path d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z" />
      </svg>
      {accuracy}
    </span>
  );
}

function withAccuracy(
  value: ReactNode,
  accuracy: ReactNode,
  accuracyLabel: string
): ReactNode {
  if (!value && value !== 0) return value;
  return (
    <>
      {value}
      <AccuracyNote accuracy={accuracy} accuracyLabel={accuracyLabel} />
    </>
  );
}

/** Picks the text for the current locale from a localized record. */
function localizedText(
  record: Record<string, string> | undefined,
  locale: string
): string | undefined {
  if (!record) return undefined;
  return record[locale] || record.en || Object.values(record).find(Boolean);
}

/** Anchors on /education/avalanche-sizes; a size range links its lower size. */
const AVALANCHE_SIZE_ANCHORS: Record<string, number> = {
  small: 1,
  small_medium: 1,
  medium: 2,
  medium_large: 2,
  large: 3,
  large_very_large: 3,
  very_large: 4,
  very_large_extreme: 4,
  extreme: 5
};

/** Anchors on /education/avalanche-problems. */
const AVALANCHE_PROBLEM_ANCHORS = [
  "new_snow",
  "wind_slab",
  "persistent_weak_layers",
  "wet_snow",
  "gliding_snow"
];

/** Links a value to its explanation on an education page. */
function EducationLink({
  href,
  children
}: {
  href: string | undefined;
  children: ReactNode;
}) {
  if (!children || !href) return children;
  return (
    <a
      className="incident-details-link-icon"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="icon-external" aria-hidden="true" />
    </a>
  );
}

function problemTypeMessageId(problemType: string): MessageId {
  return `caaml:avalancheProblem.${problemType}` as MessageId;
}

function aspectLabel(
  aspects: string | string[] | undefined,
  intl: IntlApi
): string | undefined {
  const list = (Array.isArray(aspects) ? aspects : [aspects]).filter(
    (a): a is string => Boolean(a)
  );
  if (!list.length) return undefined;
  return list
    .map(aspect =>
      intl.formatMessage({
        id: `bulletin:report:problem:aspect:${aspect.toLowerCase()}` as MessageId
      })
    )
    .join(", ");
}

type GalleryAttachment = IncidentAttachmentView & { id: string };

function isImageAttachment(a: IncidentAttachmentView): a is GalleryAttachment {
  return !!a.id && !!a.mediaType?.startsWith("image/");
}

/** Fallback extensions for attachments whose `fileName` doesn't already carry
 * one, keyed by `mediaType` — used so a forced download still gets a correct
 * file-ending even when the uploaded name didn't have one. */
const MEDIA_TYPE_EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/zip": "zip",
  "application/gpx+xml": "gpx",
  "text/csv": "csv",
  "text/plain": "txt"
};

function attachmentDownloadName(a: IncidentAttachmentView): string | undefined {
  const { fileName, mediaType } = a;
  if (fileName && /\.[a-z0-9]+$/i.test(fileName)) return fileName;
  const ext = mediaType && MEDIA_TYPE_EXTENSIONS[mediaType];
  if (!ext) return fileName;
  return fileName ? `${fileName}.${ext}` : `attachment.${ext}`;
}

/** A non-image attachment rendered as a download link — same shape as a
 * plain external link, just with a download icon instead of an external one. */
function AttachmentLinkValue({ a }: { a: IncidentAttachmentView }): ReactNode {
  return (
    <>
      <a
        className="incident-details-link-icon"
        href={a.url}
        download={attachmentDownloadName(a)}
      >
        {a.fileName ?? a.url}
        <span className="icon-download" aria-hidden="true" />
      </a>
      {(a.caption || a.credit) && (
        <span className="incident-details-attachment-links__meta">
          {a.caption}
          {a.credit && <span className="credit"> © {a.credit}</span>}
        </span>
      )}
    </>
  );
}

/** A thumbnail's caption, clamped to 2 lines — clicking it (like clicking the
 * image itself) opens the lightbox, where the full, unclamped caption is
 * already shown. No separate "show more" affordance needed: the caption is
 * part of the same clickable card as the image, not a standalone control. */
function AttachmentCaption({
  a,
  onOpen
}: {
  a: IncidentAttachmentView;
  onOpen: () => void;
}) {
  if (!a.caption && !a.credit) return null;
  return (
    <figcaption>
      <button
        type="button"
        className="incident-details-attachment-caption-trigger"
        onClick={onOpen}
      >
        {a.caption}
        {a.credit && <span className="credit"> © {a.credit}</span>}
      </button>
    </figcaption>
  );
}

/** Renders the image attachments as a horizontally scrolling, drag-to-scroll
 * carousel, opening enlarged in a lightbox that flips through the other
 * images of this carousel — mirrors the bulletin report's photo gallery.
 * Non-image attachments (PDFs, other files) can't be previewed this way, so
 * they're rendered as plain download links below the carousel instead. */
function AttachmentGrid({
  attachments
}: {
  attachments: IncidentAttachmentView[] | undefined;
}) {
  const [openId, setOpenId] = useState("");
  const dragRef = useDragScroll<HTMLUListElement>();
  if (!attachments?.length) return null;
  const images = attachments.filter(isImageAttachment);
  const linkOnly = attachments.filter(a => !isImageAttachment(a));
  return (
    <>
      {images.length > 0 && (
        <div className="incident-details-attachments">
          <ul
            ref={dragRef}
            className="list-plain incident-details-attachments-list"
          >
            {images.map(a => (
              <li key={a.id} className="incident-details-attachment-item">
                <figure className="incident-details-attachment">
                  <button
                    type="button"
                    className="incident-details-attachment-trigger"
                    onClick={() => setOpenId(a.id ?? "")}
                  >
                    <img
                      src={a.url}
                      alt={a.altText || a.caption || a.fileName}
                    />
                  </button>
                  <AttachmentCaption
                    a={a}
                    onOpen={() => setOpenId(a.id ?? "")}
                  />
                </figure>
              </li>
            ))}
          </ul>
        </div>
      )}
      {linkOnly.length > 0 && (
        <ul className="incident-details-attachment-links">
          {linkOnly.map(a => (
            <li key={a.id}>
              <AttachmentLinkValue a={a} />
            </li>
          ))}
        </ul>
      )}
      <AttachmentLightbox
        images={images}
        openId={openId}
        setOpenId={setOpenId}
      />
    </>
  );
}

/** The enlarged view of one image, flipped through via arrows, keyboard and
 * swipe (shared dialog-flipper, as the bulletin/profile dialogs use). */
function AttachmentLightboxContent({
  images,
  openId,
  setOpenId
}: {
  images: GalleryAttachment[];
  openId: string;
  setOpenId: (id: string) => void;
}) {
  const intl = useIntl();
  const flipper = useDialogFlipper(images, openId, setOpenId);
  const image = images[flipper.index];
  if (!image) return null;
  return (
    <div
      className="modal-container incident-attachment-modal"
      {...flipper.swipeHandlers}
    >
      <DialogFlipperButtons
        flipper={flipper}
        previousLabel={intl.formatMessage({ id: "dialog:flipper:previous" })}
        nextLabel={intl.formatMessage({ id: "dialog:flipper:next" })}
      />
      <figure className="incident-attachment-modal__figure">
        <img
          className="incident-attachment-modal__image"
          src={image.url}
          alt={image.altText || image.caption || image.fileName || ""}
        />
        {(image.caption || image.credit) && (
          <figcaption className="incident-attachment-modal__caption">
            {image.caption}
            {image.credit && <span className="credit"> © {image.credit}</span>}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

function AttachmentLightbox({
  images,
  openId,
  setOpenId
}: {
  images: GalleryAttachment[];
  openId: string;
  setOpenId: (id: string) => void;
}) {
  return (
    <Modal isOpen={!!openId} onClose={() => setOpenId("")} width="fit-content">
      {!!openId && (
        <AttachmentLightboxContent
          images={images}
          openId={openId}
          setOpenId={setOpenId}
        />
      )}
    </Modal>
  );
}

/**
 * Maps an attachment's category onto the rich-text section it is shown under.
 * Categories without an entry (`Group`, `Person`) — and attachments with no
 * category — get no section of their own.
 */
const ATTACHMENT_CATEGORY_SECTION: Record<string, string> = {
  Incident: "incidentDescription",
  Avalanche: "avalancheDescription",
  Snowpack: "snowpackDescription",
  Weather: "weatherDescription"
};

/** Buckets attachments by the section key they belong to. */
function groupAttachmentsByCategory(attachments: IncidentAttachmentView[]) {
  const bySection: Record<string, IncidentAttachmentView[]> = {};
  for (const a of attachments) {
    const key =
      a.attachmentCategory && ATTACHMENT_CATEGORY_SECTION[a.attachmentCategory];
    if (key) (bySection[key] ??= []).push(a);
  }
  return bySection;
}

/**
 * Renders backend-authored rich text. Incident descriptions are HTML
 * fragments (e.g. `<p>Very&nbsp;windy…<strong>☀️</strong></p>`), so we render
 * them as markup — same trusted-content convention as the bulletin report.
 */
function RichText({
  title,
  html,
  attachments
}: {
  title: ReactNode;
  html?: string;
  attachments?: IncidentAttachmentView[];
}) {
  const hasHtml = !!html?.trim();
  if (!hasHtml && !attachments?.length) return null;
  return (
    <section className="incident-details-section">
      <h3>{title}</h3>
      {html && hasHtml && (
        <div
          className="incident-details-richtext"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      <AttachmentGrid attachments={attachments} />
    </section>
  );
}

function IncidentDetails({ incident }: { incident: IncidentData }) {
  const intl = useIntl();
  const t = useIncidentReportMessages();
  const label = (key: string) => t.incidentReport?.[key] ?? key;
  const tr = (category: string, value: string | undefined) =>
    translateIncidentValue(t, category, value);
  /** Translates each entry of a list and joins them, dropping empty values. */
  const trList = (
    category: string,
    values: (string | undefined)[] | undefined
  ) =>
    values
      ?.map(v => tr(category, v))
      .filter(Boolean)
      .join(", ");

  const d: IncidentPublicData = incident.publicData;
  const number = (value: number | undefined, unit?: string) =>
    typeof value === "number" && intl.formatNumberUnit(value, unit);
  const textBlock = (
    record: Record<string, string> | undefined,
    publicFlag?: boolean
  ) => (publicFlag === false ? undefined : localizedText(record, intl.locale));

  // `incident.attachments` rebuilds its list on every read, so read it once.
  const allAttachments = incident.attachments;
  const attachments = groupAttachmentsByCategory(allAttachments);
  const imageAttachments = allAttachments.filter(isImageAttachment);
  const attachmentLinks = d.publicExternalLinks
    ?.split(/[\s,]+/)
    .filter(url => /^https?:\/\//.test(url));
  const attachmentFields: Field[] = [
    ...allAttachments
      .filter(a => !isImageAttachment(a))
      .map(a => ({ label: "", value: <AttachmentLinkValue a={a} /> })),
    ...(attachmentLinks?.map(url => ({
      label: "",
      value: (
        <a
          className="incident-details-link-icon"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {url}
          <span className="icon-external" aria-hidden="true" />
        </a>
      )
    })) ?? [])
  ];
  // Images, file attachments and external links are one section: the heading
  // shows when any of them has content, and is dropped when none does.
  const hasAttachments =
    imageAttachments.length > 0 || attachmentFields.length > 0;

  const ledeHtml = textBlock(d.incidentLede, d.incidentLedePublic);
  const dateTime =
    incident.dateTime && intl.formatDate(incident.dateTime, DATE_TIME_FORMAT);
  const timeAccuracy = tr("timeAccuracy", d.timeAccuracy);
  const publishedAt =
    incident.publishedAt &&
    intl.formatDate(incident.publishedAt, DATE_TIME_FORMAT_SHORT);
  const reportStatus = tr("reportStatus", d.reportStatus);
  const reportStatusIcon =
    REPORT_STATUS_ICONS[d.reportStatus ?? ""] ?? "icon-info";
  const reportStatusTooltipId = REPORT_STATUS_TOOLTIPS[d.reportStatus ?? ""];
  const reportStatusTooltip =
    reportStatusTooltipId && intl.formatMessage({ id: reportStatusTooltipId });
  const outcome = involvementText(incident, intl);
  const badges = incidentBadges(
    incident,
    t,
    intl.formatMessage({ id: "incidents:analysis" })
  ).map(badge =>
    badge.key === ANALYSIS_BADGE_KEY
      ? {
          ...badge,
          onClick: () =>
            document
              .getElementById(ANALYSIS_SECTION_ID)
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      : badge
  );
  const sizeAnchor = AVALANCHE_SIZE_ANCHORS[d.avalancheSize ?? ""];
  const dangerLevel = d.dangerRating && getWarnlevelNumber(d.dangerRating);
  const dangerRatingText =
    d.dangerRating &&
    intl.formatMessage({
      id: `caaml:dangerRating.${d.dangerRating}` as MessageId
    });
  const accuracyLabel = intl.formatMessage({ id: "incidents:accuracy" });
  const regionLabel = (code: string | undefined) =>
    code && (intl.formatMessage({ id: `region:${code}` as MessageId }) || code);
  const combinedLocation = [
    regionLabel(incident.microRegion),
    regionLabel(incident.region)
  ]
    .filter(Boolean)
    .join(", ");

  const bulletinDate = d.dateTime
    ? Temporal.Instant.from(d.dateTime)
        .toZonedDateTimeISO("Europe/Vienna")
        .toPlainDate()
    : undefined;

  return (
    <div
      className="modal-container incident-details"
      style={
        {
          "--incident-involvement-color": `var(--incident-involvement-${incident.involvement})`
        } as React.CSSProperties
      }
    >
      {publishedAt && (
        <p className="incident-details-updated">
          <span className="text-icon">
            <span className="icon icon-release" />
            <span className="text">
              {intl.formatMessage({ id: "incidents:updatedAt" })}: {publishedAt}
            </span>
          </span>
          {reportStatus &&
            (reportStatusTooltip ? (
              <Tooltip label={reportStatusTooltip} enableClick={true}>
                <span className="text-icon incident-report-status">
                  <span className={`icon ${reportStatusIcon}`} />
                  <span className="text">{reportStatus}</span>
                </span>
              </Tooltip>
            ) : (
              <span className="text-icon">
                <span className={`icon ${reportStatusIcon}`} />
                <span className="text">{reportStatus}</span>
              </span>
            ))}
        </p>
      )}

      <header className="incident-details-header">
        {incident.location && <h2>{incident.location}</h2>}
        {dateTime && (
          <p className="incident-details-header__date">
            {withAccuracy(dateTime, timeAccuracy, accuracyLabel)}
          </p>
        )}
        {outcome && <p className="incident-details-header__meta">{outcome}</p>}
        <IncidentBadges badges={badges} />
      </header>

      <Section
        title={
          <>
            {label("locationInformation")}
            <AccuracyNote
              accuracy={tr("locationAccuracy", d.locationAccuracy)}
              accuracyLabel={accuracyLabel}
            />
          </>
        }
        fields={[
          { label: label("location"), value: d.location },
          { label: label("region"), value: combinedLocation }
        ]}
      >
        <IncidentLocationMap incident={incident} />
      </Section>

      <div className="incident-details-columns">
        <Section
          title={label("avalancheInformation")}
          fields={[
            {
              label: intl.formatMessage({ id: "caaml:avalancheSize.label" }),
              value: tr("avalancheSize", d.avalancheSize) && (
                <EducationLink
                  href={
                    sizeAnchor
                      ? `/education/avalanche-sizes#anchor-${sizeAnchor}`
                      : undefined
                  }
                >
                  {tr("avalancheSize", d.avalancheSize)}
                </EducationLink>
              )
            },
            {
              label: label("avalancheType"),
              value: tr("avalancheType", d.avalancheType)
            },
            {
              label: label("relevantAvalancheProblem"),
              value: d.relevantAvalancheProblem && (
                <EducationLink
                  href={`/education/avalanche-problems${
                    AVALANCHE_PROBLEM_ANCHORS.includes(
                      d.relevantAvalancheProblem
                    )
                      ? `#${d.relevantAvalancheProblem}`
                      : ""
                  }`}
                >
                  {intl.formatMessage({
                    id: problemTypeMessageId(d.relevantAvalancheProblem)
                  })}
                </EducationLink>
              )
            },
            {
              label: label("avalancheLength"),
              value: number(d.avalancheLength, "m")
            },
            {
              label: label("startZoneAspect"),
              value: withAccuracy(
                aspectLabel(d.startZoneAspect, intl),
                tr("startZoneAspectAccuracy", d.startZoneAspectAccuracy),
                accuracyLabel
              )
            },
            {
              label: label("startZoneElevation"),
              value: withAccuracy(
                number(d.startZoneElevation, "m"),
                tr("startZoneElevationAccuracy", d.startZoneElevationAccuracy),
                accuracyLabel
              )
            },
            {
              label: label("startZoneIncline"),
              value: number(d.startZoneIncline, "°")
            },
            {
              label: label("startZoneMoisture"),
              value: tr("startZoneMoisture", d.startZoneMoisture)
            },
            { label: label("trigger"), value: tr("trigger", d.trigger) },
            {
              label: label("weakLayerGrainType1"),
              value: tr("weakLayerGrainType", d.weakLayerGrainType1)
            },
            {
              label: label("weakLayerGrainType2"),
              value: tr("weakLayerGrainType", d.weakLayerGrainType2)
            },
            {
              label: label("weakLayerLocation"),
              value: tr("weakLayerLocation", d.weakLayerLocation)
            }
          ]}
        />

        <Section
          title={
            <>
              {intl.formatMessage({ id: "incidents:documentedInvolvements" })}
              <Tooltip
                html={true}
                enableClick={true}
                label={`<p>${intl.formatMessage({
                  id: "incidents:documentedInvolvements.info"
                })}</p>`}
              >
                <span className="tooltip-trigger icon-info"></span>
              </Tooltip>
            </>
          }
          fields={[
            {
              label: label("numberInvolved"),
              value: d.involvementsFatalitiesBurials?.numberInvolved
            },
            {
              label: label("activities"),
              value: trList(
                "incidentActivity",
                d.involvementsFatalitiesBurials?.incidentActivity
              )
            },
            {
              label: label("terrainTypes"),
              value: trList(
                "incidentTerrainType",
                d.involvementsFatalitiesBurials?.incidentTerrainType
              )
            },
            {
              label: label("fatalities"),
              value: d.involvementsFatalitiesBurials?.fatalities
            },
            {
              label: label("injuredSurvivors"),
              value: d.involvementsFatalitiesBurials?.injuredSurvivors
            },
            {
              label: label("uninjuredSurvivors"),
              value: d.involvementsFatalitiesBurials?.uninjuredSurvivors
            },
            {
              label: label("caughtOnly"),
              value: d.involvementsFatalitiesBurials?.caughtOnly
            },
            {
              label: label("fullyBuried"),
              value: d.involvementsFatalitiesBurials?.fullyBuried
            },
            {
              label: label("partlyBuried"),
              value: d.involvementsFatalitiesBurials?.partlyBuried
            }
          ]}
        />
      </div>

      <Section
        title={label("bulletinInformation")}
        fields={[
          {
            label: label("publicAvalancheWarningService"),
            value: d.publicAvalancheWarningService
          },
          {
            label: intl.formatMessage({ id: "caaml:dangerRating.label" }),
            value: d.dangerRating && dangerRatingText && (
              <EducationLink
                href={
                  dangerLevel
                    ? `/education/danger-scale#level${dangerLevel}`
                    : undefined
                }
              >
                <span className="incident-details-danger-rating">
                  <img
                    src={`/images/pro/danger-levels/${getDangerRatingIconFile(d.dangerRating)}`}
                    alt={dangerRatingText}
                  />
                  {getDangerRatingLabel(d.dangerRating, dangerRatingText)}
                </span>
              </EducationLink>
            )
          },
          {
            label: intl.formatMessage({ id: "bulletin:header:forecast" }),
            value: bulletinDate && incident.microRegion && (
              <a
                className="incident-details-link-icon"
                href={`/bulletin/${bulletinDate}?${new URLSearchParams({
                  region: incident.microRegion
                })}`}
                target="_blank"
                rel="noopener noreferrer"
                title={intl.formatMessage({
                  id: "archive:show-forecast:hover"
                })}
              >
                {intl.formatDate(bulletinDate, LONG_DATE_FORMAT)}
                <span className="icon-external" aria-hidden="true" />
              </a>
            )
          }
        ]}
      />

      {hasAttachments && (
        <Section title={label("incidentAttachments")} fields={attachmentFields}>
          <AttachmentGrid attachments={imageAttachments} />
        </Section>
      )}

      {/* Everything below the rule is the analysis: the lede, the picklist
          summary, then the rich-text blocks. Shown only when there is prose to
          show — `hasAnalysis` also gates the badge that scrolls here. */}
      {incident.hasAnalysis && (
        <section id={ANALYSIS_SECTION_ID} className="incident-details-analysis">
          <h2>{label("incidentAnalysis")}</h2>

          {ledeHtml?.trim() && (
            <div
              className="incident-details-richtext incident-details-lede"
              dangerouslySetInnerHTML={{ __html: ledeHtml }}
            />
          )}

          <WarningSigns
            title={label("warningSigns")}
            signs={ANALYSIS_ENUM_FIELDS.map(field => ({
              label: label(field),
              status: d[field],
              text: tr(field, d[field])
            }))}
          />

          {INCIDENT_ANALYSIS_TEXT_FIELDS.map(([field, publicFlag]) => (
            <RichText
              key={field}
              title={label(field)}
              html={textBlock(d[field], d[publicFlag])}
              attachments={attachments[field]}
            />
          ))}
        </section>
      )}
    </div>
  );
}

export function IncidentDetailsDialog({ incident, onClose }: Props) {
  return (
    <Modal isOpen={!!incident} onClose={onClose} width="min(90vw, 64rem)">
      {incident && <IncidentDetails incident={incident} />}
    </Modal>
  );
}

export default IncidentDetailsDialog;
