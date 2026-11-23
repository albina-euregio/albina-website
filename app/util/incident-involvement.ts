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
 * The involvement phrase for an incident, plus the persons count it
 * interpolates where the category has one.
 */
function involvementMessage(
  incident: IncidentData
): [id: MessageId, count?: number] {
  const { involvement, fatalities, injuredSurvivors } = incident;
  switch (involvement) {
    case "fatal":
      return ["incidents:involvement:fatal", fatalities];
    case "injured":
      return ["incidents:involvement:injured", injuredSurvivors];
    case "involved":
      return ["incidents:involvement:involved"];
    case "uninvolved":
      return ["incidents:involvement:uninvolved"];
    case "unknown":
      return ["incidents:involvement:unknown"];
  }
}

/**
 * An incident's involvement as one short phrase — "Incident with 2
 * fatalities", "Incident without involvement", …
 */
export function involvementText(
  incident: IncidentData,
  intl: ReturnType<typeof useIntl>
): string {
  const [id, count] = involvementMessage(incident);
  return count === undefined
    ? intl.formatMessage({ id })
    : intl.formatMessage({ id }, { count: intl.formatNumber(count) });
}
