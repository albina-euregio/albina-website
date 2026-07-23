import React, { type ReactNode } from "react";
import Modal from "../dialogs/albina-modal";
import { useIntl, type MessageId } from "../../i18n";
import {
  useIncidentReportMessages,
  translateIncidentValue
} from "../../i18n/incident-report";
import { DATE_TIME_FORMAT } from "../../util/date";
import ProblemIcon from "../icons/problem-icon";
import ExpositionIcon from "../icons/exposition-icon";
import ElevationIcon from "../icons/elevation-icon";
import type { Aspect, AvalancheProblemType } from "../../stores/bulletin";
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
function Section({ title, fields }: { title: ReactNode; fields: Field[] }) {
  const rows = fields.filter(f => f.value || f.value === 0);
  if (!rows.length) return null;
  return (
    <section className="incident-details-section">
      <h3>{title}</h3>
      <table className="pure-table pure-table-striped pure-table-small">
        <tbody>
          {rows.map((f, i) => (
            <tr key={i}>
              <th>{f.label}</th>
              <td>{f.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
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

/**
 * Renders avalanche problems as pictograms, mirroring the bulletin report.
 */
function AvalancheProblems({
  problems,
  label,
  intl
}: {
  problems: IncidentAvalancheProblem[];
  label: (key: string) => string;
  intl: IntlApi;
}) {
  if (!problems?.length) return null;
  return (
    <section className="incident-details-section">
      <h3>{label("avalancheProblem")}</h3>
      <ul className="list-plain list-bulletin-report-pictos incident-details-problems">
        {problems.map((p, i) => (
          <AvalancheProblemRow key={i} problem={p} intl={intl} />
        ))}
      </ul>
    </section>
  );
}

function AvalancheProblemRow({
  problem,
  intl
}: {
  problem: IncidentAvalancheProblem;
  intl: IntlApi;
}) {
  const problemType = problem.problemType;
  const aspects = (
    Array.isArray(problem.aspects) ? problem.aspects : [problem.aspects]
  ).filter((a): a is Aspect => Boolean(a));

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
              {intl.formatMessage({
                id: `${problemTypeMessageId(problemType)}:short` as MessageId
              })}
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

      <ProblemMatrix problem={problem} intl={intl} />
    </li>
  );
}

/** Text matrix of snowpack stability / frequency / avalanche size. */
function ProblemMatrix({
  problem,
  intl
}: {
  problem: IncidentAvalancheProblem;
  intl: IntlApi;
}) {
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
          intl.formatMessage({
            id: "bulletin:report:problem:snowpack-stability"
          }),
          intl.formatMessage({
            id: `bulletin:report:problem:snowpack-stability:${snowpackStability}` as MessageId
          })
        )}
      {frequency &&
        row(
          intl.formatMessage({ id: "bulletin:report:problem:frequency" }),
          intl.formatMessage({
            id: `bulletin:report:problem:frequency:${frequency}` as MessageId
          })
        )}
      {avalancheSize &&
        row(
          intl.formatMessage({ id: "bulletin:report:problem:avalanche-size" }),
          avalancheSize
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
  // Incident spec uses `no_distinct_avalanche_problem`; the shared message
  // resource uses `no_distinct_problem`.
  const type =
    problemType === "no_distinct_avalanche_problem"
      ? "no_distinct_problem"
      : problemType;
  return `problem:${type}` as MessageId;
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

function Attachments({
  attachments,
  label
}: {
  attachments: IncidentAttachmentView[];
  label: (key: string) => string;
}) {
  if (!attachments.length) return null;
  return (
    <section className="incident-details-section">
      <h3>{label("incidentAttachments")}</h3>
      <div className="incident-details-attachments">
        {attachments.map(a => (
          <figure key={a.id} className="incident-details-attachment">
            <a href={a.url} target="_blank" rel="noreferrer">
              {a.mediaType?.startsWith("image/") ? (
                <img src={a.url} alt={a.altText || a.caption || a.fileName} />
              ) : (
                (a.fileName ?? a.url)
              )}
            </a>
            {(a.caption || a.credit) && (
              <figcaption>
                {a.caption}
                {a.credit && <span className="credit"> © {a.credit}</span>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

/**
 * Renders backend-authored rich text. Incident descriptions are HTML
 * fragments (e.g. `<p>Very&nbsp;windy…<strong>☀️</strong></p>`), so we render
 * them as markup — same trusted-content convention as the bulletin report.
 */
function RichText({ title, html }: { title: ReactNode; html?: string }) {
  if (!html?.trim()) return null;
  return (
    <section className="incident-details-section">
      <h3>{title}</h3>
      <div
        className="incident-details-richtext"
        dangerouslySetInnerHTML={{ __html: html }}
      />
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

  const d: IncidentPublicData = incident.publicData;
  const number = (value: number | undefined, unit?: string) =>
    typeof value === "number" && intl.formatNumberUnit(value, unit);
  const textBlock = (
    record: Record<string, string> | undefined,
    publicFlag?: boolean
  ) => (publicFlag === false ? undefined : localizedText(record, intl.locale));

  return (
    <div className="incident-details">
      <Section
        title={label("generalInformation")}
        fields={[
          {
            label: label("dateTime"),
            value:
              incident.dateTime &&
              intl.formatDate(incident.dateTime, DATE_TIME_FORMAT)
          },
          {
            label: label("timeAccuracy"),
            value: tr("timeAccuracy", d.timeAccuracy)
          },
          {
            label: label("dangerRating"),
            value:
              incident.dangerRating &&
              intl.formatMessage({
                id: `danger-level:${incident.dangerRating}` as MessageId
              })
          },
          {
            label: label("personInvolvement"),
            value: incident.personInvolvement
          },
          {
            label: label("otherDamages"),
            value: tr("otherDamages", d.otherDamages)
          },
          {
            label: label("damagedAssets"),
            value: d.damagedAssets?.map(a => tr("damagedAssets", a)).join(", ")
          },
          {
            label: label("otherDamagesComment"),
            value: d.otherDamagesComment
          },
          {
            label: label("sourceOfInformation"),
            value: d.sourceOfInformation
              ?.map(s => tr("sourceOfInformation", s))
              .join(", ")
          },
          {
            label: label("generalInformationComment"),
            value: d.generalInformationComment
          }
        ]}
      />

      <Section
        title={label("locationInformation")}
        fields={[
          { label: label("location"), value: incident.location },
          { label: label("country"), value: tr("country", d.country) },
          { label: label("municipality"), value: d.municipality },
          { label: label("avalancheRegion"), value: d.avalancheRegion },
          { label: label("latitude"), value: number(d.latitude) },
          { label: label("longitude"), value: number(d.longitude) },
          {
            label: label("locationAccuracy"),
            value: tr("locationAccuracy", d.locationAccuracy)
          }
        ]}
      />

      <Section
        title={label("avalancheInformation")}
        fields={[
          { label: label("avalancheType"), value: incident.avalancheType },
          { label: label("avalancheSize"), value: incident.avalancheSize },
          { label: label("trigger"), value: tr("trigger", d.trigger) },
          { label: label("natural"), value: tr("natural", d.natural) },
          { label: label("person"), value: tr("person", d.person) },
          {
            label: label("accidentalControlled"),
            value: tr("accidentalControlled", d.accidentalControlled)
          },
          {
            label: label("additionalLoad"),
            value: tr("additionalLoad", d.additionalLoad)
          },
          {
            label: label("remoteTriggering"),
            value: tr("remoteTriggering", d.remoteTriggering)
          },
          {
            label: label("multipleAvalanches"),
            value: tr("multipleAvalanches", d.multipleAvalanches)
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
            label: label("startZoneAspect"),
            value: aspectLabel(d.startZoneAspect, intl)
          },
          {
            label: label("startZoneElevation"),
            value: number(d.startZoneElevation, "m")
          },
          {
            label: label("startZoneElevationAccuracy"),
            value: tr(
              "startZoneElevationAccuracy",
              d.startZoneElevationAccuracy
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
          { label: label("slabWidth"), value: number(d.slabWidth, "m") },
          {
            label: label("avalancheLength"),
            value: number(d.avalancheLength, "m")
          },
          {
            label: label("depositMoisture"),
            value: tr("depositMoisture", d.depositMoisture)
          },
          {
            label: label("avalancheDetailsComment"),
            value: d.avalancheDetailsComment
          }
        ]}
      />

      {d.avalancheProblems && (
        <AvalancheProblems
          problems={d.avalancheProblems}
          label={label}
          intl={intl}
        />
      )}

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

      <RichText
        title={label("incidentLede")}
        html={textBlock(d.incidentLede, d.incidentLedePublic)}
      />
      <RichText
        title={label("incidentDescription")}
        html={textBlock(d.incidentDescription, d.incidentDescriptionPublic)}
      />
      <RichText
        title={label("avalancheDescription")}
        html={textBlock(d.avalancheDescription, d.avalancheDescriptionPublic)}
      />
      <RichText
        title={label("snowpackDescription")}
        html={textBlock(d.snowpackDescription, d.snowpackDescriptionPublic)}
      />
      <RichText
        title={label("weatherDescription")}
        html={textBlock(d.weatherDescription, d.weatherDescriptionPublic)}
      />
      <RichText
        title={label("takeAways")}
        html={textBlock(d.takeAways, d.takeAwaysPublic)}
      />

      <ExternalLinks
        title={label("publicExternalLinks")}
        links={d.publicExternalLinks}
      />

      <Attachments attachments={incident.attachments} label={label} />
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
