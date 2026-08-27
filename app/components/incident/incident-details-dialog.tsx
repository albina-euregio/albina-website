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
import { DATE_TIME_FORMAT, DATE_TIME_FORMAT_SHORT } from "../../util/date";
import ProblemIcon from "../icons/problem-icon";
import ExpositionIcon from "../icons/exposition-icon";
import ElevationIcon from "../icons/elevation-icon";
import IncidentLocationMap from "./incident-location-map";
import { Tooltip } from "../tooltips/tooltip";
import { involvementText } from "../../util/incident-involvement";
import { incidentBadges } from "../../util/incident-badges";
import { IncidentBadges } from "./incident-badge";
import {
  getDangerRatingIconFile,
  getDangerRatingLabel
} from "../../util/warn-levels";
import type { AvalancheProblemType } from "../../stores/bulletin";
import type {
  IncidentAttachmentView,
  IncidentAvalancheProblem,
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

function withAccuracy(
  value: ReactNode,
  accuracy: ReactNode,
  accuracyLabel: string
): ReactNode {
  if (!value && value !== 0) return value;
  return (
    <>
      {value}
      {accuracy && (
        <span className="incident-details-accuracy" title={accuracyLabel}>
          {" "}
          (
          <svg
            className="incident-details-accuracy-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            aria-hidden="true"
          >
            <path d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z" />
          </svg>
          {accuracy})
        </span>
      )}
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

/** Entries with at least one populated field; empty ones only render blank space. */
function visibleProblems(
  problems: IncidentAvalancheProblem[] | undefined
): IncidentAvalancheProblem[] {
  return (problems ?? []).filter(p => p && Object.values(p).some(Boolean));
}

/**
 * Renders avalanche problems as pictograms, mirroring the bulletin report.
 * Shown as the value of a labelled row inside the bulletin-information table.
 */
function AvalancheProblems({
  problems
}: {
  problems: IncidentAvalancheProblem[];
}) {
  if (!problems.length) return null;
  return (
    <ul className="list-plain list-bulletin-report-pictos incident-details-problems">
      {problems.map((p, i) => (
        <AvalancheProblemRow key={i} problem={p} />
      ))}
    </ul>
  );
}

function AvalancheProblemRow({
  problem
}: {
  problem: IncidentAvalancheProblem;
}) {
  const intl = useIntl();
  const problemType = problem.problemType;
  const aspects = (problem.aspects ?? []).filter(Boolean);

  const aspectTitle =
    intl.formatMessage({ id: "bulletin:report:exposition" }) +
    (aspects.length
      ? ": " +
        aspects
          .map(a =>
            intl.formatMessage({
              id: `bulletin:report:problem:aspect:${a.toLowerCase()}` as MessageId
            })
          )
          .join(", ")
      : "");

  const elevation = elevationIconProps(
    problem.elevationLowerBound,
    problem.elevationUpperBound,
    intl
  );

  return (
    <li>
      {problemType && (
        <div className="bulletin-report-picto avalanche-situation">
          <a
            href={`/education/avalanche-problems#${problemType}`}
            className="img"
          >
            <div className="picto-img">
              <ProblemIcon
                problem={problemType as AvalancheProblemType}
                alt={intl.formatMessage({
                  id: problemTypeMessageId(problemType)
                })}
                active={true}
              />
            </div>
            <div className="picto-caption">
              {intl.formatMessage({ id: problemTypeMessageId(problemType) })}
            </div>
          </a>
        </div>
      )}

      {aspects.length > 0 && (
        <div>
          <ExpositionIcon expositions={aspects} title={aspectTitle} />
        </div>
      )}

      {elevation && (
        <div>
          <ElevationIcon {...elevation} />
        </div>
      )}

      <ProblemMatrix problem={problem} />
    </li>
  );
}

/** Text matrix of snowpack stability / frequency / avalanche size. */
function ProblemMatrix({ problem }: { problem: IncidentAvalancheProblem }) {
  const intl = useIntl();
  const { snowpackStability, frequency, avalancheSize } = problem;
  if (!snowpackStability && !frequency && !avalancheSize) return null;
  const row = (name: string, value: ReactNode) => (
    <div className="matrix-info">
      <span className="matrix-info-name">{name}:</span>
      <span className="matrix-info-value">{value}</span>
    </div>
  );
  return (
    <div className="bulletin-report-picto matrix-information">
      {snowpackStability &&
        row(
          intl.formatMessage({ id: "caaml:snowpackStability.label" }),
          intl.formatMessage({
            id: `caaml:snowpackStability.${snowpackStability}` as MessageId
          })
        )}
      {frequency &&
        row(
          intl.formatMessage({ id: "caaml:frequency.label" }),
          intl.formatMessage({
            id: `caaml:frequency.${frequency}` as MessageId
          })
        )}
      {avalancheSize &&
        row(
          intl.formatMessage({ id: "caaml:avalancheSize.label" }),
          intl.formatMessage({
            id: `caaml:avalancheSize.${avalancheSize}` as MessageId
          })
        )}
    </div>
  );
}

/** Maps the incident's numeric elevation bounds onto {@link ElevationIcon}. */
function elevationIconProps(
  lower: string | undefined,
  upper: string | undefined,
  intl: IntlApi
) {
  if (lower && upper) {
    return {
      where: "middle" as const,
      text: `${lower}–${upper}m`,
      title: intl.formatMessage(
        { id: "bulletin:report:problem:elevation:between:m-m:hover" },
        { elevationLow: lower, elevationHigh: upper }
      )
    };
  }
  if (lower) {
    return {
      where: "above" as const,
      text: `${lower}m`,
      title: intl.formatMessage(
        { id: "bulletin:report:problem:elevation:above:m:hover" },
        { elevationLow: lower }
      )
    };
  }
  if (upper) {
    return {
      where: "below" as const,
      text: `${upper}m`,
      title: intl.formatMessage(
        { id: "bulletin:report:problem:elevation:below:m:hover" },
        { elevationHigh: upper }
      )
    };
  }
  return null;
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

/** Renders a grid of attachment figures (images or download links). Images
 * open enlarged in a lightbox, flipping through the other images of this
 * grid — mirrors the bulletin report's photo gallery. */
function AttachmentGrid({
  attachments
}: {
  attachments: IncidentAttachmentView[] | undefined;
}) {
  const [openId, setOpenId] = useState("");
  if (!attachments?.length) return null;
  const images = attachments.filter(
    (a): a is GalleryAttachment => !!a.id && !!a.mediaType?.startsWith("image/")
  );
  return (
    <div className="incident-details-attachments">
      {attachments.map(a => (
        <figure key={a.id} className="incident-details-attachment">
          {a.id && a.mediaType?.startsWith("image/") ? (
            <button
              type="button"
              className="incident-details-attachment-trigger"
              onClick={() => setOpenId(a.id ?? "")}
            >
              <img src={a.url} alt={a.altText || a.caption || a.fileName} />
            </button>
          ) : (
            <a href={a.url} target="_blank" rel="noreferrer">
              {a.fileName ?? a.url}
            </a>
          )}
          {(a.caption || a.credit) && (
            <figcaption>
              {a.caption}
              {a.credit && <span className="credit"> © {a.credit}</span>}
            </figcaption>
          )}
        </figure>
      ))}
      <AttachmentLightbox
        images={images}
        openId={openId}
        setOpenId={setOpenId}
      />
    </div>
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

function ExternalLinks({ title, links }: { title: ReactNode; links?: string }) {
  const urls = links?.split(/[\s,]+/).filter(url => /^https?:\/\//.test(url));
  if (!urls?.length) return null;
  return (
    <Section
      title={title}
      fields={urls.map(url => ({
        label: "",
        value: (
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        )
      }))}
    />
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

  const { bySection: attachments, bottom: bottomAttachments } =
    groupAttachmentsByCategory(incident.attachments);

  const ledeHtml = textBlock(d.incidentLede, d.incidentLedePublic);
  const dateTime =
    incident.dateTime && intl.formatDate(incident.dateTime, DATE_TIME_FORMAT);
  const timeAccuracy = tr("timeAccuracy", d.timeAccuracy);
  // The header mirrors the map's tooltip card: date · outcome, then the same
  // neutral badge cluster (danger level, avalanche type/size).
  const headerDate =
    incident.dateTime &&
    intl.formatDate(incident.dateTime, DATE_TIME_FORMAT_SHORT);
  const outcome = involvementText(incident, intl);
  const headerMeta = [headerDate, outcome].filter(Boolean).join(" · ");
  const badges = incidentBadges(incident, t);
  const dangerRatingText =
    d.dangerRating &&
    intl.formatMessage({
      id: `caaml:dangerRating.${d.dangerRating}` as MessageId
    });
  const problems = visibleProblems(d.avalancheProblems);
  const accuracyLabel = intl.formatMessage({ id: "incidents:accuracy" });

  return (
    <div
      className="modal-container incident-details"
      style={
        {
          "--incident-involvement-color": `var(--incident-involvement-${incident.involvement})`
        } as React.CSSProperties
      }
    >
      <header className="incident-details-header">
        {incident.location && <h2>{incident.location}</h2>}
        {headerMeta && (
          <p className="incident-details-header__meta">{headerMeta}</p>
        )}
        <IncidentBadges badges={badges} />
      </header>

      <Section
        fields={[
          {
            label: label("dateTime"),
            value:
              dateTime && withAccuracy(dateTime, timeAccuracy, accuracyLabel)
          },
          {
            label: label("updatedAt"),
            value:
              incident.publishedAt &&
              intl.formatDate(incident.publishedAt, DATE_TIME_FORMAT)
          },
          {
            label: label("otherDamages"),
            value: tr("otherDamages", d.otherDamages)
          }
        ]}
      />

      {ledeHtml?.trim() && (
        <div
          className="incident-details-richtext incident-details-lede"
          dangerouslySetInnerHTML={{ __html: ledeHtml }}
        />
      )}

      <RichText
        title={label("incidentDescription")}
        html={textBlock(d.incidentDescription, d.incidentDescriptionPublic)}
        attachments={attachments.incidentDescription}
      />
      <RichText
        title={label("avalancheDescription")}
        html={textBlock(d.avalancheDescription, d.avalancheDescriptionPublic)}
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

      <Section
        title={label("locationInformation")}
        fields={[
          { label: label("location"), value: incident.location },
          { label: label("country"), value: tr("country", d.country) },
          { label: label("municipality"), value: d.municipality },
          {
            label: label("avalancheRegion"),
            value:
              d.avalancheRegion &&
              (intl.formatMessage({
                id: `region:${d.avalancheRegion}` as MessageId
              }) ||
                d.avalancheRegion)
          },
          {
            label: `${label("latitude")} / ${label("longitude")}`,
            value:
              typeof d.latitude === "number" &&
              typeof d.longitude === "number" &&
              withAccuracy(
                `${intl.formatNumber(d.latitude, 5)} / ${intl.formatNumber(d.longitude, 5)}`,
                tr("locationAccuracy", d.locationAccuracy),
                accuracyLabel
              )
          }
        ]}
      >
        <IncidentLocationMap incident={incident} />
      </Section>

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
            label: intl.formatMessage({
              id: "menu:education:avalanche-problems"
            }),
            value: problems.length ? (
              <AvalancheProblems problems={problems} />
            ) : undefined
          },
          {
            label: intl.formatMessage({ id: "caaml:dangerPattern.label" }),
            value: d.dangerPattern
              ?.map(a =>
                intl.formatMessage({
                  id: `caaml:dangerPattern.${a.toLowerCase()}` as MessageId
                })
              )
              .join(", ")
          }
        ]}
      />

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
        title={label("incidentAnalysis")}
        fields={[
          {
            label: label("recentSlabAvalanches"),
            value: tr("recentSlabAvalanches", d.recentSlabAvalanches)
          },
          {
            label: label("signsOfInstability"),
            value: tr("signsOfInstability", d.signsOfInstability)
          },
          {
            label: label("recentLoading"),
            value: tr("recentLoading", d.recentLoading)
          },
          {
            label: label("criticalWarming"),
            value: tr("criticalWarming", d.criticalWarming)
          },
          {
            label: label("incidentAnalysisComment"),
            value: d.incidentAnalysisComment
          }
        ]}
      />

      <ExternalLinks
        title={label("incidentAttachments")}
        links={d.publicExternalLinks}
      />

      <AttachmentGrid attachments={bottomAttachments} />
    </div>
  );
}

export function IncidentDetailsDialog({ incident, onClose }: Props) {
  return (
    <Modal isOpen={!!incident} onClose={onClose} width="90vw">
      {incident && <IncidentDetails incident={incident} />}
    </Modal>
  );
}

export default IncidentDetailsDialog;
