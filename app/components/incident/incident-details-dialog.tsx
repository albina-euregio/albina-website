import React, { useState, type ReactNode } from "react";
import Modal from "../dialogs/albina-modal";
import {
  DialogFlipperButtons,
  useDialogFlipper
} from "../dialogs/dialog-flipper";
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
import { incidentBadges } from "../../util/incident-badges";
import { IncidentBadge, IncidentBadges } from "./incident-badge";
import {
  getDangerRatingIconFile,
  getDangerRatingLabel
} from "../../util/warn-levels";
import { INCIDENT_ANALYSIS_ENUM_FIELDS } from "../../stores/incidentDataStore";
import type {
  IncidentAttachmentView,
  IncidentData,
  IncidentPublicData
} from "../../stores/incidentDataStore";

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
  id,
  title,
  fields,
  children
}: {
  id?: string;
  title?: ReactNode;
  fields: Field[];
  children?: ReactNode;
}) {
  const rows = fields.filter(f => f.value || f.value === 0);
  if (!rows.length && !children) return null;
  return (
    <section id={id} className="incident-details-section">
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

function attachmentLinkField(a: IncidentAttachmentView): Field {
  return { label: "", value: <AttachmentLinkValue a={a} /> };
}

/** Renders a grid of image attachments, opening enlarged in a lightbox that
 * flips through the other images of this grid — mirrors the bulletin
 * report's photo gallery. Non-image attachments (PDFs, other files) can't be
 * previewed this way, so they're rendered as plain download links instead. */
function AttachmentGrid({
  attachments
}: {
  attachments: IncidentAttachmentView[] | undefined;
}) {
  const [openId, setOpenId] = useState("");
  if (!attachments?.length) return null;
  const images = attachments.filter(isImageAttachment);
  const linkOnly = attachments.filter(a => !isImageAttachment(a));
  return (
    <>
      {images.length > 0 && (
        <div className="incident-details-attachments">
          {images.map(a => (
            <figure key={a.id} className="incident-details-attachment">
              <button
                type="button"
                className="incident-details-attachment-trigger"
                onClick={() => setOpenId(a.id ?? "")}
              >
                <img src={a.url} alt={a.altText || a.caption || a.fileName} />
              </button>
              {(a.caption || a.credit) && (
                <figcaption>
                  {a.caption}
                  {a.credit && <span className="credit"> © {a.credit}</span>}
                </figcaption>
              )}
            </figure>
          ))}
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
 * category — are rendered at the bottom of the dialog instead.
 */
const ATTACHMENT_CATEGORY_SECTION: Record<string, string> = {
  Incident: "incidentDescription",
  Avalanche: "avalancheDescription",
  Snowpack: "snowpackDescription",
  Weather: "weatherDescription"
};

/** Buckets attachments by the section key they belong to, plus a `bottom` list. */
function groupAttachmentsByCategory(attachments: IncidentAttachmentView[]) {
  const bySection: Record<string, IncidentAttachmentView[]> = {};
  const bottom: IncidentAttachmentView[] = [];
  for (const a of attachments) {
    const key =
      a.attachmentCategory && ATTACHMENT_CATEGORY_SECTION[a.attachmentCategory];
    if (key) (bySection[key] ??= []).push(a);
    else bottom.push(a);
  }
  return { bySection, bottom };
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

  const { bySection: attachments } = groupAttachmentsByCategory(
    incident.attachments
  );
  const imageAttachments = incident.attachments.filter(isImageAttachment);
  const nonImageAttachments = incident.attachments.filter(
    a => !isImageAttachment(a)
  );
  const attachmentLinks = d.publicExternalLinks
    ?.split(/[\s,]+/)
    .filter(url => /^https?:\/\//.test(url));
  const attachmentFields: Field[] = [
    ...nonImageAttachments.map(attachmentLinkField),
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

  const ledeHtml = textBlock(d.incidentLede, d.incidentLedePublic);
  const dateTime =
    incident.dateTime && intl.formatDate(incident.dateTime, DATE_TIME_FORMAT);
  const timeAccuracy = tr("timeAccuracy", d.timeAccuracy);
  const publishedAt =
    incident.publishedAt &&
    intl.formatDate(incident.publishedAt, DATE_TIME_FORMAT_SHORT);
  const outcome = involvementText(incident, intl);
  const badges = incidentBadges(incident, t);
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
        <p className="incident-details-updated text-icon">
          <span className="icon icon-release" />
          <span className="text">
            {intl.formatMessage({ id: "incidents:updatedAt" })}: {publishedAt}
          </span>
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
        <IncidentBadges badges={badges}>
          {incident.hasAnalysis && (
            <IncidentBadge
              variant="info"
              onClick={() =>
                document
                  .getElementById("incident-analysis")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              {intl.formatMessage({ id: "incidents:analysis" })}
            </IncidentBadge>
          )}
        </IncidentBadges>
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

      <Section
        title={label("avalancheInformation")}
        fields={[
          {
            label: intl.formatMessage({ id: "caaml:avalancheSize.label" }),
            value: tr("avalancheSize", d.avalancheSize)
          },
          {
            label: label("avalancheType"),
            value: tr("avalancheType", d.avalancheType)
          },
          {
            label: label("relevantAvalancheProblem"),
            value:
              d.relevantAvalancheProblem &&
              intl.formatMessage({
                id: problemTypeMessageId(d.relevantAvalancheProblem)
              })
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
              <span className="incident-details-danger-rating">
                <img
                  src={`/images/pro/danger-levels/${getDangerRatingIconFile(d.dangerRating)}`}
                  alt={dangerRatingText}
                />
                {getDangerRatingLabel(d.dangerRating, dangerRatingText)}
              </span>
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

      <Section title={label("incidentAttachments")} fields={attachmentFields}>
        <AttachmentGrid attachments={imageAttachments} />
      </Section>

      {/* Everything below the rule is the analysis: the lede, the picklist
          summary, then the rich-text blocks. Shown only when there is prose to
          show — `hasAnalysis` also gates the badge that scrolls here. */}
      {incident.hasAnalysis && (
        <section id="incident-analysis" className="incident-details-analysis">
          <h2>{label("incidentAnalysis")}</h2>

          {ledeHtml?.trim() && (
            <div
              className="incident-details-richtext incident-details-lede"
              dangerouslySetInnerHTML={{ __html: ledeHtml }}
            />
          )}

          <Section
            fields={INCIDENT_ANALYSIS_ENUM_FIELDS.map(field => ({
              label: label(field),
              value: tr(field, d[field])
            }))}
          />

          <RichText
            title={label("incidentDescription")}
            html={textBlock(d.incidentDescription, d.incidentDescriptionPublic)}
            attachments={attachments.incidentDescription}
          />
          <RichText
            title={label("avalancheDescription")}
            html={textBlock(
              d.avalancheDescription,
              d.avalancheDescriptionPublic
            )}
            attachments={attachments.avalancheDescription}
          />
          <RichText
            title={label("snowpackDescription")}
            html={textBlock(d.snowpackDescription, d.snowpackDescriptionPublic)}
            attachments={attachments.snowpackDescription}
          />
          <RichText
            title={label("weatherDescription")}
            html={textBlock(d.weatherDescription, d.weatherDescriptionPublic)}
            attachments={attachments.weatherDescription}
          />
          <RichText
            title={label("takeAways")}
            html={textBlock(d.takeAways, d.takeAwaysPublic)}
          />
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
