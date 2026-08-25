import React, { type ReactNode } from "react";
import Modal from "../dialogs/albina-modal";
import { useIntl, type MessageId } from "../../i18n";
import { DATE_TIME_FORMAT, DATE_TIME_FORMAT_SHORT } from "../../util/date";
import { observationImages, type Observation } from "../../stores/observations";

type IntlApi = ReturnType<typeof useIntl>;

interface Field {
  label: ReactNode;
  value: ReactNode;
}

/** Renders a titled table of label/value rows, skipping empty values. */
function Section({ title, fields }: { title?: ReactNode; fields: Field[] }) {
  const rows = fields.filter(f => f.value || f.value === 0);
  if (!rows.length) return null;
  return (
    <section className="observation-details-section">
      {title && <h3>{title}</h3>}
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

/**
 * A single elevation, the band between both bounds, or the open-ended bound the
 * observation carries.
 */
function elevationText(
  observation: Observation,
  intl: IntlApi
): string | undefined {
  const {
    elevation,
    elevationLowerBound: lower,
    elevationUpperBound: upper
  } = observation;
  if (typeof elevation === "number")
    return intl.formatNumberUnit(elevation, "m");
  if (typeof lower === "number" && typeof upper === "number") {
    return `${intl.formatNumber(lower)}–${intl.formatNumberUnit(upper, "m")}`;
  }
  if (typeof lower === "number")
    return `≥ ${intl.formatNumberUnit(lower, "m")}`;
  if (typeof upper === "number")
    return `≤ ${intl.formatNumberUnit(upper, "m")}`;
  return undefined;
}

/** Translates each value of a list and joins them, dropping empty ones. */
function translateList(
  values: string[] | undefined,
  messageId: (value: string) => MessageId,
  intl: IntlApi
): string | undefined {
  const list = (values ?? []).filter(Boolean);
  if (!list.length) return undefined;
  return list
    .map(value => intl.formatMessage({ id: messageId(value) }))
    .join(", ");
}

function problemMessageId(problem: string): MessageId {
  return `caaml:avalancheProblem.${problem}` as MessageId;
}

/** The photos the reporting app attached, linked to their full-size version. */
function ImageGrid({ observation }: { observation: Observation }) {
  const intl = useIntl();
  const images = observationImages(observation);
  if (!images.length) return null;
  return (
    <section className="observation-details-section">
      <h3>{intl.formatMessage({ id: "observation:images" })}</h3>
      <div className="observation-details-images">
        {images.map(url => (
          <a key={url} href={url} target="_blank" rel="noreferrer">
            <img src={url} alt="" loading="lazy" />
          </a>
        ))}
      </div>
    </section>
  );
}

function ObservationDetails({ observation }: { observation: Observation }) {
  const intl = useIntl();
  const o = observation;

  const typeLabel = intl.formatMessage({
    id: `observation:type:${o.$type}` as MessageId
  });
  const headerMeta = [
    o.eventDate && intl.formatDate(o.eventDate, DATE_TIME_FORMAT_SHORT),
    typeLabel
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="modal-container observation-details">
      <header className="observation-details-header">
        <h2>
          {o.$externalURL ? (
            <a href={o.$externalURL} target="_blank" rel="noreferrer">
              {o.locationName || typeLabel}
            </a>
          ) : (
            o.locationName || typeLabel
          )}
        </h2>
        {headerMeta && (
          <p className="observation-details-header__meta">{headerMeta}</p>
        )}
      </header>

      <Section
        fields={[
          {
            label: intl.formatMessage({ id: "observation:event-date" }),
            value: o.eventDate && intl.formatDate(o.eventDate, DATE_TIME_FORMAT)
          },
          {
            label: intl.formatMessage({ id: "observation:report-date" }),
            value:
              o.reportDate && intl.formatDate(o.reportDate, DATE_TIME_FORMAT)
          },
          {
            label: intl.formatMessage({ id: "observation:type" }),
            value: typeLabel
          },
          {
            label: intl.formatMessage({ id: "bulletin:report:author" }),
            value: o.authorName
          },
          {
            label: intl.formatMessage({ id: "observation:source" }),
            value: o.$source
          }
        ]}
      />

      {o.content && (
        <section className="observation-details-section">
          <h3>{intl.formatMessage({ id: "observation:comment" })}</h3>
          <p className="observation-details-content">{o.content}</p>
        </section>
      )}

      <Section
        title={intl.formatMessage({ id: "observation:location" })}
        fields={[
          {
            label: intl.formatMessage({ id: "observation:location-name" }),
            value: o.locationName
          },
          {
            label: intl.formatMessage({
              id: "measurements:table:header:microRegion"
            }),
            value: o.region
          },
          {
            label: intl.formatMessage({
              id: "measurements:table:header:altitude"
            }),
            value: elevationText(o, intl)
          },
          {
            label: intl.formatMessage({
              id: "measurements:table:header:aspect"
            }),
            value: translateList(
              o.aspects,
              aspect =>
                `bulletin:report:problem:aspect:${aspect.toLowerCase()}` as MessageId,
              intl
            )
          },
          {
            label: intl.formatMessage({ id: "observation:coordinates" }),
            value:
              typeof o.latitude === "number" &&
              typeof o.longitude === "number" &&
              `${intl.formatNumber(o.latitude, 5)} / ${intl.formatNumber(o.longitude, 5)}`
          }
        ]}
      />

      <Section
        title={intl.formatMessage({ id: "caaml:snowpack.label" })}
        fields={[
          {
            label: intl.formatMessage({ id: "caaml:snowpackStability.label" }),
            value:
              o.stability &&
              intl.formatMessage({
                id: `caaml:snowpackStability.${o.stability}` as MessageId
              })
          },
          {
            label: intl.formatMessage({
              id: "menu:education:avalanche-problems"
            }),
            value: translateList(o.avalancheProblems, problemMessageId, intl)
          },
          {
            label: intl.formatMessage({ id: "caaml:dangerPattern.label" }),
            value: translateList(
              o.dangerPatterns,
              pattern =>
                `caaml:dangerPattern.${pattern.toLowerCase()}` as MessageId,
              intl
            )
          },
          {
            label: intl.formatMessage({
              id: "observation:important-observations"
            }),
            value: translateList(
              o.importantObservation,
              value =>
                `observation:important-observation:${value}` as MessageId,
              intl
            )
          },
          {
            label: intl.formatMessage({ id: "observation:person-involvement" }),
            value:
              o.personInvolvement &&
              intl.formatMessage({
                id: `observation:person-involvement:${o.personInvolvement}` as MessageId
              })
          }
        ]}
      />

      <ImageGrid observation={observation} />

      {/* Whatever the reporting app collected beyond the fields above, already
          rendered as label/value pairs by the feed. */}
      <Section
        title={intl.formatMessage({ id: "observation:details" })}
        fields={(o.$extraDialogRows ?? []).map(row => ({
          label: row.label,
          value:
            row.value ??
            (typeof row.number === "number"
              ? intl.formatNumber(row.number)
              : undefined)
        }))}
      />
    </div>
  );
}

export default function ObservationDetailsDialog({
  observation,
  onClose
}: {
  observation: Observation | undefined;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={!!observation} onClose={onClose} width="90vw">
      {observation && <ObservationDetails observation={observation} />}
    </Modal>
  );
}
