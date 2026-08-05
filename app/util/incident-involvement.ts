import type { MessageId, useIntl } from "../i18n";
import {
  translateIncidentValue,
  type IncidentReportMessages
} from "../i18n/incident-report";
import type {
  IncidentData,
  IncidentInvolvement
} from "../stores/incidentDataStore";

/**
 * Involvement categories are labelled from the shared incident-report resource.
 */
const INVOLVEMENT_LABELS: Record<
  IncidentInvolvement,
  [category: string, value: string]
> = {
  fatal: ["incidentReport", "fatalities"],
  injured: ["incidentReport", "injuredSurvivors"],
  involved: ["personInvolvement", "Yes"],
  uninvolved: ["personInvolvement", "No"],
  unknown: ["personInvolvement", "Unknown"]
};

export function involvementLabel(
  messages: IncidentReportMessages,
  involvement: IncidentInvolvement
): string {
  const [category, value] = INVOLVEMENT_LABELS[involvement];
  return translateIncidentValue(messages, category, value) ?? value;
}

/**
 * The persons of an incident as one phrase — "4 persons involved (2 fatal, 1
 * injured)". If no person count is available the involvement category is used
 * instead ("Event not involving persons", …). Shared by the dashboard map's
 * marker tooltip and the incident table.
 */
export function involvementText(
  incident: IncidentData,
  intl: ReturnType<typeof useIntl>,
  messages: IncidentReportMessages
): string {
  const { fatalities, injuredSurvivors } = incident;
  // Reports name the fatalities and injured without always totalling them up.
  const involved =
    incident.numberInvolved || fatalities + injuredSurvivors || undefined;
  if (!involved) return involvementLabel(messages, incident.involvement);
  const count = (id: MessageId, value: number): string =>
    intl.formatMessage({ id }, { count: intl.formatNumber(value) });
  const persons = count(
    involved === 1
      ? "incidents:persons:involved:one"
      : "incidents:persons:involved",
    involved
  );
  const severities = [
    fatalities && count("incidents:persons:fatal", fatalities),
    injuredSurvivors && count("incidents:persons:injured", injuredSurvivors)
  ]
    .filter(Boolean)
    .join(", ");
  return severities ? `${persons} (${severities})` : persons;
}
